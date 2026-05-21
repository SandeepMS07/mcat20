"use client";

export default function LoadingPage() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="fixed inset-0 z-[1000] flex min-h-screen w-full items-center justify-center bg-gradient-to-bl from-[#1C398E] to-[#0E005A]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/4 h-72 w-72 rounded-full bg-[#F68323]/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-1/4 h-72 w-72 rounded-full bg-white/5 blur-3xl"
      />

      <div className="relative flex flex-col items-center gap-7">
        <div className="relative h-32 w-[280px] sm:h-36 sm:w-[320px]">
          <svg
            viewBox="0 0 280 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            <rect
              x="2"
              y="2"
              width="276"
              height="96"
              rx="48"
              ry="48"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="3"
            />
            <rect
              x="2"
              y="2"
              width="276"
              height="96"
              rx="48"
              ry="48"
              fill="none"
              stroke="#F68323"
              strokeWidth="3"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="22 78"
              className="t20-loader-ring"
              style={{ filter: "drop-shadow(0 0 8px rgba(246,131,35,0.5))" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center gap-3 px-6 sm:gap-4">
            <img
              src="https://mca-cdn.ken42.com/mca-logos/t20-m.png"
              alt="T20 Mumbai"
              className="h-16 w-auto sm:h-20 t20-loader-pulse drop-shadow-[0_4px_18px_rgba(0,0,0,0.4)]"
            />
            <span
              aria-hidden
              className="h-10 w-px bg-white/30 sm:h-12"
            />
            <img
              src="/images/home/logo-w.png"
              alt="Women's T20 Mumbai"
              className="h-16 w-auto sm:h-20 t20-loader-pulse drop-shadow-[0_4px_18px_rgba(0,0,0,0.4)]"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/60">
            T20 Mumbai League
          </span>
          <div className="flex items-center gap-1">
            <span className="t20-loader-dot h-1.5 w-1.5 rounded-full bg-[#F68323]" />
            <span
              className="t20-loader-dot h-1.5 w-1.5 rounded-full bg-[#F68323]"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="t20-loader-dot h-1.5 w-1.5 rounded-full bg-[#F68323]"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes t20LoaderTravel {
          to { stroke-dashoffset: -100; }
        }
        @keyframes t20LoaderPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.94); opacity: 0.92; }
        }
        @keyframes t20LoaderDot {
          0%, 80%, 100% { opacity: 0.25; transform: translateY(0); }
          40% { opacity: 1; transform: translateY(-3px); }
        }
        .t20-loader-ring {
          stroke-dashoffset: 0;
          animation: t20LoaderTravel 2s linear infinite;
        }
        .t20-loader-pulse {
          animation: t20LoaderPulse 1.8s ease-in-out infinite;
        }
        .t20-loader-dot {
          animation: t20LoaderDot 1.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
