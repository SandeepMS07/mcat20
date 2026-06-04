"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const HPTO_JS_SRC = "https://d3ml9nicy4vh6j.cloudfront.net/t20mumbai/hpto.js";
const HPTO_SCRIPT_ID = "mumbai-hpto-script";
const MATCH_CENTER_PATH = "/matchcentre";

export default function HptoWidget() {
  const [closed, setClosed] = useState(false);
  const containerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (closed) return;
    const existing = document.getElementById(HPTO_SCRIPT_ID);
    if (existing) existing.remove();
    const script = document.createElement("script");
    script.src = HPTO_JS_SRC;
    script.async = false;
    script.id = HPTO_SCRIPT_ID;
    document.body.appendChild(script);
    return () => {
      const s = document.getElementById(HPTO_SCRIPT_ID);
      if (s) s.remove();
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [closed]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || closed) return;

    const handleClick = (e) => {
      const anchor = e.target?.closest("a");
      if (!anchor?.href) return;

      let parsed;
      try {
        parsed = new URL(anchor.href, window.location.origin);
      } catch {
        return;
      }

      const hostname = parsed.hostname.replace(/^www\./, "");
      const isT20Mumbai = hostname === "t20mumbai.com" || hostname === window.location.hostname.replace(/^www\./, "");
      const isMatchCenter =
        parsed.pathname === MATCH_CENTER_PATH ||
        parsed.pathname.startsWith(`${MATCH_CENTER_PATH}/`) ||
        parsed.pathname.startsWith("/matches/");

      if (!isT20Mumbai || !isMatchCenter) return;

      e.preventDefault();
      e.stopPropagation();
      router.push(`${parsed.pathname}${parsed.search}${parsed.hash}`);
    };

    container.addEventListener("click", handleClick, true);
    return () => container.removeEventListener("click", handleClick, true);
  }, [closed, router]);

  if (closed) return null;

  return (
    <>
      {/* Background bar sits above the app banner (z-999) */}
      <div className="fixed bottom-0 left-0 w-full h-[135px] md:h-[100px] bg-[#081d65] z-[1001] pointer-events-none" />
      {/* Close button above both */}
      <button
        onClick={() => setClosed(true)}
        className="fixed bottom-[130px] md:bottom-[95px] right-2 z-[1003] flex h-6 w-6 items-center justify-center rounded-full bg-black text-white text-xs hover:bg-gray-800"
        aria-label="Close widget"
      >
        ✕
      </button>
      <div
        ref={containerRef}
        className="smmumbaihpto hpto-horizontal hpto-fixed"
      />
    </>
  );
}
