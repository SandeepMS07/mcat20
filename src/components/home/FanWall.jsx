"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

const ELFSIGHT_APP_CLASS = "elfsight-app-b9288b7b-ed2e-44f9-b830-6806675a82f1";
const LOAD_FALLBACK_MS = 8000;

const FanWallSkeleton = () => (
  <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:grid-cols-3 lg:grid-cols-5">
    {Array.from({ length: 10 }).map((_, i) => (
      <div key={i} className="aspect-square rounded-sm bg-white/10" />
    ))}
  </div>
);

const FanWall = () => {
  const containerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    if (node.childElementCount > 0) {
      setLoaded(true);
      return;
    }

    const observer = new MutationObserver(() => {
      if (node.childElementCount > 0) {
        setLoaded(true);
        observer.disconnect();
      }
    });
    observer.observe(node, { childList: true, subtree: true });

    const timer = window.setTimeout(() => setLoaded(true), LOAD_FALLBACK_MS);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <section className="relative overflow-hidden py-12 sm:py-16">
      <link rel="preconnect" href="https://static.elfsight.com" />
      <link rel="preconnect" href="https://core.service.elfsight.com" />
      <Script
        src="https://static.elfsight.com/platform/platform.js"
        strategy="afterInteractive"
      />

      <div className="section-width relative">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90 ring-1 ring-white/15">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F68323]" />
              Community
            </div>
            <h2 className="flex flex-row gap-2 text-3xl font-extrabold uppercase italic leading-[0.95] text-white sm:text-4xl lg:text-5xl">
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "1.5px #ffffff" }}
              >
                Fan
              </span>
              <span>Wall</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
              Capture your T20 Mumbai moment, post on Instagram with{" "}
              <span className="font-semibold text-white">
                #ChanceSoduNako
              </span>{" "}
              and stand a chance to win free match tickets.
            </p>
          </div>
          <a
            href="https://www.instagram.com/explore/tags/chancesodunako/"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex w-fit items-center gap-2 self-start rounded-full bg-[#F68323] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(246,131,35,0.6)] transition-all hover:bg-white hover:text-[#1B2F7A] hover:shadow-[0_10px_24px_-8px_rgba(255,255,255,0.5)] sm:text-base"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.3 1 .4 2.2.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .3-2.2.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.3 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.6c-3.1 0-3.5 0-4.7.1-1.1.1-1.7.2-2.1.4-.5.2-.9.5-1.3.9-.4.4-.7.8-.9 1.3-.2.4-.3 1-.4 2.1-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1.1.2 1.7.4 2.1.2.5.5.9.9 1.3.4.4.8.7 1.3.9.4.2 1 .3 2.1.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.5 1.3-.9.4-.4.7-.8.9-1.3.2-.4.3-1 .4-2.1.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.5-.9-.9-1.3-.4-.4-.8-.7-1.3-.9-.4-.2-1-.3-2.1-.4-1.2-.1-1.6-.1-4.7-.1zm0 2.7a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 9.1a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2zm5.7-9.3a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6z" />
            </svg>
            Share Your Moment
          </a>
        </div>

        <div className="relative grid">
          {!loaded && (
            <div className="col-start-1 row-start-1 z-0">
              <FanWallSkeleton />
            </div>
          )}
          <div
            ref={containerRef}
            data-elfsight-app-lazy
            className={`${ELFSIGHT_APP_CLASS} col-start-1 row-start-1 z-10 transition-opacity duration-300 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </div>
    </section>
  );
};

export default FanWall;
