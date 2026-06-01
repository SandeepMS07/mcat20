import Sponsorship from "@/components/common/Sponsorship";

export default function ChoicePage() {
  return (
    <div className="w-full bg-[#1E2F7D]">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1C2E8A] via-[#1A2B82] to-[#0E1B5E] bg-[url('/images/texture-bg.png')] bg-cover bg-center bg-no-repeat">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,88,210,0.35),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(26,40,116,0.65),transparent_45%)]" />

        <div className="relative flex min-h-[420px] flex-col items-center justify-center gap-5 px-6 py-20 text-center sm:py-28">
          {/* Label pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#0E1B5E]/60 px-5 py-2 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-[#F68323]" aria-hidden />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Viewers&apos; Choice
            </span>
          </div>

          {/* COMING */}
          <div className="flex flex-col items-center leading-none">
            <span
              className="text-[clamp(3.5rem,12vw,8rem)] font-black uppercase italic tracking-tight text-transparent"
              style={{ WebkitTextStroke: "2px rgba(255,255,255,0.85)" }}
            >
              COMING
            </span>
            <span className="text-[clamp(3.5rem,12vw,8rem)] font-black uppercase italic leading-none tracking-tight text-white">
              SOON
            </span>
          </div>

          {/* Description */}
          <p className="max-w-md text-sm font-medium text-white/60 sm:text-base">
            Vote for your Emerging Player, Best Batsman, Best Bowler and more —
            coming soon for T20 Mumbai League 2026.
          </p>
        </div>
      </section>

      <Sponsorship />
    </div>
  );
}
