"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/navbar/navbar";
import Footer from "@/components/layout/footer/footer";
import AppNavbarBanner from "@/components/openApp/openApp";

const HIDE_HEADER_PREFIXES = ["/player-registration", "/live-auction"];
const HIDE_FOOTER_PREFIXES = ["/player-registration", "/live-auction"];

const ClientChrome = ({ children }) => {
  const pathname = usePathname();
  const hideHeader = HIDE_HEADER_PREFIXES.some((prefix) =>
    pathname?.startsWith(prefix)
  );

  const hideFooter = HIDE_FOOTER_PREFIXES.some((prefix) =>
    pathname?.startsWith(prefix)
  );

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
