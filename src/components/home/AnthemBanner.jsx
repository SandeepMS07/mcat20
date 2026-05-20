"use client";

import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";

const YOUTUBE_VIDEO_ID = "nhblvoBIb0o";
const PREVIEW_SRC = `https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&mute=1&controls=0&modestbranding=1&playsinline=1&rel=0&disablekb=1&iv_load_policy=3&fs=0&cc_load_policy=0&loop=1&playlist=${YOUTUBE_VIDEO_ID}`;

const AnthemBanner = () => {
  const [open, setOpen] = useState(false);
  const [previewPlaying, setPreviewPlaying] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setPreviewPlaying(true), 1200);
    return () => window.clearTimeout(timeout);
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
              "linear-gradient(135deg, #060A17 0%, #0E1A47 40%, #142A7C 70%, #1F3895 100%)",
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

          {/* Right-side video preview — fills the right side of the banner (full-width on mobile) */}
          <div
            aria-hidden
            className="absolute inset-0 z-[5] overflow-hidden sm:inset-y-0 sm:left-auto sm:right-0 sm:w-[44%] lg:w-[40%]"
          >
            {/* Autoplaying preview — direct iframe so autoplay starts immediately.
                pointer-events-none keeps YouTube hover controls from appearing. */}
            <div
              className={`pointer-events-none absolute left-1/2 top-1/2 h-[260%] w-[260%] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 [&_iframe]:pointer-events-none ${
                previewPlaying ? "opacity-100" : "opacity-0"
              }`}
            >
              <iframe
                src={PREVIEW_SRC}
                title="T20 Mumbai anthem preview"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen={false}
                onLoad={() => setPreviewPlaying(true)}
                tabIndex={-1}
                className="h-full w-full border-0"
              />
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

            {/* Mobile full overlay — darken video so text reads */}
            <div
              className="pointer-events-none absolute inset-0 z-[12] sm:hidden"
              style={{
                background:
                  "linear-gradient(180deg, rgba(6,10,23,0.85) 0%, rgba(14,26,71,0.55) 50%, rgba(6,10,23,0.85) 100%)",
              }}
            />
            {/* Desktop left edge blend into the banner */}
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-[12] hidden w-24 sm:block sm:w-32"
              style={{
                background:
                  "linear-gradient(90deg, #0E1A47 0%, rgba(14,26,71,0.4) 60%, transparent 100%)",
              }}
            />
          </div>

          {/* Content */}
          <div className="absolute inset-0 z-10 flex flex-col items-start justify-end pb-[5vw] sm:justify-center sm:pb-0 gap-3 px-[4vw] py-[2vw] sm:gap-4 sm:px-8 sm:py-6 md:gap-5 md:px-12 md:py-8 lg:px-16 lg:py-10">
            {/* Orange accent line */}
            <span
              aria-hidden
              className="h-[3px] w-10 rounded-full bg-gradient-to-r from-[#f68323] to-[#d84800] sm:w-12 md:w-16"
            />

            <h2 className="font-extrabold leading-[1.15] tracking-tight text-white text-[18px] sm:text-base md:text-xl lg:text-2xl xl:text-3xl">
              Introducing the Anthem of the{" "}
              <span className="bg-gradient-to-r from-[#ffb058] via-[#f68323] to-[#d84800] bg-clip-text text-transparent">
                T20 Mumbai
              </span>
              <br className="hidden sm:inline" /> Men&rsquo;s and Women&rsquo;s
              League 2026
            </h2>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="group relative inline-flex w-fit cursor-pointer items-center gap-3 rounded-md bg-gradient-to-b from-[#d84800] to-[#f68323] px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white shadow-[0_8px_24px_rgba(216,72,0,0.4)] transition hover:brightness-110 sm:px-5 sm:py-2.5 sm:text-xs md:px-6 md:py-3 md:text-sm"
            >
              <span
                aria-hidden
                className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#d84800]"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              Watch now
              <span
                aria-hidden
                className="inline-block translate-x-0 transition group-hover:translate-x-1"
              >
                →
              </span>
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
                src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                title="T20 Mumbai League 2026 Anthem"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AnthemBanner;
