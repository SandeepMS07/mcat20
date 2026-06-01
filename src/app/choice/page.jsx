"use client";

import Link from "next/link";
import { FaStar, FaTrophy, FaUserShield, FaBaseballBall } from "react-icons/fa";
import { GiCricketBat } from "react-icons/gi";
import Sponsorship from "@/components/common/Sponsorship";
import { CHOICE_CATEGORIES } from "./categories";

const CATEGORY_ICONS = {
  "player-of-tournament-men": { Icon: FaTrophy, color: "#FFD166" },
  "best-batter-men": { Icon: GiCricketBat, color: "#ffffff" },
  "best-bowler-men": { Icon: FaBaseballBall, color: "#ff5252" },
  "best-emerging-player-men": { Icon: FaStar, color: "#FFD166" },
  "best-development-player-men": { Icon: FaUserShield, color: "#4FD1FF" },
  "player-of-tournament-women": { Icon: FaTrophy, color: "#ff69b4" },
  "best-batter-women": { Icon: GiCricketBat, color: "#7CFFB2" },
  "best-bowler-women": { Icon: FaBaseballBall, color: "#ff69b4" },
};

const glowPositionClass = {
  "top-right": "-top-3 -right-3",
  "top-left": "-top-3 -left-3",
  "bottom-right": "-bottom-3 -right-3",
  "bottom-left": "-bottom-3 -left-3",
  "right-mid": "top-1/2 -right-6 -translate-y-1/2",
};

const ChoiceCard = ({ category }) => {
  const { slug, title, glow } = category;
  const { Icon, color: iconColor } = CATEGORY_ICONS[slug] || {
    Icon: FaStar,
    color: "#fff",
  };
  return (
    <div className="relative flex flex-col items-center justify-between overflow-hidden rounded-3xl border border-white/10 p-7 shadow-[inset_0_0_14px_1px_rgba(255,255,255,0.1)] h-full min-h-[220px]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-3xl"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(16,40,104,0.8) 0%, rgba(10,25,68,0.9) 100%)",
        }}
      />
      <span
        aria-hidden
        className={`pointer-events-none absolute rounded-full blur-2xl ${
          glowPositionClass[glow.placement]
        }`}
        style={{
          backgroundColor: glow.color,
          opacity: glow.opacity,
          width: glow.size,
          height: glow.size,
        }}
      />
      <div className="relative z-10 pt-3">
        <Icon size={36} color={iconColor} />
      </div>
      <h3 className="relative z-10 mt-4 text-center text-lg font-bold uppercase tracking-wider text-white sm:text-xl">
        {title.map((line, i) => (
          <span key={i} className="block leading-7">
            {line}
          </span>
        ))}
      </h3>
      <Link
        href={`/choice/${slug}`}
        className="relative z-10 mt-6 flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#f97316] to-[#ef4444] px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white shadow-[0_14px_20px_-4px_rgba(0,0,0,0.1),0_5.5px_8px_-5.5px_rgba(0,0,0,0.1)] transition hover:brightness-110"
      >
        Vote Now
      </Link>
    </div>
  );
};

export default function ChoicePage() {
  return (
    <div>
      <div className="relative bg-[#192a66] pt-[120px] lg:pt-[160px] pb-16 md:pb-24 overflow-hidden bg-[url('/images/texture-bg.png')] bg-cover bg-center bg-no-repeat">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-gradient-to-b from-[rgba(13,55,169,0.44)] to-[rgba(13,55,169,0)]"
        />

        <div className="section-width section-padding relative">
          {/* Heading row */}
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <h1 className="flex gap-2 text-4xl font-extrabold italic uppercase leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
              <span
                className="block text-transparent"
                style={{ WebkitTextStroke: "1.5px #ffffff" }}
              >
                VIEWERS
              </span>
              <span className="block text-white">CHOICE</span>
            </h1>
          </div>

          {/* Cards grid: 3 cols on lg, 2 on md, 1 on mobile */}
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 items-stretch">
            {CHOICE_CATEGORIES.map((category) => (
              <ChoiceCard key={category.slug} category={category} />
            ))}
          </div>
        </div>
      </div>

      <Sponsorship />
    </div>
  );
}
