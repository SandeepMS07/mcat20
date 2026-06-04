"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";

/**
 * Cross-app logout target.
 *
 * The fantasy frontend (separate origin, separate localStorage, separate
 * refresh-cookie domain) cannot reach into this app's auth state directly.
 * When a user signs out over there, it redirects them to /logout here; this
 * page runs the same AuthProvider.logout() that the in-app Sign Out button
 * triggers — revoking the refresh cookie via the backend and wiping the
 * mca_user localStorage entry — then drops the user on the home page.
 *
 * No-op-safe for users who arrive already signed out (logout() returns
 * early when there's no token).
 */
export default function LogoutPage() {
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await logout();
      } catch {
        /* ignore — best-effort revoke; we still want to leave the page */
      }
      if (!cancelled) router.replace("/");
    })();
    return () => {
      cancelled = true;
    };
  }, [logout, router]);

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "1rem",
        color: "rgba(255,255,255,0.85)",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        aria-hidden
        style={{
          width: 36,
          height: 36,
          border: "2px solid rgba(255,255,255,0.12)",
          borderTopColor: "#F68323",
          borderRadius: "50%",
          animation: "logout-spin 0.8s linear infinite",
        }}
      />
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.7)",
        }}
      >
        Signing out…
      </div>
      <style>{`@keyframes logout-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
