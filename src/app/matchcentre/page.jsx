"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const MATCHCENTRE_CSS = "https://d3ml9nicy4vh6j.cloudfront.net/t20mumbai/app.css";
const MATCHCENTRE_SCRIPT = "https://d3ml9nicy4vh6j.cloudfront.net/t20mumbai/app_matchcentre.js";
const WIDGET_SCRIPT_ID = "matchcentre-widget-script";

const loadWidgetScript = () => {
  if (!document.querySelector(`link[href="${MATCHCENTRE_CSS}"]`)) {
    const link = document.createElement("link");
    link.href = MATCHCENTRE_CSS;
    link.rel = "stylesheet";
    link.type = "text/css";
    document.head.appendChild(link);
  }

  const existingScript = document.getElementById(WIDGET_SCRIPT_ID);
  if (existingScript) {
    existingScript.remove();
  }

  const script = document.createElement("script");
  script.src = MATCHCENTRE_SCRIPT;
  script.async = true;
  script.id = WIDGET_SCRIPT_ID;
  document.body.appendChild(script);
  return script;
};

export default function Page() {
  const [widgetLoaded, setWidgetLoaded] = useState(false);

  useEffect(() => {
    const widgetEl = document.querySelector("app-matchcentre");
    if (widgetEl) widgetEl.innerHTML = "";

    const scriptEl = loadWidgetScript();
    const onLoad = () => setWidgetLoaded(true);
    scriptEl.addEventListener("load", onLoad);

    return () => {
      scriptEl.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <div className="w-full bg-white">
      <div className="relative">
        {/* Title Block */}
        <div className="section-width pt-10">
          <div className="relative mb-6">
            <Image
              src="/images/elements/small-title-bg.png"
              alt="Mobile Title"
              className="block md:hidden w-full"
              width={200}
              height={0}
              priority
            />
            <Image
              src="/images/elements/title-bg.png"
              alt="Desktop Title"
              className="hidden md:block w-full"
              width={700}
              height={200}
              priority
            />
            <div className="absolute top-0 left-0 h-full z-10 flex flex-col md:flex-row md:items-center md:justify-between justify-center w-full">
              <h2
                className="uppercase max-sm:text-base md:text-lg lg:text-xl xl:text-2xl xl:ml-16 ml-12 italic text-black"
                style={{
                  background:
                    "radial-gradient(43.3% 61.24% at 50% 50%, #FFF200 0%, #FFF200 26%, #FBB040 97%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Match Centre
              </h2>
            </div>
          </div>
        </div>
        <div className="section-width mt-8">
          <app-matchcentre style={{ display: "block", width: "100%" }} className={widgetLoaded ? "" : "opacity-0"}></app-matchcentre>
          {!widgetLoaded && <p>Loading Match Centre Widget...</p>}
        </div>
      </div>
    </div>
  );
}
