"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function Page() {


    const [iframeSrc, setIframeSrc] = useState('');

    useEffect(() => {
        const queryString = window.location.search;
        // console.log(queryString, "queryString")
        const fullUrl = `https://d3ml9nicy4vh6j.cloudfront.net/t20mumbai/matchcentre.html${queryString}`;
        setIframeSrc(fullUrl);
    }, []);

  return (
    <>
      <div className="w-full bg-white">
        {/* <div className="w-full relative flex justify-end lg:py-36 py-20 bg-[url('/images/banner/fixture.jpg')] bg-cover bg-center bg-no-repeat">
          <div className="relative z-10 pt-8 h-full flex-col overflow-hidden justify-between text-white flex gap-24 mt-20 section-width">
            <div className="w-full flex flex-col items-start justify-between bg-transparent gap-20">
              <h1>Match Centre</h1>
            </div>
          </div>
        </div> */}

        <div className="relative">
          <img
            src="/images/elements/section-element.png"
            className="absolute right-0 top-0 md:block hidden"
            alt="element"
          />
          <img
            src="/images/elements/section-element.png"
            className="absolute left-0 bottom-0 rotate-180 md:block hidden"
            alt="element"
          />

          <div className="section-width pt-10">
            {/* Season and Team Selection Header */}
            <div className="relative  mb-6">
              {/* Background image */}
              <Image
                src="/images/elements/small-title-bg.png"
                alt="Mobile Title"
                className="block md:hidden    w-full"
                width={200}
                height={0}
                priority
              />
              <Image
                src="/images/elements/title-bg.png"
                alt="Desktop Title"
                className="hidden md:block lg:block   w-full "
                width={700}
                height={200}
                priority
              />

              {/* Foreground content */}
              <div className="absolute top-0 left-0 h-full z-10 flex flex-col md:flex-row md:items-center md:justify-between justify-center   w-full">
                <h2
                  className="uppercase max-sm:text-base md:text-lg lg:text-xl xl:text-2xl  xl:ml-16 ml-12 italic text-black"
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
            <div style={{ height: '70vh', width: '100%' }}>
                {iframeSrc ? (
                    <iframe
                    src={iframeSrc}
                    title="Matchcentre Preview"
                    width="100%"
                    height="100%"
                    style={{ border: 'none' }}
                    />
                ) : (
                    <p>Loading match centre...</p> 
                )}
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
}
