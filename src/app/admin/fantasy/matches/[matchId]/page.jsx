"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  abandonMatch,
  clearMatchCache,
  forceIngestTick,
  forceRescore,
  getContestPreview,
  getFantasyMatch,
  getIngestStatus,
  listContestsForMatch,
  listMatchEntries,
  lockMatch,
  rebuildMatchScoring,
  rescheduleMatch,
  updateWidgetMatchId,
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
  const [scheduleForm, setScheduleForm] = useState({ scheduledAt: "", lockAt: "", resetStatus: false });
  // Ingest health — refreshed on its own faster cadence (5s) so the "last
  // tick" timestamp stays useful during a live match. Polling stops while
  // the editor for widget_match_id is open so a refresh doesn't clobber the
  // admin's in-progress edit.
  const [ingest, setIngest] = useState(null);
  const [widgetIdDraft, setWidgetIdDraft] = useState("");
  const [editingWidgetId, setEditingWidgetId] = useState(false);
  // Abandon confirmation panel — replaces the old window.confirm so we can
  // surface a "also void all entries" choice in the same UI.
  const [abandonOpen, setAbandonOpen] = useState(false);
  const [abandonVoid, setAbandonVoid] = useState(false);
  // Contest preview cache — entry counts + top 10 per contest. Lazy-loaded
  // when the admin expands a contest row; keyed by contest id.
  const [contestPreviews, setContestPreviews] = useState({});
  const [previewLoading, setPreviewLoading] = useState({});
  const [expandedContestId, setExpandedContestId] = useState(null);

  // Flat list of every entry for the match — populates the "Live entries"
  // table. Loaded alongside the match metadata and refreshed on the main
  // 10s tick so points stay current during a live match without an extra
  // poll cadence.
  const [entries, setEntries] = useState([]);
  const [entriesLoading, setEntriesLoading] = useState(true);
  const [entryFilter, setEntryFilter] = useState("");

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

  // Live entries — every active+voided entry across every contest for this
  // match, with current points. Re-fetches on the same 10s tick as the main
  // load so the table tracks the live score without a separate cadence.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await listMatchEntries(matchId);
        if (cancelled) return;
        setEntries(Array.isArray(list) ? list : []);
      } catch {
        if (!cancelled) setEntries([]);
      } finally {
        if (!cancelled) setEntriesLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [matchId, tick]);

  // Ingest health poll — faster than the main 10s tick so the "last update"
  // pill on the live card stays meaningful. Paused while the widget_match_id
  // editor is open so a fetch doesn't overwrite the admin's typed value.
  useEffect(() => {
    let cancelled = false;
    let timer = null;
    const load = async () => {
      if (editingWidgetId) return;
      try {
        const s = await getIngestStatus(matchId);
        if (!cancelled) setIngest(s);
      } catch {
        // Swallow — the card just shows the previous value with no fresh
        // staleness counter. A persistent failure is visible because the
        // "last updated Ns ago" stops advancing.
      }
    };
    load();
    timer = setInterval(load, 5_000);
    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [matchId, tick, editingWidgetId]);

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
      scheduledAt:  toLocalInputValue(match?.scheduled_at),
      lockAt:       toLocalInputValue(match?.lock_at),
      resetStatus:  false,
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
    if (scheduledAt)              body.scheduledAt  = new Date(scheduledAt).toISOString();
    if (lockAt)                   body.lockAt       = new Date(lockAt).toISOString();
    if (scheduleForm.resetStatus) body.resetStatus  = true;
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
      setActionMsg({ ok: true, text: scheduleForm.resetStatus ? "Schedule updated and match reset to upcoming — team creation is now open." : "Schedule updated." });
      setScheduleOpen(false);
      setTick((n) => n + 1);
    } catch (e) {
      const code = e?.response?.data?.error;
      const friendly =
        code === "match_already_finished" ? "Match is completed or abandoned — can't reschedule." :
        code === "lock_after_start"        ? "Lock time must be at or before scheduled start." :
        code === "match_not_found"         ? "Match not found." :
        code || e?.message || "reschedule_failed";
      setActionMsg({ ok: false, text: friendly });
    } finally {
      setActionBusy(null);
    }
  };

  const openAbandon = () => {
    setAbandonVoid(false);
    setAbandonOpen(true);
    setActionMsg(null);
  };

  // Confirm panel uses an explicit "Void all entries" checkbox instead of
  // window.confirm so the admin has to make the void choice deliberately —
  // a true second action, not buried in a confirm-dialog message body.
  const handleAbandonConfirm = async () => {
    setActionBusy("abandon");
    setActionMsg(null);
    try {
      const res = await abandonMatch(matchId, { voidEntries: abandonVoid });
      setActionMsg({
        ok: true,
        text: abandonVoid
          ? `Match abandoned. ${res?.voidedEntries ?? 0} entries voided.`
          : "Match abandoned.",
      });
      setAbandonOpen(false);
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

  const handleSaveWidgetId = async () => {
    setActionBusy("widget_id");
    setActionMsg(null);
    try {
      await updateWidgetMatchId(matchId, widgetIdDraft);
      setActionMsg({ ok: true, text: "Widget match id saved." });
      setEditingWidgetId(false);
      setTick((n) => n + 1);
    } catch (e) {
      const code = e?.response?.data?.error;
      const friendly =
        code === "invalid_widget_match_id" ? "Invalid format — letters, digits, dash, underscore only." :
        code === "widget_match_id_in_use"  ? "Another match already owns this widget id." :
        code || e?.message || "save_failed";
      setActionMsg({ ok: false, text: friendly });
    } finally {
      setActionBusy(null);
    }
  };

  const handleForceTick = async () => {
    setActionBusy("force_tick");
    setActionMsg(null);
    try {
      const res = await forceIngestTick(matchId);
      const summary = res?.reason === "no_change"
        ? "Tick ran — no new deltas."
        : res?.reason === "no_fantasy_match_row"
          ? "No fantasy_match row matched the widget id."
          : `Tick ran — ${res?.deltas ?? 0} deltas, ${res?.snapshotPlayers ?? 0} players in snapshot.`;
      setActionMsg({ ok: true, text: summary });
      setTick((n) => n + 1);
    } catch (e) {
      const code = e?.response?.data?.error;
      const friendly =
        code === "no_widget_match_id" ? "Set widget_match_id first." :
        code === "match_not_found"    ? "Match not found." :
        code || e?.message || "tick_failed";
      setActionMsg({ ok: false, text: friendly });
    } finally {
      setActionBusy(null);
    }
  };

  const handleRescore = async () => {
    if (!window.confirm(
      "Re-run scoring from current player_match_stats? Idempotent — safe to repeat.",
    )) {
      return;
    }
    setActionBusy("rescore");
    setActionMsg(null);
    try {
      const res = await forceRescore(matchId);
      setActionMsg({ ok: true, text: `Rescore enqueued for ${res?.players ?? 0} players.` });
    } catch (e) {
      const code = e?.response?.data?.error;
      const friendly =
        code === "no_stats_to_rescore" ? "No player_match_stats rows for this match yet." :
        code === "match_not_found"     ? "Match not found." :
        code || e?.message || "rescore_failed";
      setActionMsg({ ok: false, text: friendly });
    } finally {
      setActionBusy(null);
    }
  };

  // DESTRUCTIVE: wipe player_event / player_match_stats /
  // entry_player_points / entry.total_points for this match, then force
  // one ingest tick to rebuild from the vendor feed. Use only when
  // player_event has wrong attributions baked in from before the
  // canonical-id resolver was hardened. Force rescore can't fix that
  // because it recomputes FROM the corrupted data.
  //
  // Type-to-confirm the matchId in the dialog because mistakenly running
  // this on the wrong match wipes its scoring derived data — recoverable
  // (next tick rebuilds) but disruptive while it runs.
  const handleRebuildScoring = async () => {
    const typed = window.prompt(
      `DESTRUCTIVE: rebuild scoring for ${matchId}.\n\n` +
      `This will:\n` +
      `  • DELETE every player_event row for this match\n` +
      `  • DELETE every player_match_stats row\n` +
      `  • DELETE every entry_player_points row for affected entries\n` +
      `  • Zero entry.total_points\n` +
      `  • Drop Redis keys and run one ingest tick to rebuild\n\n` +
      `Use only when player_event was written with wrong player_ids ` +
      `(pre-fix mis-attribution).\n\n` +
      `Type the match id "${matchId}" exactly to confirm:`,
    );
    if (typed == null) return; // cancelled
    if (typed.trim() !== matchId) {
      setActionMsg({ ok: false, text: "Match id didn't match — rebuild cancelled." });
      return;
    }
    setActionBusy("rebuild");
    setActionMsg(null);
    try {
      const res = await rebuildMatchScoring(matchId);
      setActionMsg({
        ok: true,
        text:
          `Rebuilt: wiped ${res?.eventsDeleted ?? 0} events, ${res?.statsDeleted ?? 0} stats, ` +
          `${res?.eppDeleted ?? 0} epp rows across ${res?.entries ?? 0} entries. ` +
          `Tick replayed ${res?.tick?.deltas ?? 0} deltas in ${res?.durationMs ?? 0}ms.`,
      });
      setTick((n) => n + 1);
    } catch (e) {
      const code = e?.response?.data?.error;
      const friendly =
        code === "no_widget_match_id" ? "Set widget_match_id first — the rebuild needs a vendor feed." :
        code === "match_not_found"    ? "Match not found." :
        code || e?.message || "rebuild_failed";
      setActionMsg({ ok: false, text: friendly });
    } finally {
      setActionBusy(null);
    }
  };

  // Nuke every Redis cache scoped to this match — response caches, the live
  // ingest resolver caches (widget:idmap, widget:snap), and the per-contest
  // leaderboard ZSETs. The follow-up action is usually Force tick (to re-
  // resolve and re-populate stats) or Force rescore (to recompute from
  // existing player_match_stats with a fixed mapping).
  const handleClearCache = async () => {
    if (!window.confirm(
      "Clear all Redis caches for this match? Stats in Postgres aren't touched. " +
      "Use this after fixing a player or widget mapping — then click Force tick.",
    )) {
      return;
    }
    setActionBusy("clear_cache");
    setActionMsg(null);
    try {
      const res = await clearMatchCache(matchId);
      setActionMsg({
        ok: true,
        text: `Caches cleared. ${res?.contestsCleared ?? 0} leaderboard ZSETs dropped.`,
      });
      setTick((n) => n + 1);
    } catch (e) {
      const code = e?.response?.data?.error;
      const friendly =
        code === "match_not_found" ? "Match not found." :
        code || e?.message || "clear_cache_failed";
      setActionMsg({ ok: false, text: friendly });
    } finally {
      setActionBusy(null);
    }
  };

  const toggleContestPreview = async (contestId) => {
    if (expandedContestId === contestId) {
      setExpandedContestId(null);
      return;
    }
    setExpandedContestId(contestId);
    if (contestPreviews[contestId]) return; // cached
    setPreviewLoading((m) => ({ ...m, [contestId]: true }));
    try {
      const data = await getContestPreview(contestId);
      setContestPreviews((m) => ({ ...m, [contestId]: data }));
    } catch {
      setContestPreviews((m) => ({ ...m, [contestId]: { error: true } }));
    } finally {
      setPreviewLoading((m) => ({ ...m, [contestId]: false }));
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
            title={xiAnnounced
              ? "EDIT PLAYING XI\n\nWHAT: Re-open the per-match XI picker to amend the announced 11+11. Auto-pull from squad.js or tick manually.\n\nWARNING: Republishing changes the XI for users who already joined. Players newly benched score 0 from this point on.\n\nOUTCOME: UPDATE fantasy_match_player SET is_playing_xi = TRUE for new selection, FALSE otherwise. Re-stamps playing_xi_announced_at."
              : "PUBLISH PLAYING XI\n\nWHAT: Open the per-match XI picker. Auto-pull from squad.js or tick 11 per team manually.\n\nWARNING: Once published, the XI is visible to all users on the team-card banner.\n\nOUTCOME: UPDATE fantasy_match_player.is_playing_xi for chosen 22 + the rest. Stamps playing_xi_announced_at."}
          >
            {xiAnnounced ? "Edit Playing XI" : "Publish Playing XI"}
          </Button>
          <Button
            as={Link}
            href={`/admin/fantasy/matches/${encodeURIComponent(matchId)}/contests`}
            variant="secondary"
            size="md"
            title="MANAGE CONTESTS\n\nWHAT: Navigate to the contests page for this match. Create, edit, or view entries per contest.\n\nWARNING: None — read-only nav. DB writes only happen inside contest actions.\n\nOUTCOME: No DB writes on this click."
          >
            Manage contests ({contests.length})
          </Button>
          <span className="ml-auto flex flex-wrap gap-2">
            {/* Reschedule — allowed on upcoming and live matches.
                For live matches the editor exposes a "Reset to upcoming"
                toggle so team creation can be reopened (demo use). */}
            <Button
              onClick={openScheduleEditor}
              variant="secondary"
              size="md"
              disabled={actionBusy === "schedule" || isAbandoned || match.status === "completed"}
              title={
                isAbandoned
                  ? "Match abandoned — schedule locked"
                  : match.status === "completed"
                    ? "Match completed — schedule is fixed"
                    : "EDIT SCHEDULE\n\nWHAT: Change scheduled_at and lock_at." + (isLive ? " For LIVE matches, enable 'Reset to upcoming' to reopen team creation (demo use)." : "") + "\n\nWARNING: Users mid-edit may lose access to the lineup form if the lock window shifts under them.\n\nOUTCOME: UPDATE fantasy_match.scheduled_at + lock_at. status-cron re-evaluates on its next pass."
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
                    : "FORCE LOCK\n\nWHAT: Manually flip status from 'upcoming' → 'live' and clamp lock_at to now.\n\nWARNING: Team creation closes immediately. Users mid-edit lose unsaved changes. Use only if status-cron didn't flip the match on time.\n\nOUTCOME: UPDATE fantasy_match SET status='live', lock_at=now(). Withdraw button hides on user-facing match card."
              }
            >
              {actionBusy === "lock" ? "Locking…" : "Force lock"}
            </Button>
            <Button
              onClick={handleRescore}
              variant="secondary"
              size="md"
              disabled={actionBusy === "rescore"}
              title="FORCE RESCORE\n\nWHAT: Re-run the scoring engine over the current player_match_stats for this match. Re-derives entry_player_points and entry.total_points.\n\nWARNING: Live leaderboard positions WILL shift if any input changed since last tick. Users may see rank jump without a visible event. Run between innings or post-match when possible.\n\nOUTCOME: UPSERT entry_player_points via computeBreakdown(stats). UPDATE entry.total_points sums. Publishes contest:* leaderboard:update WS message."
            >
              {actionBusy === "rescore" ? "Rescoring…" : "Force rescore"}
            </Button>
            <Button
              onClick={handleRebuildScoring}
              variant="secondary"
              size="md"
              disabled={actionBusy === "rebuild"}
              title="REBUILD SCORING — DESTRUCTIVE\n\nWHAT: Wipe player_event, player_match_stats, entry_player_points for this match, zero entry.total_points, drop Redis caches, then run ONE ingest tick to repopulate from the vendor feed.\n\nWARNING: The audit trail in player_event is permanently lost for this match. Use ONLY when player_event was written with wrong player_ids (e.g. pre-resolver corruption). For everyday recompute, use Force Rescore instead — it preserves the audit log.\n\nOUTCOME: DELETE 4 tables → flush Redis (widget:idmap, widget:snap, lb:contest:*) → runIngestTick → contests get leaderboard:update WS."
            >
              {actionBusy === "rebuild" ? "Rebuilding…" : "Rebuild scoring"}
            </Button>
            <Button
              onClick={openAbandon}
              variant="secondary"
              size="md"
              disabled={actionBusy === "abandon" || isAbandoned}
              title={isAbandoned
                ? "Already abandoned"
                : "ABANDON — DESTRUCTIVE\n\nWHAT: Mark match status='abandoned'. Scoring stops; ingest tick skips this match. Optionally void all entries (hides from public leaderboards, keeps DB rows).\n\nWARNING: Once abandoned, future ingest ticks ignore this match. Reversible only by editing fantasy_match.status directly (no admin button). Voiding entries also hide-but-keep — reversible by editing entry row.\n\nOUTCOME: UPDATE fantasy_match SET status='abandoned'. If voiding: UPDATE entry SET status='voided' WHERE contest.match_id=:id."}
            >
              {actionBusy === "abandon" ? "Abandoning…" : "Abandon"}
            </Button>
          </span>
        </div>
      </Card>

      {/* Abandon confirmation — replaces window.confirm so the "void entries"
          choice is an explicit second action, not buried in dialog text. */}
      {abandonOpen ? (
        <div className="mt-4">
          <Card title="Confirm abandon" padding="tight">
            <div className="flex flex-col gap-3 px-4 py-4">
              <p className="text-sm text-white/75">
                Mark <span className="font-semibold text-white">{teamA} vs {teamB}</span> as
                abandoned. The status flips to <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[11px]">abandoned</code> and
                scoring stops. Contests stay in place.
              </p>
              <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-red-400/25 bg-red-400/5 px-3 py-2.5 text-xs text-red-200">
                <input
                  type="checkbox"
                  checked={abandonVoid}
                  onChange={(e) => setAbandonVoid(e.target.checked)}
                  className="mt-0.5 accent-red-400"
                />
                <span>
                  <span className="font-semibold">Also void all entries</span> — every entry on every
                  contest in this match is marked voided. Voided entries are hidden from public
                  leaderboards but stay in the DB. Reversible by editing the row directly.
                </span>
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleAbandonConfirm}
                  size="md"
                  disabled={actionBusy === "abandon"}
                >
                  {actionBusy === "abandon"
                    ? "Abandoning…"
                    : abandonVoid ? "Abandon and void entries" : "Abandon match"}
                </Button>
                <Button
                  onClick={() => setAbandonOpen(false)}
                  variant="secondary"
                  size="md"
                  disabled={actionBusy === "abandon"}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      ) : null}

      {/* Ingest health — single-most-important card on this page during a
          live match. Live values refresh every 5s. */}
      <div className="mt-4">
        <IngestHealthCard
          ingest={ingest}
          editing={editingWidgetId}
          draft={widgetIdDraft}
          setDraft={setWidgetIdDraft}
          onEdit={() => {
            setWidgetIdDraft(ingest?.widgetMatchId ?? "");
            setEditingWidgetId(true);
          }}
          onCancelEdit={() => setEditingWidgetId(false)}
          onSave={handleSaveWidgetId}
          onForceTick={handleForceTick}
          busyKey={actionBusy}
        />
      </div>

      {/* Support — rarely-used, destructive-feeling levers we don't want
          buried in Actions. Right now: Clear cache (drops the live ingest
          resolver caches so a corrected vendor↔fantasy player mapping
          actually takes effect on the next tick — see the S4-M0 misattribution
          incident for the kind of bug this fixes). Add more support tools
          here (export entries, dump leaderboard, etc.) instead of growing
          the Actions row. */}
      <div className="mt-4">
        <Card title="Support" padding="tight">
          <div className="flex flex-col gap-3 px-4 py-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="max-w-xl text-xs leading-relaxed text-white/60">
                <span className="block text-sm font-semibold text-white">Clear Redis caches</span>
                Drops <code className="rounded bg-white/[0.06] px-1 py-0.5 text-[10px]">widget:idmap</code>,
                {" "}<code className="rounded bg-white/[0.06] px-1 py-0.5 text-[10px]">widget:snap</code>,
                {" "}leaderboard ZSETs, and API response caches for this match. Stats in Postgres are
                not touched. Use this after correcting a player or widget mapping mid-match —
                otherwise the next ingest tick will re-resolve from the 24h-cached entries and
                keep mis-attributing.
                <span className="mt-1 block text-[11px] text-white/45">
                  Typical recipe: fix the mapping in <code className="rounded bg-white/[0.06] px-1 py-0.5 text-[10px]">tournament_team_player</code> →
                  click <span className="font-semibold">Clear cache</span> → click <span className="font-semibold">Force tick</span>.
                </span>
              </div>
              <Button
                onClick={handleClearCache}
                variant="secondary"
                size="md"
                disabled={actionBusy === "clear_cache"}
                title="CLEAR REDIS CACHES\n\nWHAT: Drop widget:idmap, widget:snap, leaderboard ZSETs, and API response caches scoped to this match. Postgres state is untouched.\n\nWARNING: Next ingest tick treats the entire innings as new — re-emits every cumulative stat into the score_delta_log audit (noisier than usual, no incorrect scoring). Use after fixing a player or widget mapping mid-match so the resolver doesn't keep using the cached wrong mapping for 24h.\n\nOUTCOME: DEL widget:idmap:* widget:snap:* lb:contest:* match:* keys. Forces every downstream lookup to hit Postgres on the next read."
              >
                {actionBusy === "clear_cache" ? "Clearing…" : "Clear cache"}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Schedule editor — collapsed panel. Opens when admin clicks
          "Edit schedule" in the Actions row. Backend publishes a
          schedule:updated WS event on save so consumer frontends refresh
          without a page reload. */}
      {scheduleOpen ? (
        <ScheduleEditor
          form={scheduleForm}
          setForm={setScheduleForm}
          currentScheduledAtIso={match.scheduled_at}
          currentLockAtIso={match.lock_at}
          isLive={isLive}
          busy={actionBusy === "schedule"}
          onSave={handleScheduleSave}
          onCancel={() => setScheduleOpen(false)}
        />
      ) : null}

      {/* Live entries — flat list across every contest for this match with
          current points + within-contest rank. Refreshes on the 10s tick.
          Lets an operator answer "who's playing and what are they scoring"
          in one glance instead of expanding each contest. Voided entries
          sort to the bottom and carry a pill. */}
      <div className="mt-6">
        <Card title="Live entries" padding="tight">
          <div className="flex items-center justify-between gap-3 border-b border-white/5 px-4 py-3">
            <div className="text-xs text-white/60">
              {entriesLoading
                ? "Loading…"
                : `${entries.filter((e) => e.status === "active").length} active`}
              {!entriesLoading && entries.some((e) => e.status === "voided") ? (
                <span className="ml-2 text-red-300/80">
                  · {entries.filter((e) => e.status === "voided").length} voided
                </span>
              ) : null}
            </div>
            <input
              value={entryFilter}
              onChange={(e) => setEntryFilter(e.target.value)}
              placeholder="Filter by user, team, or contest…"
              className="w-64 max-w-[60%] rounded-md border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white outline-none placeholder:text-white/40 focus:border-white/30"
            />
          </div>
          {entriesLoading ? (
            <div className="px-4 py-8 text-center text-xs text-white/50">
              Loading entries…
            </div>
          ) : entries.length === 0 ? (
            <div className="px-4 py-8 text-center text-xs text-white/50">
              No entries yet for this match.
            </div>
          ) : (
            <div className="max-h-[480px] overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-[#0b1f4a]/95 text-[10px] uppercase tracking-wider text-white/50">
                  <tr>
                    <th className="px-4 py-2 text-left">Rank</th>
                    <th className="px-4 py-2 text-left">User</th>
                    <th className="px-4 py-2 text-left">Team</th>
                    <th className="px-4 py-2 text-left">Contest</th>
                    <th className="px-4 py-2 text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {entries
                    .filter((e) => {
                      const q = entryFilter.trim().toLowerCase();
                      if (!q) return true;
                      return (
                        (e.user_name || "").toLowerCase().includes(q) ||
                        (e.user_team_name || "").toLowerCase().includes(q) ||
                        (e.template_name || "").toLowerCase().includes(q) ||
                        (e.contest_name || "").toLowerCase().includes(q)
                      );
                    })
                    .map((e) => (
                      <tr
                        key={e.entry_id}
                        className={e.status === "voided" ? "opacity-55" : ""}
                      >
                        <td className="px-4 py-2 tabular-nums text-white/80">
                          {e.rank ?? "—"}
                        </td>
                        <td className="px-4 py-2 text-white">
                          {e.user_name || `User #${e.user_id}`}
                          {e.status === "voided" ? (
                            <span className="ml-2 rounded bg-red-400/15 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-red-200">
                              voided
                            </span>
                          ) : null}
                        </td>
                        <td className="px-4 py-2 text-white/75">
                          {e.template_name || e.user_team_name || "—"}
                        </td>
                        <td className="px-4 py-2 text-white/65">
                          {e.contest_name || `#${e.contest_id}`}
                          {e.contest_type && e.contest_type !== "public" ? (
                            <span className="ml-1 text-[10px] uppercase tracking-wider text-white/40">
                              · {e.contest_type}
                            </span>
                          ) : null}
                        </td>
                        <td className="px-4 py-2 text-right tabular-nums font-semibold text-white">
                          {Number(e.total_points ?? 0).toFixed(1)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Contest preview — entry counts (active / voided) + top-10 board per
          contest for admin QA. Voided entries are shown here (with a pill)
          even though they're hidden from the public board. */}
      {contests.length > 0 ? (
        <div className="mt-6">
          <Card title="Contests" padding="tight">
            <div className="divide-y divide-white/5">
              {contests.map((c) => {
                const expanded = expandedContestId === c.id;
                const preview = contestPreviews[c.id];
                const loading = previewLoading[c.id];
                return (
                  <div key={c.id} className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleContestPreview(c.id)}
                      className="flex w-full items-center justify-between gap-3 text-left"
                    >
                      <span className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-white">
                          {c.name || c.contest_name || `Contest #${c.id}`}
                        </span>
                        <span className="text-[11px] uppercase tracking-wider text-white/45">
                          {c.contest_type || "public"}
                          {c.entries_per_user ? ` · ${c.entries_per_user}/user` : ""}
                          {c.max_entries ? ` · cap ${c.max_entries}` : ""}
                        </span>
                      </span>
                      <span className="flex items-center gap-2">
                        {preview && !preview.error ? (
                          <span className="text-xs tabular-nums text-white/70">
                            {preview.entries.active}
                            {preview.entries.voided > 0 ? (
                              <span className="ml-1 text-red-300/80">
                                +{preview.entries.voided} voided
                              </span>
                            ) : null}
                            <span className="ml-1 text-white/40">entries</span>
                          </span>
                        ) : null}
                        <span className="text-[10px] uppercase tracking-wider text-white/40">
                          {expanded ? "Hide" : "Preview"}
                        </span>
                      </span>
                    </button>
                    {expanded ? (
                      <div className="mt-3 rounded-lg border border-white/5 bg-white/[0.02] p-3">
                        {loading ? (
                          <div className="text-xs text-white/55">Loading…</div>
                        ) : preview?.error ? (
                          <div className="text-xs text-red-300">Failed to load preview.</div>
                        ) : preview && preview.top.length === 0 ? (
                          <div className="text-xs text-white/55">No entries yet.</div>
                        ) : preview ? (
                          <table className="w-full text-xs">
                            <thead className="text-[10px] uppercase tracking-wider text-white/45">
                              <tr>
                                <th className="w-10 px-2 py-1 text-left">#</th>
                                <th className="px-2 py-1 text-left">Player</th>
                                <th className="px-2 py-1 text-left">Team</th>
                                <th className="px-2 py-1 text-right">Points</th>
                                <th className="w-16 px-2 py-1 text-right">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {preview.top.map((row) => (
                                <tr key={row.entryId} className="border-t border-white/5">
                                  <td className="px-2 py-1.5 tabular-nums text-amber-300">
                                    #{row.rank}
                                  </td>
                                  <td className="px-2 py-1.5 text-white">{row.name ?? "—"}</td>
                                  <td className="px-2 py-1.5 text-white/65">{row.teamName ?? ""}</td>
                                  <td className="px-2 py-1.5 text-right tabular-nums font-semibold text-white">
                                    {row.totalPoints}
                                  </td>
                                  <td className="px-2 py-1.5 text-right">
                                    {row.status === "voided" ? (
                                      <Pill tone="default">voided</Pill>
                                    ) : (
                                      <span className="text-emerald-300/80">·</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
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

// Ingest health card — the "is this match scoring?" panel. Renders the
// widget_match_id (with inline edit), last successful tick + staleness,
// player_event volume in the last 5 minutes, and a "force tick" button. The
// `ingest` shape comes verbatim from GET /v1/admin/matches/:id/ingest-status.
function IngestHealthCard({
  ingest,
  editing,
  draft,
  setDraft,
  onEdit,
  onCancelEdit,
  onSave,
  onForceTick,
  busyKey,
}) {
  if (!ingest) {
    return (
      <Card title="Ingest health" padding="tight">
        <div className="px-4 py-4 text-sm text-white/55">Loading ingest status…</div>
      </Card>
    );
  }

  const stale = !!ingest.stale;
  const widgetSet = !!ingest.widgetMatchId;
  const staleText = formatStaleness(ingest.stalenessSeconds);

  return (
    <Card
      title={
        <span className="flex items-center gap-2">
          <span>Ingest health</span>
          {ingest.shouldIngest ? (
            stale ? (
              <Pill tone="default">
                <span className="text-red-300">stale · {staleText}</span>
              </Pill>
            ) : (
              <Pill tone="emerald">live · {staleText}</Pill>
            )
          ) : (
            <Pill tone="default">outside ingest window</Pill>
          )}
        </span>
      }
      padding="tight"
    >
      <div className="grid gap-4 px-4 py-4 sm:grid-cols-2">
        {/* widget_match_id — editable */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/55">
            widget_match_id
          </span>
          {editing ? (
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="e.g. 1666"
                className="w-32 rounded-md border border-white/15 bg-white/[0.04] px-3 py-1.5 text-sm font-mono text-white outline-none focus:border-amber-400/60"
              />
              <Button
                onClick={onSave}
                size="sm"
                disabled={busyKey === "widget_id"}
              >
                {busyKey === "widget_id" ? "Saving…" : "Save"}
              </Button>
              <Button onClick={onCancelEdit} size="sm" variant="secondary">
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <span className={`font-mono text-sm ${widgetSet ? "text-white" : "text-red-300"}`}>
                {ingest.widgetMatchId || "— not set —"}
              </span>
              <Button onClick={onEdit} size="sm" variant="secondary">
                {widgetSet ? "Edit" : "Set"}
              </Button>
            </div>
          )}
          {!widgetSet ? (
            <span className="text-[11px] text-red-300/85">
              Worker can&apos;t ingest until this is set to the vendor MatchID.
            </span>
          ) : null}
        </div>

        {/* Activity counters */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/55">
            Events (last 5 min)
          </span>
          <span className="text-sm tabular-nums text-white">
            {ingest.eventsLast5m ?? 0}
          </span>
          <span className="text-[11px] text-white/45">
            Last event:{" "}
            {ingest.lastEventAt
              ? new Date(ingest.lastEventAt).toLocaleTimeString()
              : "never"}
          </span>
        </div>

        {/* Last tick */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/55">
            Last ingest tick
          </span>
          <span className={`text-sm tabular-nums ${stale ? "text-red-300" : "text-white"}`}>
            {ingest.ingestedAt
              ? `${staleText} (${new Date(ingest.ingestedAt).toLocaleTimeString()})`
              : "never"}
          </span>
        </div>

        {/* Should-ingest flag explanation */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/55">
            Auto-discovery window
          </span>
          <span className="text-sm text-white/75">
            {ingest.shouldIngest
              ? "Worker should be polling this match now."
              : ingest.status === "completed" || ingest.status === "abandoned"
                ? `Match ${ingest.status} — worker has dropped it.`
                : "Outside the live window (or widget_match_id unset)."}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-white/5 px-4 py-3">
        <Button
          onClick={onForceTick}
          size="md"
          disabled={busyKey === "force_tick" || !widgetSet}
          title={!widgetSet
            ? "Set widget_match_id first — the worker needs it to fetch the vendor feed"
            : "FORCE TICK\n\nWHAT: Trigger one ingest worker run NOW. Fetches Innings1.js + Innings2.js + squad.js from the vendor CDN, diffs against last snapshot, emits deltas, pushes statsSnapshot to the scoring worker queue.\n\nWARNING: Safe to race against the worker — dedup is on player_event.event_hash. But spamming this won't get scores in faster — bottleneck is usually the vendor feed publishing the update.\n\nOUTCOME: One pass through fetchLatestDeltas → scoring queue. Same path the worker takes on its 30s schedule, just on demand."}
        >
          {busyKey === "force_tick" ? "Ticking…" : "Force tick"}
        </Button>
        <span className="text-[11px] text-white/45">
          Safe to race against the worker — dedup is on player_event.event_hash.
        </span>
      </div>
    </Card>
  );
}

// "12s ago", "3m ago", "2h ago" — friendlier than raw seconds counters once
// staleness blows past a minute. Returns "—" for null.
function formatStaleness(seconds) {
  if (seconds == null) return "—";
  if (seconds < 60)  return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m ago`;
  return `${Math.round(seconds / 3600)}h ago`;
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
  isLive,
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
          {isLive ? (
            <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-amber-400/20 bg-amber-400/5 px-3 py-2.5 text-xs text-amber-200">
              <input
                type="checkbox"
                checked={form.resetStatus}
                onChange={(e) => setForm((f) => ({ ...f, resetStatus: e.target.checked }))}
                className="mt-0.5 accent-amber-400"
              />
              <span>
                <span className="font-semibold">Reset to upcoming</span> — reopens team creation and
                prevents the status-cron from auto-completing this match. Set both times to the future.
              </span>
            </label>
          ) : null}
          <p className="text-[11px] leading-relaxed text-white/45">
            Lock must be at or before scheduled start. Both fields use your local timezone; the
            backend stores UTC.
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
