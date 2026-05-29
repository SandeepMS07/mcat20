"use client";

// TV-screen winner reveal — designed for venue kiosk / big screen.
// Full-bleed, no chrome. Animation flow:
//   Phase 0 — word cloud drifts (~6.5s)
//   Phase 1 — Lottie cricket ball flies bottom-left → centre, scatters names (~4.8s)
//   Phase 2 — winner name rises from cloud to centre, glows gold (~1.8s)
//   Phase 3 — IPL big-screen overlay slams in with corner brackets & gradient name
//
// Real-time: Socket.IO subscribes to `poll:<pollId>` room.
// Admin picks winner → backend publishes poll:winner event → page reacts instantly.
// One-time HTTP fetch on mount handles the case where winner was already picked.

import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { io } from "socket.io-client";
import lottie from "lottie-web";
import { getPollRevealPayload } from "@/app/api/polls";
import { FANTASY_API_BASE } from "@/constant";

const DURATIONS = [6500, 4800, 1800]; // phase 0 (drift), 1 (ball + scatter), 2 (rise) in ms

const BALL_SIZE = 340;
// Change this path to test a different Lottie file (must be in /public)
const BALL_ANIM_PATH = "/animation/loading.json";

// Colour palette — fixed at particle creation, never randomised per-frame
const PALETTE = [
  [244, 124, 32], // orange
  [255, 215, 0], // gold
  [255, 255, 255], // white
  [100, 140, 255], // blue-light
  [255, 180, 80], // amber
  [180, 210, 255], // ice blue
];
const SIZES = [10, 12, 14, 17, 20, 24, 29, 35, 43];

