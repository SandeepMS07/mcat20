"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  getFantasyMatch,
  previewPlayingXiFromWidget,
  publishPlayingXi,
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

export default function FantasyPlayingXiPage() {
  const { matchId } = useParams(); // fantasy_match.id (text)

  const [match, setMatch] = useState(null);
  const [players, setPlayers] = useState([]);
  const [selected, setSelected] = useState(new Set());
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
        const inXi = (fm.players ?? [])
          .filter((p) => p.is_playing_xi === true)
          .map((p) => p.player_id);
        setSelected(new Set(inXi));
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

  const handlePublish = async () => {
    if (!canSubmit || !match) return;
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    setWidgetNotice(null);
    try {
      const res = await publishPlayingXi(match.id, Array.from(selected));
      setSuccess({
        announcedAt: res.announcedAt,
        lateChange: res.lateChange,
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

  const teamA = match?.team_a_short || match?.team_a_name || "TBA";
  const teamB = match?.team_b_short || match?.team_b_name || "TBA";

  if (loading) {
    return (
      <>
        <PageHeader
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
        <PageHeader eyebrow="Playing XI" title="Match not found" />
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

      <Card title="Widget assist" padding="tight">
        <div className="flex flex-col gap-3 px-4 py-4">
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
      </Card>

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

      <div className="mt-6">
        <Card title="Or — pick manually" padding="tight">
          <div className="flex flex-col gap-2 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/75">
              <span>
                Total{" "}
                <span className="font-extrabold text-white">
                  {selected.size}
                </span>{" "}
                / {TOTAL_PICKS}
              </span>
              {teamIds.map((tid) => {
                const n = selectedByTeam.get(tid) ?? 0;
                const label = teamLabelForId(tid, match);
                const ok = n === PER_TEAM;
                return (
                  <span
                    key={tid}
                    className={ok ? "text-emerald-300" : "text-white/75"}
                  >
                    {label}:{" "}
                    <span className="font-extrabold text-white">{n}</span> /{" "}
                    {PER_TEAM}
                  </span>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                onClick={() => setSelected(new Set())}
                disabled={selected.size === 0 || submitting}
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
                  ? "RE-PUBLISH XI\n\nWHAT: Overwrite the previously announced XI with the current selection (11 per team).\n\nWARNING: Users who picked players newly benched will start scoring 0 from this point on. Past points are NOT reverted — but new events won't be credited to benched players' picks. Visible to all users immediately.\n\nOUTCOME: UPDATE fmp.is_playing_xi=TRUE for selected 22, FALSE otherwise. Updates playing_xi_announced_at."
                  : "PUBLISH XI\n\nWHAT: Commit the manual XI selection. Writes 11 per team into fantasy_match_player.is_playing_xi.\n\nWARNING: Once published, the XI is visible to all users on the team-card banner. Players left out score 0 from match start.\n\nOUTCOME: UPDATE fmp.is_playing_xi=TRUE for selected 22, FALSE otherwise. Stamps playing_xi_announced_at."}
              >
                {submitting
                  ? "Publishing…"
                  : match.playing_xi_announced_at
                    ? "Re-publish XI"
                    : "Publish XI"}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {[...byTeam.entries()].map(([teamId, list]) => {
          const teamCount = selectedByTeam.get(teamId) ?? 0;
          return (
            <TeamSquad
              key={teamId}
              teamId={teamId}
              players={list}
              selected={selected}
              onToggle={togglePick}
              disabled={submitting}
              teamAtCap={teamCount >= PER_TEAM}
              perTeam={PER_TEAM}
              teamLabelFor={(p) => squadLabel(p, match)}
            />
          );
        })}
      </div>
    </>
  );
}

function TeamSquad({ teamId, players, selected, onToggle, disabled, teamAtCap, perTeam, teamLabelFor }) {
  const teamName = useMemo(() => {
    const sample = players[0];
    if (!sample) return `Team ${teamId}`;
    return teamLabelFor(sample) || `Team ${teamId}`;
  }, [players, teamId, teamLabelFor]);
  const inXi = players.filter((p) => selected.has(p.player_id)).length;

  // Pure alpha sort, case-insensitive. Role labels stay inline on each row
  // (next to the Icon/U-19/In XI pills) so the admin can still see what each
  // player is without role groupings breaking up the alphabetical flow.
  const sorted = useMemo(() => {
    return [...players].sort((a, b) =>
      (a.player_name || "").localeCompare(b.player_name || "", undefined, {
        sensitivity: "base",
      }),
    );
  }, [players]);

  return (
    <Card
      title={
        <span className="flex items-center gap-2">
          <span>{teamName}</span>
          <Pill tone={inXi === perTeam ? "emerald" : inXi > 0 ? "default" : "default"}>
            {inXi} / {perTeam} in XI
          </Pill>
        </span>
      }
      padding="tight"
    >
      <ul className="divide-y divide-white/5">
        {sorted.map((p) => {
          const checked = selected.has(p.player_id);
          // Cap is per-team: a row only goes "disabled (full)" once this team
          // has hit 11. The other team's picker keeps accepting clicks.
          const disabledRow = disabled || (!checked && teamAtCap);
          return (
            <li key={p.player_id} className="px-3 py-2">
              <label
                className={`flex cursor-pointer items-center gap-3 ${
                  disabledRow && !checked ? "opacity-40" : ""
                }`}
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-[#F68323]"
                  checked={checked}
                  disabled={disabledRow && !checked}
                  onChange={() => onToggle(p.player_id)}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-white">
                    {p.player_name || p.player_id}
                  </span>
                  <span className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-white/55">
                    <span>{ROLE_LABEL[p.role] || p.role}</span>
                    {p.is_icon ? <Pill tone="gold">Icon</Pill> : null}
                    {/* Underlying column is still is_emerging until the
                        0019_u19_flag migration lands; UI surfaces it as U-19
                        per the renamed BRD multiplier. */}
                    {p.is_u19 || p.is_emerging ? <Pill tone="violet">U-19</Pill> : null}
                    {p.is_playing_xi === true ? (
                      <Pill tone="emerald">In XI</Pill>
                    ) : p.is_playing_xi === false ? (
                      <Pill tone="default">Benched</Pill>
                    ) : null}
                  </span>
                </span>
              </label>
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
    return match.team_a_short || match.team_a_name || "Team A";
  }
  if (String(match.team_b_id) === tid) {
    return match.team_b_short || match.team_b_name || "Team B";
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
