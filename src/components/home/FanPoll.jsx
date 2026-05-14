"use client";
import { useState } from "react";
import TitleComponent from "../common/TitleComponent";

const POLLS = [
  {
    id: "winner",
    question: "Who will win the T20 Mumbai League Season 5?",
    baseVotes: 9996,
    options: [
      { id: "triumph", label: "Triumph Knights" },
      { id: "msc", label: "Mumbai South Lions" },
      { id: "warriors", label: "Warriors Central" },
    ],
  },
  {
    id: "scorer",
    question: "Who will be the Top Run Scorer of Season 5?",
    baseVotes: 9996,
    options: [
      { id: "chinmay", label: "Chinmay Rajesh Sutar" },
      { id: "shashank", label: "Shashank Vinayak Attarde" },
      { id: "prithvi", label: "Prithvi Shaw" },
      { id: "drumil", label: "Drumil Matkar" },
    ],
  },
  {
    id: "bowler",
    question: "Who will be the Best Bowler of the Tournament?",
    baseVotes: 33496,
    options: [
      { id: "drumil", label: "Drumil Matkar" },
      { id: "prasad", label: "Prasad Pawar" },
      { id: "suved", label: "Suved Parkar" },
      { id: "ishan", label: "Ishan Mulchandani" },
    ],
  },
];

const PollCard = ({ poll }) => {
  const [selected, setSelected] = useState(null);

  const totalVotes = poll.baseVotes + (selected ? 1 : 0);

  return (
    <div className="flex h-full flex-col rounded-xl border border-white/15 bg-[#02103D]/80 p-5 backdrop-blur-sm">
      <h3 className="mb-4 text-sm font-semibold leading-tight text-white sm:text-base">
        {poll.question}
      </h3>
      <div className="flex flex-1 flex-col gap-2.5">
        {poll.options.map((opt) => {
          const isSelected = selected === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelected(opt.id)}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-xs font-medium transition sm:text-sm ${
                isSelected
                  ? "border-[#F2A23A] bg-[#F2A23A]/20 text-white"
                  : "border-white/10 bg-white/[0.04] text-white/90 hover:border-white/30 hover:bg-white/[0.08]"
              }`}
              aria-pressed={isSelected}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                  isSelected ? "border-[#F2A23A]" : "border-white/50"
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
      <div className="mt-4 flex items-center justify-between text-[11px] text-white/70 sm:text-xs">
        <span>
          {totalVotes.toLocaleString("en-IN")} total votes
        </span>
        <span className="text-[#F2A23A]">
          {selected ? "Vote recorded" : "Click an option to vote"}
        </span>
      </div>
    </div>
  );
};

const FanPoll = () => {
  return (
    <div className="bg-[#010A33]">
      <div className="section-width section-padding">
        <TitleComponent title="Fan Poll" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {POLLS.map((poll) => (
            <PollCard key={poll.id} poll={poll} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FanPoll;
