"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/navbar/navbar";
import Footer from "@/components/layout/footer/footer";
import AppNavbarBanner from "@/components/openApp/openApp";

const HIDE_HEADER_PREFIXES = [
  "/player-registration",
  "/live-auction",
  "/admin",            // admin shell renders its own chrome
  "/fan-poll/reveal",  // TV-screen full-bleed
];
const HIDE_FOOTER_PREFIXES = [
  "/player-registration",
  "/live-auction",
  "/admin",
  "/fan-poll/reveal",
  "/matchcentre",
];

const PAGE_BG_COLORS = {
  "/fixtures": "#081d65",
};

const ClientChrome = ({ children }) => {
  const pathname = usePathname();
  const hideHeader = HIDE_HEADER_PREFIXES.some((prefix) =>
    pathname?.startsWith(prefix)
  );

  const hideFooter = HIDE_FOOTER_PREFIXES.some((prefix) =>
    pathname?.startsWith(prefix)
  );

  useEffect(() => {
    const bg = Object.entries(PAGE_BG_COLORS).find(([path]) =>
      pathname?.startsWith(path)
    )?.[1] ?? "";
    document.documentElement.style.background = bg;
    document.body.style.background = bg;
    return () => {
      document.documentElement.style.background = "";
      document.body.style.background = "";
    };
  }, [pathname]);

  return (
    <>
      {!hideHeader && (
        <>
          <AppNavbarBanner />
          <Navbar />
        </>
      )}
      {children}
      {!hideFooter && <Footer />}
    </>
  );
};

export default ClientChrome;
