"use client";
import { useState } from "react";

const DEFAULT_OPTION_IMAGE = "/images/stats/player-img.svg";

const POLLS = [
  {
    id: "winner",
    question: "Who will win the T20 Mumbai League Season 5?",
    baseVotes: 9996,
    options: [
      {
        id: "triumph",
        label: "Triumph Knights",
        image: "/images/playerProfile/dhurmil.svg",
      },
      {
        id: "msc",
        label: "Mumbai South Lions",
        image: "/images/playerProfile/prithvi.svg",
      },
      {
        id: "warriors",
        label: "Warriors Central",
        image: "/images/stats/player1.svg",
      },
      {
        id: "warriors",
        label: "Warriors Central",
        image: "/images/stats/player1.svg",
      },
    ],
  },
  {
    id: "scorer",
    question: "Who will be the Top Run Scorer of Season 5?",
    baseVotes: 9996,
    options: [
      {
        id: "chinmay",
        label: "Chinmay Rajesh Sutar",
        image: "/images/stats/player1.svg",
      },
      {
        id: "shashank",
        label: "Shashank Vinayak Attarde",
        image: "/images/stats/player2.svg",
      },
      {
        id: "prithvi",
        label: "Prithvi Shaw",
        image: "/images/playerProfile/prithvi.svg",
      },
      {
        id: "drumil",
        label: "Drumil Matkar",
        image: "/images/playerProfile/dhurmil.svg",
      },
    ],
  },
  {
    id: "bowler",
    question: "Who will be the Best Bowler of the Tournament?",
    baseVotes: 33496,
    options: [
      {
        id: "drumil",
        label: "Drumil Matkar",
        image: "/images/playerProfile/dhurmil.svg",
      },
      {
        id: "prasad",
        label: "Prasad Pawar",
        image: "/images/stats/player1.svg",
      },
      {
        id: "suved",
        label: "Suved Parkar",
        image: "/images/stats/player2.svg",
      },
      {
        id: "ishan",
        label: "Ishan Mulchandani",
        image: "/images/stats/player-img.svg",
      },
    ],
  },
];

const PollCard = ({ poll }) => {
  const [selected, setSelected] = useState(null);

  const totalVotes = poll.baseVotes + (selected ? 1 : 0);

  return (
    <div className="flex h-full flex-col rounded-xl border border-white/30 bg-[#02103D]/80 p-5 backdrop-blur-sm">
      <h3 className="mb-4 text-sm font-semibold leading-tight text-white sm:text-base max-w-56">
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
                  : "border-white/20 bg-white/[0.05] text-white/90 hover:border-white/30 hover:bg-white/[0.08]"
              }`}
              aria-pressed={isSelected}
            >
              <img
                src={opt.image || DEFAULT_OPTION_IMAGE}
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
        <span>{totalVotes.toLocaleString("en-IN")} total votes</span>
        <span className="text-[#F2A23A]">
          {selected ? "Vote recorded" : "Click to vote"}
        </span>
      </div>
    </div>
  );
};

const FanPoll = () => {
  return (
    <div className="">
      <div className="section-width padding-bottom">
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
          {POLLS.map((poll) => (
            <PollCard key={poll.id} poll={poll} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FanPoll;
