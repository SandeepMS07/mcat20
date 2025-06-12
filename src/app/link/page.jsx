"use client";
import { useEffect, useState } from "react";

export default function AppRedirectPage() {
  const [platform, setPlatform] = useState(null);

  const IOS_APP_URL = "https://apps.apple.com/app/id6746642031";
  const ANDROID_APP_URL =
    "https://play.google.com/store/apps/details?id=com.mca.t20mumbai";
  const WEB_FALLBACK_URL = "https://t20mumbai.com";

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;
    const isAndroid = /android/i.test(userAgent);
    const isIOS = /iPad|iPhone|iPod|Macintosh/i.test(userAgent);

    if (isIOS) {
      setPlatform("ios");
      window.location.href = IOS_APP_URL;
    } else if (isAndroid) {
      setPlatform("android");
      window.location.href = ANDROID_APP_URL;
    } else {
      setPlatform("web");
      window.location.href = WEB_FALLBACK_URL;
    }
  }, []);

  const handleManualRedirect = () => {
    if (platform === "ios") {
      window.location.href = IOS_APP_URL;
    } else if (platform === "android") {
      window.location.href = ANDROID_APP_URL;
    } else {
      window.location.href = WEB_FALLBACK_URL;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-black via-gray-900 to-black text-center px-4">
      <div className="mb-4">
        <img
          src={"/images/home/mca-logo.png"}
          style={{ height: "60px", width: "auto" }}
          alt="logo"
          className=" drop-shadow-2xl filter brightness-110"
        />
      </div>

      <h1 className="text-2xl md:text-3xl text-white mb-8 font-semibold tracking-wide">
        T20 Mumbai
      </h1>

      {platform === "ios" && (
        <div
          className="mb-8 p-6 bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700/50 max-w-sm"
          onClick={handleManualRedirect}
        >
          <img
            src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
            alt="Download on App Store"
            className="h-14 mx-auto hover:scale-105 transition-transform cursor-pointer"
          />
          <div className="text-gray-400 text-sm mt-3">Tap to download now</div>
        </div>
      )}

      {platform === "android" && (
        <div
          className="mb-8 p-6 bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700/50 max-w-sm"
          onClick={handleManualRedirect}
        >
          <img
            src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
            alt="Get it on Google Play"
            className="h-16 mx-auto hover:scale-105 transition-transform cursor-pointer"
          />
          <div className="text-gray-400 text-sm mt-3">Tap to download now</div>
        </div>
      )}

      {platform === "web" && (
        <div className="mb-8 p-6 bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700/50 max-w-sm">
          <div className="text-white mb-4 text-lg">Opening web version</div>
          <div
            className="text-6xl mb-4 hover:scale-110 transition-transform cursor-pointer"
            onClick={handleManualRedirect}
          >
            🌐
          </div>
          <div className="text-gray-400 text-sm">Click to open now</div>
        </div>
      )}
      <a
        href="/"
        className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-6 rounded-lg transition-colors duration-200 shadow-md"
      >
        ← Go back home
      </a>
    </div>
  );
}
