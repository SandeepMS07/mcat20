"use client";

import { useEffect, useState } from "react";

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
    <div className="w-full bg-white pb-24">
      <div className="relative">
        {/* Title Block */}
        <div className="w-full bg-[#091d65] py-10">
          <div className="section-width">
            <h1 className="flex flex-col text-5xl font-extrabold uppercase italic leading-[0.92] sm:text-6xl lg:text-7xl">
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "2px white" }}
              >
                Match
              </span>
              <span className="text-white">Centre</span>
            </h1>
          </div>
        </div>
        <div className="section-width pt-10">
  {/* {iframeSrc ? (
                    <iframe
                    src={iframeSrc}
                    title="Matchcentre Preview"
                    width="100%"
                    height="100%"
                    style={{ border: 'none' }}
                    />
                ) : (x
                    <p>Loading match centre...</p> 
                )} */}
            {/* </div> */}
          <div className="mt-8 min-h-[80vh]">
            <app-matchcentre className={widgetLoaded ? "" : "opacity-0"}></app-matchcentre>
            {!widgetLoaded && <p>Loading Match Centre Widget...</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
