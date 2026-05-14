"use client";
import { useState } from "react";

const DEFAULT_POLL = {
  question: "Who will be the Best Bowler of the Tournament?",
  options: [
    { id: "drumil", label: "Drumil Matkar" },
    { id: "prasad", label: "Prasad Pawar" },
    { id: "suved", label: "Suved Parkar" },
    { id: "ishan", label: "Ishan Mulchandani" },
  ],
};

const HeroPoll = ({ poll = DEFAULT_POLL }) => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="pointer-events-auto w-full max-w-xs rounded-xl border border-white/15 bg-[#02103D]/90 p-4 shadow-2xl backdrop-blur-md sm:max-w-sm">
      <h4 className="mb-3 text-xs font-semibold leading-snug text-white sm:text-sm">
        {poll.question}
      </h4>
      <div className="flex flex-col gap-2">
        {poll.options.map((opt) => {
          const isSelected = selected === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelected(opt.id);
              }}
              className={`flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-left text-[11px] font-medium transition sm:text-xs ${
                isSelected
                  ? "border-[#F2A23A] bg-[#F2A23A]/20 text-white"
                  : "border-white/15 bg-white/[0.04] text-white/90 hover:bg-white/[0.1]"
              }`}
              aria-pressed={isSelected}
            >
              <span
                className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-2 ${
                  isSelected ? "border-[#F2A23A]" : "border-white/50"
                }`}
              >
                {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-[#F2A23A]" />}
              </span>
              <span className="truncate">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HeroPoll;
