"use client";
import { useEffect, useState } from "react";
import { votePoll } from "@/app/api/polls";
import { trackEvent } from "@/utilis/mixpanelClient";
import { useAuth } from "@/components/auth/AuthContext";
import { usePollsContext } from "@/components/polls/PollsProvider";

function Toast({ message, onDone }) {
  useEffect(() => {
    const id = setTimeout(onDone, 3500);
    return () => clearTimeout(id);
  }, [onDone]);
  return (
    <>
      <style>{`@keyframes toastSlideUp{from{opacity:0;transform:translate(-50%,12px)}to{opacity:1;transform:translate(-50%,0)}}`}</style>
      <div
        role="alert"
        className="fixed bottom-6 left-1/2 z-[9999] -translate-x-1/2 rounded-xl border border-white/15 bg-[#0E1A47] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        style={{ whiteSpace: "nowrap", animation: "toastSlideUp 0.25s ease" }}
      >
        {message}
      </div>
    </>
  );
}

const formatCountdown = (ms) => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60).toString().padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
};

const PollTimer = ({ endsAt }) => {
  const [remainingMs, setRemainingMs] = useState(() =>
    Math.max(0, new Date(endsAt).getTime() - Date.now())
  );

  useEffect(() => {
    const tick = () => {
      const ms = new Date(endsAt).getTime() - Date.now();
      setRemainingMs(ms > 0 ? ms : 0);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [endsAt]);

  return (
    <span
      className={`inline-flex w-fit items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold tabular-nums ${
        remainingMs > 0
          ? "border-[#F2A23A]/40 bg-[#F2A23A]/10 text-[#F2A23A]"
          : "border-white/15 bg-white/5 text-white/50"
      }`}
      aria-live="polite"
      title={remainingMs > 0 ? "Time left to vote" : "Voting closed"}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-2.5 w-2.5" aria-hidden>
        <circle cx="12" cy="13" r="8" />
        <path d="M12 9v4l2.5 2" />
        <path d="M9 2h6" />
      </svg>
      {remainingMs > 0 ? formatCountdown(remainingMs) : "Closed"}
    </span>
  );
};

const CheckIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const PollCard = ({ poll, onPollUpdate, onPollClosed, variant = "compact" }) => {
  const [error, setError] = useState(null);
  const [pendingOptionId, setPendingOptionId] = useState(null);
  const { isAuthed, openLogin } = useAuth();

  const selectedId = poll.my_selection;

  const submitVote = async (optionId) => {
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

      const chosenOption = poll.options.find((o) => o.id === optionId);
      trackEvent("Fan Poll Voted", {
        poll_slug: poll.slug,
        poll_question: poll.question,
        option_id: optionId,
        option_label: chosenOption?.label,
        is_change: selectedId != null,
      });
    } catch (err) {
      onPollUpdate(prevPoll);
      const status = err?.response?.status;
      const code = err?.response?.data?.error || err?.response?.data?.code;
      if (code === "poll_closed") {
        onPollClosed?.("This poll has closed. Refreshing…");
      } else {
        let msg = "Something went wrong. Please try again.";
        if (status === 429 || code === "rate_limited")
          msg = "Too many votes. Please slow down and try again in a minute.";
        else if (code === "invalid_option") msg = "That option is no longer available.";
        setError(msg);
      }
    } finally {
      setPendingOptionId(null);
    }
  };

  const handleVote = (optionId) => {
    if (pendingOptionId !== null) return;
    if (optionId === selectedId) return;
    if (!isAuthed) {
      openLogin(() => submitVote(optionId));
      return;
    }
    submitVote(optionId);
  };

  const hasVoted = selectedId != null;
  const totalVotes = poll.total_votes || 0;
  const showResults = hasVoted || variant === "results";
  const maxVotes = Math.max(0, ...poll.options.map((o) => o.votes || 0));

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0E1A47] via-[#0C1845] to-[#091236] p-5 shadow-[0_10px_30px_rgba(2,8,30,0.35)] transition-shadow hover:shadow-[0_14px_36px_rgba(2,8,30,0.5)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#F68323]/[0.08] blur-3xl"
      />

      <div className="mb-5 flex flex-col gap-1.5">
        {poll.ends_at && poll.status !== "closed" && new Date(poll.ends_at).getTime() > Date.now() && (
          <div>
            <PollTimer endsAt={poll.ends_at} />
          </div>
        )}
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="mt-1 h-5 w-1 shrink-0 rounded-full bg-gradient-to-b from-[#F68323] to-[#F2A23A]"
          />
          <h3 className="text-sm font-bold leading-snug text-white sm:text-[15px]">
            {poll.question}
          </h3>
        </div>
      </div>

      {showResults ? (
        <div className="flex flex-1 flex-col gap-3.5">
          {poll.options.map((opt) => {
            const pct =
              totalVotes > 0 ? Math.round(((opt.votes || 0) / totalVotes) * 100) : 0;
            const isMine = opt.id === selectedId;
            const isLeader = maxVotes > 0 && (opt.votes || 0) === maxVotes;
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
        <>
          {/* Mobile: 2-column vertical avatar cards */}
          <div className="grid flex-1 grid-cols-2 gap-2 sm:hidden">
            {poll.options.map((opt) => {
              const isSelected = selectedId === opt.id;
              const isPending = pendingOptionId === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleVote(opt.id)}
                  disabled={pendingOptionId !== null}
                  className={`group/opt flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border px-2 py-3 text-center transition-all disabled:cursor-not-allowed ${
                    isSelected
                      ? "border-[#F2A23A] bg-[#F2A23A]/15 ring-2 ring-[#F2A23A]/40"
                      : "border-white/10 bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.07]"
                  } ${isPending ? "opacity-70" : ""}`}
                  aria-pressed={isSelected}
                >
                  <div className="relative">
                    {opt.image_url && (
                      <img
                        src={opt.image_url}
                        alt=""
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-white/15"
                        loading="lazy"
                      />
                    )}
                    {isSelected && (
                      <span className="absolute -right-0.5 -bottom-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#F2A23A] text-white shadow-md">
                        <CheckIcon />
                      </span>
                    )}
                  </div>
                  <span className="line-clamp-2 text-[11px] font-semibold leading-tight text-white/90">
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tablet/Desktop: original pill list */}
          <div className="hidden flex-1 flex-col gap-2.5 sm:flex">
            {poll.options.map((opt) => {
              const isSelected = selectedId === opt.id;
              const isPending = pendingOptionId === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleVote(opt.id)}
                  disabled={pendingOptionId !== null}
                  className={`group/opt flex cursor-pointer items-center gap-3 rounded-full border px-3 py-2 text-left text-xs font-medium transition-all sm:text-sm disabled:cursor-not-allowed ${
                    isSelected
                      ? "border-[#F2A23A] bg-[#F2A23A]/15 text-white"
                      : "border-white/15 bg-white/[0.04] text-white/90 hover:border-white/30 hover:bg-white/[0.08] hover:-translate-y-px"
                  } ${isPending ? "opacity-70" : ""}`}
                  aria-pressed={isSelected}
                >
                  {opt.image_url && (
                    <img
                      src={opt.image_url}
                      alt=""
                      className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-white/15"
                      loading="lazy"
                    />
                  )}
                  <span className="flex-1 truncate">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3 text-[11px] sm:text-xs">
        <span className="text-white/55">
          {totalVotes.toLocaleString("en-IN")} {totalVotes === 1 ? "vote" : "votes"}
        </span>
        {hasVoted ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F68323]/15 px-2.5 py-1 font-bold uppercase tracking-wide text-[#F2A23A]">
            <CheckIcon />
            Voted
          </span>
        ) : (
          <span className="font-semibold text-[#F2A23A]">Tap an option</span>
        )}
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
    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-[#0E1A47] via-[#0C1845] to-[#091236] p-5">
      <div className="mb-5 flex items-start gap-3">
        <span className="mt-1 h-5 w-1 shrink-0 rounded-full bg-white/10" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-4/5 animate-pulse rounded bg-white/12" />
          <div className="h-3.5 w-2/5 animate-pulse rounded bg-white/12" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3">
        {widths.map((w, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 shrink-0 animate-pulse rounded-full bg-white/15" />
              <div className={`h-3 animate-pulse rounded bg-white/12 ${w}`} />
            </div>
            <div className="h-2 w-full animate-pulse rounded-full bg-white/[0.08]" />
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3">
        <div className="h-3 w-1/3 animate-pulse rounded bg-white/12" />
        <div className="h-5 w-16 animate-pulse rounded-full bg-[#F2A23A]/25" />
      </div>
    </div>
  );
};

const DEFAULT_GRID_CLASS =
  "-mr-4 flex snap-x snap-mandatory gap-5 overflow-x-auto pl-1 pr-4 pb-4 md:mr-0 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:pl-0 md:pr-0 md:pb-0 lg:grid-cols-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

const DEFAULT_CARD_WRAPPER_CLASS =
  "w-[85%] shrink-0 snap-start md:w-auto md:shrink";

const FanPoll = ({
  headerSlot,
  variant = "compact",
  gridClassName = DEFAULT_GRID_CLASS,
  skeletonCount = 3,
  filter,
  showDefaultHeading = true,
}) => {
  const usingDefaultGrid = gridClassName === DEFAULT_GRID_CLASS;
  const cardWrapperClass = usingDefaultGrid ? DEFAULT_CARD_WRAPPER_CLASS : "min-w-0";
  const { polls, loadError, refetch, updatePoll } = usePollsContext();
  const [toast, setToast] = useState(null);

  const handlePollClosed = (msg) => {
    setToast(msg);
    refetch(false);
  };


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
          onClick={refetch}
          className="rounded-full border border-white/30 bg-white/10 px-5 py-2 text-xs font-semibold text-white transition hover:bg-white/15"
        >
          Retry
        </button>
      </div>
    );
  } else if (visiblePolls === null) {
    body = Array.from({ length: skeletonCount }).map((_, i) => (
      <div key={i} className={cardWrapperClass}>
        <SkeletonCard />
      </div>
    ));
  } else if (visiblePolls.length === 0) {
    const isHistory = variant === "results";
    body = (
      <div className="col-span-full flex flex-col items-center gap-4 py-16 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-white/15" aria-hidden>
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
        <div>
          <p className="text-base font-bold text-white/50">
            {isHistory ? "No closed polls yet" : "No active polls right now"}
          </p>
          <p className="mt-1 text-sm text-white/30">
            {isHistory ? "Closed polls will appear here once a poll ends." : "Check back soon for the next fan poll!"}
          </p>
        </div>
      </div>
    );
  } else {
    body = visiblePolls.map((poll) => (
      <div key={poll.id} className={cardWrapperClass}>
        <PollCard
          poll={poll}
          onPollUpdate={updatePoll}
          onPollClosed={handlePollClosed}
          variant={variant}
        />
      </div>
    ));
  }

  return (
    <div className="relative">
      {toast ? <Toast message={toast} onDone={() => setToast(null)} /> : null}
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
