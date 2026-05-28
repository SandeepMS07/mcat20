"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  getFantasyMatch,
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
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [widgetNotice, setWidgetNotice] = useState(null);

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

  // Pull the XI from the widget feed. If the widget has nothing yet (toss
  // not done), surface the soft "try again later" message instead of an error.
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

      <Card title="Auto-pull from widget" padding="tight">
        <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-white/75">
            The widget feed publishes the announced XI about 30 min after toss.
            If it's there, pull it in with one click — no manual selection
            needed.
          </div>
          <Button
            onClick={handlePullFromWidget}
            disabled={pulling || submitting}
            size="md"
          >
            {pulling ? "Pulling…" : "Pull from widget"}
          </Button>
        </div>
      </Card>

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
                  title="Clear the announced XI and reset every player to undecided"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-rose-300/40 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-rose-200 hover:border-rose-300 hover:bg-rose-400/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {unpublishing ? "Unpublishing…" : "Unpublish XI"}
                </button>
              ) : null}
              <Button onClick={handlePublish} disabled={!canSubmit || pulling || unpublishing} size="md">
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
        {players.map((p) => {
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
    default:
      return null;
  }
}
