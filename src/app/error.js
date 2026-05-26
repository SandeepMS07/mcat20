"use client";

import { useEffect } from "react";
import CricketGame from "@/components/error/CricketGame";

// Full-bleed error boundary. We use `position: fixed; inset: 0` and a high
// z-index so the page chrome (navbar + marquee) underneath is completely
// covered — the user shouldn't see half of the broken page bleeding through.
export default function Error({ error, reset }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    if (error) console.error("[t20 error boundary]", error);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [error]);

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto bg-gradient-to-br from-[#02061A] via-[#02103D] to-[#050C2A] text-white"
      role="alert"
    >
      <div className="mx-auto flex min-h-full max-w-4xl flex-col px-4 py-8 sm:py-12">
        <header className="mb-6 flex items-center justify-between gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#F2A23A] text-base font-extrabold italic text-[#02103D]">
            M
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.32em] text-white/40">
            T20 Mumbai · Innings Break
          </span>
        </header>

        <div className="mb-6 text-center">
          <h1 className="font-oswald text-4xl font-extrabold uppercase italic leading-[0.95] text-white sm:text-6xl">
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: "1.5px #ffffff" }}
            >
              Drinks
            </span>{" "}
            Break
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/65 sm:text-base">
            Our servers are taking a quick water break. While the team gets
            back on the pitch, grab a bat — best score so far stays with you.
          </p>
        </div>

        <CricketGame />

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#F2A23A] px-6 py-3 text-sm font-bold uppercase tracking-wide text-[#02103D] shadow-[0_10px_28px_rgba(242,162,58,0.45)] transition hover:brightness-110"
          >
            Try the page again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white/80 hover:border-white/40 hover:text-white"
          >
            Back to homepage
          </a>
        </div>

        {error?.digest ? (
          <p className="mt-auto pt-8 text-center text-[10px] uppercase tracking-[0.22em] text-white/25">
            Reference: {error.digest}
          </p>
        ) : null}
      </div>
    </div>
  );
}
