"use client";

import { useEffect, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";

const YOUTUBE_VIDEO_ID = "nhblvoBIb0o";
const YT_API_SRC = "https://www.youtube.com/iframe_api";
const YT_NO_COOKIE_HOST = "https://www.youtube-nocookie.com";

const loadYouTubeApi = () => {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  return new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prev === "function") prev();
      resolve(window.YT);
    };
    if (!document.querySelector(`script[src="${YT_API_SRC}"]`)) {
      const tag = document.createElement("script");
      tag.src = YT_API_SRC;
      document.body.appendChild(tag);
    }
  });
};

const AnthemBanner = () => {
  const [open, setOpen] = useState(false);
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const previewContainerRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    let player;
    loadYouTubeApi().then((YT) => {
      if (cancelled || !YT || !previewContainerRef.current) return;
      player = new YT.Player(previewContainerRef.current, {
        videoId: YOUTUBE_VIDEO_ID,
        host: YT_NO_COOKIE_HOST,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          disablekb: 1,
          iv_load_policy: 3,
          fs: 0,
          cc_load_policy: 0,
        },
        events: {
          onReady: (e) => {
            try {
              e.target.mute();
              e.target.playVideo();
            } catch (_) {}
          },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PLAYING) setPreviewPlaying(true);
          },
        },
      });
      playerRef.current = player;
    });
    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy?.();
      } catch (_) {}
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <section className="bg-[#192A66] pb-4 md:pb-6">
      <div className="section-width">
        <div
          className="relative overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/15"
          style={{
            background:
              "radial-gradient(120% 140% at 0% 50%, #1F3895 0%, #162468 45%, #0B144A 100%)",
          }}
        >
          {/* Diagonal orange light sweep (right side) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-[-10%] w-[70%]"
            style={
              {
                // background:
                //   "linear-gradient(115deg, transparent 30%, rgba(246,131,35,0.45) 55%, rgba(216,72,0,0.25) 70%, transparent 90%)",
                // filter: "blur(2px)",
              }
            }
          />
          {/* Soft glow on the right edge to anchor the video */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 top-1/2 hidden h-[140%] w-[55%] -translate-y-1/2 sm:block"
            style={{
              background:
                "radial-gradient(closest-side, rgba(255,170,80,0.35), transparent 70%)",
            }}
          />
          {/* Theme texture overlay */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[url('/images/texture-bg.png')] bg-cover bg-center bg-no-repeat"
          />

          {/* Mobile vertical spacer */}
          <div className="block aspect-[16/9] sm:hidden" />
          {/* Desktop horizontal spacer */}
          <div className="hidden aspect-[1697/300] sm:block" />

          {/* Right-side video preview — fills the right side of the banner */}
          <div
            aria-hidden
            className="absolute inset-y-0 right-0 z-[5] hidden w-[44%] overflow-hidden sm:block lg:w-[40%]"
          >
            {/* Player mount point — YT API mounts the iframe into this node.
                pointer-events-none here is critical: it makes the iframe ignore mouse/touch entirely,
                so YouTube never shows hover controls (play/pause/prev/next). */}
            <div
              className={`pointer-events-none absolute left-1/2 top-1/2 h-[260%] w-[260%] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 [&_iframe]:pointer-events-none ${
                previewPlaying ? "opacity-100" : "opacity-0"
              }`}
            >
              <div ref={previewContainerRef} className="h-full w-full" />
            </div>

            {/* Skeleton / thumbnail cover — sits ABOVE the iframe until playback truly begins. */}
            <div
              aria-hidden
              className={`absolute inset-0 z-[10] overflow-hidden bg-cover bg-center transition-opacity duration-500 ${
                previewPlaying ? "pointer-events-none opacity-0" : "opacity-100"
              }`}
              style={{
                backgroundImage: `url('https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/maxresdefault.jpg')`,
                backgroundColor: "#0B144A",
              }}
            >
              {/* Animated shimmer to read as a skeleton while loading */}
              <div
                aria-hidden
                className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#162468]/40 via-transparent to-[#0B144A]/40"
              />
            </div>

            {/* Left edge blend into the banner */}
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-[12] w-24 sm:w-32"
              style={{
                background:
                  "linear-gradient(90deg, #162468 0%, rgba(22,36,104,0.4) 60%, transparent 100%)",
              }}
            />
          </div>

          {/* Content */}
          <div className="absolute inset-0 z-10 flex flex-col items-start justify-center gap-[2vw] px-[4vw] py-[2vw] sm:gap-3 sm:px-8 sm:py-6 md:gap-4 md:px-12 md:py-8 lg:px-16 lg:py-10">
            <h2
              className="bg-gradient-to-b from-[#ff8000] via-[#e17100] to-[#ffae5c] bg-clip-text text-[3.6vw] font-extrabold italic leading-[1.2] tracking-tight text-transparent sm:text-base md:text-xl lg:text-2xl xl:text-3xl"
              style={{ WebkitBackgroundClip: "text" }}
            >
              Introducing the anthem of the T20 Mumbai
              <br className="hidden sm:inline" /> Men&rsquo;s and Women&rsquo;s
              League 2026
            </h2>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full bg-gradient-to-b from-[#d84800] to-[#f68323] px-[3.5vw] py-[1vw] text-[2.5vw] font-semibold italic uppercase text-white shadow-md transition hover:brightness-110 sm:px-5 sm:py-2 sm:text-xs md:px-6 md:text-sm"
            >
              <span
                aria-hidden
                className="flex h-5 w-5 items-center justify-center rounded-full bg-white/95 text-[#d84800] sm:h-5 sm:w-5"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-3 w-3"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              Watch now
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="T20 Mumbai anthem video"
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close video"
              className="absolute -top-10 right-0 text-white transition hover:text-orange-400"
            >
              <RxCross2 size={28} />
            </button>
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black shadow-2xl">
              <iframe
                src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&mute=1&controls=0&modestbranding=1&playsinline=1&rel=0&disablekb=1&iv_load_policy=3&fs=0`}
                title="T20 Mumbai League 2026 Anthem"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="pointer-events-none absolute inset-0 h-full w-full"
                tabIndex={-1}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AnthemBanner;
