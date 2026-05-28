"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  getAdminStats,
  listFantasyMatches,
  seedDemoMatch,
  seedFixtures,
} from "@/app/api/admin/fantasy";
import {
  Button,
  Card,
  EmptyState,
  MatchStatusBadge,
  PageHeader,
  Pill,
  StatCard,
} from "@/components/admin/ui";

const REFRESH_MS = 15_000;

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "upcoming", label: "Upcoming" },
  { value: "live", label: "Live" },
  { value: "completed", label: "Completed" },
];

const CATEGORY_FILTERS = [
  { value: "all", label: "All" },
  { value: "Men", label: "Men's" },
  { value: "Women", label: "Women's" },
];

// Demo matches use a "DEMO-<timestamp>" id prefix so the hub can pin them
// to the top of the list and stamp a visual badge. Keep this in sync with
// the backend seed-demo-match endpoint.
const isDemoMatch = (m) => typeof m?.id === "string" && m.id.startsWith("DEMO-");

export default function FantasyHubPage() {
  const [stats, setStats] = useState(null);
  const [matches, setMatches] = useState([]);
  const [statsError, setStatsError] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState(null);
  const [seedingDemo, setSeedingDemo] = useState(false);
  const [demoMsg, setDemoMsg] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [statsResult, matchesResult] = await Promise.allSettled([
        getAdminStats(),
        listFantasyMatches(),
      ]);
      if (cancelled) return;
      if (statsResult.status === "fulfilled") {
        setStats(statsResult.value);
        setStatsError(null);
      } else {
        setStatsError(
          statsResult.reason?.response?.data?.error ??
            statsResult.reason?.message ??
            "stats_unavailable",
        );
      }
      if (matchesResult.status === "fulfilled") {
        setMatches(matchesResult.value);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [tick]);

  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  const filtered = useMemo(() => {
    const list = matches.filter(
      (m) =>
        (statusFilter === "all" || m.status === statusFilter) &&
        (categoryFilter === "all" || m.category === categoryFilter),
    );
    // Pin DEMO matches to the top of the list — most-recent first within the
    // demo group so consecutive seedings stack newest-on-top.
    return list.slice().sort((a, b) => {
      const da = isDemoMatch(a);
      const db = isDemoMatch(b);
      if (da !== db) return da ? -1 : 1;
      if (da && db) return String(b.id).localeCompare(String(a.id));
      return 0;
    });
  }, [matches, statusFilter, categoryFilter]);

  const handleSeed = async () => {
    if (seeding) return;
    if (
      !window.confirm(
        "Re-pull fixtures from iSportz? This upserts fantasy_match rows.",
      )
    ) {
      return;
    }
    setSeeding(true);
    setSeedMsg(null);
    try {
      const res = await seedFixtures();
      setSeedMsg({ ok: true, count: res.fixtures ?? 0 });
      setTick((n) => n + 1);
    } catch (err) {
      setSeedMsg({
        ok: false,
        error:
          err?.response?.data?.error ??
          err?.message ??
          "Seed failed — check backend logs.",
      });
    } finally {
      setSeeding(false);
    }
  };

  const handleSeedDemo = async () => {
    if (seedingDemo) return;
    setSeedingDemo(true);
    setDemoMsg(null);
    try {
      const res = await seedDemoMatch();
      setDemoMsg({
        ok: true,
        matchId: res.matchId,
        squadSize: res.squadSize,
        teamA: res.teamAShort || res.teamA,
        teamB: res.teamBShort || res.teamB,
        fullA: res.teamA,
        fullB: res.teamB,
        sourceFixture: res.sourceFixture,
      });
      setTick((n) => n + 1);
    } catch (err) {
      // Backend hints (e.g. "run seed:squads first") are usefully surfaced
      // to the operator — pass them through.
      const data = err?.response?.data ?? {};
      setDemoMsg({
        ok: false,
        error: data.error ?? err?.message ?? "Demo seed failed — check backend logs.",
        hint: data.hint,
      });
    } finally {
      setSeedingDemo(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Fantasy"
        title="Fantasy Hub"
        subtitle="One place for Playing XI, contest CRUD, and match lifecycle controls."
        actions={
          <>
            <Button
              onClick={handleSeedDemo}
              disabled={seedingDemo}
              variant="secondary"
              size="md"
            >
              {seedingDemo ? "Setting up…" : "+ Set up walkthrough"}
            </Button>
            <Button onClick={handleSeed} disabled={seeding} size="md">
              {seeding ? "Seeding…" : "Re-seed fixtures"}
            </Button>
          </>
        }
      />

      {demoMsg ? (
        <div
          className={`mb-3 rounded-xl border px-4 py-3 text-sm ${
            demoMsg.ok
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
              : "border-red-400/30 bg-red-400/10 text-red-200"
          }`}
        >
          {demoMsg.ok ? (
            <>
              <span className="font-semibold">Walkthrough match ready —</span>{" "}
              <span className="font-bold">{demoMsg.fullA || demoMsg.teamA}</span>{" "}
              vs{" "}
              <span className="font-bold">{demoMsg.fullB || demoMsg.teamB}</span>{" "}
              ({demoMsg.squadSize}-player squad). Pinned to the top of the list.
            </>
          ) : (
            <>
              Setup failed — <span className="font-mono">{demoMsg.error}</span>
              {demoMsg.hint ? (
                <div className="mt-1 text-xs text-red-200/80">{demoMsg.hint}</div>
              ) : null}
            </>
          )}
        </div>
      ) : null}

      {seedMsg ? (
        <div
          className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
            seedMsg.ok
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
              : "border-red-400/30 bg-red-400/10 text-red-200"
          }`}
        >
          {seedMsg.ok
            ? `Re-seed done — ${seedMsg.count} fixtures upserted.`
            : `Re-seed failed — ${seedMsg.error}`}
        </div>
      ) : null}

      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Users" value={stats?.users ?? "—"} accent="default" />
        <StatCard label="Matches" value={stats?.matches ?? "—"} accent="blue" />
        <StatCard label="Contests" value={stats?.contests ?? "—"} accent="gold" />
        <StatCard label="Entries" value={stats?.entries ?? "—"} accent="emerald" />
      </div>

      {statsError ? (
        <Card title="Stats unavailable">
          <div className="text-sm text-white/65">
            Backend returned {String(statsError)}. The hub auto-retries every 15
            seconds.
          </div>
        </Card>
      ) : null}

      <Card padding="tight">
        <div className="flex flex-col gap-2 px-1 py-1">
          <FilterRow
            label="Status"
            options={STATUS_FILTERS}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          <FilterRow
            label="Category"
            options={CATEGORY_FILTERS}
            value={categoryFilter}
            onChange={setCategoryFilter}
          />
        </div>
      </Card>

      <div className="mt-6">
        {filtered.length === 0 ? (
          <Card>
            <EmptyState
              title={
                matches.length === 0
                  ? "No fantasy matches yet"
                  : "No matches match the current filters"
              }
              hint={
                matches.length === 0
                  ? "Use Re-seed fixtures to pull the schedule from iSportz."
                  : undefined
              }
            />
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((m) => (
              <FantasyMatchCard key={m.id} match={m} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function FilterRow({ label, options, value, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
        {label}
      </span>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition ${
            value === opt.value
              ? "bg-gradient-to-b from-[#F68323] to-[#E07E27] text-white shadow-[0_4px_12px_-4px_rgba(246,131,35,0.6)]"
              : "border border-white/15 bg-white/[0.03] text-white/70 hover:border-white/40 hover:text-white"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function FantasyMatchCard({ match }) {
  const teamA = match.team_a_short || match.team_a_name || "TBA";
  const teamB = match.team_b_short || match.team_b_name || "TBA";
  const xiAnnounced = !!match.playing_xi_announced_at;
  // We still detect demo matches to pin them to the top (see the sort in
  // FantasyHubPage), but render them visually identical to real fixtures so
  // the demo is indistinguishable from a production match for the client.
  return (
    <Link
      href={`/admin/fantasy/matches/${encodeURIComponent(match.id)}`}
      className="group relative flex flex-col rounded-2xl border border-white/10 bg-[#0A1438]/85 p-5 transition hover:border-[#F2A23A]/40 hover:bg-[#0A1438]"
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">
          {match.series_name || "Match"}
        </span>
        <MatchStatusBadge status={match.status} />
      </div>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {match.category ? <Pill tone="default">{match.category}</Pill> : null}
        {xiAnnounced ? <Pill tone="emerald">XI ✓</Pill> : <Pill tone="default">XI pending</Pill>}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <TeamBadge label={teamA} />
        <span className="font-oswald text-sm font-bold italic text-white/55">VS</span>
        <TeamBadge label={teamB} />
      </div>
      <div className="mt-3 text-xs text-white/55">
        {match.scheduled_at ? new Date(match.scheduled_at).toLocaleString() : ""}
      </div>
      <div className="mt-3 text-[11px] text-white/45">
        lock_at:{" "}
        <span className="font-mono text-white/65">
          {match.lock_at ? new Date(match.lock_at).toLocaleString() : "—"}
        </span>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-2">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
            Entries
          </div>
          <div className="mt-0.5 font-oswald text-lg font-extrabold italic tabular-nums text-white">
            {match.entries_count ?? 0}
          </div>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-2">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
            ID
          </div>
          <div className="mt-0.5 truncate font-mono text-xs text-white">
            {match.id}
          </div>
        </div>
      </div>
      <div className="mt-auto pt-4 text-right text-xs font-bold uppercase tracking-wide text-[#F2A23A] opacity-0 transition group-hover:opacity-100">
        Manage →
      </div>
    </Link>
  );
}

function TeamBadge({ label }) {
  return (
    <div className="flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-white/[0.06] text-xs font-extrabold text-white">
        {label.slice(0, 3).toUpperCase()}
      </span>
      <span className="font-oswald text-base font-extrabold italic uppercase text-white">
        {label}
      </span>
    </div>
  );
}
