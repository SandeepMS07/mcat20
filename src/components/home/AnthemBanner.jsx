"use client";

import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";

const YOUTUBE_VIDEO_ID = "nhblvoBIb0o";

const AnthemBanner = () => {
  const [open, setOpen] = useState(false);

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
    <section className="bg-[#192A66] py-10 md:py-14">
      <div className="section-width">
        <div className="relative overflow-hidden   shadow-lg">
          {/* Background image — mobile (tall) */}
          <img
            src="/images/home/banner/anthem-m.png"
            alt=""
            aria-hidden="true"
            className="block h-auto w-full lg:hidden"
          />
          {/* Background image — desktop (wide) */}
          <img
            src="/images/home/banner/anthem.png"
            alt=""
            aria-hidden="true"
            className="hidden h-auto w-full lg:block"
          />

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
              className="inline-flex w-fit cursor-pointer items-center rounded-full bg-gradient-to-b from-[#d84800] to-[#f68323] px-[3.5vw] py-[1vw] text-[2.5vw] font-semibold italic uppercase text-white shadow-md transition hover:brightness-110 sm:px-5 sm:py-2 sm:text-xs md:px-6 md:text-sm"
            >
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
                src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0`}
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
