"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Tap-to-bat cricket mini-game shown on the error/5xx fallback screen.
 *
 * Design goals:
 *   - One canvas, no image assets, no audio. Boots in milliseconds.
 *   - Game state lives in refs so React never re-renders during animation.
 *   - Forgiving timing — three lives, generous contact zones — so the user
 *     gets a few hits in before retrying the page.
 *   - Looks like cricket: stadium silhouette, bright pitch, white-clad
 *     batsman, red leather ball with a visible seam, ball trail on hits.
 */

// Logical (CSS-pixel) drawing dimensions. The canvas is resized to fit its
// container width and devicePixelRatio; everything inside is positioned in
// these logical coordinates.
const LOGICAL_HEIGHT = 420;

// Game tuning — fan-friendly defaults. Sweet zone is wider than feels
// "skilful" because the goal is engagement, not difficulty.
const BAT_X_RATIO = 0.18;            // batsman sits at 18% of canvas width
const SWEET_ZONE = 38;               // px — perfect SIX
const GOOD_ZONE = 70;                // FOUR
const OK_ZONE = 110;                 // TWO / SINGLE
const MISS_ZONE = 150;               // beyond this = OUT
const BALL_RADIUS = 13;
const TRAIL_LEN = 16;
const STARTING_LIVES = 3;
const SCORE_KEY = "mca_cricket_game_best";

const HITS = [
  { runs: 6, label: "SIX!",   color: "#F2A23A" },
  { runs: 4, label: "FOUR",   color: "#34D399" },
  { runs: 2, label: "TWO",    color: "#60A5FA" },
  { runs: 1, label: "SINGLE", color: "#FFFFFF" },
];

