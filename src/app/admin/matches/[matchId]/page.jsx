"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  getMatchWinner,
  listMatches,
  listPolls,
  updatePoll,
} from "@/app/api/admin/polls";
import {
  Button,
  Card,
  EmptyState,
  MatchStatusBadge,
  PageHeader,
  Pill,
  PollStatusBadge,
  StatCard,
} from "@/components/admin/ui";

const REFRESH_MS = 5000;

export default function AdminMatchDetailPage() {
  const { matchId } = useParams();
  const [match, setMatch] = useState(null);
  const [polls, setPolls] = useState([]);
  const [winner, setWinner] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [pollsRes, matchesRes, winnerRes] = await Promise.all([
          listPolls({ matchId }),
          listMatches(),
          getMatchWinner(matchId),
        ]);
        if (cancelled) return;
        setPolls(pollsRes.polls || []);
        setMatch(
          (matchesRes.matches || []).find((m) => m.id === matchId) || null,
        );
        setWinner(winnerRes.winner ?? null);
      } catch {
        /* ignore */
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

  const totalVotes = useMemo(
    () => polls.reduce((s, p) => s + (p.vote_count || 0), 0),
    [polls],
  );
  const activeCount = useMemo(
    () => polls.filter((p) => p.status === "active").length,
    [polls],
  );

  const toggleStatus = async (poll) => {
    const next = poll.status === "active" ? "closed" : "active";
    try {
      await updatePoll(poll.id, { status: next });
      setTick((n) => n + 1);
    } catch (err) {
      // Silent-fail used to be the behaviour — make sure ops at least sees
      // *something* if the PATCH fails (next 5s tick would otherwise paper
      // over it with stale data).
      // eslint-disable-next-line no-console
      console.error("[admin] toggleStatus failed", err);
      window.alert("Failed to update poll status. Please try again.");
    }
  };

  const teamA = match?.team_a_short || match?.team_a_name || "TBA";
  const teamB = match?.team_b_short || match?.team_b_name || "TBA";

  return (
    <>
      <PageHeader
        eyebrow={match?.series_name || "Match"}
        title={`${teamA} vs ${teamB}`}
        subtitle={
          <span className="flex flex-wrap items-center gap-2">
            {match ? <MatchStatusBadge status={match.status} /> : null}
            {match?.scheduled_at ? (
              <span className="text-white/55">
                {new Date(match.scheduled_at).toLocaleString()}
              </span>
            ) : null}
          </span>
        }
        actions={
          <>
            <Button
              as={Link}
              href={`/admin/polls/new?matchId=${encodeURIComponent(matchId)}`}
              size="md"
            >
              + Create poll
            </Button>
            <Button
              as={Link}
              href={`/admin/matches/${encodeURIComponent(matchId)}/winner`}
              variant="secondary"
              size="md"
            >
              {winner ? "View winner" : "Pick winner"}
            </Button>
            {winner ? (
              <Button
                as="a"
                href={`/fan-poll/reveal/${encodeURIComponent(matchId)}?admin=1`}
                target="_blank"
                rel="noreferrer"
                variant="success"
                size="md"
              >
                Open TV reveal ↗
              </Button>
            ) : null}
          </>
        }
      />

      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total polls" value={polls.length} accent="default" />
        <StatCard label="Active" value={activeCount} accent="emerald" />
        <StatCard
          label="Total votes"
          value={totalVotes.toLocaleString("en-IN")}
          accent="gold"
        />
        <StatCard
          label="Winner"
          value={winner ? "Picked" : "Not yet"}
          accent={winner ? "emerald" : "default"}
        />
      </div>

      {winner ? (
        <Card title="Today's winner">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-emerald-400/15 text-2xl">
                🏆
              </span>
              <div>
                <div className="font-oswald text-2xl font-extrabold italic uppercase text-white">
                  {winner.name || "Anonymous"}
                </div>
                <div className="mt-0.5 text-sm text-white/65">
                  <span className="font-mono">{winner.mobile}</span> · drawn from{" "}
                  {winner.eligible_voter_count} eligible voter
                  {winner.eligible_voter_count === 1 ? "" : "s"}
                </div>
                <div className="mt-0.5 text-[11px] text-white/45">
                  {new Date(winner.picked_at).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                as="a"
                href={`/fan-poll/reveal/${encodeURIComponent(matchId)}?admin=1`}
                target="_blank"
                rel="noreferrer"
                variant="success"
              >
                Open TV reveal ↗
              </Button>
              <Button
                as={Link}
                href={`/admin/matches/${encodeURIComponent(matchId)}/winner`}
                variant="secondary"
              >
                Re-draw
              </Button>
            </div>
          </div>
        </Card>
      ) : null}

      <div className={winner ? "mt-6" : ""}>
        <Card
          title="Polls in this match"
          action={
            <span className="text-[10px] uppercase tracking-[0.22em] text-white/55">
              auto-refreshing every 5s
            </span>
          }
          padding="tight"
        >
          {polls.length === 0 ? (
            <EmptyState
              title="No polls attached to this match"
              hint="Create one to start collecting predictions for this fixture."
              action={
                <Button
                  as={Link}
                  href={`/admin/polls/new?matchId=${encodeURIComponent(matchId)}`}
                >
                  + Create poll
                </Button>
              }
            />
          ) : (
            <div className="divide-y divide-white/5">
              {polls.map((p) => (
                <PollRow
                  key={p.id}
                  poll={p}
                  onToggleStatus={() => toggleStatus(p)}
                />
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

function PollRow({ poll, onToggleStatus }) {
  return (
    <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-6">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-white">
            {poll.question}
          </span>
          {poll.correct_option_id != null ? (
            <Pill tone="emerald">✓ Result set</Pill>
          ) : null}
        </div>
        <div className="mt-1 flex items-center gap-2 text-[11px] text-white/55">
          <PollStatusBadge status={poll.status} />
          <span>·</span>
          <span>{poll.vote_count.toLocaleString("en-IN")} votes</span>
          {poll.ends_at ? (
            <>
              <span>·</span>
              <span>closes {new Date(poll.ends_at).toLocaleString()}</span>
            </>
          ) : null}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          onClick={onToggleStatus}
          disabled={poll.status === "draft"}
          variant="secondary"
          size="sm"
        >
          {poll.status === "active" ? "Close" : "Open"}
        </Button>
        <Button
          as={Link}
          href={`/admin/polls/${poll.id}/edit`}
          variant="secondary"
          size="sm"
        >
          Edit →
        </Button>
      </div>
    </div>
  );
}
