"use client";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

const ELFSIGHT_APP_CLASS = "elfsight-app-699da6b2-483b-4520-a7cd-82f1db1898af";
const LOAD_FALLBACK_MS = 8000;

const SocialsSkeleton = ({ hideHeader = false }) => (
  <div>
    {!hideHeader && (
      <div className="mb-3 flex items-center gap-4 rounded-md bg-white px-4 py-3 sm:gap-6 sm:px-6 sm:py-4">
        <div className="h-10 w-10 shrink-0 rounded-full bg-slate-200 sm:h-12 sm:w-12" />
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="h-3 w-28 rounded bg-slate-200 sm:h-4 sm:w-40" />
          <div className="h-2.5 w-20 rounded bg-slate-100 sm:h-3 sm:w-28" />
        </div>
        <div className="hidden gap-6 sm:flex">
          <div className="flex flex-col items-center gap-1">
            <div className="h-3 w-8 rounded bg-slate-200" />
            <div className="h-2 w-10 rounded bg-slate-100" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="h-3 w-8 rounded bg-slate-200" />
            <div className="h-2 w-12 rounded bg-slate-100" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="h-3 w-8 rounded bg-slate-200" />
            <div className="h-2 w-12 rounded bg-slate-100" />
          </div>
        </div>
        <div className="h-8 w-20 shrink-0 rounded-md bg-[#2186e3]/40 sm:h-9 sm:w-24" />
      </div>
    )}
    <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:grid-cols-3 lg:grid-cols-5">
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i} className="aspect-square rounded-sm bg-white/10" />
      ))}
    </div>
  </div>
);

const Socials = ({ hideHeader = false, title, hashtag }) => {
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
    <div className="relative">
      <link rel="preconnect" href="https://static.elfsight.com" />
      <link rel="preconnect" href="https://core.service.elfsight.com" />
      <Script
        src="https://static.elfsight.com/platform/platform.js"
        strategy="afterInteractive"
      />
      <div className="section-width section-padding">
        {title ? (
          <div className="mb-6 flex items-start justify-between gap-4">
            <h2 className="flex items-baseline gap-3 text-3xl font-extrabold uppercase italic leading-[0.95] text-[#ffffff] sm:text-4xl lg:text-6xl">
              <span
                className="text-transparent [-webkit-text-stroke:1.5px_#ffffff]"
                style={{ WebkitTextStroke: "1.5px #ffffff" }}
              >
                {title.split(" ")[0]}
              </span>
              <span>{title.split(" ").slice(1).join(" ")}</span>
            </h2>
            {hashtag ? (
              <span className="shrink-0 self-center rounded-full border border-white/40 px-4 py-2 text-sm font-semibold italic text-white sm:text-base">
                {hashtag}
              </span>
            ) : null}
          </div>
        ) : (
          <h2 className="flex flex-col text-3xl font-extrabold uppercase italic leading-[0.95] text-[#ffffff] sm:text-4xl lg:text-6xl mb-6">
            <span
              className="text-transparent [-webkit-text-stroke:1.5px_#ffffff]"
              style={{ WebkitTextStroke: "1.5px #ffffff" }}
            >
              THE
            </span>
            <span>SOCIALS</span>
          </h2>
        )}
        <div
          className={`relative grid ${
            hideHeader ? "socials-hide-banner" : ""
          }`}
        >
          {!loaded && (
            <div className="col-start-1 row-start-1 z-0">
              <SocialsSkeleton hideHeader={hideHeader} />
            </div>
          )}
          <div
            ref={containerRef}
            className={`${ELFSIGHT_APP_CLASS} col-start-1 row-start-1 z-10 transition-opacity duration-300 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default Socials;
