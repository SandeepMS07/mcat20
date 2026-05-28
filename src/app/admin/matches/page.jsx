"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { deleteFixture, listMatches } from "@/app/api/admin/polls";
import {
  Button,
  Card,
  EmptyState,
  MatchStatusBadge,
  PageHeader,
  Pill,
  StatCard,
} from "@/components/admin/ui";

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

export default function AdminMatchesListPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [category, setCategory] = useState("all");
  // Track in-flight delete by fixture id so the button can show a spinner
  // and we can disable re-clicks without blocking other rows.
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await listMatches();
        if (!cancelled) setMatches(res.matches || []);
      } catch {
        if (!cancelled) setMatches([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(
    () =>
      matches.filter(
        (m) =>
          (filter === "all" || m.status === filter) &&
          (category === "all" || m.category === category),
      ),
    [filter, category, matches],
  );

  const handleDelete = async (m) => {
    const teamA = m.team_a_short || m.team_a_name || "TBD";
    const teamB = m.team_b_short || m.team_b_name || "TBD";
    const label = m.label || `${teamA} vs ${teamB}`;
    if (!window.confirm(`Delete fixture "${label}"? This cannot be undone.`)) return;
    setDeletingId(m.id);
    try {
      await deleteFixture(m.id);
      setMatches((prev) => prev.filter((x) => x.id !== m.id));
    } catch (e) {
      window.alert(`Delete failed: ${e?.response?.data?.error ?? e?.message ?? "unknown error"}`);
    } finally {
      setDeletingId(null);
    }
  };

  const stats = useMemo(
    () => ({
      total: matches.length,
      live: matches.filter((m) => m.status === "live").length,
      upcoming: matches.filter((m) => m.status === "upcoming").length,
      withWinner: matches.filter((m) => m.has_winner).length,
    }),
    [matches],
  );

  return (
    <>
      <PageHeader
        eyebrow="Match dashboards"
        title="Matches"
        subtitle="Monitor live poll activity, manage scheduling and pick winners."
      />

      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total matches" value={stats.total} accent="default" />
        <StatCard label="Live now" value={stats.live} accent="emerald" />
        <StatCard label="Upcoming" value={stats.upcoming} accent="blue" />
        <StatCard label="Winners picked" value={stats.withWinner} accent="gold" />
      </div>

      <Card padding="tight">
        <div className="flex flex-col gap-2 px-1 py-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
              Status
            </span>
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition ${
                  filter === f.value
                    ? "bg-gradient-to-b from-[#F68323] to-[#E07E27] text-white shadow-[0_4px_12px_-4px_rgba(246,131,35,0.6)]"
                    : "border border-white/15 bg-white/[0.03] text-white/70 hover:border-white/40 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
              Category
            </span>
            {CATEGORY_FILTERS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setCategory(c.value)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition ${
                  category === c.value
                    ? "bg-gradient-to-b from-[#F68323] to-[#E07E27] text-white shadow-[0_4px_12px_-4px_rgba(246,131,35,0.6)]"
                    : "border border-white/15 bg-white/[0.03] text-white/70 hover:border-white/40 hover:text-white"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="mt-6">
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-44 animate-pulse rounded-2xl border border-white/10 bg-white/[0.02]"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <EmptyState
              title={
                filter === "all" && category === "all"
                  ? "No matches in the next 30 days"
                  : `No matches for the current filters`
              }
              hint="Matches are seeded from the tournament fixtures file. Run `npm run seed:tournament` after editing the schedule."
            />
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((m) => (
              <MatchCard
                key={m.id}
                match={m}
                onDelete={handleDelete}
                deleting={deletingId === m.id}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function MatchCard({ match, onDelete, deleting }) {
  const teamA = match.team_a_short || match.team_a_name || "TBA";
  const teamB = match.team_b_short || match.team_b_name || "TBA";
  // Clicks on the delete button must not also follow the card's <Link>.
  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(match);
  };
  return (
    <Link
      href={`/admin/matches/${encodeURIComponent(match.id)}`}
      className="group relative flex flex-col rounded-2xl border border-white/10 bg-[#0A1438]/85 p-5 transition hover:border-[#F2A23A]/40 hover:bg-[#0A1438]"
    >
      <button
        type="button"
        onClick={handleDeleteClick}
        disabled={deleting}
        title="Delete fixture"
        className="absolute right-3 top-3 z-10 rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white/60 transition hover:border-red-400/50 hover:bg-red-500/15 hover:text-red-300 disabled:opacity-50"
      >
        {deleting ? "…" : "Delete"}
      </button>
      <div className="flex items-center justify-between pr-16">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">
          {match.series_name || "Match"}
        </span>
        <MatchStatusBadge status={match.status} />
      </div>
      {(match.category || match.match_type === "playoff" || match.match_type === "reserve") && (
        <div className="mt-1 flex flex-wrap gap-1.5">
          {match.category ? <Pill tone="default">{match.category}</Pill> : null}
          {match.match_type && match.match_type !== "match" ? (
            <Pill tone="gold">{match.label || match.match_type}</Pill>
          ) : null}
        </div>
      )}
      <div className="mt-3 flex items-center gap-3">
        <TeamBadge label={teamA} />
        <span className="font-oswald text-sm font-bold italic text-white/55">VS</span>
        <TeamBadge label={teamB} />
      </div>
      <div className="mt-3 text-xs text-white/55">
        {match.scheduled_at
          ? new Date(match.scheduled_at).toLocaleString()
          : ""}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-2">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
            Polls
          </div>
          <div className="mt-0.5 font-oswald text-lg font-extrabold italic tabular-nums text-white">
            {match.poll_count}
          </div>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-2">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
            Votes
          </div>
          <div className="mt-0.5 font-oswald text-lg font-extrabold italic tabular-nums text-white">
            {match.vote_count}
          </div>
        </div>
      </div>
      {match.has_winner ? (
        <div className="mt-4">
          <Pill tone="emerald">🏆 Winner picked</Pill>
        </div>
      ) : null}
      <div className="mt-auto pt-4 text-right text-xs font-bold uppercase tracking-wide text-[#F2A23A] opacity-0 transition group-hover:opacity-100">
        Open →
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
