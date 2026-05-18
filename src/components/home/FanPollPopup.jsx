"use client";
import { useEffect, useMemo, useState } from "react";
import { listPolls, votePoll } from "@/app/api/polls";

const POPUP_DISMISSED_KEY = "mca_fanpoll_popup_dismissed";

const RESULT_BAR_COLORS = [
  "#3B82F6", // blue
  "#F58220", // orange
  "#F2C94C", // yellow
  "#9CA3AF", // grey
  "#34D399", // green
  "#A78BFA", // purple
];

const markDismissed = () => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(POPUP_DISMISSED_KEY, "1");
  } catch {
    /* ignore */
  }
};

export const hasFanPollPopupBeenDismissed = () => {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(POPUP_DISMISSED_KEY) === "1";
  } catch {
    return true;
  }
};

const FanPollPopup = ({ open, onClose }) => {
  const [poll, setPoll] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [pendingOptionId, setPendingOptionId] = useState(null);
  const [voteError, setVoteError] = useState(null);

  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;
    setLoadError(false);
    listPolls()
      .then((data) => {
        if (cancelled) return;
        const first = Array.isArray(data) && data.length > 0 ? data[0] : null;
        if (!first) {
          setLoadError(true);
          return;
        }
        setPoll(first);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("[FanPollPopup] failed to load poll:", err);
        setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

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

  const handleClose = () => {
    markDismissed();
    onClose?.();
  };

  const handleVote = async (optionId) => {
    if (!poll || pendingOptionId !== null || hasVoted) return;

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
    setPoll(optimistic);

    try {
      const res = await votePoll(poll.slug, optionId);
      if (res && res.poll) setPoll(res.poll);
      markDismissed();
    } catch (err) {
      setPoll(prevPoll);
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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-3xl rounded-2xl border border-white/15 bg-[#1f2c70] p-5 sm:p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={poll?.question || "Fan poll"}
      >
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#1A2C76]">
            Todays Fanpoll
          </span>
          {hasVoted && (
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#F2A23A]">
              {totalVotes.toLocaleString("en-IN")} votes
            </span>
          )}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close poll"
            className="ml-auto cursor-pointer rounded-full p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
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
          <p className="py-8 text-center text-sm italic text-white/70">
            Could not load poll right now. Please try again later.
          </p>
        ) : !poll ? (
          <div className="space-y-3 py-2">
            <div className="h-5 w-3/5 animate-pulse rounded bg-white/15" />
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-10 animate-pulse rounded-full bg-white/10"
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-[minmax(0,260px),1fr] sm:items-center">
            <h3 className="text-base font-bold leading-snug text-white sm:text-lg">
              {poll.question}
            </h3>

            {hasVoted ? (
              <div className="flex flex-col gap-3">
                {poll.options.map((opt, idx) => {
                  const pct =
                    totalVotes > 0
                      ? Math.round(((opt.votes || 0) / totalVotes) * 100)
                      : 0;
                  const color = RESULT_BAR_COLORS[idx % RESULT_BAR_COLORS.length];
                  const isMine = opt.id === poll.my_selection;
                  const isLeading = opt.id === leadingOptionId;
                  return (
                    <div key={opt.id}>
                      <div className="mb-1 flex items-center justify-between text-xs sm:text-sm">
                        <span
                          className={`${
                            isMine ? "font-semibold text-white" : "text-white/90"
                          }`}
                        >
                          {opt.label}
                          {isMine && (
                            <span className="ml-2 text-[10px] uppercase tracking-wide text-[#F2A23A]">
                              Your pick
                            </span>
                          )}
                        </span>
                        <span
                          className={`font-semibold ${
                            isLeading ? "text-[#F2A23A]" : "text-white/85"
                          }`}
                        >
                          {pct}%
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-white/15">
                        <div
                          className="h-full rounded-full transition-[width] duration-500"
                          style={{ width: `${pct}%`, backgroundColor: color }}
                        />
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
                      className={`flex cursor-pointer items-center gap-3 rounded-full border px-4 py-2.5 text-left text-sm font-medium transition disabled:cursor-not-allowed ${
                        isPending
                          ? "border-[#F2A23A] bg-[#F2A23A]/15 text-white opacity-70"
                          : "border-white/20 bg-white/[0.04] text-white hover:border-white/40 hover:bg-white/[0.08]"
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                          isPending ? "border-[#F2A23A]" : "border-white/60"
                        }`}
                      >
                        {isPending && (
                          <span className="h-2 w-2 rounded-full bg-[#F2A23A]" />
                        )}
                      </span>
                      <span className="truncate">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {voteError && (
          <p className="mt-3 text-[11px] text-red-300" role="alert">
            {voteError}
          </p>
        )}
      </div>
    </div>
  );
};

export default FanPollPopup;
