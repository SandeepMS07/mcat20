"use client";
import { useEffect, useState } from "react";

const YOUTUBE_EMBED_URL =
  "https://www.youtube.com/embed/nhblvoBIb0o?si=FND1jGn8MSHc9Vnh&autoplay=1&rel=0";

const AnthemBanner = () => {
  const [showVideo, setShowVideo] = useState(false);

  const openVideo = () => setShowVideo(true);
  const closeVideo = () => setShowVideo(false);

  useEffect(() => {
    if (!showVideo) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeVideo();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [showVideo]);

  return (
    <div className="relative bg-white">
      <img
        src="/images/elements/section-element.png"
        className="absolute right-0 top-0 md:block hidden"
        alt="element"
      />
      <div className="section-width relative z-10 pt-10 pb-2 sm:pt-14 sm:pb-3 lg:pt-16 lg:pb-4">
      <button
        type="button"
        onClick={openVideo}
        aria-label="Watch the T20 Mumbai 2026 anthem"
        className="group relative block w-full overflow-hidden rounded-[20px] text-left shadow-[0_4px_2px_rgba(0,0,0,0.25)]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(13,55,169,0.78), rgba(13,55,169,0.78)), url('/images/home/iconicWankhedeStadium.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-[55%]"
          style={{
            background:
              "radial-gradient(ellipse at 80% 50%, rgba(246,131,35,0.55) 0%, rgba(246,131,35,0.2) 35%, rgba(13,55,169,0) 70%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-[8%] hidden w-[40%] sm:block"
          style={{
            background:
              "repeating-linear-gradient(115deg, rgba(246,131,35,0.18) 0px, rgba(246,131,35,0.18) 14px, rgba(246,131,35,0) 14px, rgba(246,131,35,0) 60px)",
            mixBlendMode: "screen",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-1/2 h-[120%] w-[340px] -translate-y-1/2 blur-[42px]"
          style={{ background: "#143083" }}
        />

        <div className="relative z-10 flex flex-col gap-3 px-6 py-6 sm:gap-4 sm:px-10 sm:py-7 lg:px-12 lg:py-9">
          <h2 className="max-w-[90%] bg-gradient-to-b from-[#ff8000] via-[#e17100] to-[#ffae5c] bg-clip-text font-extrabold italic text-transparent text-[20px] leading-[1.25] tracking-tight sm:text-[26px] sm:leading-[1.25] lg:max-w-[60%] lg:text-[34px] lg:leading-[1.27]">
            Introducing the anthem of the T20 Mumbai Men&rsquo;s and Women&rsquo;s
            League 2026
          </h2>
          <span className="inline-flex w-fit items-center justify-center rounded-full bg-gradient-to-b from-[#d84800] to-[#f68323] px-5 py-1.5 text-[12px] font-medium italic uppercase text-white transition-transform duration-200 group-hover:scale-[1.03] sm:text-[14px]">
            Watch Now
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="ml-2 h-4 w-4 fill-current"
            >
              <circle cx="10" cy="10" r="9" fill="white" fillOpacity="0.18" />
              <path d="M8 6.5l5 3.5-5 3.5v-7z" fill="white" />
            </svg>
          </span>
        </div>
      </button>

      </div>
      {showVideo && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-4"
          onClick={closeVideo}
        >
          <div
            className="relative aspect-video w-full max-w-[960px] overflow-hidden rounded-lg bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              width="100%"
              height="100%"
              src={YOUTUBE_EMBED_URL}
              title="T20 Mumbai League Anthem 2026"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full rounded-lg"
            />
            <button
              type="button"
              onClick={closeVideo}
              aria-label="Close video"
              className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#E07E27] text-white hover:bg-[#c86a1e]"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnthemBanner;
