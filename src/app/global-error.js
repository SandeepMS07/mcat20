"use client";

import { useEffect } from "react";
import "./globals.css";
import CricketGame from "@/components/error/CricketGame";

// Catches errors that crash the root layout itself. Must render its own
// <html> + <body> because the layout never got a chance to.
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    if (error) console.error("[t20 global error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-[#02061A]">
        <div className="min-h-screen overflow-y-auto bg-gradient-to-br from-[#02061A] via-[#02103D] to-[#050C2A] text-white">
          <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-8 sm:py-12">
            <header className="mb-6 flex items-center justify-between gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#F2A23A] text-base font-extrabold italic text-[#02103D]">
                M
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.32em] text-white/40">
                T20 Mumbai · Stadium Offline
              </span>
            </header>

            <div className="mb-6 text-center">
              <h1 className="font-oswald text-4xl font-extrabold uppercase italic leading-[0.95] text-white sm:text-6xl">
                <span
                  className="text-transparent"
                  style={{ WebkitTextStroke: "1.5px #ffffff" }}
                >
                  Tea
                </span>{" "}
                Break
              </h1>
              <p className="mx-auto mt-3 max-w-xl text-sm text-white/65 sm:text-base">
                Something blocked the entire app from loading. While we sort it
                out, take a few balls in the nets.
              </p>
            </div>

            <CricketGame />

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => reset()}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#F2A23A] px-6 py-3 text-sm font-bold uppercase tracking-wide text-[#02103D] shadow-[0_10px_28px_rgba(242,162,58,0.45)] transition hover:brightness-110"
              >
                Reload the app
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
      </body>
    </html>
  );
}