export default function RevealPage() {
  const { matchId: pollId } = useParams(); // segment is still [matchId] in the URL
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get("admin") === "1";

  // "waiting" = no winner yet; "ready" = winner received, start animation;
  // "running" = animation in progress; "done" = overlay showing
  const [uiState, setUiState] = useState("waiting");
  const [participants, setParticipants] = useState([]);
  const [winner, setWinner] = useState(null);
  const [pollQuestion, setPollQuestion] = useState("");

  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const lottieBallRef = useRef(null);

  // Track pickedAt so we detect admin re-draw
  const lastPickedAtRef = useRef(null);

  // participantsRef / winnerRef — always current values accessible inside effects
  // without needing them as deps (avoids stale closure issues)
  const participantsRef = useRef([]);
  const winnerRef = useRef(null);
  participantsRef.current = participants;
  winnerRef.current = winner;

  // animKey increment → starts a fresh animation run imperatively
  const [animKey, setAnimKey] = useState(0);

  const startReveal = (newWinner, newParticipants) => {
    if (newParticipants?.length) setParticipants(newParticipants);
    setWinner(newWinner);
    setUiState("running");
    setAnimKey((k) => k + 1);
  };

  const triggerWinner = (newWinner, pickedAt, newParticipants) => {
    const isNewDraw =
      lastPickedAtRef.current !== null && lastPickedAtRef.current !== pickedAt;
    if (lastPickedAtRef.current === null || isNewDraw) {
      lastPickedAtRef.current = pickedAt;
      startReveal(newWinner, newParticipants);
    }
  };

  // One-time fetch on mount — handles winner already picked before page opened
  useEffect(() => {
    getPollRevealPayload(pollId)
      .then((data) => {
        if (data.pollQuestion) setPollQuestion(data.pollQuestion);
        if (data.winner) {
          triggerWinner(
            data.winner,
            data.winner.pickedAt ?? data.winner.name,
            data.participants,
          );
        } else if (data.participants?.length) {
          setParticipants(data.participants);
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollId]);

  // Socket.IO — real-time winner events
  useEffect(() => {
    const wsUrl = FANTASY_API_BASE.replace(/\/api\/?$/, "");
    const socket = io(wsUrl, {
      withCredentials: false,
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      socket.emit("subscribe", { type: "poll", id: pollId });
    });

    socket.on("poll:winner", (ev) => {
      if (String(ev.pollId) !== String(pollId)) return;
      const pickedAt = ev.winner?.pickedAt ?? ev.winner?.name;
      // Re-fetch to get fresh participants alongside new winner
      getPollRevealPayload(pollId)
        .then((data) => {
          if (data.pollQuestion) setPollQuestion(data.pollQuestion);
          lastPickedAtRef.current = null; // force restart even if same person re-won
          triggerWinner(ev.winner, pickedAt, data.participants);
        })
        .catch(() => {
          lastPickedAtRef.current = null;
          triggerWinner(ev.winner, pickedAt, participantsRef.current);
        });
    });

    return () => {
      socket.emit("unsubscribe", { type: "poll", id: pollId });
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollId]);

  // Replay button — reset DOM and bump animKey to restart
  const replay = () => {
    resetOverlayDOM(overlayRef.current, lottieBallRef.current);
    setUiState("running");
    setAnimKey((k) => k + 1);
  };

  // Animation effect — keyed on animKey so it only runs when explicitly triggered
  // Never sets uiState inside here (avoids the cleanup-kills-new-animation race)
  useEffect(() => {
    if (animKey === 0) return; // skip initial mount
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cleanup = startAnimation({
      canvas,
      overlayEl: overlayRef.current,
      lottieBallEl: lottieBallRef.current,
      participants: participantsRef.current,
      winner: winnerRef.current,
      onDone: () => setUiState("done"),
    });

    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animKey]);

  // Cursor auto-hide for kiosk feel
  useEffect(() => {
    let timerId;
    const reset = () => {
      document.body.style.cursor = "default";
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        document.body.style.cursor = "none";
      }, 3000);
    };
    reset();
    window.addEventListener("mousemove", reset);
    return () => {
      window.removeEventListener("mousemove", reset);
      clearTimeout(timerId);
      document.body.style.cursor = "default";
    };
  }, []);

  // Body overflow lock
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#04092e] text-white">
      {/* Scanlines overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[2]"
        style={{
          background:
            "repeating-linear-gradient(0deg,rgba(0,0,0,0.055) 0px,rgba(0,0,0,0.055) 1px,transparent 1px,transparent 3px)",
        }}
      />

      {/* Impact flash */}
      <div
        ref={(el) => {
          if (el) el.__impactFlash = true;
        }}
        id="reveal-impact-flash"
        className="pointer-events-none fixed inset-0 z-[6] bg-white"
        style={{ opacity: 0, transition: "opacity 0.5s ease-out" }}
      />

      {/* Main canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 z-[1] h-full w-full" />

      {/* Lottie ball */}
      <div
        id="reveal-lottie-ball"
        ref={lottieBallRef}
        className="pointer-events-none fixed z-[5]"
        style={{
          width: BALL_SIZE,
          height: BALL_SIZE,
          opacity: 0,
          left: -BALL_SIZE * 0.6,
          top: "calc(100% + 180px)",
          transition: "opacity 0.9s cubic-bezier(0.4,0,0.2,1)",
          background: "transparent",
        }}
      />

      {/* Winner overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[10] flex flex-col items-center justify-center overflow-hidden"
        style={{
          opacity: 0,
          pointerEvents: "none",
          background: "linear-gradient(135deg,#04092e 0%,#0a1560 100%)",
          transition: "opacity 0s",
        }}
      >
        {/* Inner flash */}
        <div
          id="reveal-overlay-flash"
          className="absolute inset-0 z-[1] bg-white"
          style={{ opacity: 0 }}
        />

        {/* Top/bottom bars */}
        <div
          className="w-bar top absolute left-0 right-0 top-0 h-[6px] origin-left scale-x-0"
          style={{
            background: "linear-gradient(90deg,#F47C20,#FFD700,#F47C20)",
          }}
        />
        <div
          className="w-bar bot absolute bottom-0 left-0 right-0 h-[6px] origin-right scale-x-0"
          style={{
            background: "linear-gradient(90deg,#1535CC,#F47C20,#1535CC)",
          }}
        />

        {/* Corner brackets */}
        <div className="absolute left-[18px] top-[18px] h-[55px] w-[55px] border-[4px] border-b-0 border-r-0 border-[#F47C20]" />
        <div className="absolute right-[18px] top-[18px] h-[55px] w-[55px] border-[4px] border-b-0 border-l-0 border-[#F47C20]" />
        <div className="absolute bottom-[18px] left-[18px] h-[55px] w-[55px] border-[4px] border-r-0 border-t-0 border-[#F47C20]" />
        <div className="absolute bottom-[18px] right-[18px] h-[55px] w-[55px] border-[4px] border-l-0 border-t-0 border-[#F47C20]" />

        {/* Glitch lines */}
        <div
          id="reveal-gl1"
          className="absolute left-0 right-0 h-[2px] bg-[rgba(244,124,32,0.7)]"
          style={{ opacity: 0, top: "30%" }}
        />
        <div
          id="reveal-gl2"
          className="absolute left-0 right-0 h-[2px] bg-[rgba(244,124,32,0.7)]"
          style={{ opacity: 0, top: "60%" }}
        />

        {/* Winner content */}
        <div className="relative z-[5] flex flex-col items-center text-center">
          <div
            id="reveal-badge"
            className="mb-4 rounded-full border border-[rgba(244,124,32,0.4)] px-5 py-1.5 text-[clamp(11px,1.5vw,14px)] font-semibold uppercase tracking-[10px] text-[#F47C20]"
            style={{
              opacity: 0,
              transform: "translateY(-10px)",
              fontFamily: "'Rajdhani',sans-serif",
            }}
          >
            {pollQuestion ? `✦ ${pollQuestion} ✦` : "✦ TODAY'S FAN POLL ✦"}
          </div>
          <div
            id="reveal-wlabel"
            className="text-[clamp(18px,3.5vw,36px)] uppercase tracking-[14px] text-[rgba(255,255,255,0.42)]"
            style={{
              opacity: 0,
              transform: "translateY(-8px)",
              fontFamily: "'Bebas Neue',sans-serif",
            }}
          >
            THE WINNER IS
          </div>
          <div
            id="reveal-wname"
            className="mt-2 text-center leading-[0.88] tracking-[2px]"
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: "clamp(60px,16vw,190px)",
              background:
                "linear-gradient(150deg,#fff 0%,#FFD700 30%,#F47C20 65%,#fff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              opacity: 0,
              transform: "scale(3.5) translateY(15px)",
              filter: "blur(18px)",
            }}
          >
            {winner?.name
              ? winner.name
                  .trim()
                  .toUpperCase()
                  .split(" ")
                  .map((w, i) => (
                    <span key={i} className="block">
                      {w}
                    </span>
                  ))
              : null}
          </div>
          <div
            id="reveal-wline"
            className="mt-3.5 rounded-full"
            style={{
              height: 5,
              width: 0,
              background: "linear-gradient(90deg,#F47C20,#FFD700,#F47C20)",
              boxShadow: "0 0 18px #F47C20,0 0 40px rgba(244,124,32,0.4)",
            }}
          />
          <div
            id="reveal-trophies"
            className="mt-6"
            style={{
              fontSize: "clamp(24px,3.5vw,42px)",
              letterSpacing: 18,
              filter: "drop-shadow(0 0 14px rgba(255,215,0,0.8))",
              opacity: 0,
            }}
          >
            🏆 🏏 🏆
          </div>
        </div>
      </div>

      {/* Waiting state */}
      {uiState === "waiting" ? (
        <div className="fixed inset-0 z-[15] flex flex-col items-center justify-center text-center px-6">
          <div
            className="text-[clamp(32px,6vw,72px)] font-extrabold uppercase italic tracking-tight text-white"
            style={{ fontFamily: "'Bebas Neue',sans-serif" }}
          >
            Waiting for winner…
          </div>
          <p className="mt-4 text-sm text-white/50 max-w-sm">
            The admin is picking the winner. This screen will update
            automatically.
          </p>
          <div className="mt-8 flex gap-2">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-2 w-2 rounded-full bg-[#F47C20] animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      ) : null}

      {/* Admin replay button */}
      {isAdmin && (uiState === "done" || uiState === "running") ? (
        <button
          type="button"
          onClick={replay}
          className="fixed bottom-6 right-6 z-[20] rounded-full border border-white/30 bg-black/40 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white/80 backdrop-blur hover:bg-black/60"
        >
          Replay
        </button>
      ) : null}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────

// Resets all overlay DOM back to pre-animation state.
function resetOverlayDOM(overlayEl, lottieBallEl) {
  if (lottieBallEl) {
    lottieBallEl.style.opacity = "0";
    lottieBallEl.style.transform = "";
    lottieBallEl.innerHTML = "";
  }
  if (!overlayEl) return;
  overlayEl.style.opacity = "0";
  overlayEl.style.pointerEvents = "none";
  const ids = [
    "reveal-badge",
    "reveal-wlabel",
    "reveal-wname",
    "reveal-wline",
    "reveal-trophies",
    "reveal-overlay-flash",
    "reveal-gl1",
    "reveal-gl2",
  ];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.animation = "none";
    void el.offsetWidth;
    el.style.animation = "";
    el.style.opacity = "";
    el.style.transform = "";
    el.style.width = "";
    el.style.filter = "";
  });
  const topBar = overlayEl.querySelector(".w-bar.top");
  const botBar = overlayEl.querySelector(".w-bar.bot");
  [topBar, botBar].forEach((el) => {
    if (!el) return;
    el.style.animation = "none";
    void el.offsetWidth;
    el.style.animation = "";
    el.style.transform = "scaleX(0)";
  });
  const flash = document.getElementById("reveal-overlay-flash");
  if (flash) {
    flash.style.animation = "none";
    void flash.offsetWidth;
    flash.style.animation = "";
    flash.style.opacity = "0";
  }
}

function startAnimation({ canvas, overlayEl, lottieBallEl, participants, winner, onDone }) {
  return runAnimation({ canvas, overlayEl, lottieBallEl, participants, winner, onDone });
}

// ─────────────────────────────────────────────────────────
// Core animation engine — extracted so it's easy to reason about separately
// ─────────────────────────────────────────────────────────

function runAnimation({ canvas, overlayEl, lottieBallEl, participants, winner, onDone }) {
  const ctx = canvas.getContext("2d");
  let W = (canvas.width = window.innerWidth);
  let H = (canvas.height = window.innerHeight);

  const onResize = () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };
  window.addEventListener("resize", onResize);

  // Build word list from participants (or fallback names)
  const names =
    participants.length > 0
      ? participants
      : winner
      ? [winner.name]
      : ["Fan", "Mumbai", "T20", "Cricket", "Winner", "Champion"];

  const winnerName = winner?.name ?? "";

  // Grid-jitter placement
  const COLS = 20;
  const ROWS = 13;
  const TOTAL = COLS * ROWS;
  const cellW = W / COLS;
  const cellH = H / ROWS;

  const words = [];
  for (let i = 0; i < TOTAL; i++) {
    const c = i % COLS;
    const r = Math.floor(i / COLS);
    const name = names[i % names.length];
    const isWinner = name === winnerName;
    const sz = SIZES[Math.floor(Math.random() * SIZES.length)];
    const col = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    const baseA = 0.32 + Math.random() * 0.55;
    const jx = (Math.random() - 0.5) * cellW * 0.85;
    const jy = (Math.random() - 0.5) * cellH * 0.85;
    words.push({
      name,
      isWinner,
      sz,
      x: (c + 0.5) * cellW + jx,
      y: (r + 0.5) * cellH + jy,
      vx: (Math.random() - 0.5) * 0.32,
      vy: (Math.random() - 0.5) * 0.22,
      r: col[0],
      g: col[1],
      b: col[2],
      baseAlpha: baseA,
      alpha: 0,
      angle: (Math.random() - 0.5) * 0.35,
      sx: 0,
      sy: 0,
      angVel: 0,
      scattered: false,
      fadeOut: false,
      rising: false,
    });
  }

  let phase = 0;
  let phaseT = 0;
  let shakeUntil = 0;
  let impactFired = false;
  let ballAnimFrame = null;
  let lottieAnimRef_local = null;
  let riseWord = null;
  let rise = null;
  let rafId = 0;
  let stopped = false;
  let glitchIv = null;
  let glitchT1 = null;
  let glitchT2 = null;
  let lastFrameTs = 0;

  // Phase timers
  const t1 = setTimeout(() => startPhase(1), DURATIONS[0]);
  const t2 = setTimeout(() => startPhase(2), DURATIONS[0] + DURATIONS[1]);
  const t3 = setTimeout(
    () => startPhase(3),
    DURATIONS[0] + DURATIONS[1] + DURATIONS[2],
  );

  function startPhase(p) {
    phase = p;
    phaseT = performance.now();
    if (p === 1) initBall();
    if (p === 2) initWinnerRise();
    if (p === 3) showOverlay();
  }

  // ── Lottie ball ──
  function initBall() {
    if (!lottieBallEl) return;
    const anim = lottie.loadAnimation({
      container: lottieBallEl,
      renderer: "canvas",
      loop: true,
      autoplay: true,
      path: BALL_ANIM_PATH,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid meet",
        clearCanvas: true,
      },
    });
    lottieAnimRef_local = anim;
    lottieBallEl.style.opacity = "1";
    animateBallPath();
  }

  function animateBallPath() {
    const P0x = -BALL_SIZE * 0.4, P0y = window.innerHeight + BALL_SIZE * 0.4;
    const P1x = window.innerWidth * 0.28, P1y = window.innerHeight * 0.62;
    const P2x = window.innerWidth * 0.5, P2y = window.innerHeight * 0.5;
    const dur = DURATIONS[1] * 0.5;
    const t0 = performance.now();

    function step(ts) {
      if (stopped) return;
      const raw = Math.min((ts - t0) / dur, 1);
      const e = 1 - Math.pow(1 - raw, 3);
      const u = 1 - e;
      const cx = u * u * P0x + 2 * u * e * P1x + e * e * P2x;
      const cy = u * u * P0y + 2 * u * e * P1y + e * e * P2y;

      lottieBallEl.style.left = cx - BALL_SIZE / 2 + "px";
      lottieBallEl.style.top = cy - BALL_SIZE / 2 + "px";

      scatterNear(cx, cy);

      if (raw < 1) {
        ballAnimFrame = requestAnimationFrame(step);
      } else {
        if (!impactFired) {
          impactFired = true;
          fireImpact(cx, cy);
        }
        lottieBallEl.style.opacity = "0";
        if (lottieAnimRef_local) lottieAnimRef_local.destroy();
      }
    }
    ballAnimFrame = requestAnimationFrame(step);
  }

  function scatterNear(bx, by) {
    words.forEach((w) => {
      if (w.scattered) return;
      const dx = w.x - bx, dy = w.y - by;
      const d = Math.sqrt(dx * dx + dy * dy);
      const hitR = BALL_SIZE * 0.35 + w.sz * 2;
      if (d < hitR) {
        w.scattered = true;
        const force = (1 - d / hitR) * 18;
        const nx = dx / (d || 1), ny = dy / (d || 1);
        w.sx = nx * force + (Math.random() - 0.5) * 4;
        w.sy = ny * force + (Math.random() - 0.5) * 4;
      }
    });
  }

  function fireImpact(bx, by) {
    const fl = document.getElementById("reveal-impact-flash");
    if (fl) {
      fl.style.transition = "opacity 0s";
      fl.style.opacity = "0.85";
      requestAnimationFrame(() => {
        fl.style.transition = "opacity 0.5s ease-out";
        fl.style.opacity = "0";
      });
    }
    shakeUntil = performance.now() + 520;
    const reach = Math.hypot(W, H) * 0.7;
    words.forEach((w) => {
      let dx = w.x - bx, dy = w.y - by;
      let d = Math.sqrt(dx * dx + dy * dy);
      if (d < 40) {
        const a = Math.random() * Math.PI * 2;
        dx = Math.cos(a); dy = Math.sin(a); d = 1;
      }
      const falloff = Math.max(0.35, 1 - d / reach);
      const force = 14 + falloff * 8 + Math.random() * 2;
      w.scattered = true;
      w.sx = (dx / d) * force + (Math.random() - 0.5) * 2.5;
      w.sy = (dy / d) * force + (Math.random() - 0.5) * 2.5;
      w.angVel = (Math.random() - 0.5) * 0.08;
    });
  }

  // ── Winner rise ──
  function initWinnerRise() {
    let best = null,
      bestD = Infinity;
    words.forEach((w) => {
      if (!w.isWinner) return;
      const d = Math.hypot(w.x - W / 2, w.y - H / 2);
      if (d < bestD) {
        bestD = d;
        best = w;
      }
    });
    if (!best) best = words[0]; // fallback
    riseWord = best;
    riseWord.rising = true;
    rise = {
      startX: riseWord.x,
      startY: riseWord.y,
      startSz: riseWord.sz,
      startAngle: riseWord.angle,
      targetSz: Math.min(W, H) * 0.13,
    };
    words.forEach((w) => {
      if (w !== riseWord) w.fadeOut = true;
    });
  }

  // ── Show overlay ──
  function showOverlay() {
    if (!overlayEl) {
      onDone?.();
      return;
    }
    overlayEl.style.opacity = "1";
    overlayEl.style.pointerEvents = "auto";

    // Animate bars
    const topBar = overlayEl.querySelector(".w-bar.top");
    const botBar = overlayEl.querySelector(".w-bar.bot");
    if (topBar)
      topBar.style.animation = "revealBarIn 0.45s 0.05s ease forwards";
    if (botBar)
      botBar.style.animation = "revealBarIn 0.45s 0.05s ease forwards";

    // Flash
    const flash = document.getElementById("reveal-overlay-flash");
    if (flash) flash.style.animation = "revealFlashIt 0.6s ease forwards";

    // Badge
    const badge = document.getElementById("reveal-badge");
    if (badge) badge.style.animation = "revealUpIn 0.4s 0.15s forwards";

    // Label
    const label = document.getElementById("reveal-wlabel");
    if (label) label.style.animation = "revealUpIn 0.4s 0.3s forwards";

    // Name
    const wname = document.getElementById("reveal-wname");
    if (wname)
      wname.style.animation =
        "revealSlamIn 0.75s 0.55s cubic-bezier(0.22,1,0.36,1) forwards";

    // Line
    const wline = document.getElementById("reveal-wline");
    if (wline) wline.style.animation = "revealLineIn 0.5s 1.2s ease forwards";

    // Trophies
    const trophies = document.getElementById("reveal-trophies");
    if (trophies) trophies.style.animation = "revealUpIn 0.5s 1.8s forwards";

    // Glitch
    glitchT1 = setTimeout(glitchFx, 380);
    glitchT2 = setTimeout(() => { if (!stopped) onDone?.(); }, 2500);
  }

  function glitchFx() {
    if (stopped) return;
    const lines = [
      document.getElementById("reveal-gl1"),
      document.getElementById("reveal-gl2"),
    ];
    let c = 0;
    glitchIv = setInterval(() => {
      if (stopped) {
        clearInterval(glitchIv);
        glitchIv = null;
        return;
      }
      lines.forEach((l) => {
        if (!l) return;
        l.style.top = Math.random() * 88 + "%";
        l.style.opacity = Math.random() > 0.5 ? "1" : "0";
        l.style.height = Math.random() * 2.5 + 1 + "px";
      });
      if (++c > 14) {
        clearInterval(glitchIv);
        glitchIv = null;
        lines.forEach((l) => {
          if (l) l.style.opacity = "0";
        });
      }
    }, 72);
  }

  // ── Draw background ──
  function drawBg() {
    ctx.fillStyle = "#04092e";
    ctx.fillRect(0, 0, W, H);
    const rad = ctx.createRadialGradient(
      W / 2,
      H * 0.55,
      0,
      W / 2,
      H * 0.5,
      Math.max(W, H) * 0.68,
    );
    rad.addColorStop(0, "rgba(21,53,204,0.15)");
    rad.addColorStop(1, "rgba(4,9,46,0)");
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, W, H);

    // Perspective grid floor
    ctx.save();
    ctx.globalAlpha = 0.035;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    const gTop = H * 0.48;
    const cx2 = W / 2;
    for (let x = -W; x < W * 2; x += 75) {
      ctx.beginPath();
      ctx.moveTo(cx2, gTop);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let row = 0; row <= 7; row++) {
      const f = row / 7;
      const yPos = gTop + (H - gTop) * f;
      const xOff = f * W * 0.62;
      ctx.beginPath();
      ctx.moveTo(cx2 - xOff, yPos);
      ctx.lineTo(cx2 + xOff, yPos);
      ctx.stroke();
    }
    ctx.restore();
  }

  // ── Camera shake ──
  function applyShake() {
    const now = performance.now();
    if (shakeUntil > now) {
      const left = (shakeUntil - now) / 520;
      const k = 18 * left * left;
      const sx = (Math.random() - 0.5) * k * 2;
      const sy = (Math.random() - 0.5) * k * 2;
      canvas.style.transform = `translate(${sx}px,${sy}px)`;
      if (lottieBallEl) lottieBallEl.style.transform = `translate(${sx * 0.4}px,${sy * 0.4}px)`;
    } else if (canvas.style.transform) {
      canvas.style.transform = "";
      if (lottieBallEl) lottieBallEl.style.transform = "";
    }
  }

  // ── Update + draw words ──
  function updateDrawWords(elapsed) {
    words.forEach((w) => {
      if (phase === 0) {
        if (w.alpha < w.baseAlpha)
          w.alpha = Math.min(w.baseAlpha, w.alpha + 0.006);
        w.x += w.vx;
        w.y += w.vy;
        if (w.x < -160) w.x = W + 80;
        if (w.x > W + 160) w.x = -80;
        if (w.y < -50) w.y = H + 25;
        if (w.y > H + 50) w.y = -25;
      }
      if (phase === 1) {
        if (w.scattered) {
          w.sx *= 0.985;
          w.sy *= 0.985;
          w.x += w.sx;
          w.y += w.sy;
          w.angle += w.angVel || 0;
        } else {
          w.x += w.vx;
          w.y += w.vy;
        }
      }
      if (phase === 2) {
        if (w.fadeOut) {
          w.sx *= 0.985;
          w.sy *= 0.985;
          w.x += w.sx;
          w.y += w.sy;
          w.angle += w.angVel || 0;
          w.alpha = Math.max(0, w.alpha - 0.012);
        }
        if (w.rising && rise) {
          const t = Math.min(elapsed / DURATIONS[2], 1);
          const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          w.x = rise.startX + (W / 2 - rise.startX) * e;
          w.y = rise.startY + (H / 2 - rise.startY) * e;
          w.sz = rise.startSz + (rise.targetSz - rise.startSz) * e;
          w.angle = rise.startAngle * (1 - e);
          w.alpha = 0.55 + 0.45 * e;
        }
      }

      if (w.alpha < 0.01) return;

      ctx.save();
      ctx.globalAlpha = w.alpha;
      ctx.translate(w.x, w.y);
      ctx.rotate(w.angle);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `${Math.round(w.sz)}px 'Bebas Neue', 'Oswald', sans-serif`;

      if (w.rising && phase >= 2 && rise) {
        const t = Math.min(elapsed / DURATIONS[2], 1);
        const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        const hw = w.sz * 3.5;
        const grad = ctx.createLinearGradient(-hw, 0, hw, 0);
        grad.addColorStop(0, "#ffffff");
        grad.addColorStop(0.3, "#FFD700");
        grad.addColorStop(0.7, "#F47C20");
        grad.addColorStop(1, "#ffffff");
        ctx.fillStyle = grad;
        ctx.shadowColor = "rgba(255,190,60,0.95)";
        ctx.shadowBlur = 28 * e;
      } else {
        ctx.fillStyle = `rgba(${w.r},${w.g},${w.b},1)`;
      }

      ctx.fillText(w.name, 0, 0);
      ctx.restore();
    });
  }

  // ── Render loop — capped at ~60 fps ──
  function loop(ts) {
    if (stopped) return;
    rafId = requestAnimationFrame(loop);
    if (ts - lastFrameTs < 16) return; // skip frames beyond ~60 fps
    lastFrameTs = ts;
    const elapsed = ts - phaseT;
    applyShake();
    drawBg();
    updateDrawWords(elapsed);
  }

  // Inject keyframes into document once
  injectKeyframes();

  // Start the loop — if fonts are already loaded (replay case) kick off immediately
  // via rAF so the call stack unwinds before the first draw. If fonts are still
  // loading, wait for them first (initial page load only).
  if (document.fonts.status === "loaded") {
    rafId = requestAnimationFrame(loop);
  } else {
    document.fonts.ready.then(() => {
      if (!stopped) rafId = requestAnimationFrame(loop);
    });
  }

  // Cleanup function — called when component unmounts or replay triggers
  return () => {
    stopped = true;
    cancelAnimationFrame(rafId);
    if (ballAnimFrame) cancelAnimationFrame(ballAnimFrame);
    clearTimeout(t1);
    clearTimeout(t2);
    clearTimeout(t3);
    if (glitchT1) clearTimeout(glitchT1);
    if (glitchT2) clearTimeout(glitchT2);
    if (glitchIv) clearInterval(glitchIv);
    window.removeEventListener("resize", onResize);
    if (lottieAnimRef_local) {
      try { lottieAnimRef_local.destroy(); } catch { /* ignore */ }
    }
    if (overlayEl) {
      overlayEl.style.opacity = "0";
      overlayEl.style.pointerEvents = "none";
    }
    canvas.style.transform = "";
  };
}

let keyframesInjected = false;
function injectKeyframes() {
  if (keyframesInjected) return;
  keyframesInjected = true;
  const style = document.createElement("style");
  style.textContent = `
    @keyframes revealBarIn { to { transform: scaleX(1); } }
    @keyframes revealFlashIt {
      0%{opacity:.9}20%{opacity:0}45%{opacity:.55}65%{opacity:0}85%{opacity:.28}100%{opacity:0}
    }
    @keyframes revealUpIn { to { opacity: 1; transform: translateY(0); } }
    @keyframes revealSlamIn { to { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); } }
    @keyframes revealLineIn { to { width: min(580px, 78vw); } }
  `;
  document.head.appendChild(style);
}
