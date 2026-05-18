"use client";
import { useEffect, useState } from "react";

const DEFAULT_POLL = {
  question: "Who will be the Best Bowler of the Tournament?",
  options: [
    { id: "drumil", label: "Drumil Matkar" },
    { id: "prasad", label: "Prasad Pawar" },
    { id: "suved", label: "Suved Parkar" },
    { id: "ishan", label: "Ishan Mulchandani" },
  ],
};

const formatCountdown = (seconds) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const FanPollPopup = ({ open, onClose, poll = DEFAULT_POLL, initialSeconds = 3320 }) => {
  const [selected, setSelected] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (!open) return undefined;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-2xl border border-white/15 bg-[#1f2c70] p-5 sm:p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={poll.question}
      >
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#1A2C76]">
            Todays Fanpoll
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#F2A23A]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5"
              aria-hidden
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {formatCountdown(secondsLeft)}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close poll"
            className="ml-auto rounded-full p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
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

        <div className="grid gap-5 sm:grid-cols-[minmax(0,260px),1fr] sm:items-center">
          <h3 className="text-base font-bold leading-snug text-white sm:text-lg">
            {poll.question}
          </h3>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {poll.options.map((opt) => {
              const isSelected = selected === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelected(opt.id)}
                  className={`flex items-center gap-3 rounded-full border px-4 py-2.5 text-left text-sm font-medium transition ${
                    isSelected
                      ? "border-[#F2A23A] bg-[#F2A23A]/15 text-white"
                      : "border-white/20 bg-white/[0.04] text-white hover:border-white/40 hover:bg-white/[0.08]"
                  }`}
                  aria-pressed={isSelected}
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                      isSelected ? "border-[#F2A23A]" : "border-white/60"
                    }`}
                  >
                    {isSelected && (
                      <span className="h-2 w-2 rounded-full bg-[#F2A23A]" />
                    )}
                  </span>
                  <span className="truncate">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FanPollPopup;
