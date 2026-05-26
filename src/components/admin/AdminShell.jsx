"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAdminAuth } from "./AdminAuthProvider";

const NAV = [
  {
    href: "/admin/polls",
    label: "Polls",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M3 3v18h18" />
        <rect x="7" y="13" width="3" height="5" />
        <rect x="12" y="9" width="3" height="9" />
        <rect x="17" y="5" width="3" height="13" />
      </svg>
    ),
  },
  {
    href: "/admin/matches",
    label: "Matches",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </svg>
    ),
  },
];

export default function AdminShell({ children }) {
  const { adminUser, loading, logout } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !adminUser && pathname !== "/admin/login") {
      const returnTo = encodeURIComponent(pathname || "/admin/polls");
      router.replace(`/admin/login?returnTo=${returnTo}`);
    }
  }, [loading, adminUser, pathname, router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (loading || !adminUser) {
    // While loading=true OR the redirect to /admin/login is in flight, render
    // a placeholder background instead of `null`. Returning null causes a
    // visible blank flash between the spinner and the login page on slow
    // navigation. Use the same skeleton color as the shell so the transition
    // is seamless.
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#02061A] text-white">
        <div className="flex items-center gap-3 text-sm uppercase tracking-[0.22em] text-white/60">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#F2A23A]" />
          {loading ? "Loading admin" : "Redirecting…"}
        </div>
      </div>
    );
  }

  const initials = (adminUser.displayName || adminUser.username || "?")
    .split(/\s+/)
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-h-screen bg-[#02061A] text-white">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform border-r border-white/10 bg-[#050C2A]/95 backdrop-blur transition-transform md:relative md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#F2A23A] text-base font-extrabold italic text-[#02103D]">
            M
          </span>
          <div className="leading-tight">
            <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/45">
              MCA
            </div>
            <div className="font-oswald text-base font-extrabold italic uppercase text-white">
              Admin
            </div>
          </div>
        </div>
        <nav className="space-y-1 p-3">
          {NAV.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "bg-[#F2A23A]/15 text-[#F2A23A] shadow-[inset_0_0_0_1px_rgba(242,162,58,0.35)]"
                    : "text-white/70 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-3">
          <div className="flex items-center gap-3 rounded-lg bg-white/[0.04] p-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#F2A23A]/20 text-sm font-extrabold text-[#F2A23A]">
              {initials}
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="truncate text-sm font-bold text-white">
                {adminUser.displayName || adminUser.username}
              </div>
              <div className="truncate text-[10px] uppercase tracking-[0.18em] text-white/45">
                {adminUser.username}
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              title="Sign out"
              className="rounded-md p-1.5 text-white/55 hover:bg-white/10 hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-20 bg-black/60 md:hidden"
        />
      ) : null}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-3 border-b border-white/10 bg-[#02061A]/85 px-4 backdrop-blur sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="rounded-md border border-white/15 p-2 text-white/70 hover:bg-white/[0.04] md:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <Breadcrumbs pathname={pathname || ""} />
          <div className="hidden items-center gap-2 text-xs text-white/55 md:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Live
          </div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

function Breadcrumbs({ pathname }) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return null;
  const crumbs = parts.map((seg, idx) => {
    const href = "/" + parts.slice(0, idx + 1).join("/");
    const label = humanize(seg);
    return { href, label };
  });
  return (
    <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
      <ol className="flex items-center gap-1.5 text-xs font-medium text-white/55">
        {crumbs.map((c, i) => (
          <li key={c.href} className="flex items-center gap-1.5 truncate">
            {i > 0 ? <span className="text-white/30">/</span> : null}
            {i === crumbs.length - 1 ? (
              <span className="truncate uppercase tracking-[0.16em] text-white">
                {c.label}
              </span>
            ) : (
              <Link
                href={c.href}
                className="truncate uppercase tracking-[0.16em] hover:text-white"
              >
                {c.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function humanize(segment) {
  if (/^\[.*\]$/.test(segment)) return segment;
  if (segment.length > 30 && !segment.includes("-")) {
    // Likely an ID — truncate
    return segment.slice(0, 8) + "…";
  }
  return segment.replace(/-/g, " ");
}
