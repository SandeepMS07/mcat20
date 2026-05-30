"use client";
import { useEffect, useMemo, useState } from "react";
import { votePoll } from "@/app/api/polls";
import { useAuth } from "@/components/auth/AuthContext";
import { usePollsContext } from "@/components/polls/PollsProvider";

const formatCountdown = (ms) => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60).toString().padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
};

const FanPollPopup = ({ open, onClose, onVoted }) => {
  const { polls, loadError, updatePoll } = usePollsContext();
  const poll = polls && polls.length > 0 ? polls[polls.length - 1] : null;
  const [pendingOptionId, setPendingOptionId] = useState(null);
  const [voteError, setVoteError] = useState(null);
  const [remainingMs, setRemainingMs] = useState(null);
  const { isAuthed, openLogin } = useAuth();


  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open || !poll?.ends_at) {
      setRemainingMs(null);
      return undefined;
    }

    const endsAt = new Date(poll.ends_at).getTime();

    const tick = () => {
      const remaining = endsAt - Date.now();
      setRemainingMs(remaining > 0 ? remaining : 0);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [open, poll?.ends_at]);

  const hasVoted = poll?.my_selection != null;
  const totalVotes = poll?.total_votes || 0;

  const leadingOptionId = useMemo(() => {
    if (!poll || !Array.isArray(poll.options) || poll.options.length === 0)
      return null;
    return poll.options.reduce(
      (lead, opt) => (opt.votes > (lead?.votes ?? -1) ? opt : lead),
      null
    )?.id;
  }, [poll]);

  const handleVote = async (optionId) => {
    if (!poll || pendingOptionId !== null || hasVoted) return;
    if (!isAuthed) {
      openLogin(() => handleVote(optionId));
      return;
    }

    const prevPoll = poll;
    const optimistic = {
      ...poll,
      my_selection: optionId,
      total_votes: (poll.total_votes || 0) + 1,
      options: poll.options.map((opt) =>
        opt.id === optionId ? { ...opt, votes: (opt.votes || 0) + 1 } : opt
      ),
    };
    setVoteError(null);
    setPendingOptionId(optionId);
    updatePoll(optimistic);

    try {
      const res = await votePoll(poll.slug, optionId);
      if (res && res.poll) updatePoll(res.poll);
      onVoted?.(poll.id);
    } catch (err) {
      updatePoll(prevPoll);
      const status = err?.response?.status;
      const code = err?.response?.data?.error || err?.response?.data?.code;
      let msg = "Something went wrong. Please try again.";
      if (status === 429 || code === "rate_limited")
        msg = "Too many votes. Please slow down and try again in a minute.";
      else if (code === "poll_closed")
        msg = "This poll is no longer accepting votes.";
      else if (code === "invalid_option")
        msg = "That option is no longer available.";
      setVoteError(msg);
    } finally {
      setPendingOptionId(null);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/15 bg-[#02103D] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={poll?.question || "Fan poll"}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#F2A23A]/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-[#1C398E]/40 blur-3xl"
        />

        <div className="relative p-5 sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F2A23A] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#02103D]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#02103D]" />
              Today's Fan Poll
            </span>
            {remainingMs !== null && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold tabular-nums ${
                  remainingMs > 0
                    ? "border-[#F2A23A]/40 bg-[#F2A23A]/10 text-[#F2A23A]"
                    : "border-white/15 bg-white/5 text-white/60"
                }`}
                aria-live="polite"
                title={remainingMs > 0 ? "Time left to vote" : "Voting closed"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3"
                  aria-hidden
                >
                  <circle cx="12" cy="13" r="8" />
                  <path d="M12 9v4l2.5 2" />
                  <path d="M9 2h6" />
                </svg>
                {remainingMs > 0 ? formatCountdown(remainingMs) : "Closed"}
              </span>
            )}
            {totalVotes > 0 && (
              <span className="text-xs font-medium text-white/60">
                {totalVotes.toLocaleString("en-IN")} votes
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close poll"
              className="ml-auto cursor-pointer rounded-full p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {loadError ? (
            <p className="py-10 text-center text-sm italic text-white/70">
              Could not load poll right now. Please try again later.
            </p>
          ) : !poll ? (
            <div className="space-y-4">
              <div className="h-6 w-3/4 animate-pulse rounded bg-white/10" />
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-14 animate-pulse rounded-lg bg-white/[0.04]"
                  />
                ))}
              </div>
            </div>
          ) : (
            <>
              <h3 className="mb-5 text-lg font-extrabold uppercase italic leading-tight text-white sm:text-2xl">
                {poll.question}
              </h3>

              {hasVoted ? (
                <div className="flex flex-col gap-3">
                  {poll.options.map((opt) => {
                    const pct =
                      totalVotes > 0
                        ? Math.round(((opt.votes || 0) / totalVotes) * 100)
                        : 0;
                    const isMine = opt.id === poll.my_selection;
                    const isLeading = opt.id === leadingOptionId;
                    return (
                      <div
                        key={opt.id}
                        className={`relative overflow-hidden rounded-lg border px-3 py-2.5 ${
                          isMine
                            ? "border-[#F2A23A]/60 bg-[#F2A23A]/10"
                            : "border-white/15 bg-white/[0.03]"
                        }`}
                      >
                        <div
                          aria-hidden
                          className={`absolute inset-y-0 left-0 transition-[width] duration-700 ${
                            isLeading
                              ? "bg-gradient-to-r from-[#F2A23A]/40 to-[#F2A23A]/10"
                              : "bg-white/[0.07]"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                        <div className="relative flex items-center gap-3">
                          {opt.image_url && (
                            <img
                              src={opt.image_url}
                              alt=""
                              className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-white/20"
                              loading="lazy"
                            />
                          )}
                          <span
                            className={`min-w-0 flex-1 truncate text-sm ${
                              isMine
                                ? "font-semibold text-white"
                                : "text-white/90"
                            }`}
                          >
                            {opt.label}
                            {isMine && (
                              <span className="ml-2 text-[10px] uppercase tracking-wider text-[#F2A23A]">
                                Your pick
                              </span>
                            )}
                          </span>
                          <span
                            className={`shrink-0 text-sm font-bold tabular-nums ${
                              isLeading ? "text-[#F2A23A]" : "text-white/80"
                            }`}
                          >
                            {pct}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {poll.options.map((opt) => {
                    const isPending = pendingOptionId === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleVote(opt.id)}
                        disabled={pendingOptionId !== null}
                        className={`group flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition disabled:cursor-not-allowed ${
                          isPending
                            ? "border-[#F2A23A] bg-[#F2A23A]/15 text-white"
                            : "border-white/15 bg-white/[0.04] text-white hover:border-[#F2A23A]/60 hover:bg-white/[0.08]"
                        }`}
                        aria-pressed={isPending}
                      >
                        {opt.image_url && (
                          <img
                            src={opt.image_url}
                            alt=""
                            className={`h-9 w-9 shrink-0 rounded-full object-cover ring-1 transition ${
                              isPending
                                ? "ring-[#F2A23A]"
                                : "ring-white/20 group-hover:ring-[#F2A23A]/40"
                            }`}
                            loading="lazy"
                          />
                        )}
                        <span className="min-w-0 flex-1 truncate">
                          {opt.label}
                        </span>
                        <span
                          aria-hidden
                          className={`h-4 w-4 shrink-0 rounded-full border-2 transition ${
                            isPending
                              ? "border-[#F2A23A] bg-[#F2A23A]"
                              : "border-white/40 group-hover:border-[#F2A23A]"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              {!hasVoted && (
                <p className="mt-5 text-center text-[11px] uppercase tracking-wider text-white/40">
                  Tap an option to cast your vote
                </p>
              )}
            </>
          )}

          {voteError && (
            <p className="mt-3 text-xs text-red-300" role="alert">
              {voteError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FanPollPopup;
