"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { listMatchPolls, listMatches, votePoll } from "@/app/api/polls";
import { trackEvent } from "@/utilis/mixpanelClient";


function chooseActiveMatch(matches) {
  if (!Array.isArray(matches) || matches.length === 0) return null;
  // Prefer the first live match; otherwise the next upcoming one; otherwise
  // the most recently completed (so the winner banner is still discoverable).
  const live = matches.find((m) => m.status === "live");
  if (live) return live;
  const upcoming = matches
    .filter((m) => m.status === "upcoming")
    .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at))[0];
  if (upcoming) return upcoming;
  return matches
    .filter((m) => m.status === "completed")
    .sort((a, b) => new Date(b.scheduled_at) - new Date(a.scheduled_at))[0] ?? null;
}

export default function MatchFanPollSection() {
  const { isAuthed, openLogin } = useAuth();
  const [match, setMatch] = useState(null);
  const [polls, setPolls] = useState([]);
  const [winner, setWinner] = useState(null);
  const [loaded, setLoaded] = useState(false);

  // Mount flag — async reload() called from handlers/effects can land after
  // the user navigates away; setting state on an unmounted component warns
  // in dev and can cause stale-paint artifacts under concurrent React.
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const reload = useCallback(async (matchId) => {
    const res = await listMatchPolls(matchId);
    if (!mountedRef.current) return;
    setPolls(res.polls || []);
    setWinner(res.winner ?? null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const matches = await listMatches();
        if (cancelled) return;
        const active = chooseActiveMatch(matches);
        setMatch(active);
        if (active) {
          await reload(active.id);
        }
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reload, isAuthed]);

  const matchLabel = useMemo(() => {
    if (!match) return null;
    const a = match.teamA?.short || match.teamA?.name || match.team_a_short || match.team_a_name;
    const b = match.teamB?.short || match.teamB?.name || match.team_b_short || match.team_b_name;
    return a && b ? `${a} vs ${b}` : (match.label || "Today’s Match");
  }, [match]);

  if (!loaded) return null;
  if (!match || polls.length === 0) return null;

  return (
    <section className="mb-12 rounded-2xl border border-white/10 bg-[#02103D]/70 p-5 sm:p-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#F2A23A]">
            Today’s Polls
          </div>
          <h2 className="mt-1 font-oswald text-2xl font-extrabold uppercase italic text-white sm:text-3xl">
            {matchLabel}
          </h2>
          {match.scheduled_at ? (
            <p className="mt-1 text-xs text-white/55">
              {new Date(match.scheduled_at).toLocaleString()}
            </p>
          ) : null}
        </div>
        {winner ? (
          <Link
            href={`/fan-poll/reveal/${encodeURIComponent(match.id)}`}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-emerald-200 hover:bg-emerald-400/20"
          >
            🏆 Today’s winner: <span className="text-white">{winner.firstName}</span>
            <span aria-hidden>→</span>
          </Link>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {polls.map((poll) => (
          <MatchPollCard
            key={poll.id}
            poll={poll}
            isAuthed={isAuthed}
            openLogin={openLogin}
            onUpdated={() => reload(match.id)}
          />
        ))}
      </div>
    </section>
  );
}

function MatchPollCard({ poll, isAuthed, openLogin, onUpdated }) {
  const [error, setError] = useState(null);
  const [pendingOptionId, setPendingOptionId] = useState(null);
  const selectedId = poll.my_selection;

  const submitVote = async (optionId) => {
    setError(null);
    setPendingOptionId(optionId);
    try {
      await votePoll(poll.slug, optionId);
      trackEvent("Fan Poll Voted", {
        poll_slug: poll.slug,
        poll_question: poll.question,
        option_id: optionId,
        match_id: poll.match_id,
        is_change: selectedId != null,
      });
      await onUpdated();
    } catch (err) {
      const status = err?.response?.status;
      const code = err?.response?.data?.error;
      if (status === 401) setError("Please sign in to vote.");
      else if (status === 429) setError("Too many votes. Slow down a moment.");
      else if (code === "poll_closed") setError("This poll has closed.");
      else if (code === "invalid_option") setError("That option is no longer available.");
      else setError("Couldn’t cast your vote. Try again.");
    } finally {
      setPendingOptionId(null);
    }
  };

  const handleVote = (optionId) => {
    if (pendingOptionId !== null) return;
    if (optionId === selectedId) return;
    if (!isAuthed) {
      openLogin(() => submitVote(optionId), { variant: "fanPoll" });
      return;
    }
    submitVote(optionId);
  };

  const closed = poll.status !== "active";
  const showResults = selectedId != null || closed;
  const totalVotes = poll.total_votes || 0;
  const maxVotes = Math.max(0, ...poll.options.map((o) => o.votes || 0));

  return (
    <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-[#0E1A47] via-[#0C1845] to-[#091236] p-5">
      <header className="mb-4 flex items-start gap-3">
        <span className="mt-1 h-5 w-1 shrink-0 rounded-full bg-[#F2A23A]" />
        <h3 className="text-sm font-bold text-white sm:text-[15px]">
          {poll.question}
        </h3>
      </header>

      {showResults ? (
        <div className="flex flex-col gap-3">
          {poll.options.map((opt) => {
            const pct =
              totalVotes > 0 ? Math.round(((opt.votes || 0) / totalVotes) * 100) : 0;
            const isLeader = maxVotes > 0 && (opt.votes || 0) === maxVotes;
            const isMine = opt.id === selectedId;
            return (
              <div key={opt.id}>
                <div className="mb-1.5 flex items-center gap-2.5">
                  {opt.image_url && (
                    <img
                      src={opt.image_url}
                      alt=""
                      className="h-7 w-7 shrink-0 rounded-full object-cover ring-1 ring-white/15"
                      loading="lazy"
                    />
                  )}
                  <p className="flex-1 truncate text-[13px] font-semibold text-white/95">
                    {opt.label}
                  </p>
                  <span
                    className={`shrink-0 text-[12px] font-extrabold tabular-nums ${
                      isLeader ? "text-[#F2A23A]" : "text-white/80"
                    }`}
                  >
                    {pct}%
                  </span>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/[0.08]">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-700 ease-out"
                    style={{
                      width: `${pct}%`,
                      background: isLeader
                        ? "linear-gradient(90deg, #F68323 0%, #F2A23A 100%)"
                        : isMine
                        ? "linear-gradient(90deg, #3B82F6 0%, #60A5FA 100%)"
                        : "rgba(255,255,255,0.22)",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {poll.options.map((opt) => {
            const isPending = pendingOptionId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleVote(opt.id)}
                disabled={pendingOptionId !== null || closed}
                className={`flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-left text-xs font-semibold text-white/90 transition-all hover:border-white/30 hover:bg-white/[0.08] disabled:cursor-not-allowed ${
                  isPending ? "opacity-70" : ""
                }`}
              >
                {opt.image_url && (
                  <img
                    src={opt.image_url}
                    alt=""
                    className="h-7 w-7 shrink-0 rounded-full object-cover ring-1 ring-white/15"
                    loading="lazy"
                  />
                )}
                <span className="flex-1 truncate">{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}

      <footer className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[11px]">
        <span className="text-white/55">
          {totalVotes.toLocaleString("en-IN")} {totalVotes === 1 ? "vote" : "votes"}
        </span>
        {selectedId ? (
          <span className="rounded-full bg-[#F68323]/15 px-2.5 py-1 font-bold uppercase tracking-wide text-[#F2A23A]">
            Voted
          </span>
        ) : closed ? (
          <span className="rounded-full bg-white/10 px-2.5 py-1 font-bold uppercase tracking-wide text-white/70">
            Closed
          </span>
        ) : !isAuthed ? (
          <span className="font-semibold text-[#F2A23A]">Sign in to vote</span>
        ) : (
          <span className="font-semibold text-[#F2A23A]">Tap an option</span>
        )}
      </footer>
      {error ? (
        <p className="mt-2 text-[11px] text-red-300" role="alert">
          {error}
        </p>
      ) : null}
    </article>
  );
}
