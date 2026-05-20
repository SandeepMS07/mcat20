"use client";

import Link from "next/link";
import { FaStar, FaTrophy, FaUserShield, FaBaseballBall } from "react-icons/fa";
import { GiCricketBat, GiBaseballGlove } from "react-icons/gi";
import Sponsorship from "@/components/common/Sponsorship";
import { CHOICE_CATEGORIES } from "./categories";

const CATEGORY_ICONS = {
  "emerging-player": {
    Icon: FaStar,
    color: "#FFD166",
    ring: "rgba(255,209,102,0.35)",
  },
  "best-batsman": {
    Icon: GiCricketBat,
    color: "#ffffff",
    ring: "rgba(255,255,255,0.35)",
  },
  "best-captain": {
    Icon: FaUserShield,
    color: "#4FD1FF",
    ring: "rgba(79,209,255,0.35)",
  },
  "best-bowler": {
    Icon: FaBaseballBall,
    color: "#FF7A7A",
    ring: "rgba(255,122,122,0.35)",
  },
  "best-wicketkeeper": {
    Icon: GiBaseballGlove,
    color: "#7CFFB2",
    ring: "rgba(124,255,178,0.35)",
  },
  "most-valuable-player": {
    Icon: FaTrophy,
    color: "#FFD166",
    ring: "rgba(255,209,102,0.4)",
  },
};

const ChoiceCard = ({ category, index }) => {
  const { slug, title } = category;
  const { Icon, color: iconColor, ring } = CATEGORY_ICONS[slug] || {
    Icon: FaStar,
    color: "#fff",
    ring: "rgba(255,255,255,0.3)",
  };
  return (
    <Link
      href={`/choice/${slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#1A2C7A] via-[#142366] to-[#0B1545] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_18px_44px_-12px_rgba(0,0,0,0.6)]"
    >
      {/* Category number watermark */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-2 -top-4 text-[88px] font-black italic leading-none text-white/[0.04]"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Decorative ring glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ backgroundColor: ring }}
      />

      {/* Icon + accent line */}
      <div className="relative z-10 flex items-center justify-between">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110"
          style={{
            backgroundImage: `linear-gradient(135deg, ${ring} 0%, rgba(255,255,255,0.02) 100%)`,
          }}
        >
          <Icon size={26} color={iconColor} />
        </div>
        <span
          aria-hidden
          className="h-[3px] w-10 rounded-full bg-gradient-to-r from-[#f68323] to-[#d84800]"
        />
      </div>

      <h3 className="relative z-10 mt-6 text-base font-extrabold uppercase italic leading-tight tracking-tight text-white sm:text-lg">
        {title.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </h3>

      <p className="relative z-10 mt-1 text-[11px] font-medium uppercase tracking-[0.15em] text-white/50">
        Category {String(index + 1).padStart(2, "0")}
      </p>

      <div className="relative z-10 mt-auto flex items-center justify-between pt-6">
        <span className="text-xs font-bold uppercase tracking-wider text-white/85 group-hover:text-[#F8A24A]">
          Vote Now
        </span>
        <span
          aria-hidden
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-[#d84800] to-[#f68323] text-white shadow-[0_4px_14px_rgba(216,72,0,0.45)] transition-transform duration-300 group-hover:translate-x-1"
        >
          →
        </span>
      </div>
    </Link>
  );
};

export default function ChoicePage() {
  return (
    <div className="w-full bg-[#1E2F7D]">
      <section className="relative overflow-hidden pt-[100px] pb-16 lg:pt-[130px] md:pb-24 bg-[url('/images/texture-bg.png')] bg-cover bg-center bg-no-repeat">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,88,210,0.35),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(26,40,116,0.65),transparent_45%)]" />

        <div className="section-width section-padding relative">
          {/* Heading row */}
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-end">
            <h1 className="flex flex-col text-4xl font-extrabold uppercase italic leading-[0.9] text-white sm:text-5xl lg:text-6xl">
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "1.5px #7E93DB" }}
              >
                Viewers
              </span>
              <span>Choice</span>
            </h1>
            <p className="hidden text-sm font-medium uppercase tracking-[0.18em] text-[#FFE150]/80 sm:block">
              Cast your vote
            </p>
          </div>

          {/* Cards grid: 3 cols on lg, 2 on md, 1 on mobile */}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 max-w-5xl mx-auto">
            {CHOICE_CATEGORIES.map((category, index) => (
              <ChoiceCard
                key={category.slug}
                category={category}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      <Sponsorship />
    </div>
  );
}
