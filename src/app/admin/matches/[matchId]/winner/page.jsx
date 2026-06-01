"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { getMatchWinner, matchVoters, pickWinner } from "@/app/api/admin/polls";
import {
  Button,
  Card,
  PageHeader,
  Pill,
  StatCard,
} from "@/components/admin/ui";

export default function PickWinnerPage() {
  const { matchId } = useParams();
  const [winner, setWinner] = useState(null);
  const [voterCount, setVoterCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [requireCorrect, setRequireCorrect] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Guard against setState after unmount — handlers race with navigation away.
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const reload = async () => {
    const [w, v] = await Promise.all([
      getMatchWinner(matchId),
      matchVoters(matchId),
    ]);
    if (!mountedRef.current) return;
    setWinner(w.winner ?? null);
    setVoterCount(v.count ?? 0);
    setCorrectCount(v.correctCount ?? 0);
  };

  useEffect(() => {
    reload().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchId]);

  const pool = requireCorrect ? correctCount : voterCount;

  const handlePick = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await pickWinner(matchId, { requireCorrect });
      if (!mountedRef.current) return;
      setWinner(res.winner);
      if (requireCorrect) setCorrectCount(res.eligibleCount);
      else setVoterCount(res.eligibleCount);
    } catch (err) {
      if (!mountedRef.current) return;
      const code = err?.response?.data?.error;
      if (code === "no_correct_voters")
        setError("No fans got a prediction right yet for this match.");
      else if (code === "no_voters")
        setError("No eligible voters yet for this match.");
      else setError("Failed to pick a winner. Try again.");
    } finally {
      if (mountedRef.current) setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Random draw"
        title={winner ? "Winner picked" : "Pick winner"}
        subtitle={
          winner
            ? "Reveal it to the venue or re-draw if needed."
            : "Choose your pool, then trigger a uniform random selection."
        }
        actions={
          <Button
            as={Link}
            href={`/admin/matches/${encodeURIComponent(matchId)}`}
            variant="ghost"
            size="sm"
          >
            ← Back to match
          </Button>
        }
      />

      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        <StatCard
          label="Total voters"
          value={voterCount.toLocaleString("en-IN")}
          accent="default"
        />
        <StatCard
          label="Answered correctly"
          value={correctCount.toLocaleString("en-IN")}
          accent="emerald"
        />
        <StatCard
          label="Eligible pool"
          value={pool.toLocaleString("en-IN")}
          accent="gold"
          trend={requireCorrect ? "Only correct answers" : "All voters"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
        <Card title="Eligible pool">
          <p className="text-sm text-white/65">
            Pick the group of fans the random draw will sample from. The
            “correct answers” pool only includes fans who picked the right
            option on at least one poll with a marked correct answer.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <PoolOption
              checked={!requireCorrect}
              onChange={() => setRequireCorrect(false)}
              title="All voters"
              count={voterCount}
              description="Every fan who voted on any poll for this match."
            />
            <PoolOption
              checked={requireCorrect}
              onChange={() => setRequireCorrect(true)}
              title="Only correct answers"
              count={correctCount}
              description="Fans who picked the correct option on at least one poll."
              disabled={correctCount === 0}
            />
          </div>
          {correctCount === 0 ? (
            <div className="mt-4 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/55">
              Mark the correct option on each poll (from the poll edit page) to
              enable the “only correct answers” pool.
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs uppercase tracking-[0.18em] text-white/55">
              Draws from <b className="text-white">{pool}</b> fan
              {pool === 1 ? "" : "s"}
            </div>
            <Button
              type="button"
              onClick={handlePick}
              disabled={submitting || pool === 0}
              size="lg"
            >
              {submitting
                ? "Drawing…"
                : winner
                ? "Re-draw winner"
                : "Pick random winner"}
            </Button>
          </div>
          {error ? (
            <div className="mt-4 rounded-md border border-red-400/40 bg-red-400/10 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          ) : null}
        </Card>

        <Card title="Result">
          {winner ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-emerald-400/15 text-2xl">
                  🏆
                </span>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-200/80">
                    Current winner
                  </div>
                  <div className="mt-1 truncate font-oswald text-2xl font-extrabold italic uppercase text-white">
                    {winner.name || "Anonymous"}
                  </div>
                  <div className="mt-0.5 font-mono text-xs text-white/65">
                    {winner.mobile}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-2">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
                    Pool
                  </div>
                  <div className="mt-1 font-bold tabular-nums text-white">
                    {winner.eligible_voter_count}
                  </div>
                </div>
                <div className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-2">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
                    Picked at
                  </div>
                  <div className="mt-1 text-white/85">
                    {new Date(winner.picked_at).toLocaleString()}
                  </div>
                </div>
              </div>
              <Button
                as="a"
                href={`/fan-poll/reveal/${encodeURIComponent(matchId)}?admin=1`}
                target="_blank"
                rel="noreferrer"
                variant="success"
                size="lg"
                className="w-full"
              >
                Open TV reveal ↗
              </Button>
              <Pill tone="default">Replay safely from the reveal page</Pill>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-white/[0.04] text-2xl">
                🎲
              </div>
              <div className="text-base font-bold text-white">
                No winner drawn yet
              </div>
              <p className="max-w-xs text-sm text-white/55">
                Confirm the pool on the left, then hit Pick random winner.
              </p>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

function PoolOption({ checked, onChange, title, count, description, disabled }) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
        checked
          ? "border-[#F2A23A] bg-[#F2A23A]/[0.06]"
          : "border-white/10 bg-white/[0.02] hover:border-white/30"
      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="mt-1 h-4 w-4 accent-[#F2A23A]"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-sm font-bold uppercase tracking-wide text-white">
            {title}
          </span>
          <span className="font-oswald text-xl font-extrabold tabular-nums italic text-[#F2A23A]">
            {count}
          </span>
        </div>
        <p className="mt-1 text-xs text-white/55">{description}</p>
      </div>
    </label>
  );
}
