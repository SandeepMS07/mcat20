"use client";

import React, { useEffect, useState } from "react";

const PlayerRegistrationPage = () => {
  const [loaded, setLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const iframeUrl = "https://mca-registration.ken42.com";

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!loaded) {
        setShowFallback(true);
      }
    }, 8000);

    return () => clearTimeout(timeoutId);
  }, [loaded]);

  return (
    <div className="w-full min-h-screen bg-black">
      <div className="relative w-full h-screen">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0c1230] text-white">
            <div className="text-center px-4">
              <p className="text-sm uppercase tracking-[0.2em] text-[#f9ae2d]">
                Loading registration
              </p>
              <p className="mt-2 text-base">
                If this takes too long, use the direct link below.
              </p>
            </div>
          </div>
        )}
        <iframe
          src={iframeUrl}
          title="MCA Registration"
          className="w-full h-full border-0"
          loading="eager"
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
        />
      </div>
      {showFallback && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
          <a
            href={iframeUrl}
            className="inline-flex items-center justify-center rounded-lg bg-[#f9ae2d] px-5 py-3 text-sm font-bold uppercase text-black"
            target="_blank"
            rel="noreferrer"
          >
            Open Registration in New Tab
          </a>
        </div>
      )}
    </div>
  );
};

export default PlayerRegistrationPage;
