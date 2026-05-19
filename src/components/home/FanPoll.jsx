"use client";
import { useCallback, useEffect, useState } from "react";
import { listPolls, votePoll } from "@/app/api/polls";

const DEFAULT_OPTION_IMAGE = "/images/stats/player-img.svg";

const RESULT_BAR_COLORS = [
  "#3B82F6", // blue
  "#F58220", // orange
  "#F2C94C", // yellow
  "#9CA3AF", // grey
  "#34D399", // green
  "#A78BFA", // purple
];

const PollCard = ({ poll, onPollUpdate, variant = "compact" }) => {
  const [error, setError] = useState(null);
  const [pendingOptionId, setPendingOptionId] = useState(null);

  const selectedId = poll.my_selection;

  const handleVote = async (optionId) => {
    if (pendingOptionId !== null) return;
    if (optionId === selectedId) return;

    const prevPoll = poll;
    const optimistic = {
      ...poll,
      my_selection: optionId,
      total_votes:
        poll.total_votes + (selectedId == null ? 1 : 0),
      options: poll.options.map((opt) => {
        if (opt.id === optionId) return { ...opt, votes: opt.votes + 1 };
        if (opt.id === selectedId && selectedId != null)
          return { ...opt, votes: Math.max(0, opt.votes - 1) };
        return opt;
      }),
    };

    setError(null);
    setPendingOptionId(optionId);
    onPollUpdate(optimistic);

    try {
      const res = await votePoll(poll.slug, optionId);
      if (res && res.poll) onPollUpdate(res.poll);
    } catch (err) {
      onPollUpdate(prevPoll);
      const status = err?.response?.status;
      const code = err?.response?.data?.error || err?.response?.data?.code;
      let msg = "Something went wrong. Please try again.";
      if (status === 429 || code === "rate_limited")
        msg = "Too many votes. Please slow down and try again in a minute.";
      else if (code === "poll_closed") msg = "This poll is no longer accepting votes.";
      else if (code === "invalid_option") msg = "That option is no longer available.";
      setError(msg);
    } finally {
      setPendingOptionId(null);
    }
  };

  const hasVoted = selectedId != null;
  const totalVotes = poll.total_votes || 0;

  return (
    <div className="flex h-full flex-col rounded-xl border border-white/30 bg-[#02103D]/80 p-5 backdrop-blur-sm">
      <h3 className="mb-4 text-sm font-semibold leading-tight text-white sm:text-base">
        {poll.question}
      </h3>

      {hasVoted ? (
        <div className="flex flex-1 flex-col gap-2.5">
          {poll.options.map((opt, idx) => {
            const pct =
              totalVotes > 0 ? Math.round(((opt.votes || 0) / totalVotes) * 100) : 0;
            const color = RESULT_BAR_COLORS[idx % RESULT_BAR_COLORS.length];
            const isMine = opt.id === selectedId;
            return (
              <div key={opt.id} className="leading-tight">
                <p className="mb-1 text-[13px] font-medium text-white/95">
                  {opt.label}
                </p>
                <div className="relative h-5 w-full rounded-full bg-white/10 px-2">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-500"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                  />
                  <span
                    className={`absolute inset-0 flex items-center justify-center text-[11px] font-semibold ${
                      isMine ? "text-[#F2A23A]" : "text-white"
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
        <div className="flex flex-1 flex-col gap-2.5">
          {poll.options.map((opt) => {
            const isSelected = selectedId === opt.id;
            const isPending = pendingOptionId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleVote(opt.id)}
                disabled={pendingOptionId !== null}
                className={`flex cursor-pointer items-center gap-3 rounded-full border px-4 py-2 text-left text-xs font-medium transition sm:text-sm disabled:cursor-not-allowed ${
                  isSelected
                    ? "border-[#F2A23A] bg-[#F2A23A]/20 text-white"
                    : "border-white/20 bg-white/[0.05] text-white/90 hover:border-white/30 hover:bg-white/[0.08]"
                } ${isPending ? "opacity-70" : ""}`}
                aria-pressed={isSelected}
              >
                {variant === "compact" && (
                  <img
                    src={opt.image_url || DEFAULT_OPTION_IMAGE}
                    alt={opt.label}
                    className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-white/20"
                    loading="lazy"
                  />
                )}
                <span className="flex-1 truncate text-center">{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {variant === "compact" && (
        <div className="mt-4 flex items-center justify-between text-[11px] text-white/70 sm:text-xs">
          <span>{totalVotes.toLocaleString("en-IN")} total votes</span>
          <span className="text-[#F2A23A]">
            {hasVoted ? "Vote recorded" : "Click to vote"}
          </span>
        </div>
      )}
      {error && (
        <p className="mt-2 text-[11px] text-red-300" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

const SkeletonCard = () => {
  const widths = ["w-1/2", "w-2/3", "w-5/12", "w-3/5"];
  return (
    <div className="flex h-full flex-col rounded-xl border border-white/30 bg-[#02103D]/80 p-5 backdrop-blur-sm">
      <div className="mb-1 h-4 w-4/5 animate-pulse rounded bg-white/15" />
      <div className="mb-4 h-4 w-2/5 animate-pulse rounded bg-white/15" />
      <div className="flex flex-1 flex-col gap-2.5">
        {widths.map((w, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-lg border border-white/20 bg-white/[0.06] px-3 py-2.5"
          >
            <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-white/20" />
            <div className={`h-3 animate-pulse rounded bg-white/15 ${w}`} />
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="h-3 w-1/3 animate-pulse rounded bg-white/15" />
        <div className="h-3 w-1/5 animate-pulse rounded bg-[#F2A23A]/40" />
      </div>
    </div>
  );
};

const FanPoll = ({
  headerSlot,
  variant = "compact",
  gridClassName = "grid gap-5 md:grid-cols-2 lg:grid-cols-3",
  skeletonCount = 3,
  filter,
  showDefaultHeading = true,
}) => {
  const [polls, setPolls] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoadError(false);
    setPolls(null);
    listPolls()
      .then((data) => {
        if (cancelled) return;
        setPolls(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("[FanPoll] failed to load polls:", err);
        setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const handlePollUpdate = useCallback((updated) => {
    setPolls((curr) =>
      curr ? curr.map((p) => (p.id === updated.id ? updated : p)) : curr
    );
  }, []);

  // On the home page (no headerSlot), keep prior behavior: hide silently on error.
  if (loadError && !headerSlot) return null;

  const visiblePolls = polls && filter ? polls.filter(filter) : polls;

  let body;
  if (loadError) {
    body = (
      <div className="col-span-full flex flex-col items-center gap-3 py-6">
        <p className="text-center text-sm italic text-white/70">
          Could not load polls right now.
        </p>
        <button
          type="button"
          onClick={() => setReloadKey((k) => k + 1)}
          className="rounded-full border border-white/30 bg-white/10 px-5 py-2 text-xs font-semibold text-white transition hover:bg-white/15"
        >
          Retry
        </button>
      </div>
    );
  } else if (visiblePolls === null) {
    body = Array.from({ length: skeletonCount }).map((_, i) => (
      <SkeletonCard key={i} />
    ));
  } else if (visiblePolls.length === 0) {
    body = (
      <p className="col-span-full text-center text-sm italic text-white/70">
        No polls to show.
      </p>
    );
  } else {
    body = visiblePolls.map((poll) => (
      <PollCard
        key={poll.id}
        poll={poll}
        onPollUpdate={handlePollUpdate}
        variant={variant}
      />
    ));
  }

  return (
    <div className="relative">
      <div className="section-width pt-14 pb-14 md:pt-16 md:pb-16 lg:pt-20 lg:pb-20">
        {headerSlot
          ? headerSlot
          : showDefaultHeading && (
              <h2 className="flex flex-row text-3xl gap-2 font-extrabold uppercase italic leading-[0.95] text-[#ffffff] sm:text-4xl lg:text-6xl mb-6">
                <span
                  className="text-transparent [-webkit-text-stroke:1.5px_#ffffff]"
                  style={{ WebkitTextStroke: "1.5px #ffffff" }}
                >
                  FAN
                </span>
                <span>POLL</span>
              </h2>
            )}
        <div className={gridClassName}>{body}</div>
      </div>
    </div>
  );
};

export default FanPoll;
