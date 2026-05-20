"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaUserFriends,
  FaTrophy,
  FaBolt,
} from "react-icons/fa";
import { GiCricketBat } from "react-icons/gi";

const LAUNCH_DATE = new Date("2026-06-01T00:00:00+05:30").getTime();

const pad2 = (n) => String(Math.max(0, n)).padStart(2, "0");

const getTimeLeft = () => {
  const diff = LAUNCH_DATE - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, done: false };
};

const TimeBlock = ({ label, value }) => (
  <div className="flex w-[68px] flex-col items-center rounded-xl border border-white/10 bg-gradient-to-br from-[#1A2C7A] via-[#142366] to-[#0B1545] px-2 py-3 shadow-[0_8px_22px_rgba(0,0,0,0.35)] sm:w-[88px] sm:py-4">
    <span className="text-2xl font-extrabold italic tabular-nums text-white sm:text-4xl">
      {pad2(value)}
    </span>
    <span className="mt-1 text-[9px] font-bold uppercase tracking-wider text-[#FFE150]/85 sm:text-[10px]">
      {label}
    </span>
  </div>
);

const FEATURES = [
  {
    Icon: GiCricketBat,
    title: "Pick Your XI",
    desc: "Draft your dream squad from every team in the league.",
    color: "#FFD166",
  },
  {
    Icon: FaUserFriends,
    title: "Play With Friends",
    desc: "Create private leagues and compete with the crew.",
    color: "#4FD1FF",
  },
  {
    Icon: FaTrophy,
    title: "Climb The Ranks",
    desc: "Top the leaderboards as the action unfolds live.",
    color: "#F2A23A",
  },
];

const FantasyPage = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="relative w-full overflow-hidden bg-[#1E2F7D] bg-[url('/images/texture-bg.png')] bg-cover bg-center bg-no-repeat pt-[120px] pb-20 sm:pt-[140px] lg:pt-[160px]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,88,210,0.35),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(26,40,116,0.65),transparent_45%)]"
      />

      {/* Soft accent glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#F2A23A]/[0.12] blur-3xl"
      />

      <div className="section-width section-padding relative">
        {/* Header */}
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#F2A23A]/40 bg-[#F2A23A]/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#FFE150] backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F2A23A] opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#F2A23A]" />
            </span>
            Fantasy
          </span>

          <h1 className="mt-6 flex flex-col font-extrabold uppercase italic leading-[0.9] text-white">
            <span
              className="text-5xl text-transparent sm:text-6xl lg:text-7xl xl:text-8xl"
              style={{ WebkitTextStroke: "1.5px #ffffff" }}
            >
              Coming
            </span>
            <span className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl">
              Soon
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-sm text-white/75 sm:text-base lg:text-lg">
            Create your Fantasy XI, compete with friends and own the T20 Mumbai
            League 2026.
          </p>

          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-white/70 backdrop-blur-sm">
            <FaBolt className="h-3 w-3 text-[#FFE150]" />
            Launching 1 June 2026
          </div>

          {/* Countdown */}
          {!timeLeft.done && (
            <div className="mt-8 flex items-center justify-center gap-2 sm:gap-3">
              <TimeBlock label="Days" value={timeLeft.days} />
              <span className="text-2xl font-extrabold text-white/30 sm:text-4xl">
                :
              </span>
              <TimeBlock label="Hrs" value={timeLeft.hours} />
              <span className="text-2xl font-extrabold text-white/30 sm:text-4xl">
                :
              </span>
              <TimeBlock label="Min" value={timeLeft.minutes} />
              <span className="text-2xl font-extrabold text-white/30 sm:text-4xl">
                :
              </span>
              <TimeBlock label="Sec" value={timeLeft.seconds} />
            </div>
          )}
        </div>

        {/* Feature cards */}
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-3 sm:gap-5">
          {FEATURES.map(({ Icon, title, desc, color }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#1A2C7A] via-[#142366] to-[#0B1545] p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_18px_44px_-12px_rgba(0,0,0,0.55)] sm:p-6"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-30 blur-3xl transition-opacity duration-500 group-hover:opacity-60"
                style={{ backgroundColor: color }}
              />
              <div
                className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 backdrop-blur-sm"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${color}33 0%, rgba(255,255,255,0.02) 100%)`,
                }}
              >
                <Icon size={24} color={color} />
              </div>
              <h3 className="relative mt-4 text-sm font-extrabold uppercase italic tracking-tight text-white sm:text-base">
                {title}
              </h3>
              <p className="relative mt-2 text-xs text-white/65 sm:text-sm">
                {desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col items-center gap-3 sm:mt-16">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-b from-[#d84800] to-[#f68323] px-8 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-[0_8px_24px_rgba(216,72,0,0.4)] transition hover:brightness-110 sm:text-sm"
          >
            Back to Home
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
          <p className="text-[11px] uppercase tracking-wider text-white/40">
            Stay tuned for the launch
          </p>
        </div>
      </div>
    </main>
  );
};

export default FantasyPage;
