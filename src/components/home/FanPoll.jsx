"use client";
import { useCallback, useEffect, useState } from "react";
import { listPolls, votePoll } from "@/app/api/polls";

const DEFAULT_OPTION_IMAGE = "/images/stats/player-img.svg";

const PollCard = ({ poll, onPollUpdate }) => {
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

  return (
    <div className="flex h-full flex-col rounded-xl border border-white/30 bg-[#02103D]/80 p-5 backdrop-blur-sm">
      <h3 className="mb-4 text-sm font-semibold leading-tight text-white sm:text-base max-w-56">
        {poll.question}
      </h3>
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
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-xs font-medium transition sm:text-sm disabled:cursor-not-allowed ${
                isSelected
                  ? "border-[#F2A23A] bg-[#F2A23A]/20 text-white"
                  : "border-white/20 bg-white/[0.05] text-white/90 hover:border-white/30 hover:bg-white/[0.08]"
              } ${isPending ? "opacity-70" : ""}`}
              aria-pressed={isSelected}
            >
              <img
                src={opt.image_url || DEFAULT_OPTION_IMAGE}
                alt={opt.label}
                className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-white/20"
                loading="lazy"
              />
              <span className="truncate">{opt.label}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-between text-[11px] text-white/70 sm:text-xs">
        <span>
          {(poll.total_votes || 0).toLocaleString("en-IN")} total votes
        </span>
        <span className="text-[#F2A23A]">
          {selectedId != null ? "Vote recorded" : "Click to vote"}
        </span>
      </div>
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

const FanPoll = () => {
  const [polls, setPolls] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
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
  }, []);

  const handlePollUpdate = useCallback((updated) => {
    setPolls((curr) =>
      curr ? curr.map((p) => (p.id === updated.id ? updated : p)) : curr
    );
  }, []);

  if (loadError) return null;

  return (
    <div className="relative">
      <div className="section-width pb-14 md:pb-16 lg:pb-20">
        <h2 className="flex flex-row text-3xl gap-2 font-extrabold uppercase italic leading-[0.95] text-[#ffffff] sm:text-4xl lg:text-6xl mb-6">
          <span
            className="text-transparent [-webkit-text-stroke:1.5px_#ffffff]"
            style={{ WebkitTextStroke: "1.5px #ffffff" }}
          >
            FAN
          </span>
          <span>POLL</span>
        </h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {polls === null
            ? [0, 1, 2].map((i) => <SkeletonCard key={i} />)
            : polls.map((poll) => (
                <PollCard
                  key={poll.id}
                  poll={poll}
                  onPollUpdate={handlePollUpdate}
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default FanPoll;
