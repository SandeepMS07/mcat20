"use client";

import { useState } from "react";
import FanPoll from "@/components/home/FanPoll";
import Sponsorship from "@/components/common/Sponsorship";

const TABS = [
  { id: "active", label: "Fan Poll" },
  { id: "history", label: "History" },
];

export default function FanPollPage() {
  const [tab, setTab] = useState("active");

  const filter = tab === "history" ? (p) => p.my_selection != null : undefined;
  const variant = "results";

  const headerSlot = (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <h1 className="flex flex-row gap-2 text-3xl font-extrabold uppercase italic leading-[0.95] text-white sm:text-4xl lg:text-6xl">
        <span
          className="text-transparent"
          style={{ WebkitTextStroke: "1.5px #ffffff" }}
        >
          FAN
        </span>
        <span>POLL</span>
      </h1>

      <div
        role="tablist"
        aria-label="Fan poll view"
        className="relative inline-grid grid-cols-2 rounded-full bg-white/10 p-1"
      >
        <span
          aria-hidden
          className={`pointer-events-none absolute top-1 left-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-full bg-white shadow-md transition-transform duration-300 ease-out ${
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
              tab === t.id ? "text-[#162362]" : "text-white hover:text-white/90"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div className="relative bg-[#101b52] pt-[140px] lg:pt-[180px] overflow-hidden">
        <FanPoll
          headerSlot={headerSlot}
          variant={variant}
          gridClassName="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          skeletonCount={8}
          filter={filter}
        />
      </div>
      <Sponsorship />
    </div>
  );
}
