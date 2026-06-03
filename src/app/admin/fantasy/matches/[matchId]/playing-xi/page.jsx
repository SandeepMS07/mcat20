"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import {
  getFantasyMatch,
  previewPlayingXiFromWidget,
  publishRoster,
  pullPlayingXiFromWidget,
  unpublishPlayingXi,
} from "@/app/api/admin/fantasy";
import {
  Button,
  Card,
  EmptyState,
  MatchStatusBadge,
  PageHeader,
  Pill,
} from "@/components/admin/ui";

const ROLE_ORDER = ["WK", "BAT", "AR", "BOWL"];
const ROLE_LABEL = {
  WK: "Wicketkeeper",
  BAT: "Batter",
  AR: "All-rounder",
  BOWL: "Bowler",
};

// A real cricket announcement is 11 from EACH side — admin picks 22 total,
// split exactly 11/11 across the two teams. The picker caps selections at
// 11 per team (not 11 overall) and refuses to publish until both teams hit 11.
const PER_TEAM = 11;
const TOTAL_PICKS = PER_TEAM * 2;

// BRD v4.3 MCA Impact Player rule: each side's team-sheet also lists up to 5
// reserves, any one of which can be substituted in as the IP during the match.
// Admin enters these alongside the 11 starters; backend stamps
// is_reserve_player=TRUE on each. Reserves are optional (0..5) — some sheets
// have fewer.
const RESERVES_PER_TEAM_MAX = 5;

