"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getRevealPayload } from "@/app/api/polls";

// TV-screen winner reveal. Designed for a venue kiosk:
//   - Full-bleed black background, no chrome.
//   - Names of all participants fly across the canvas (cycle ~6s).
//   - Then the cycle slows down and the winner card animates in.
//   - `?admin=1` exposes a discreet Replay button for re-triggering.

const REVEAL_PHASES = {
  cycling: "cycling",   // names flying around
  slowing: "slowing",   // decelerate
  winner: "winner",     // hold on winner
  empty: "empty",       // no voters yet
  waiting: "waiting",   // winner not yet picked
};

const CYCLE_MS = 5500;
const SLOW_MS = 1800;

export default function RevealPage() {
  const { matchId } = useParams();
  const searchParams = useSearchParams();
  const isAdminPreview = searchParams.get("admin") === "1";

  const [phase, setPhase] = useState(REVEAL_PHASES.cycling);
  const [participants, setParticipants] = useState([]);
  const [winner, setWinner] = useState(null);
  const [revealKey, setRevealKey] = useState(0);
  const canvasRef = useRef(null);
  const startedAtRef = useRef(0);

  const fetchPayload = useCallback(async () => {
    try {
      const res = await getRevealPayload(matchId);
      setParticipants(res.participants || []);
      setWinner(res.winner ?? null);
      if (!res.winner) {
        if (!res.participants?.length) setPhase(REVEAL_PHASES.empty);
        else setPhase(REVEAL_PHASES.waiting);
        return;
      }
      setPhase(REVEAL_PHASES.cycling);
      startedAtRef.current = performance.now();
    } catch {
      setPhase(REVEAL_PHASES.waiting);
    }
  }, [matchId]);

  useEffect(() => {
    fetchPayload();
  }, [fetchPayload, revealKey]);

  // Cursor auto-hide for kiosk feel.
  useEffect(() => {
    let timeoutId;
    const reset = () => {
      document.body.style.cursor = "default";
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        document.body.style.cursor = "none";
      }, 3000);
    };
    reset();
    window.addEventListener("mousemove", reset);
    return () => {
      window.removeEventListener("mousemove", reset);
      clearTimeout(timeoutId);
      document.body.style.cursor = "default";
    };
  }, []);

  // Body overflow lock so the kiosk view never scrolls.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Canvas animation — flying-name particles. Drawn even in `waiting`/`empty`
  // states (with a subdued backdrop) so the screen never goes black.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const names =
      participants.length > 0
        ? participants
        : winner
        ? [winner.name]
        : ["Fan", "Mumbai", "T20", "Cricket", "Winner", "Champion"];

    // Pre-spawn ~30 floating name particles.
    const particles = Array.from({ length: 30 }, () => makeParticle(names, canvas));

    // Track the RAF handle locally so cleanup always cancels the latest frame,
    // even if the effect re-runs (deps change) before the first frame has
    // executed. Using a module-scoped ref would race because rafRef.current is
    // written *inside* draw(), which hasn't run yet at cleanup time.
    let rafId = 0;
    let stopped = false;
    let lastTs = performance.now();
    const draw = (ts) => {
      if (stopped) return;
      const dt = Math.min(40, ts - lastTs);
      lastTs = ts;
      const w = window.innerWidth;
      const h = window.innerHeight;

      const gradient = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, Math.max(w, h));
      gradient.addColorStop(0, "#0E1A47");
      gradient.addColorStop(1, "#02061A");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      const speedMul =
        phase === REVEAL_PHASES.winner
          ? 0.25
          : phase === REVEAL_PHASES.slowing
          ? 0.55
          : 1;

      for (const p of particles) {
        p.x += p.vx * speedMul * dt * 0.06;
        p.y += p.vy * speedMul * dt * 0.06;
        if (p.x < -200) p.x = w + 50;
        if (p.x > w + 200) p.x = -50;
        if (p.y < -100) p.y = h + 50;
        if (p.y > h + 100) p.y = -50;

        ctx.font = `${p.size}px 'Oswald', sans-serif`;
        ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${p.alpha})`;
        ctx.textAlign = "center";
        ctx.fillText(p.name, p.x, p.y);
      }

      rafId = requestAnimationFrame(draw);
    };
    rafId = requestAnimationFrame(draw);

    return () => {
      stopped = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [participants, winner, phase]);

  // Phase progression. cycling → slowing → winner.
  useEffect(() => {
    if (phase !== REVEAL_PHASES.cycling || !winner) return;
    const t1 = setTimeout(() => setPhase(REVEAL_PHASES.slowing), CYCLE_MS);
    const t2 = setTimeout(() => setPhase(REVEAL_PHASES.winner), CYCLE_MS + SLOW_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [phase, winner]);

  const replay = () => setRevealKey((k) => k + 1);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white">
      <canvas ref={canvasRef} className="absolute inset-0" />

      {phase === REVEAL_PHASES.empty ? (
        <Overlay
          headline="No votes yet"
          subhead="Once fans cast their votes, a winner will be drawn here."
        />
      ) : null}

      {phase === REVEAL_PHASES.waiting ? (
        <Overlay
          headline="Winner pick in progress…"
          subhead="The randomiser is choosing a fan. Hold tight."
        />
      ) : null}

      {phase === REVEAL_PHASES.winner && winner ? (
        <WinnerCard winner={winner} />
      ) : null}

      {isAdminPreview ? (
        <button
          type="button"
          onClick={replay}
          className="absolute bottom-6 right-6 rounded-full border border-white/30 bg-black/40 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white/80 backdrop-blur hover:bg-black/60"
        >
          Replay
        </button>
      ) : null}
    </div>
  );
}

function makeParticle(names, canvas) {
  const w = canvas?.width || window.innerWidth;
  const h = canvas?.height || window.innerHeight;
  const palette = [
    { r: 242, g: 162, b: 58 },   // gold
    { r: 246, g: 131, b: 35 },   // orange
    { r: 96, g: 165, b: 250 },   // blue
    { r: 255, g: 255, b: 255 },  // white
  ];
  const tone = palette[Math.floor(Math.random() * palette.length)];
  return {
    name: names[Math.floor(Math.random() * names.length)],
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 3,
    vy: (Math.random() - 0.5) * 3,
    size: 18 + Math.random() * 36,
    alpha: 0.35 + Math.random() * 0.55,
    ...tone,
  };
}

function Overlay({ headline, subhead }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
      <h1 className="font-oswald text-4xl font-extrabold uppercase italic tracking-tight text-white sm:text-6xl">
        {headline}
      </h1>
      <p className="mt-4 max-w-xl text-base text-white/70 sm:text-lg">{subhead}</p>
    </div>
  );
}

function WinnerCard({ winner }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
      <div className="reveal-burst absolute inset-0 pointer-events-none" />
      <div className="reveal-card relative z-10 max-w-3xl rounded-3xl border border-[#F2A23A]/50 bg-gradient-to-br from-[#0E1A47]/95 via-[#08123A]/95 to-[#02061A]/95 px-10 py-12 text-center shadow-[0_30px_100px_rgba(242,162,58,0.35)] sm:px-16 sm:py-16">
        <div className="text-xs font-bold uppercase tracking-[0.45em] text-[#F2A23A] sm:text-sm">
          🏆 Today’s Fan Poll Winner
        </div>
        <div className="mt-6 font-oswald text-5xl font-extrabold italic uppercase leading-[0.95] text-white sm:text-7xl lg:text-8xl">
          {winner.name || "Anonymous Fan"}
        </div>
        <div className="mt-6 text-xs font-bold uppercase tracking-[0.3em] text-white/60 sm:text-sm">
          Join us on the field for the presentation
        </div>
      </div>

      <style jsx>{`
        .reveal-card {
          animation: rise 1.2s ease-out both, glow 4s ease-in-out infinite alternate;
        }
        .reveal-burst::before,
        .reveal-burst::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 20% 30%, rgba(242, 162, 58, 0.3), transparent 35%),
            radial-gradient(circle at 80% 60%, rgba(246, 131, 35, 0.25), transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(96, 165, 250, 0.15), transparent 55%);
          animation: pulse 3s ease-in-out infinite;
        }
        @keyframes rise {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.94);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes glow {
          from {
            box-shadow: 0 30px 100px rgba(242, 162, 58, 0.35);
          }
          to {
            box-shadow: 0 30px 130px rgba(246, 131, 35, 0.55);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
