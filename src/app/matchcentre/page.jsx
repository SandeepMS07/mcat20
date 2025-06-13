"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Page() {
  const [widgetLoaded, setWidgetLoaded] = useState(false);

     // const [iframeSrc, setIframeSrc] = useState('');

    // useEffect(() => {
    //     const queryString = window.location.search;
    //     // console.log(queryString, "queryString")
    //     const fullUrl = `https://d3ml9nicy4vh6j.cloudfront.net/t20mumbai/matchcentre.html${queryString}`;
    //     setIframeSrc(fullUrl);
    // }, []);

  useEffect(() => {
    const loadWidget = async () => {
      // Load CSS
      const cssLink = document.createElement("link");
      cssLink.rel = "stylesheet";
      cssLink.href = "https://d3ml9nicy4vh6j.cloudfront.net/t20mumbai/app.css";
      document.head.appendChild(cssLink);

      // Load JS
      const script = document.createElement("script");
      script.src = "https://d3ml9nicy4vh6j.cloudfront.net/t20mumbai/app_matchcentre.js";
      script.async = true;
      script.onload = () => setWidgetLoaded(true);
      document.body.appendChild(script);
    };

    loadWidget();
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
            {widgetLoaded ? (
              <app-matchcentre></app-matchcentre>
            ) : (
              <p>Loading Match Centre Widget...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
