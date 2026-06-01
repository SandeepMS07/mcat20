"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  createContest,
  getFantasyMatch,
  listContestsForMatch,
  updateContest,
} from "@/app/api/admin/fantasy";
import {
  Button,
  Card,
  EmptyState,
  MatchStatusBadge,
  PageHeader,
  Pill,
} from "@/components/admin/ui";

// The contest schema's enum includes a legacy "free" value, but it is
// invisible to /v1/contests (which filters to 'public') and so admin-created
// "free" rows disappear from the consumer app. We collapse the choice to two
// real options: Public (any prize_pool, including no fee) and Private
// (invite-code only). "Free" is just a Public contest with no fee.
const CONTEST_TYPES = [
  { value: "public",  label: "Public",  hint: "Open to all (free or paid)" },
  { value: "private", label: "Private", hint: "Invite-code only" },
];

export default function FantasyContestsPage() {
  const { matchId } = useParams(); // fantasy_match.id (text)

  const [match, setMatch] = useState(null);
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [fm, list] = await Promise.all([
          getFantasyMatch(matchId),
          listContestsForMatch(matchId),
        ]);
        if (cancelled) return;
        setMatch(fm.match);
        setContests(Array.isArray(list) ? list : list.contests ?? []);
      } catch (e) {
        if (!cancelled) {
          setError(e?.response?.data?.error ?? e?.message ?? "load_failed");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [matchId]);

  const refresh = async () => {
    setRefreshing(true);
    try {
      const list = await listContestsForMatch(matchId);
      setContests(Array.isArray(list) ? list : list.contests ?? []);
    } finally {
      setRefreshing(false);
    }
  };

  const teamA = match?.team_a_short || match?.team_a_name || "TBA";
  const teamB = match?.team_b_short || match?.team_b_name || "TBA";

  if (loading) {
    return (
      <>
        <PageHeader eyebrow="Contests" title="Loading…" />
        <div className="h-32 animate-pulse rounded-2xl border border-white/10 bg-white/[0.02]" />
      </>
    );
  }

  if (!match) {
    return (
      <>
        <PageHeader eyebrow="Contests" title="Match not found" />
        <Card>
          <EmptyState
            title="No fantasy_match for this id"
            hint="Try Re-seed fixtures from the Fantasy Hub."
            action={<Button as={Link} href="/admin/fantasy">← Back to Fantasy Hub</Button>}
          />
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow={`Contests · ${match.series_name || "Match"}`}
        title={`${teamA} vs ${teamB}`}
        subtitle={
          <span className="flex flex-wrap items-center gap-2">
            <MatchStatusBadge status={match.status} />
            {match.scheduled_at ? (
              <span className="text-white/55">
                {new Date(match.scheduled_at).toLocaleString()}
              </span>
            ) : null}
            <span className="text-white/45">
              {contests.length} contest{contests.length === 1 ? "" : "s"}
            </span>
          </span>
        }
        actions={
          <Button as={Link} href={`/admin/fantasy/matches/${encodeURIComponent(matchId)}`} variant="secondary" size="md">
            ← Back to match
          </Button>
        }
      />

      {error ? (
        <div className="mb-4 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {String(error)}
        </div>
      ) : null}

      <Card title="Create new contest" padding="tight">
        <CreateContestForm fantasyMatchId={matchId} onCreated={() => refresh()} />
      </Card>

      <div className="mt-6">
        <Card
          title={
            <span className="flex items-center gap-2">
              <span>Existing contests</span>
              {refreshing ? <span className="text-[10px] text-white/45">refreshing…</span> : null}
            </span>
          }
          padding="tight"
        >
          {contests.length === 0 ? (
            <EmptyState
              title="No contests for this match yet"
              hint="Create the first contest above. Free contest is the default for Phase-1."
            />
          ) : (
            <ul className="divide-y divide-white/5">
              {contests.map((c) => (
                <ContestRow
                  key={c.id}
                  contest={c}
                  editing={editingId === c.id}
                  onEdit={() => setEditingId(c.id)}
                  onCancel={() => setEditingId(null)}
                  onSaved={async () => {
                    setEditingId(null);
                    await refresh();
                  }}
                />
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}

function CreateContestForm({ fantasyMatchId, onCreated }) {
  const [name, setName] = useState("");
  const [contestType, setContestType] = useState("public");
  const [maxEntries, setMaxEntries] = useState("");
  const [entriesPerUser, setEntriesPerUser] = useState("1");
  const [prizePool, setPrizePool] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  const reset = () => {
    setName("");
    setContestType("public");
    setMaxEntries("");
    setEntriesPerUser("1");
    setPrizePool("");
  };

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    if (!name.trim()) {
      setErr("Name is required.");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      await createContest({
        matchId: fantasyMatchId,
        name: name.trim(),
        contestType,
        maxEntries: maxEntries ? Number(maxEntries) : null,
        entriesPerUser: entriesPerUser ? Number(entriesPerUser) : 1,
        prizePool: prizePool || undefined,
      });
      reset();
      onCreated?.();
    } catch (e) {
      setErr(e?.response?.data?.error ?? e?.message ?? "create_failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-3 px-3 py-3 sm:grid-cols-2">
      <Field label="Name">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Mega Contest"
          maxLength={120}
          className="w-full rounded-md border border-white/15 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-[#F2A23A] focus:outline-none"
        />
      </Field>
      <Field label="Type">
        <select
          value={contestType}
          onChange={(e) => setContestType(e.target.value)}
          className="w-full rounded-md border border-white/15 bg-white/[0.04] px-3 py-2 text-sm text-white focus:border-[#F2A23A] focus:outline-none"
        >
          {CONTEST_TYPES.map((t) => (
            <option key={t.value} value={t.value} className="bg-[#0A1438]">
              {t.label} — {t.hint}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Max entries (blank = unlimited)">
        <input
          type="number"
          min="1"
          value={maxEntries}
          onChange={(e) => setMaxEntries(e.target.value)}
          className="w-full rounded-md border border-white/15 bg-white/[0.04] px-3 py-2 text-sm text-white focus:border-[#F2A23A] focus:outline-none"
        />
      </Field>
      <Field label="Entries per user">
        <input
          type="number"
          min="1"
          value={entriesPerUser}
          onChange={(e) => setEntriesPerUser(e.target.value)}
          className="w-full rounded-md border border-white/15 bg-white/[0.04] px-3 py-2 text-sm text-white focus:border-[#F2A23A] focus:outline-none"
        />
      </Field>
      <Field label="Prize pool (optional)" wide>
        <input
          type="text"
          value={prizePool}
          onChange={(e) => setPrizePool(e.target.value)}
          placeholder="e.g. ₹50,000 / Phase 2 only"
          className="w-full rounded-md border border-white/15 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-[#F2A23A] focus:outline-none"
        />
      </Field>
      {err ? (
        <div className="rounded-md border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs text-red-200 sm:col-span-2">
          {err}
        </div>
      ) : null}
      <div className="flex justify-end gap-2 sm:col-span-2">
        <Button type="submit" disabled={busy} size="md">
          {busy ? "Creating…" : "Create contest"}
        </Button>
      </div>
    </form>
  );
}

function ContestRow({ contest, editing, onEdit, onCancel, onSaved }) {
  if (editing) return <EditContestRow contest={contest} onCancel={onCancel} onSaved={onSaved} />;
  return (
    <li className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-6">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-white">{contest.name}</span>
          <Pill tone={contest.contest_type === "private" ? "default" : "gold"}>
            {contest.contest_type}
          </Pill>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-white/55">
          <span>
            {contest.max_entries ? `cap ${contest.max_entries}` : "no cap"} ·{" "}
            {contest.entries_per_user}/user
          </span>
          {contest.prize_pool ? (
            <>
              <span>·</span>
              <span>{contest.prize_pool}</span>
            </>
          ) : null}
        </div>
      </div>
      <Button onClick={onEdit} variant="secondary" size="sm">
        Edit
      </Button>
    </li>
  );
}

function EditContestRow({ contest, onCancel, onSaved }) {
  const [name, setName] = useState(contest.name ?? "");
  // Migrate legacy 'free' to 'public' in the editor so a Save doesn't re-write
  // the dead-end type back to the row.
  const [contestType, setContestType] = useState(
    contest.contest_type === "free" ? "public" : (contest.contest_type ?? "public"),
  );
  const [maxEntries, setMaxEntries] = useState(
    contest.max_entries == null ? "" : String(contest.max_entries),
  );
  const [entriesPerUser, setEntriesPerUser] = useState(
    String(contest.entries_per_user ?? 1),
  );
  const [prizePool, setPrizePool] = useState(contest.prize_pool ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  const save = async () => {
    setBusy(true);
    setErr(null);
    try {
      await updateContest(contest.id, {
        name,
        contestType,
        maxEntries: maxEntries ? Number(maxEntries) : null,
        entriesPerUser: entriesPerUser ? Number(entriesPerUser) : 1,
        prizePool: prizePool || null,
      });
      onSaved?.();
    } catch (e) {
      setErr(e?.response?.data?.error ?? e?.message ?? "update_failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <li className="px-4 py-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-white/15 bg-white/[0.04] px-3 py-2 text-sm text-white"
          />
        </Field>
        <Field label="Type">
          <select
            value={contestType}
            onChange={(e) => setContestType(e.target.value)}
            className="w-full rounded-md border border-white/15 bg-white/[0.04] px-3 py-2 text-sm text-white"
          >
            {CONTEST_TYPES.map((t) => (
              <option key={t.value} value={t.value} className="bg-[#0A1438]">
                {t.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Max entries">
          <input
            type="number"
            min="1"
            value={maxEntries}
            onChange={(e) => setMaxEntries(e.target.value)}
            className="w-full rounded-md border border-white/15 bg-white/[0.04] px-3 py-2 text-sm text-white"
          />
        </Field>
        <Field label="Entries per user">
          <input
            type="number"
            min="1"
            value={entriesPerUser}
            onChange={(e) => setEntriesPerUser(e.target.value)}
            className="w-full rounded-md border border-white/15 bg-white/[0.04] px-3 py-2 text-sm text-white"
          />
        </Field>
        <Field label="Prize pool" wide>
          <input
            value={prizePool}
            onChange={(e) => setPrizePool(e.target.value)}
            className="w-full rounded-md border border-white/15 bg-white/[0.04] px-3 py-2 text-sm text-white"
          />
        </Field>
        {err ? (
          <div className="rounded-md border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs text-red-200 sm:col-span-2">
            {err}
          </div>
        ) : null}
        <div className="flex justify-end gap-2 sm:col-span-2">
          <Button onClick={onCancel} variant="secondary" size="sm" disabled={busy}>
            Cancel
          </Button>
          <Button onClick={save} size="sm" disabled={busy}>
            {busy ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
    </li>
  );
}

function Field({ label, wide, children }) {
  return (
    <label className={`flex flex-col gap-1 ${wide ? "sm:col-span-2" : ""}`}>
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">
        {label}
      </span>
      {children}
    </label>
  );
}
