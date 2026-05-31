"use client";

import { useState } from "react";
import FanPoll from "@/components/home/FanPoll";
import MatchFanPollSection from "@/components/fan-poll/MatchFanPollSection";
import Sponsorship from "@/components/common/Sponsorship";

const TABS = [
  { id: "active", label: "Fan Poll" },
  { id: "history", label: "History" },
];

export default function FanPollPage() {
  const [tab, setTab] = useState("active");

  const filter =
    tab === "history" ? (p) => p.status === "closed" : (p) => p.status === "active";
  const variant = tab === "history" ? "results" : "compact";

  const headerSlot = (
    <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:mb-10 sm:flex-row sm:items-end">
      <h1 className="flex flex-col text-4xl font-extrabold uppercase italic leading-[0.9] text-white sm:text-5xl lg:text-6xl">
        <span
          className="text-transparent"
          style={{ WebkitTextStroke: "1.5px #7E93DB" }}
        >
          Fan
        </span>
        <span>Poll</span>
      </h1>

      <div
        role="tablist"
        aria-label="Fan poll view"
        className="relative inline-grid grid-cols-2 rounded-full bg-white/10 p-1 ring-1 ring-white/15 backdrop-blur-sm"
      >
        <span
          aria-hidden
          className={`pointer-events-none absolute top-1 left-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-full bg-[#F68323] shadow-[0_4px_14px_rgba(246,131,35,0.4)] transition-transform duration-300 ease-out ${
            tab === "active" ? "translate-x-0" : "translate-x-full"
          }`}
        />
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`relative z-10 px-6 py-1.5 text-xs font-extrabold italic uppercase tracking-wide transition-colors duration-300 sm:text-sm ${
              tab === t.id ? "text-white" : "text-white/75 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full bg-[#1E2F7D]">
      <section className="relative overflow-hidden pt-[80px] pb-14 lg:pt-[90px] lg:pb-20 bg-[url('/images/texture-bg.png')] bg-cover bg-center bg-no-repeat">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,88,210,0.35),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(26,40,116,0.65),transparent_45%)]" />
        <div className="relative">
          <div className="section-width pb-4">
            <MatchFanPollSection />
          </div>
          <FanPoll
            headerSlot={headerSlot}
            variant={variant}
            gridClassName="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
            skeletonCount={8}
            filter={filter}
          />
        </div>
      </section>
      <Sponsorship />
    </div>
  );
}
