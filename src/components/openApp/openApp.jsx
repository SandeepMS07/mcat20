"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function AppNavbarBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") {
      setShowBanner(false);
      setIsDismissed(true);
      return;
    }
    const dismissed = localStorage.getItem("appBannerDismissed");
    if (dismissed) {
      setIsDismissed(true);
      setShowBanner(false);
      return;
    }

    const bannerTimeout = setTimeout(() => {
      setShowBanner(true);
      setIsDismissed(false);
    }, 1000);

    return () => clearTimeout(bannerTimeout);
  }, [pathname]);

  const handleOpenApp = () => {
    const userAgent = navigator.userAgent || navigator.vendor;
    const isAndroid = /android/i.test(userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);

    if (isIOS) {
      window.location.href = "https://t20mumbai.com/link";
    } else if (isAndroid) {
      const fallbackUrl = "https://t20mumbai.com/link";
      window.location.href = `intent://links#Intent;scheme=t20mumbai;package=com.mca.t20mumbai;S.browser_fallback_url=${encodeURIComponent(
        fallbackUrl
      )};end`;
    } else {
      window.open(
        "https://play.google.com/store/apps/details?id=com.mca.t20mumbai",
        "_blank"
      );
    }
  };

  const dismissBanner = () => {
    setShowBanner(false);
    setIsDismissed(true);
    localStorage.setItem("appBannerDismissed", "true");
  };

  if (!showBanner || isDismissed) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        borderBottom: "1px solid #e0e0e0",
        padding: "12px 16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        animation: "slideDown 0.3s ease-out",
      }}
    >
      <style>
        {`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @media (max-width: 480px) {
          .banner-content {
            font-size: 12px;
          }
          .banner-button {
            padding: 6px 12px !important;
            font-size: 12px !important;
          }
        }
      `}
      </style>

      <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
        <div
          style={{
            marginRight: "12px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 10px",
            borderRadius: "10px",
            background:
              "linear-gradient(135deg, #192A66 0%, #1F43C5 100%)",
            boxShadow: "0 2px 8px rgba(25,42,102,0.25)",
          }}
        >
          <img
            src={"/images/home/logo.svg"}
            style={{ height: "36px", width: "auto" }}
            alt="T20 Mumbai"
          />
          <span
            aria-hidden
            style={{
              display: "inline-block",
              width: "1px",
              height: "22px",
              backgroundColor: "rgba(255,255,255,0.35)",
            }}
          />
          <img
            src={"/images/home/logo-w.png"}
            style={{ height: "36px", width: "auto" }}
            alt="Women's T20 Mumbai"
          />
        </div>
        <div className="banner-content">
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              fontWeight: "600",
              color: "#333",
            }}
          >
            T20 Mumbai App
          </p>
          <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
            Get live scores & updates
          </p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button
          onClick={handleOpenApp}
          className="banner-button"
          style={{
            backgroundColor: "#1976d2",
            color: "white",
            padding: "8px 16px",
            fontSize: "14px",
            border: "none",
            borderRadius: "20px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#1565c0")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#1976d2")}
        >
          Open App
        </button>

        <button
          onClick={dismissBanner}
          style={{
            background: "none",
            border: "none",
            fontSize: "26px",
            color: "#666",
            cursor: "pointer",
            padding: "4px",
            borderRadius: "50%",
            width: "28px",
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
        >
          ×
        </button>
      </div>
    </div>
  );
}