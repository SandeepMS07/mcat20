"use client";
import { useEffect } from "react";
import FanPoll from "./FanPoll";

const Socials = () => {
  useEffect(() => {
    const scriptSrc = "https://static.elfsight.com/platform/platform.js";
    const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = scriptSrc;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="relative bg-gradient-to-bl from-[#1C398E] to-[#0E005A]">
      <div className="section-width section-padding">
        <h2 className="flex flex-col text-3xl font-extrabold uppercase italic leading-[0.95] text-[#ffffff] sm:text-4xl lg:text-6xl mb-6">
          <span
            className="text-transparent [-webkit-text-stroke:1.5px_#ffffff]"
            style={{ WebkitTextStroke: "1.5px #ffffff" }}
          >
            THE
          </span>
          <span>SOCIALS</span>
        </h2>
        <div>
          <div
            className="elfsight-app-699da6b2-483b-4520-a7cd-82f1db1898af"
            data-elfsight-app-lazy
          />
        </div>
      </div>
      <FanPoll />
    </div>
  );
};

export default Socials;
