"use client";

import { useEffect, useState } from "react";

export default function HptoWidget() {
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (closed) return;
    const existing = document.querySelector(
      'script[src="https://d3ml9nicy4vh6j.cloudfront.net/t20mumbai/hpto.js"]'
    );
    if (existing) existing.remove();
    const script = document.createElement("script");
    script.src = "https://d3ml9nicy4vh6j.cloudfront.net/t20mumbai/hpto.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, [closed]);

  useEffect(() => {
    if (closed) return;
    const handleClick = (e) => {
      const anchor = e.target.closest("a");
      if (!anchor) return;
      const widget = document.querySelector(".smmumbaihpto");
      if (!widget || !widget.contains(anchor)) return;
      if (anchor.target === "_blank") {
        e.preventDefault();
        window.location.href = anchor.href;
      }
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [closed]);

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
      <div className="smmumbaihpto hpto-horizontal hpto-fixed"></div>
    </>
  );
}
