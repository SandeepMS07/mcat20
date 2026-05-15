import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Fantasy | T20 Mumbai League",
  description:
    "T20 Mumbai Fantasy is coming soon. Pick your XI, score big, and own bragging rights all season long.",
};

export default function FantasyPage() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#060A17] via-[#0c1334] to-[#243FA3]">
      <div
        className="pointer-events-none absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-[#F68323]/25 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-32 h-[460px] w-[460px] rounded-full bg-[#3663DE]/30 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.7) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 pb-20 pt-40 text-center sm:pt-44 lg:pt-48">
        <Image
          src="/images/home/logo.svg"
          alt="T20 Mumbai League"
          width={140}
          height={140}
          className="h-20 w-auto sm:h-24"
          priority
        />

        <span className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#F68323]/40 bg-[#F68323]/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#F68323] sm:text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-[#F68323]" />
          Fantasy
        </span>

        <h1 className="mt-6 font-jakarta text-5xl font-extrabold italic leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
          COMING
          <br />
          <span className="bg-gradient-to-r from-[#F68323] to-[#ffb066] bg-clip-text text-transparent">
            SOON
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
          T20 Mumbai Fantasy is gearing up for launch. Pick your XI, score big,
          and own bragging rights all season long — stay tuned.
        </p>

        <Link
          href="/"
          className="mt-10 inline-flex items-center justify-center rounded-full bg-[#F68323] px-8 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(246,131,35,0.35)] transition hover:bg-[#ff9239] sm:text-base"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}
