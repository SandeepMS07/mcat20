"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  abandonMatch,
  getFantasyMatch,
  lockMatch,
  listContestsForMatch,
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
