"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  abandonMatch,
  getFantasyMatch,
  lockMatch,
  listContestsForMatch,
  rescheduleMatch,
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

const REFRESH_MS = 10_000;

export default function FantasyMatchDetailPage() {
  const { matchId } = useParams(); // fantasy_match.id (text)
  const [match, setMatch] = useState(null);
  const [players, setPlayers] = useState([]);
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionBusy, setActionBusy] = useState(null);
  const [actionMsg, setActionMsg] = useState(null);
  const [tick, setTick] = useState(0);
  // Schedule edit panel — collapsed by default; opens inline below Actions
  // when the admin clicks "Edit schedule". Values held in datetime-local
  // shape (YYYY-MM-DDTHH:MM, local time) so they bind directly to the
  // native input; converted to ISO at submit time.
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({ scheduledAt: "", lockAt: "" });

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
        setPlayers(fm.players ?? []);
        setContests(Array.isArray(list) ? list : list.contests ?? []);
      } catch {
        if (!cancelled) {
          setMatch(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [matchId, tick]);

  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  const handleLock = async () => {
    if (!window.confirm(
      "Force-lock this match? lock_at clamps to now and status → live.",
    )) {
      return;
    }
    setActionBusy("lock");
    setActionMsg(null);
    try {
      await lockMatch(matchId);
      setActionMsg({ ok: true, text: "Match locked." });
      setTick((n) => n + 1);
    } catch (e) {
      setActionMsg({
        ok: false,
        text: e?.response?.data?.error ?? e?.message ?? "lock_failed",
      });
    } finally {
      setActionBusy(null);
    }
  };

  const openScheduleEditor = () => {
    setScheduleForm({
      scheduledAt: toLocalInputValue(match?.scheduled_at),
      lockAt:      toLocalInputValue(match?.lock_at),
    });
    setScheduleOpen(true);
    setActionMsg(null);
  };

  const handleScheduleSave = async () => {
    const { scheduledAt, lockAt } = scheduleForm;
    if (!scheduledAt && !lockAt) {
      setActionMsg({ ok: false, text: "Enter at least one of scheduled / lock time." });
      return;
    }
    // datetime-local has no timezone — Date() reads it as LOCAL time, then
    // toISOString() emits UTC. That round-trip is what the backend expects.
    const body = {};
    if (scheduledAt) body.scheduledAt = new Date(scheduledAt).toISOString();
    if (lockAt)      body.lockAt      = new Date(lockAt).toISOString();
    // Quick client-side guard so the user sees the error without a 400
    // round-trip. Backend still enforces this — this is just polish.
    if (body.scheduledAt && body.lockAt && body.lockAt > body.scheduledAt) {
      setActionMsg({ ok: false, text: "Lock time must be at or before scheduled start." });
      return;
    }
    setActionBusy("schedule");
    setActionMsg(null);
    try {
      await rescheduleMatch(matchId, body);
      setActionMsg({ ok: true, text: "Schedule updated." });
      setScheduleOpen(false);
      setTick((n) => n + 1);
    } catch (e) {
      const code = e?.response?.data?.error;
      const friendly =
        code === "match_not_upcoming" ? "Match is already live or completed — can't reschedule." :
        code === "lock_after_start"   ? "Lock time must be at or before scheduled start." :
        code === "match_not_found"    ? "Match not found." :
        code || e?.message || "reschedule_failed";
      setActionMsg({ ok: false, text: friendly });
    } finally {
      setActionBusy(null);
    }
  };

  const handleAbandon = async () => {
    if (!window.confirm(
      "Mark this match abandoned? Scoring stops; contests stay (no auto-refund yet).",
    )) {
      return;
    }
    setActionBusy("abandon");
    setActionMsg(null);
    try {
      await abandonMatch(matchId);
      setActionMsg({ ok: true, text: "Match marked abandoned." });
      setTick((n) => n + 1);
    } catch (e) {
      setActionMsg({
        ok: false,
        text: e?.response?.data?.error ?? e?.message ?? "abandon_failed",
      });
    } finally {
      setActionBusy(null);
    }
  };

  if (loading) {
    return (
      <>
        <PageHeader eyebrow="Fantasy" title="Loading…" />
        <div className="h-32 animate-pulse rounded-2xl border border-white/10 bg-white/[0.02]" />
      </>
    );
  }

  if (!match) {
    return (
      <>
        <PageHeader
          eyebrow="Fantasy"
          title="Match not found"
          actions={
            <Button as={Link} href="/admin/fantasy" variant="secondary" size="md">
              ← Back to Fantasy Hub
            </Button>
          }
        />
        <Card>
          <EmptyState
            title="No fantasy_match for this id"
            hint="The match may not be seeded yet. Try Re-seed fixtures from the Fantasy Hub."
            action={
              <Button as={Link} href="/admin/fantasy">← Back to Fantasy Hub</Button>
            }
          />
        </Card>
      </>
    );
  }

  const teamA = match.team_a_short || match.team_a_name || "TBA";
  const teamB = match.team_b_short || match.team_b_name || "TBA";
  const xiAnnounced = !!match.playing_xi_announced_at;
  const inXiCount = players.filter((p) => p.is_playing_xi === true).length;
  const benchedCount = players.filter((p) => p.is_playing_xi === false).length;
  const squadCount = players.length;
  const isLive = match.status === "live";
  const isAbandoned = match.status === "abandoned";

  return (
    <>
      <PageHeader
        eyebrow={`Fantasy · ${match.series_name || "Match"}`}
        title={`${teamA} vs ${teamB}`}
        subtitle={
          <span className="flex flex-wrap items-center gap-2">
            <MatchStatusBadge status={match.status} />
            {match.category ? <Pill tone="default">{match.category}</Pill> : null}
            {match.scheduled_at ? (
              <span className="text-white/55">
                {new Date(match.scheduled_at).toLocaleString()}
              </span>
            ) : null}
            <span className="font-mono text-[10px] text-white/45">id: {match.id}</span>
          </span>
        }
        actions={
          <Button as={Link} href="/admin/fantasy" variant="secondary" size="md">
            ← Fantasy Hub
          </Button>
        }
      />

      {actionMsg ? (
        <div
          className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
            actionMsg.ok
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
              : "border-red-400/30 bg-red-400/10 text-red-200"
          }`}
        >
          {actionMsg.text}
        </div>
      ) : null}

      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Squad size"
          value={squadCount}
          accent="default"
        />
        <StatCard
          label="Playing XI"
          value={xiAnnounced ? `${inXiCount} in / ${benchedCount} out` : "Not announced"}
          accent={xiAnnounced ? "emerald" : "default"}
        />
        <StatCard label="Contests" value={contests.length} accent="gold" />
        <StatCard
          label="lock_at"
          value={match.lock_at ? new Date(match.lock_at).toLocaleTimeString() : "—"}
          accent="blue"
        />
      </div>

      {/* Primary actions row */}
      <Card title="Actions" padding="tight">
        <div className="flex flex-wrap items-center gap-2 px-4 py-4">
          <Button
            as={Link}
            href={`/admin/fantasy/matches/${encodeURIComponent(matchId)}/playing-xi`}
            size="md"
          >
            {xiAnnounced ? "Edit Playing XI" : "Publish Playing XI"}
          </Button>
          <Button
            as={Link}
            href={`/admin/fantasy/matches/${encodeURIComponent(matchId)}/contests`}
            variant="secondary"
            size="md"
          >
            Manage contests ({contests.length})
          </Button>
          <span className="ml-auto flex flex-wrap gap-2">
            {/* Reschedule — only meaningful for upcoming matches; the
                backend rejects PATCH /schedule on live/completed rows. */}
            <Button
              onClick={openScheduleEditor}
              variant="secondary"
              size="md"
              disabled={actionBusy === "schedule" || isLive || isAbandoned || match.status === "completed"}
              title={
                isLive
                  ? "Match is live — schedule is fixed"
                  : isAbandoned
                    ? "Match abandoned"
                    : match.status === "completed"
                      ? "Match completed — schedule is fixed"
                      : "Edit scheduled / lock time"
              }
            >
              Edit schedule
            </Button>
            <Button
              onClick={handleLock}
              variant="secondary"
              size="md"
              disabled={actionBusy === "lock" || isLive || isAbandoned}
              title={
                isLive
                  ? "Already live"
                  : isAbandoned
                    ? "Match abandoned"
                    : "Force status → live, clamp lock_at to now"
              }
            >
              {actionBusy === "lock" ? "Locking…" : "Force lock"}
            </Button>
            <Button
              onClick={handleAbandon}
              variant="secondary"
              size="md"
              disabled={actionBusy === "abandon" || isAbandoned}
              title={isAbandoned ? "Already abandoned" : "Mark as abandoned"}
            >
              {actionBusy === "abandon" ? "Abandoning…" : "Abandon"}
            </Button>
          </span>
        </div>
      </Card>

      {/* Schedule editor — collapsed panel. Opens when admin clicks
          "Edit schedule" in the Actions row. Backend publishes a
          schedule:updated WS event on save so consumer frontends refresh
          without a page reload. */}
      {scheduleOpen ? (
        <ScheduleEditor
          form={scheduleForm}
          setForm={setScheduleForm}
          // Pass the current persisted values so the live invariant check
          // can resolve a one-sided patch: if the admin clears either
          // input we fall back to what's already in the DB, so the
          // comparison matches what the backend will enforce.
          currentScheduledAtIso={match.scheduled_at}
          currentLockAtIso={match.lock_at}
          busy={actionBusy === "schedule"}
          onSave={handleScheduleSave}
          onCancel={() => setScheduleOpen(false)}
        />
      ) : null}

      {/* Playing XI summary */}
      <div className="mt-6">
        <Card
          title={
            <span className="flex items-center gap-2">
              <span>Playing XI</span>
              {xiAnnounced ? (
                <Pill tone="emerald">
                  ✓ {new Date(match.playing_xi_announced_at).toLocaleString()}
                </Pill>
              ) : (
                <Pill tone="default">not announced</Pill>
              )}
            </span>
          }
          padding="tight"
        >
          {!xiAnnounced ? (
            <div className="px-4 py-6 text-sm text-white/55">
              No XI has been published for this match yet. Hit{" "}
              <span className="font-semibold text-white">Publish Playing XI</span>{" "}
              when team sheets are out.
            </div>
          ) : (
            <ul className="grid gap-1 px-4 py-3 sm:grid-cols-2">
              {players
                .filter((p) => p.is_playing_xi === true)
                .map((p) => (
                  <li
                    key={p.player_id}
                    className="flex items-center justify-between gap-2 rounded-md border border-white/5 bg-white/[0.02] px-3 py-2 text-sm"
                  >
                    <span className="truncate text-white">{p.player_name || p.player_id}</span>
                    <span className="text-[10px] text-white/55">{p.role}</span>
                  </li>
                ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}

// Convert an ISO timestamp into the YYYY-MM-DDTHH:MM string that the
// <input type="datetime-local"> control expects, in local time. Returns
// "" for null/invalid input so the comparison logic can treat absence as
// "no client-side value entered yet".
function toLocalInputValue(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Inline editor for the match's scheduled_at / lock_at. Lives in this
// file because the wiring is small and tightly coupled to the parent's
// form state. Surfaces live invariant feedback (red border + helper line
// + disabled Save) by comparing against the admin's intended end-state —
// which means falling back to the *currently persisted* values when the
// admin only edits one side. Without that fallback a lockAt-only patch
// that pushes past the existing scheduled_at would silently pass client
// validation and only fail server-side.
function ScheduleEditor({
  form,
  setForm,
  currentScheduledAtIso,
  currentLockAtIso,
  busy,
  onSave,
  onCancel,
}) {
  // Effective end-state after this save: form value if entered, otherwise
  // the persisted value the backend will keep as-is. datetime-local
  // strings are lexicographically ordered as long as the format is
  // consistent — and we normalize both sides to the same toLocalInputValue
  // format, so string compare here matches the backend's Date() compare.
  const effectiveScheduledAt = form.scheduledAt || toLocalInputValue(currentScheduledAtIso);
  const effectiveLockAt      = form.lockAt      || toLocalInputValue(currentLockAtIso);
  const lockAfterStart =
    effectiveScheduledAt && effectiveLockAt && effectiveLockAt > effectiveScheduledAt;
  const inputBase =
    "rounded-md border bg-white/[0.04] px-3 py-2 text-sm text-white outline-none";
  const lockInputClass = lockAfterStart
    ? `${inputBase} border-red-400/70 focus:border-red-400`
    : `${inputBase} border-white/15 focus:border-amber-400/60`;
  return (
    <div className="mt-4">
      <Card title="Edit schedule" padding="tight">
        <div className="flex flex-col gap-4 px-4 py-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-xs text-white/65">
              <span className="font-semibold uppercase tracking-wider">Scheduled start</span>
              <input
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(e) =>
                  setForm((f) => ({ ...f, scheduledAt: e.target.value }))
                }
                className={`${inputBase} border-white/15 focus:border-amber-400/60`}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-xs text-white/65">
              <span className="font-semibold uppercase tracking-wider">Lock at</span>
              <input
                type="datetime-local"
                value={form.lockAt}
                onChange={(e) =>
                  setForm((f) => ({ ...f, lockAt: e.target.value }))
                }
                className={lockInputClass}
              />
              {lockAfterStart ? (
                <span className="text-[11px] font-semibold text-red-300">
                  Must be at or before {new Date(effectiveScheduledAt).toLocaleString()}.
                </span>
              ) : null}
            </label>
          </div>
          <p className="text-[11px] leading-relaxed text-white/45">
            Lock must be at or before scheduled start. Both fields use your local timezone; the
            backend stores UTC. Only allowed while the match is still upcoming.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={onSave}
              size="md"
              disabled={busy || lockAfterStart}
              title={lockAfterStart ? "Lock at must be ≤ Scheduled start" : undefined}
            >
              {busy ? "Saving…" : "Save schedule"}
            </Button>
            <Button
              onClick={onCancel}
              variant="secondary"
              size="md"
              disabled={busy}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