export default function FantasyPlayingXiPage() {
  const { matchId } = useParams(); // fantasy_match.id (text)

  const [match, setMatch] = useState(null);
  const [players, setPlayers] = useState([]);
  // `selected` holds the 11 STARTERS per side. `reserves` is a separate
  // disjoint set holding up to 5 reserves per side. The two are mutex by
  // construction (togglePick / toggleReserve both remove from the other).
  const [selected, setSelected] = useState(new Set());
  const [reserves, setReserves] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pulling, setPulling] = useState(false);
  const [unpublishing, setUnpublishing] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [widgetNotice, setWidgetNotice] = useState(null);
  // Suggested-XI rows returned by the preview endpoint. Pure read-only display
  // — the admin uses these as a reference and manually ticks players in the
  // picker below. Each row carries the matched_player_id when our DB has a
  // counterpart for the vendor's name (so we can highlight the corresponding
  // checkbox row), and null when it doesn't (those are surfaced separately).
  const [suggestedXi, setSuggestedXi] = useState(null);
  const [suggestedUnmatched, setSuggestedUnmatched] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const fm = await getFantasyMatch(matchId);
        if (cancelled) return;
        setMatch(fm.match);
        setPlayers(fm.players ?? []);
        // Pre-select the currently-announced 11 (if any) so re-publishing
        // doesn't force the admin to re-tick everyone.
        // is_playing_xi=TRUE && !is_reserve_player → starter
        // is_reserve_player=TRUE → reserve (regardless of is_playing_xi, which
        // flips to TRUE after activation — we still want it visually
        // tracked as a reserve in the picker).
        const starters = (fm.players ?? [])
          .filter((p) => p.is_playing_xi === true && !p.is_reserve_player)
          .map((p) => p.player_id);
        const reserveIds = (fm.players ?? [])
          .filter((p) => p.is_reserve_player === true)
          .map((p) => p.player_id);
        setSelected(new Set(starters));
        setReserves(new Set(reserveIds));
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

  const byTeam = useMemo(() => {
    const out = new Map();
    for (const p of players) {
      const key = String(p.team_id ?? "unknown");
      if (!out.has(key)) out.set(key, []);
      out.get(key).push(p);
    }
    for (const arr of out.values()) {
      arr.sort((a, b) => {
        const ra = ROLE_ORDER.indexOf(a.role);
        const rb = ROLE_ORDER.indexOf(b.role);
        if (ra !== rb) return ra - rb;
        return (a.player_name || "").localeCompare(b.player_name || "");
      });
    }
    return out;
  }, [players]);

  // Map of team_id → count of currently-selected players on that team.
  // Drives both the per-team cap in togglePick and the per-team progress UI.
  const selectedByTeam = useMemo(() => {
    const counts = new Map();
    for (const p of players) {
      if (selected.has(p.player_id)) {
        const k = String(p.team_id ?? "unknown");
        counts.set(k, (counts.get(k) ?? 0) + 1);
      }
    }
    return counts;
  }, [selected, players]);

  // Same shape, but for reserves. Per-team cap is RESERVES_PER_TEAM_MAX.
  const reservesByTeam = useMemo(() => {
    const counts = new Map();
    for (const p of players) {
      if (reserves.has(p.player_id)) {
        const k = String(p.team_id ?? "unknown");
        counts.set(k, (counts.get(k) ?? 0) + 1);
      }
    }
    return counts;
  }, [reserves, players]);

  // Index player_id → team_id so togglePick can apply the per-team cap
  // without a linear scan of `players` on every click.
  const teamByPlayer = useMemo(() => {
    const m = new Map();
    for (const p of players) m.set(p.player_id, String(p.team_id ?? "unknown"));
    return m;
  }, [players]);

  const teamIds = useMemo(() => [...new Set(players.map((p) => String(p.team_id ?? "unknown")))], [players]);

  const canSubmit =
    teamIds.length >= 2 &&
    teamIds.every((tid) => (selectedByTeam.get(tid) ?? 0) === PER_TEAM) &&
    !submitting;

  const togglePick = (playerId) => {
    // Mutex with reserves — if this player was marked RP, picking them as
    // XI unmarks the RP slot.
    setReserves((prev) => {
      if (!prev.has(playerId)) return prev;
      const next = new Set(prev);
      next.delete(playerId);
      return next;
    });
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(playerId)) {
        next.delete(playerId);
        return next;
      }
      // Enforce the per-team cap, not a total cap. The other team is allowed
      // to keep accepting picks even if this team is full.
      const tid = teamByPlayer.get(playerId);
      let countOnTeam = 0;
      for (const id of next) {
        if (teamByPlayer.get(id) === tid) countOnTeam += 1;
      }
      if (countOnTeam >= PER_TEAM) return prev;
      next.add(playerId);
      return next;
    });
  };

  // ── Search-as-you-type + keyboard shortcuts ────────────────────────────
  // Single search box up top filters players across BOTH team cards. As the
  // admin types, the first matching row in either card becomes the
  // "focused" row (highlighted). Press X → mark focused as XI; R → mark as
  // RP; Esc → clear search. This is dramatically faster than clicking
  // because the admin can hold the team-sheet and type 2-3 letters per name
  // without moving their cursor between rows. Confirmed by Sandeep on
  // 2026-06-03 as the fastest workflow during post-toss publish.
  const [search, setSearch] = useState("");
  const [focusIdx, setFocusIdx] = useState(0);
  const searchRef = useRef(null);
  // Tracks whether the user has pressed ↓/↑ since the last search change.
  // X/R shortcuts only fire when this is true (explicit navigation) OR when
  // there's exactly 1 match (unambiguous). Otherwise the keypress falls
  // through to the input so letters like "r" just extend the search string.
  const arrowUsedRef = useRef(false);

  const matchedPlayers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return players.filter((p) => (p.player_name || "").toLowerCase().includes(q));
  }, [players, search]);

  const focusedPlayer = matchedPlayers[focusIdx] ?? null;

  useEffect(() => {
    // Reset focus and explicit-navigation flag whenever the query changes
    setFocusIdx(0);
    arrowUsedRef.current = false;
  }, [search]);

  // Toggle a player as a reserve (RP). Mutex with starters — clicking RP on
  // a player who is currently a starter moves them to RP, freeing a starter
  // slot. Capped at RESERVES_PER_TEAM_MAX per team.
  const toggleReserve = (playerId) => {
    setSelected((prev) => {
      if (!prev.has(playerId)) return prev;
      const next = new Set(prev);
      next.delete(playerId);
      return next;
    });
    setReserves((prev) => {
      const next = new Set(prev);
      if (next.has(playerId)) {
        next.delete(playerId);
        return next;
      }
      const tid = teamByPlayer.get(playerId);
      let countOnTeam = 0;
      for (const id of next) {
        if (teamByPlayer.get(id) === tid) countOnTeam += 1;
      }
      if (countOnTeam >= RESERVES_PER_TEAM_MAX) return prev;
      next.add(playerId);
      return next;
    });
  };

  // Search-box keyboard handler. Only fires when the input is focused —
  // shortcut keys X / R never collide with the rest of the page (admin can
  // still type X or R into other inputs without triggering a pick).
  const handleSearchKey = useCallback(
    (e) => {
      if (e.key === "Escape") {
        setSearch("");
        return;
      }
      if (e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey)) {
        e.preventDefault();
        if (matchedPlayers.length > 0) {
          arrowUsedRef.current = true;
          setFocusIdx((i) => (i + 1) % matchedPlayers.length);
        }
        return;
      }
      if (e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey)) {
        e.preventDefault();
        if (matchedPlayers.length > 0) {
          arrowUsedRef.current = true;
          setFocusIdx((i) => (i - 1 + matchedPlayers.length) % matchedPlayers.length);
        }
        return;
      }
      // X/R shortcuts only fire when:
      //  (a) exactly 1 match — unambiguous, user is done typing, OR
      //  (b) user pressed ↓/↑ to explicitly land on a specific row.
      // In all other cases let the keypress fall through to the input so
      // letters like "r" just extend the search string normally.
      if (!focusedPlayer) return;
      const unambiguous = matchedPlayers.length === 1;
      if (!unambiguous && !arrowUsedRef.current) return;
      if (e.key === "?") {
        e.preventDefault();
        togglePick(focusedPlayer.player_id);
        setSearch("");
      } else if (e.key === ".") {
        e.preventDefault();
        toggleReserve(focusedPlayer.player_id);
        setSearch("");
      }
    },
    // togglePick / toggleReserve are recreated each render but capture
    // current `selected` / `reserves` via the setState updater pattern,
    // so they're safe to omit from deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [matchedPlayers, focusedPlayer],
  );

  const handlePublish = async () => {
    if (!canSubmit || !match) return;
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    setWidgetNotice(null);
    try {
      // Always go through the new roster endpoint — it handles the 0-reserve
      // case identically to the legacy PATCH /playing-xi (just writes the 22
      // starters and an empty reserves list). Stamps roster_locked_at, which
      // makes squad.js ingest stop overriding the admin's choice.
      const sideOf = (tid) => ({
        starters: players.filter((p) => selected.has(p.player_id) && String(p.team_id) === tid).map((p) => p.player_id),
        reserves: players.filter((p) => reserves.has(p.player_id) && String(p.team_id) === tid).map((p) => p.player_id),
      });
      const [teamAId, teamBId] = [String(match.team_a_id), String(match.team_b_id)];
      const body = { teamA: sideOf(teamAId), teamB: sideOf(teamBId) };
      const res = await publishRoster(match.id, body);
      setSuccess({
        announcedAt: res.playingXiAnnouncedAt,
        rosterLockedAt: res.rosterLockedAt,
        source: "manual",
      });
      const fm = await getFantasyMatch(match.id);
      setMatch(fm.match);
      setPlayers(fm.players ?? []);
    } catch (e) {
      const code = e?.response?.data?.error;
      setError(prettifyError(code) ?? e?.message ?? "publish_failed");
    } finally {
      setSubmitting(false);
    }
  };

  // Unpublish — clears announced_at + resets is_playing_xi on every squad row.
  // Confirms before firing because users with entries WILL see their card
  // flip from "XI announced ✓" back to "XI not yet announced" within the
  // next 30s polling tick.
  const handleUnpublish = async () => {
    if (!match || unpublishing) return;
    const ok = window.confirm(
      "Unpublish the announced Playing XI? Every squad row's in-XI flag is reset to undecided and the announcement timestamp is cleared. Users will be told to wait for the next XI announcement. You can re-publish at any time.",
    );
    if (!ok) return;
    setUnpublishing(true);
    setError(null);
    setSuccess(null);
    setWidgetNotice(null);
    try {
      const res = await unpublishPlayingXi(match.id);
      if (res.cleared === false) {
        setError("No XI is currently published — nothing to clear.");
      } else {
        setSuccess({ unpublished: true, lateChange: res.lateChange });
        const fm = await getFantasyMatch(match.id);
        setMatch(fm.match);
        setPlayers(fm.players ?? []);
        setSelected(new Set());
      }
    } catch (e) {
      const code = e?.response?.data?.error;
      setError(prettifyError(code) ?? e?.message ?? "unpublish_failed");
    } finally {
      setUnpublishing(false);
    }
  };

  // Pull-from-widget PREVIEW. Read-only: fetches the vendor's squad.js, runs
  // name → fmp.player_id resolution server-side, returns the 22 suggested
  // players grouped by team WITHOUT touching the DB. UI renders them as a
  // reference card; admin still ticks the picker below manually.
  const handlePullPlayingXi = async () => {
    if (!match || previewing) return;
    setPreviewing(true);
    setError(null);
    setSuccess(null);
    setWidgetNotice(null);
    setSuggestedXi(null);
    setSuggestedUnmatched([]);
    try {
      const res = await previewPlayingXiFromWidget(match.id);
      if (!Array.isArray(res?.suggested) || res.suggested.length === 0) {
        setWidgetNotice(
          res?.message ??
            "Widget feed has no Playing XI yet (typically populates ~30 min after toss).",
        );
      } else {
        setSuggestedXi(res.suggested);
        setSuggestedUnmatched(Array.isArray(res.unmatched) ? res.unmatched : []);
      }
    } catch (e) {
      const code = e?.response?.data?.error;
      const hint = e?.response?.data?.hint;
      setError(prettifyWidgetError(code, [], hint) ?? e?.message ?? "preview_failed");
    } finally {
      setPreviewing(false);
    }
  };

  // LEGACY pull-from-widget path. Kept available behind a disabled button so
  // operators are nudged toward the preview-then-pick flow above instead of
  // the auto-publish flow this triggers. Wired in case we ever re-enable it.
  const handlePullFromWidget = async () => {
    if (!match || pulling) return;
    setPulling(true);
    setError(null);
    setSuccess(null);
    setWidgetNotice(null);
    try {
      const res = await pullPlayingXiFromWidget(match.id);
      if (res.xi == null) {
        setWidgetNotice(
          res.message ??
            "Widget feed has no Playing XI yet (typically populates ~30 min after toss).",
        );
      } else {
        setSuccess({
          announcedAt: res.announcedAt,
          source: "widget",
        });
        // Refresh local state so the squad cards flip to In XI / Benched.
        const fm = await getFantasyMatch(match.id);
        setMatch(fm.match);
        setPlayers(fm.players ?? []);
        setSelected(new Set(res.xi));
      }
    } catch (e) {
      const code = e?.response?.data?.error;
      const hint = e?.response?.data?.hint;
      const missing = e?.response?.data?.missing;
      const friendly = prettifyWidgetError(code, missing, hint);
      setError(friendly ?? e?.message ?? "pull_failed");
    } finally {
      setPulling(false);
    }
  };

  const teamA = match?.team_a_name || match?.team_a_short || "TBA";
  const teamB = match?.team_b_name || match?.team_b_short || "TBA";

  if (loading) {
    return (
      <>
        <PageHeader
          compact
          eyebrow="Playing XI"
          title="Loading…"
          actions={
            <Button as={Link} href={`/admin/fantasy/matches/${encodeURIComponent(matchId)}`} variant="secondary" size="md">
              ← Back to match
            </Button>
          }
        />
        <div className="h-32 animate-pulse rounded-2xl border border-white/10 bg-white/[0.02]" />
      </>
    );
  }

  if (!match) {
    return (
      <>
        <PageHeader compact eyebrow="Playing XI" title="Match not found" />
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
        compact
        eyebrow={`Playing XI · ${match.series_name || "Match"}`}
        title={`${teamA} vs ${teamB}`}
        subtitle={
          <span className="flex flex-wrap items-center gap-2">
            <MatchStatusBadge status={match.status} />
            {match.scheduled_at ? (
              <span className="text-white/55">
                {new Date(match.scheduled_at).toLocaleString()}
              </span>
            ) : null}
            {match.playing_xi_announced_at ? (
              <Pill tone="emerald">
                XI announced {new Date(match.playing_xi_announced_at).toLocaleString()}
              </Pill>
            ) : (
              <Pill tone="default">XI not yet announced</Pill>
            )}
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
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="mb-4 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
          {success.unpublished ? (
            <>Playing XI unpublished. Every player is back to undecided — pick again or pull from the widget when ready.</>
          ) : (
            <>
              Playing XI published at {new Date(success.announcedAt).toLocaleString()}
              {success.source === "widget" ? (
                <span className="ml-2 text-emerald-100">· source: widget feed ⚡</span>
              ) : null}
            </>
          )}
          {success.lateChange ? (
            <span className="ml-2 text-amber-300">
              ⚠ This was after lock_at — scoring may need a re-tick.
            </span>
          ) : null}
        </div>
      ) : null}

      {widgetNotice ? (
        <div className="mb-4 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
          {widgetNotice}
        </div>
      ) : null}

      {/* Widget assist — collapsed by default so the team-picker stays
          above the fold on standard 1080p admin laptops. The instructional
          text is verbose and not needed for every publish. Click the
          summary to expand the buttons. */}
      <details className="group rounded-xl border border-white/10 bg-white/[0.02]">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-2.5 text-sm text-white/75 [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-2">
            <svg className="h-3 w-3 transition group-open:rotate-90" fill="none" viewBox="0 0 12 12">
              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M4 3l4 3-4 3" />
            </svg>
            <span className="font-semibold uppercase tracking-wider text-[12px] text-white/85">Widget assist</span>
            <span className="text-[11px] text-white/45">— pull suggested XI from squad.js</span>
          </span>
        </summary>
        <div className="flex flex-col gap-3 border-t border-white/10 px-4 py-4">
          <div className="text-sm text-white/75">
            The widget feed publishes the announced XI about 30 min after toss.
            Use <strong className="text-white">Pull Playing XI</strong> to see
            the suggested 22 names team-wise, then tick them in the picker
            below and publish. Auto-pull is disabled because the vendor's feed
            sends only names — final selection stays operator-driven and
            ID-based.
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Legacy auto-pull — visible but non-clickable per BRD update.
                Preserves muscle memory while routing operators through the
                preview + manual-pick flow on the right. */}
            <Button
              onClick={handlePullFromWidget}
              disabled
              size="md"
              variant="secondary"
              title="PULL FROM WIDGET — DISABLED\n\nWHAT: Reads squad.js, takes 11 names per team, matches against fantasy_match_player by normalized name, flips is_playing_xi=TRUE.\n\nWARNING: ALL-OR-NOTHING — if even one name in squad.js has no fmp row (name drift, missing seed, wrong widget_match_id), the entire pull fails with a 409 squad_mismatch and zero rows update.\n\nDISABLED BY DESIGN: Use 'Pull Playing XI' to preview first, then commit via 'Publish XI'. Routes operators through a safer manual-confirm flow."
            >
              Pull from widget
            </Button>
            <Button
              onClick={handlePullPlayingXi}
              disabled={previewing || submitting || pulling || unpublishing}
              size="md"
              title="PULL PLAYING XI (PREVIEW)\n\nWHAT: Read squad.js for this match's widget_match_id, take 11 names per team, match against fantasy_match_player. PREVIEW only — does not update fmp.\n\nWARNING: None — read-only. If names don't match, the preview shows the missing ones so you can fix them before clicking Publish XI.\n\nOUTCOME: Returns 22 matched names + list of any missing names. No DB writes."
            >
              {previewing ? "Loading…" : "Pull Playing XI"}
            </Button>
          </div>
        </div>
      </details>

      {suggestedXi ? (
        <div className="mt-4">
          <SuggestedXi
            suggested={suggestedXi}
            unmatched={suggestedUnmatched}
            onDismiss={() => {
              setSuggestedXi(null);
              setSuggestedUnmatched([]);
            }}
          />
        </div>
      ) : null}

      <div className="mt-3 rounded-lg border border-white/10 bg-[#0A1438]/85 px-3 py-1.5 shadow-[0_18px_44px_-26px_rgba(0,0,0,0.75)] backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-white/75">
              <span>
                Total{" "}
                <span className="font-extrabold text-white">
                  {selected.size}
                </span>{" "}
                / {TOTAL_PICKS}
              </span>
              {teamIds.map((tid) => {
                const xi = selectedByTeam.get(tid) ?? 0;
                const rp = reservesByTeam.get(tid) ?? 0;
                const label = teamLabelForId(tid, match);
                const xiOk = xi === PER_TEAM;
                return (
                  <span key={tid} className="flex items-center gap-2">
                    <span className={xiOk ? "text-emerald-300" : "text-white/75"}>
                      {label}:{" "}
                      <span className="font-extrabold text-white">{xi}</span>
                      {" / "}{PER_TEAM}{" XI"}
                    </span>
                    <span className="text-white/55">·</span>
                    <span className={rp > 0 ? "text-amber-300" : "text-white/55"}>
                      <span className="font-extrabold text-white">{rp}</span>
                      {" / "}{RESERVES_PER_TEAM_MAX}{" RP"}
                    </span>
                  </span>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                onClick={() => { setSelected(new Set()); setReserves(new Set()); }}
                disabled={(selected.size === 0 && reserves.size === 0) || submitting}
                variant="secondary"
                size="sm"
              >
                Clear all
              </Button>
              {match.playing_xi_announced_at ? (
                <button
                  type="button"
                  onClick={handleUnpublish}
                  disabled={unpublishing || submitting || pulling}
                  title="UNPUBLISH XI — DESTRUCTIVE\n\nWHAT: Clear the announced XI. Resets every player's is_playing_xi to NULL.\n\nWARNING: Banner on user-facing match cards disappears immediately. Players who were marked benched return to 'undecided' — scoring resolver treats NULL as eligible. Use only if the announced XI was wrong; otherwise prefer Re-publish XI with corrections.\n\nOUTCOME: UPDATE fantasy_match_player SET is_playing_xi=NULL WHERE match_id=:id. Clears playing_xi_announced_at."
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-rose-300/40 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-rose-200 hover:border-rose-300 hover:bg-rose-400/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {unpublishing ? "Unpublishing…" : "Unpublish XI"}
                </button>
              ) : null}
              <Button
                onClick={handlePublish}
                disabled={!canSubmit || pulling || unpublishing}
                size="md"
                title={match.playing_xi_announced_at
                  ? "RE-PUBLISH ROSTER\n\nWHAT: Overwrite the previously published roster with the current selection (11 starters + up to 5 reserves per team).\n\nWARNING: Users who picked players newly benched will start scoring 0 from this point on. Past points are NOT reverted. An already-activated Impact Player is preserved (won't be re-benched). Stamps roster_locked_at — squad.js ingest will stop overriding your selection.\n\nOUTCOME: UPDATE fmp.is_playing_xi for the 22 starters TRUE, the up-to-10 reserves FALSE, all others FALSE. SET is_reserve_player=TRUE for the reserves. Stamps playing_xi_announced_at + roster_locked_at."
                  : "PUBLISH ROSTER\n\nWHAT: Commit the manual XI selection (11 starters + up to 5 reserves per team — reserves optional).\n\nWARNING: Once published, the XI is visible to all users. Reserves earn 0 points UNTIL substituted in mid-match as the Impact Player (then they earn full scoring + 4 bonus). Stamps roster_locked_at — squad.js ingest will stop overriding.\n\nOUTCOME: UPDATE fmp.is_playing_xi=TRUE for the 22 starters, FALSE for reserves and everyone else. SET is_reserve_player=TRUE for the reserves. Stamps playing_xi_announced_at + roster_locked_at."}
              >
                {submitting
                  ? "Publishing…"
                  : match.playing_xi_announced_at
                    ? `Re-publish XI${reserves.size > 0 ? ` + ${reserves.size} RP` : ""}`
                    : `Publish XI${reserves.size > 0 ? ` + ${reserves.size} RP` : ""}`}
              </Button>
            </div>
          </div>
      </div>

      {/* Search-as-you-type bar — the fastest workflow for admin during the
          post-toss publish window. Type 2-3 letters of any player's name,
          press X to mark as starter or R to mark as reserve, then keep
          typing the next name. Esc clears. Click pills below still work
          as a fallback if anyone prefers point-and-click. */}
      <div className="mt-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/65">
              Quick pick — type a name
            </label>
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKey}
              placeholder="e.g. bat, fat, mahi, ..."
              autoFocus
              className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-[#F68323] focus:outline-none focus:ring-2 focus:ring-[#F68323]/30"
            />
          </div>
          <div className="mt-5 flex flex-col gap-0.5 text-[11px] leading-snug text-white/55">
            <div>
              <kbd className="rounded border border-emerald-400/40 bg-emerald-400/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-200">?</kbd>{" "}
              starter &nbsp;
              <kbd className="rounded border border-amber-400/40 bg-amber-400/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-200">.</kbd>{" "}
              reserve &nbsp;
              <kbd className="rounded border border-white/20 bg-white/5 px-1.5 py-0.5 text-[10px] font-mono tracking-wider text-white/55">↓ / ↑</kbd>{" "}
              cycle &nbsp;·&nbsp;{" "}
              <kbd className="rounded border border-white/20 bg-white/5 px-1.5 py-0.5 text-[10px] font-mono tracking-wider text-white/55">Esc</kbd>{" "}
              clear
            </div>
          </div>
        </div>
        {search ? (
          <div className="mt-3 border-t border-white/10 pt-2 text-[12.5px]">
            {matchedPlayers.length === 0 ? (
              <span className="text-rose-300">No players match &ldquo;{search}&rdquo;</span>
            ) : (
              <span className="text-white/70">
                {matchedPlayers.length === 1 ? "1 match" : `${matchedPlayers.length} matches`} ·{" "}
                <span className="font-semibold text-white">
                  {focusedPlayer?.player_name}
                </span>{" "}
                {focusedPlayer ? (
                  <>
                    <span className="text-white/45">
                      ({teamLabelForId(String(focusedPlayer.team_id), match)})
                    </span>{" "}
                    — press <kbd className="rounded border border-emerald-400/40 bg-emerald-400/10 px-1 text-[10px] font-bold text-emerald-200">?</kbd> or <kbd className="rounded border border-amber-400/40 bg-amber-400/10 px-1 text-[10px] font-bold text-amber-200">.</kbd>
                  </>
                ) : null}
              </span>
            )}
          </div>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {[...byTeam.entries()].map(([teamId, list]) => {
          const xiCount = selectedByTeam.get(teamId) ?? 0;
          const rpCount = reservesByTeam.get(teamId) ?? 0;
          return (
            <TeamSquad
              key={teamId}
              teamId={teamId}
              players={list}
              selected={selected}
              reserves={reserves}
              focusedPlayerId={focusedPlayer?.player_id ?? null}
              searchQuery={search}
              onTogglePick={togglePick}
              onToggleReserve={toggleReserve}
              disabled={submitting}
              xiAtCap={xiCount >= PER_TEAM}
              rpAtCap={rpCount >= RESERVES_PER_TEAM_MAX}
              perTeam={PER_TEAM}
              maxReserves={RESERVES_PER_TEAM_MAX}
              teamLabelFor={(p) => squadLabel(p, match)}
            />
          );
        })}
      </div>
    </>
  );
}

function TeamSquad({
  teamId, players, selected, reserves,
  focusedPlayerId, searchQuery,
  onTogglePick, onToggleReserve,
  disabled, xiAtCap, rpAtCap, perTeam, maxReserves, teamLabelFor,
}) {
  // When the search-by-name input above is non-empty, the focused row in
  // EITHER team card needs to scroll into view so the admin doesn't have
  // to hunt for it. We ref each row, find the focused one, and scrollIntoView.
  const rowRefs = useRef(new Map());
  useEffect(() => {
    if (!focusedPlayerId) return;
    const el = rowRefs.current.get(focusedPlayerId);
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [focusedPlayerId]);
  const teamName = useMemo(() => {
    const sample = players[0];
    if (!sample) return `Team ${teamId}`;
    return teamLabelFor(sample) || `Team ${teamId}`;
  }, [players, teamId, teamLabelFor]);
  const inXi = players.filter((p) => selected.has(p.player_id)).length;
  const inRp = players.filter((p) => reserves.has(p.player_id)).length;

  // Pure alpha sort, case-insensitive. Role labels stay inline on each row
  // (next to the Icon/U-19/In XI pills) so the admin can still see what each
  // player is without role groupings breaking up the alphabetical flow.
  //
  // When the search box has a query, we filter this team's list down to ONLY
  // matching rows — non-matches disappear instead of being shown dimmed.
  // The matches naturally appear at the top of the card with no scrolling
  // required. Empty search → full alpha list returns.
  const sorted = useMemo(() => {
    const alphaSorted = [...players].sort((a, b) =>
      (a.player_name || "").localeCompare(b.player_name || "", undefined, {
        sensitivity: "base",
      }),
    );
    if (!searchQuery) return alphaSorted;
    const q = searchQuery.toLowerCase();
    return alphaSorted.filter((p) =>
      (p.player_name || "").toLowerCase().includes(q),
    );
  }, [players, searchQuery]);

  return (
    <Card
      title={
        <span className="flex items-center gap-2">
          <span>{teamName}</span>
          <Pill tone={inXi === perTeam ? "emerald" : "default"}>
            {inXi} / {perTeam} in XI
          </Pill>
          <Pill tone={inRp > 0 ? "gold" : "default"}>
            {inRp} / {maxReserves} RP
          </Pill>
        </span>
      }
      padding="tight"
    >
      {/* Internal scroll on the list — keeps the page non-scrolling even
          when each side has 20+ players. max-h-[55vh] keeps both team
          cards comfortably within a 1080p viewport with the search bar +
          counter visible above. */}
      {searchQuery && sorted.length === 0 ? (
        <div className="px-4 py-6 text-center text-[12.5px] text-white/45">
          No <span className="font-semibold text-white/70">{teamName}</span> player matches &ldquo;{searchQuery}&rdquo;
        </div>
      ) : null}
      <ul className="max-h-[55vh] divide-y divide-white/5 overflow-y-auto">
        {sorted.map((p) => {
          const isXi = selected.has(p.player_id);
          const isRp = reserves.has(p.player_id);
          // Per-bucket cap: a row's XI button greys out once this team has
          // 11 in XI, RP button greys out at 5. Already-marked rows stay
          // clickable so the admin can un-mark them.
          const xiBlocked = disabled || (!isXi && xiAtCap);
          const rpBlocked = disabled || (!isRp && rpAtCap);
          // Row-level visual cue when picked — colored left border + faint
          // background tint, like Excel "this row is selected." Makes it
          // instantly obvious which players the admin has already chosen
          // even when scanning a long alphabetical list.
          const rowAccent = isXi
            ? "border-l-2 border-l-emerald-400/70 bg-emerald-400/[0.04]"
            : isRp
              ? "border-l-2 border-l-amber-400/70 bg-amber-400/[0.04]"
              : "border-l-2 border-l-transparent";
          // Search highlight: only matching rows are rendered (see filter
          // in `sorted` above), so we just ring the focused one in blue.
          const isFocused = focusedPlayerId === p.player_id;
          const searchClass = searchQuery && isFocused
            ? "ring-2 ring-sky-400 ring-offset-2 ring-offset-[#070a14] rounded-md"
            : "";
          return (
            <li
              key={p.player_id}
              ref={(el) => {
                if (el) rowRefs.current.set(p.player_id, el);
                else rowRefs.current.delete(p.player_id);
              }}
              className={`px-2 py-1 ${rowAccent} ${searchClass}`}
            >
              <div className="flex items-center gap-2">
                {/* XI / RP toggle pair. Two labeled buttons, fixed min-width
                    so the row layout doesn't shift when the label changes
                    from "Add" to "In" / "As" on select. Mutex by handler
                    — clicking XI auto-removes RP and vice-versa. */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => !xiBlocked && onTogglePick(p.player_id)}
                    disabled={xiBlocked}
                    title={xiBlocked && !isXi ? `Team is full (${perTeam} XI). Remove a starter first.` : "Mark as Starter (Playing XI)"}
                    className={`cursor-pointer min-w-[60px] inline-flex items-center justify-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border transition select-none ${
                      isXi
                        ? "border-emerald-400 bg-emerald-500 text-white shadow-[0_2px_8px_rgba(16,185,129,0.35)]"
                        : "border-white/20 bg-white/[0.03] text-white/80 hover:border-emerald-400 hover:bg-emerald-400/15 hover:text-emerald-100"
                    } disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-white/20 disabled:hover:bg-white/[0.03] disabled:hover:text-white/80`}
                  >
                    <span aria-hidden="true" className="text-[10px] leading-none">
                      {isXi ? "✓" : "+"}
                    </span>
                    {isXi ? "In XI" : "Add XI"}
                  </button>
                  <button
                    type="button"
                    onClick={() => !rpBlocked && onToggleReserve(p.player_id)}
                    disabled={rpBlocked}
                    title={rpBlocked && !isRp ? `${maxReserves} reserves already named. Remove a reserve first.` : "Mark as Reserve (eligible Impact Player)"}
                    className={`cursor-pointer min-w-[60px] inline-flex items-center justify-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border transition select-none ${
                      isRp
                        ? "border-amber-400 bg-amber-500 text-white shadow-[0_2px_8px_rgba(245,158,11,0.35)]"
                        : "border-white/20 bg-white/[0.03] text-white/80 hover:border-amber-400 hover:bg-amber-400/15 hover:text-amber-100"
                    } disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-white/20 disabled:hover:bg-white/[0.03] disabled:hover:text-white/80`}
                  >
                    <span aria-hidden="true" className="text-[10px] leading-none">
                      {isRp ? "✓" : "+"}
                    </span>
                    {isRp ? "As RP" : "Add RP"}
                  </button>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="block truncate text-xs font-semibold text-white">
                    {p.player_name || p.player_id}
                  </div>
                  <div className="flex flex-wrap items-center gap-1 text-[10px] text-white/55">
                    <span>{ROLE_LABEL[p.role] || p.role}</span>
                    {p.is_icon ? <Pill tone="gold">Icon</Pill> : null}
                    {/* Underlying column is still is_emerging until the
                        0019_u19_flag migration lands; UI surfaces it as U-19
                        per the renamed BRD multiplier. */}
                    {p.is_u19 || p.is_emerging ? <Pill tone="violet">U-19</Pill> : null}
                    {/* Live impact-player state from fmp. impact_activated_at
                        is set by widget.ts once the reserve has been
                        substituted in mid-match. */}
                    {p.impact_activated_at ? (
                      <Pill tone="emerald">IP active</Pill>
                    ) : p.is_reserve_player ? (
                      <Pill tone="gold">RP (saved)</Pill>
                    ) : p.is_playing_xi === true ? (
                      <Pill tone="emerald">In XI</Pill>
                    ) : p.is_playing_xi === false ? (
                      <Pill tone="default">Benched</Pill>
                    ) : null}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

// Read-only display of the widget-suggested XI grouped by team. No checkboxes,
// no auto-selection — the admin reads this and manually ticks corresponding
// rows in the TeamSquad pickers below. Unmatched names (vendor sent a name
// that doesn't normalize to any player in our fmp roster for this match) are
// surfaced in a banner so the admin knows to spell-check / chase the vendor.
function SuggestedXi({ suggested, unmatched, onDismiss }) {
  const grouped = useMemo(() => {
    const out = new Map();
    for (const row of suggested) {
      const key = row.teamLabel || row.teamId || "?";
      if (!out.has(key)) out.set(key, []);
      out.get(key).push(row);
    }
    // Alpha-sort within each team (case-insensitive) so the suggested list
    // matches the manual picker's ordering — easier to scan one against the
    // other when ticking checkboxes. Vendor's squad.js sends batting order;
    // we override that here because the admin reads against an alpha picker.
    for (const arr of out.values()) {
      arr.sort((a, b) =>
        (a.playerName || "").localeCompare(b.playerName || "", undefined, {
          sensitivity: "base",
        }),
      );
    }
    return out;
  }, [suggested]);

  return (
    <Card
      title={
        <span className="flex items-center gap-2">
          <span>Suggested Playing XI (from widget)</span>
          <Pill tone="default">Reference only</Pill>
        </span>
      }
      padding="tight"
    >
      <div className="px-4 py-3">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="text-xs text-white/55">
            Use this as a guide — tick the matching players in the picker
            below, then click <strong className="text-white">Publish XI</strong>.
          </span>
          <button
            type="button"
            onClick={onDismiss}
            className="text-xs text-white/55 hover:text-white"
          >
            Dismiss
          </button>
        </div>

        {unmatched.length > 0 ? (
          <div className="mb-3 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-200">
            <strong>Names not found in this match's squad:</strong>{" "}
            {unmatched.join(", ")}.{" "}
            <span className="text-amber-300/80">
              Spelling drift between vendor and our DB — handle via{" "}
              <code>sync:vendor-names</code> / alias before publishing.
            </span>
          </div>
        ) : null}

        <div className="grid gap-3 md:grid-cols-2">
          {[...grouped.entries()].map(([label, rows]) => (
            <div
              key={label}
              className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-bold text-white">{label}</span>
                <Pill tone="default">{rows.length} players</Pill>
              </div>
              <ul className="space-y-1">
                {rows.map((p, i) => (
                  <li
                    key={`${label}-${i}-${p.playerName}`}
                    className="flex items-center justify-between text-sm"
                  >
                    <span
                      className={
                        p.matchedPlayerId
                          ? "text-white/90"
                          : "text-amber-200/90 line-through decoration-amber-300/50"
                      }
                    >
                      {p.playerName}
                      {p.isCaptain ? (
                        <span className="ml-1 text-[10px] font-bold uppercase tracking-wider text-[#F68323]">
                          (C)
                        </span>
                      ) : null}
                      {p.isWicketKeeper ? (
                        <span className="ml-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                          (WK)
                        </span>
                      ) : null}
                    </span>
                    {p.matchedPlayerId ? null : (
                      <span className="text-[10px] text-amber-300/90">
                        not in DB
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function squadLabel(player, match) {
  if (!match || player == null) return null;
  return teamLabelForId(player.team_id, match);
}

function teamLabelForId(teamId, match) {
  if (!match || teamId == null) return null;
  const tid = String(teamId);
  if (String(match.team_a_id) === tid) {
    return match.team_a_name || match.team_a_short || "Team A";
  }
  if (String(match.team_b_id) === tid) {
    return match.team_b_name || match.team_b_short || "Team B";
  }
  return `Team ${tid}`;
}

function prettifyError(code) {
  switch (code) {
    case "not_eleven":
    case "validation_error":
      return "Pick exactly 11 players from each team (22 total).";
    case "not_eleven_per_team":
      return "Each team must have exactly 11 players selected.";
    case "duplicate_player_ids":
      return "Duplicate players in the selection — clear and try again.";
    case "unknown_player":
      return "One or more picks aren't in this match's squad.";
    // single_team_xi is the legacy code name for not_eleven_per_team; keep
    // the mapping so older backends still surface a friendly message.
    case "single_team_xi":
      return "Each team must have exactly 11 players selected.";
    case "match_not_found":
      return "Fantasy match not found — try re-seeding fixtures.";
    default:
      return null;
  }
}

function prettifyWidgetError(code, missing, hint) {
  switch (code) {
    case "match_not_found":
      return "Fantasy match not found — try re-seeding fixtures.";
    case "squad_mismatch": {
      const names = Array.isArray(missing) && missing.length > 0
        ? ` (e.g. ${missing.join(", ")})`
        : "";
      return `Widget published names${names} that aren't in this match's squad. ${hint || "Run the per-match squad seeder first, then try again."}`;
    }
    case "widget_fetch_failed":
      return "Widget feed couldn't be fetched (CDN unreachable or malformed). Try again in a moment, or publish manually below.";
    case "widget_match_id_missing":
      return hint || "Match has no widget_match_id mapped. Re-run showcase:seed-s4 to backfill from tournament_fixture.";
    default:
      return null;
  }
}
