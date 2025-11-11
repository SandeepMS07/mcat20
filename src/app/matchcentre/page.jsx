"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const MATCHCENTRE_CSS = "https://d3ml9nicy4vh6j.cloudfront.net/t20mumbai/app.css";
const MATCHCENTRE_SCRIPT = "https://d3ml9nicy4vh6j.cloudfront.net/t20mumbai/app_matchcentre.js";
const SCRIPT_ID = "matchcentre-widget-script";

export default function Page() {
  const [widgetLoaded, setWidgetLoaded] = useState(false);

  useEffect(() => {
    const ensureStylesheet = () => {
      if (document.querySelector(`link[href="${MATCHCENTRE_CSS}"]`)) return;
      const cssLink = document.createElement("link");
      cssLink.rel = "stylesheet";
      cssLink.href = MATCHCENTRE_CSS;
      document.head.appendChild(cssLink);
    };

    const ensureScript = () => {
      const existingScript = document.getElementById(SCRIPT_ID);
      if (existingScript) {
        return existingScript;
      }

      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = MATCHCENTRE_SCRIPT;
      script.async = true;
      script.dataset.loaded = "false";
      document.body.appendChild(script);
      return script;
    };

    ensureStylesheet();
    const scriptEl = ensureScript();
    if (!scriptEl.dataset.loaded) {
      scriptEl.dataset.loaded = "false";
    }
    let detachLoadListener;

    if (scriptEl.dataset.loaded === "true") {
      setWidgetLoaded(true);
    } else {
      const onLoad = () => {
        scriptEl.dataset.loaded = "true";
        setWidgetLoaded(true);
      };
      scriptEl.addEventListener("load", onLoad);
      detachLoadListener = () => scriptEl.removeEventListener("load", onLoad);
    }

    return () => {
      detachLoadListener?.();
    };
  }, []);

  return (
    <div className="w-full bg-white pb-24">
      <div className="relative">
        <div className="section-width pt-10">
          {/* Title Block */}
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
