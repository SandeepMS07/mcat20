"use client";

import Image from "next/image";
import Link from "next/link";

const FantasyPage = () => {
  return (
    <main className="relative flex min-h-[calc(100vh-120px)] w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#060A17] via-[#0E1A47] to-[#192A66] px-6 pt-[140px] pb-20 sm:pt-[160px] lg:pt-[180px]">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full bg-[#F2A23A]/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-[#1C398E]/40 blur-3xl"
      />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
        <span className="mb-4 inline-block rounded-full border border-[#F2A23A]/40 bg-[#F2A23A]/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F2A23A]">
          Fantasy
        </span>

        <h1 className="text-4xl font-extrabold uppercase italic leading-[0.95] text-white sm:text-5xl lg:text-7xl">
          <span
            className="block text-transparent"
            style={{ WebkitTextStroke: "1.5px #ffffff" }}
          >
            Coming
          </span>
          <span className="block">Soon</span>
        </h1>

        <p className="mt-6 max-w-xl text-sm text-white/80 sm:text-base lg:text-lg">
          We&apos;re building something special. Pick your dream XI, take on
          friends, and play the T20 Mumbai season alongside the action.
          Fantasy launches with Season 4 — stay tuned.
        </p>

        <Link
          href="/"
          className="mt-10 inline-flex items-center justify-center rounded-full bg-gradient-to-b from-[#d84800] to-[#f68323] px-8 py-3 text-sm font-bold uppercase italic tracking-wide text-white shadow-[0_4px_18px_rgba(216,72,0,0.35)] transition-opacity hover:opacity-90"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
};

export default FantasyPage;