export default function CricketGame() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const worldRef = useRef(null);
  const rafRef = useRef(0);

  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [lives, setLives] = useState(STARTING_LIVES);
  const [streak, setStreak] = useState(0);
  const [hint, setHint] = useState(null);
  const [phase, setPhase] = useState("idle"); // idle | playing | over

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SCORE_KEY);
      if (raw) setBest(Number(raw) || 0);
    } catch {
      /* ignore */
    }
  }, []);

  const persistBest = useCallback((finalScore) => {
    try {
      const prev = Number(window.localStorage.getItem(SCORE_KEY) || 0);
      if (finalScore > prev) {
        window.localStorage.setItem(SCORE_KEY, String(finalScore));
        setBest(finalScore);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const newBall = useCallback((ballsBowled, canvasWidth) => {
    // Speed grows with experience but plateaus so it stays playable.
    const speed = 4.2 + Math.min(ballsBowled, 18) * 0.18;
    return {
      x: canvasWidth + BALL_RADIUS,
      y: LOGICAL_HEIGHT * 0.72,
      vx: speed + (Math.random() - 0.5) * 0.5,
      // gentle arc — y oscillates slightly so it doesn't look like a laser
      bob: Math.random() * Math.PI * 2,
      trail: [],
      // Once contact is made we let the ball fly away on a curve; the original
      // forward motion is abandoned and we use vfx + vfy with gravity.
      hit: null,
    };
  }, []);

  const resetWorld = useCallback(() => {
    const canvas = canvasRef.current;
    const w = canvas?.clientWidth ?? 800;
    worldRef.current = {
      ball: newBall(0, w),
      ballsBowled: 0,
      lastTs: performance.now(),
      flashes: [],
      bgStars: makeStars(28, w),
    };
  }, [newBall]);

  const startGame = useCallback(() => {
    resetWorld();
    setScore(0);
    setLives(STARTING_LIVES);
    setStreak(0);
    setHint(null);
    setPhase("playing");
  }, [resetWorld]);

  // Score handler — pure-ish, only touches the world ref + setState.
  const registerHit = useCallback((tier, world) => {
    const h = HITS[tier];
    // Streak bonus: every 3rd consecutive boundary (tier 0 or 1) +2.
    const isBoundary = tier <= 1;
    setStreak((s) => {
      const next = isBoundary ? s + 1 : 0;
      return next;
    });
    setScore((s) => s + h.runs);
    setHint({ text: `+${h.runs} · ${h.label}`, color: h.color, key: Date.now() });

    // Launch trajectory away from the bat (depending on tier — higher tier
    // goes higher and further).
    const launchPower = 1 - tier * 0.18;
    world.ball.hit = {
      vfx: 9 * launchPower,
      vfy: -8 * launchPower,
      g: 0.32,
      color: h.color,
      spinCenterX: world.ball.x,
    };
    world.flashes.push({
      color: h.color,
      ts: performance.now(),
      duration: 500,
      strength: 0.22,
    });
    // After ~700ms launch a new ball.
    setTimeout(() => {
      const canvas = canvasRef.current;
      const cw = canvas?.clientWidth ?? 800;
      if (!worldRef.current) return;
      worldRef.current.ball = newBall(worldRef.current.ballsBowled, cw);
    }, 700);
    world.ballsBowled += 1;
  }, [newBall]);

  const registerMiss = useCallback((reason) => {
    setStreak(0);
    setHint({
      text: reason === "bowled" ? "BOWLED!" : "OUT! Mis-timed.",
      color: "#F87171",
      key: Date.now(),
    });
    setLives((l) => {
      const next = l - 1;
      if (next <= 0) {
        // End in a microtask so score+lives state settles first.
        Promise.resolve().then(() => {
          setPhase("over");
          setScore((finalScore) => {
            persistBest(finalScore);
            return finalScore;
          });
        });
      } else {
        // Respawn a ball after a short beat so the player has time to read
        // the OUT message.
        setTimeout(() => {
          const canvas = canvasRef.current;
          const cw = canvas?.clientWidth ?? 800;
          if (!worldRef.current) return;
          worldRef.current.ball = newBall(worldRef.current.ballsBowled, cw);
        }, 900);
      }
      return next;
    });
  }, [newBall, persistBest]);

  // Swing — judges contact based on current ball x.
  const swing = useCallback(() => {
    if (phase !== "playing") return;
    const world = worldRef.current;
    if (!world?.ball || world.ball.hit) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const batX = canvas.clientWidth * BAT_X_RATIO;
    const dx = Math.abs(world.ball.x - batX);
    if (dx <= SWEET_ZONE) registerHit(0, world);
    else if (dx <= GOOD_ZONE) registerHit(1, world);
    else if (dx <= OK_ZONE) registerHit(2, world);
    else if (dx <= MISS_ZONE) registerHit(3, world);
    else registerMiss("swing");
  }, [phase, registerHit, registerMiss]);

  // Animation loop.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const cssW = canvas.clientWidth;
      const cssH = LOGICAL_HEIGHT;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = cssW * dpr;
      canvas.height = cssH * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (ts) => {
      const w = canvas.clientWidth;
      const h = LOGICAL_HEIGHT;
      const world = worldRef.current;

      // Background renders even in idle to stop the canvas going black.
      drawStadium(ctx, w, h, world?.bgStars);

      if (world) {
        const dt = Math.min(40, ts - world.lastTs);
        world.lastTs = ts;
        const batX = w * BAT_X_RATIO;
        const baseY = h * 0.82;

        // Pitch + stumps drawn AFTER stadium so they sit in front.
        drawPitch(ctx, w, h);
        drawStumps(ctx, w - 60, baseY);
        drawBatsman(ctx, batX, baseY);

        // Sweet-zone telegraph: a soft circle around the bat that pulses.
        if (phase === "playing" && world.ball && !world.ball.hit) {
          drawZoneIndicator(ctx, batX, baseY - 28, ts);
        }

        // Ball physics
        if (world.ball) {
          const b = world.ball;
          if (b.hit) {
            b.x += b.hit.vfx * (dt / 16);
            b.y += b.hit.vfy * (dt / 16);
            b.hit.vfy += b.hit.g * (dt / 16);
          } else if (phase === "playing") {
            b.x -= b.vx * (dt / 16);
            b.y =
              h * 0.72 +
              Math.sin((b.x / Math.max(w, 1)) * Math.PI * 2 + b.bob) * 10;
            // Trail (pre-hit only)
            b.trail.push({ x: b.x, y: b.y });
            if (b.trail.length > TRAIL_LEN) b.trail.shift();
            // Past the batsman without a swing → bowled.
            if (b.x < batX - 36) {
              world.ball = null;
              registerMiss("bowled");
            }
          }

          if (b) drawBall(ctx, b);
        }

        // Hit flashes
        if (world.flashes.length) {
          world.flashes = world.flashes.filter((f) => {
            const age = ts - f.ts;
            if (age > f.duration) return false;
            const a = (1 - age / f.duration) * f.strength;
            ctx.fillStyle = `rgba(${hexToRgb(f.color)}, ${a})`;
            ctx.fillRect(0, 0, w, h);
            return true;
          });
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [phase, registerMiss]);

  // Keyboard swing
  useEffect(() => {
    if (phase !== "playing") return;
    const onKey = (e) => {
      if (e.code === "Space" || e.key === "Enter") {
        e.preventDefault();
        swing();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, swing]);

  return (
    <div ref={wrapRef} className="mx-auto w-full max-w-4xl">
      {/* HUD */}
      <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
        <Stat label="Runs" value={score} accent="#F2A23A" pulse={hint?.key} />
        <Stat label="Best" value={best} accent="#FBBF24" />
        <Stat
          label="Lives"
          value={"♥".repeat(lives) + "♡".repeat(Math.max(0, STARTING_LIVES - lives))}
          accent="#F87171"
          mono
        />
        <Stat
          label="Streak"
          value={streak >= 3 ? `🔥 ${streak}` : streak}
          accent="#34D399"
          className="hidden sm:block"
        />
      </div>

      {/* Canvas */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Swing the bat"
        onMouseDown={swing}
        onTouchStart={(e) => {
          e.preventDefault();
          swing();
        }}
        className="group relative cursor-pointer select-none overflow-hidden rounded-2xl border border-white/10 bg-[#031024] shadow-[0_20px_80px_rgba(2,6,26,0.6)]"
        style={{ height: LOGICAL_HEIGHT }}
      >
        <canvas
          ref={canvasRef}
          className="block h-full w-full"
          style={{ transform: "translateZ(0)" }}
        />

        {/* Persistent hint floater */}
        {hint && phase === "playing" ? (
          <div
            key={hint.key}
            className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 animate-bounce text-2xl font-extrabold italic uppercase tracking-wide sm:text-3xl"
            style={{
              color: hint.color,
              textShadow: "0 6px 24px rgba(0,0,0,0.55)",
            }}
          >
            {hint.text}
          </div>
        ) : null}

        {/* Idle / over overlay */}
        {phase !== "playing" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#02061A]/85 via-[#02061A]/90 to-[#02061A]/95 px-6 text-center backdrop-blur-sm">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#F2A23A]">
              {phase === "over" ? "Innings closed" : "Pitch ready"}
            </div>
            <div className="font-oswald text-4xl font-extrabold uppercase italic leading-[0.95] text-white sm:text-5xl">
              {phase === "over" ? `${score} run${score === 1 ? "" : "s"}` : "Tap to bat"}
            </div>
            <p className="max-w-md text-sm text-white/65 sm:text-base">
              {phase === "over"
                ? best > 0 && score >= best
                  ? "Top score! Bowled to perfection. Want to defend it?"
                  : best > 0
                  ? `Best so far: ${best}. Have another swing while we patch things up.`
                  : "While we patch the pitch, want one more over?"
                : "Tap the pitch (or press space) to swing as the ball reaches the bat. Sweet timing = SIX."}
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }}
              className="rounded-md bg-[#F2A23A] px-6 py-3 text-sm font-bold uppercase tracking-wide text-[#02103D] shadow-[0_10px_28px_rgba(242,162,58,0.45)] transition hover:brightness-110"
            >
              {phase === "over" ? "Play again" : "Start over"}
            </button>
            <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">
              3 lives · Streak boundaries for bonus runs
            </div>
          </div>
        ) : (
          <div className="pointer-events-none absolute right-4 top-4 rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/60 backdrop-blur">
            Tap / Space
          </div>
        )}
      </div>
    </div>
  );
}

/* ────── small HUD bit ────── */

function Stat({ label, value, accent = "#F2A23A", pulse, mono, className = "" }) {
  return (
    <div
      key={pulse}
      className={`rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 ${className}`}
    >
      <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">
        {label}
      </div>
      <div
        className={`mt-1 font-oswald text-2xl font-extrabold italic tabular-nums ${
          mono ? "font-mono not-italic tracking-wide" : ""
        }`}
        style={{ color: accent }}
      >
        {value}
      </div>
    </div>
  );
}

/* ────── canvas drawing helpers ────── */

function drawStadium(ctx, w, h, stars) {
  // Sky gradient
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#06112d");
  sky.addColorStop(0.55, "#0a1f4f");
  sky.addColorStop(1, "#0a1438");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Distant floodlights — soft glows top-left + top-right
  const glow = (cx, cy) => {
    const g = ctx.createRadialGradient(cx, cy, 6, cx, cy, 220);
    g.addColorStop(0, "rgba(255,235,170,0.35)");
    g.addColorStop(1, "rgba(255,235,170,0)");
    ctx.fillStyle = g;
    ctx.fillRect(cx - 220, cy - 220, 440, 440);
  };
  glow(w * 0.12, h * 0.1);
  glow(w * 0.88, h * 0.1);

  // Stars / floating dots
  if (stars) {
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    for (const s of stars) {
      ctx.globalAlpha = s.a;
      ctx.fillRect(s.x, s.y, 1.4, 1.4);
    }
    ctx.globalAlpha = 1;
  }

  // Stadium curve at bottom (the bowl)
  ctx.fillStyle = "#020815";
  ctx.beginPath();
  ctx.moveTo(0, h * 0.62);
  ctx.quadraticCurveTo(w * 0.5, h * 0.42, w, h * 0.62);
  ctx.lineTo(w, h * 0.7);
  ctx.lineTo(0, h * 0.7);
  ctx.closePath();
  ctx.fill();
  // Crowd dots
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  for (let i = 0; i < 80; i++) {
    const x = (i / 80) * w;
    const y = h * 0.52 + Math.sin(i * 1.7) * 8 + Math.random() * 6;
    ctx.fillRect(x, y, 2, 2);
  }
}

function drawPitch(ctx, w, h) {
  // Outfield (green)
  const turf = ctx.createLinearGradient(0, h * 0.7, 0, h);
  turf.addColorStop(0, "#2e7a3a");
  turf.addColorStop(1, "#1a4a23");
  ctx.fillStyle = turf;
  ctx.fillRect(0, h * 0.7, w, h * 0.3);
  // Mowing stripes
  ctx.fillStyle = "rgba(255,255,255,0.04)";
  for (let i = 0; i < 12; i++) {
    if (i % 2 === 0) continue;
    ctx.fillRect(0, h * 0.7 + i * 6, w, 3);
  }
  // Pitch strip (tan/brown)
  const strip = ctx.createLinearGradient(0, h * 0.7, 0, h);
  strip.addColorStop(0, "#c4a16b");
  strip.addColorStop(1, "#8c6f3d");
  ctx.fillStyle = strip;
  ctx.fillRect(0, h * 0.78, w, 22);

  // Crease lines (close + bowler end)
  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, h * 0.78);
  ctx.lineTo(w, h * 0.78);
  ctx.moveTo(0, h * 0.78 + 22);
  ctx.lineTo(w, h * 0.78 + 22);
  ctx.stroke();
}

function drawBatsman(ctx, x, baseY) {
  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.ellipse(x + 4, baseY + 4, 22, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pads (legs in cricket whites)
  ctx.fillStyle = "#F4F4F4";
  roundRect(ctx, x - 12, baseY - 22, 8, 22, 3);
  roundRect(ctx, x + 4, baseY - 22, 8, 22, 3);
  // Pad straps
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.fillRect(x - 12, baseY - 15, 8, 1.5);
  ctx.fillRect(x - 12, baseY - 8, 8, 1.5);
  ctx.fillRect(x + 4, baseY - 15, 8, 1.5);
  ctx.fillRect(x + 4, baseY - 8, 8, 1.5);

  // Torso (jersey)
  const torsoH = 32;
  const torsoW = 22;
  ctx.fillStyle = "#0E3A8A";   // T20 Mumbai navy
  roundRect(ctx, x - torsoW / 2, baseY - 22 - torsoH, torsoW, torsoH, 4);
  // Jersey gold trim
  ctx.fillStyle = "#F2A23A";
  ctx.fillRect(x - torsoW / 2, baseY - 22 - torsoH + 6, torsoW, 2);

  // Arms (gloves)
  ctx.fillStyle = "#F4F4F4";
  ctx.beginPath();
  ctx.arc(x - 11, baseY - 22 - torsoH + 10, 4, 0, Math.PI * 2);
  ctx.arc(x + 11, baseY - 22 - torsoH + 10, 4, 0, Math.PI * 2);
  ctx.fill();

  // Helmet
  ctx.fillStyle = "#0E3A8A";
  ctx.beginPath();
  ctx.arc(x, baseY - 22 - torsoH - 6, 10, Math.PI, 0);
  ctx.lineTo(x + 10, baseY - 22 - torsoH + 2);
  ctx.lineTo(x - 10, baseY - 22 - torsoH + 2);
  ctx.closePath();
  ctx.fill();
  // Visor grille
  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(x - 9, baseY - 22 - torsoH - 1);
  ctx.lineTo(x + 9, baseY - 22 - torsoH - 1);
  ctx.stroke();

  // Bat (gold)
  ctx.save();
  ctx.translate(x + 11, baseY - 22 - torsoH + 14);
  ctx.rotate(-0.7);            // ~ 45° back-lift
  ctx.fillStyle = "#F2A23A";
  roundRect(ctx, 0, -4, 38, 8, 2);
  ctx.fillStyle = "#3A1F00";
  ctx.fillRect(-8, -2, 10, 4);   // handle
  ctx.restore();
}

function drawStumps(ctx, x, baseY) {
  ctx.fillStyle = "#F8E9C9";
  for (let i = -1; i <= 1; i++) {
    ctx.fillRect(x + i * 6 - 1.5, baseY - 32, 3, 32);
  }
  ctx.fillStyle = "#F2A23A";
  ctx.fillRect(x - 9, baseY - 33, 18, 2);
}

function drawBall(ctx, b) {
  // Trail (pre-hit only — after hit we let the launch handle motion blur)
  if (!b.hit && b.trail.length > 1) {
    for (let i = 0; i < b.trail.length; i++) {
      const t = b.trail[i];
      const a = (i / b.trail.length) * 0.35;
      ctx.fillStyle = `rgba(224,56,59,${a})`;
      ctx.beginPath();
      ctx.arc(t.x, t.y, BALL_RADIUS * (0.5 + (i / b.trail.length) * 0.5), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Ball body
  const grad = ctx.createRadialGradient(
    b.x - 4, b.y - 4, 2,
    b.x, b.y, BALL_RADIUS,
  );
  grad.addColorStop(0, "#FF6669");
  grad.addColorStop(1, "#9C171A");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(b.x, b.y, BALL_RADIUS, 0, Math.PI * 2);
  ctx.fill();

  // Seam
  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(b.x, b.y, BALL_RADIUS - 1, -0.6, 0.6);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(b.x, b.y, BALL_RADIUS - 1, Math.PI - 0.6, Math.PI + 0.6);
  ctx.stroke();
}

function drawZoneIndicator(ctx, x, y, ts) {
  // Pulsing ring around the batsman to telegraph the sweet zone.
  const phase = (Math.sin(ts / 220) + 1) / 2;  // 0..1
  const r = 22 + phase * 8;
  ctx.strokeStyle = `rgba(242,162,58,${0.55 - phase * 0.3})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y,     x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x,     y + h, r);
  ctx.arcTo(x,     y + h, x,     y,     r);
  ctx.arcTo(x,     y,     x + w, y,     r);
  ctx.closePath();
  ctx.fill();
}

function makeStars(n, w) {
  const out = [];
  for (let i = 0; i < n; i++) {
    out.push({
      x: Math.random() * w,
      y: Math.random() * LOGICAL_HEIGHT * 0.55,
      a: 0.3 + Math.random() * 0.6,
    });
  }
  return out;
}

function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return "255,255,255";
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)].join(",");
}
