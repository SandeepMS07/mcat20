"use client";
import Image from "next/image";
import Link from "next/link";
import { navLinks } from "./data";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import { FiChevronDown, FiUser } from "react-icons/fi";
import { useState } from "react";
import routes from "@/utilis/route";
import { redirect, usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import { requestSsoHandoff } from "@/app/api/auth";
import { FANTASY_WEB_BASE } from "@/constant";

const TOP_MARQUEE_TEXT =
  "T20 Mumbai Creators League | Your chance to win BIG | Participate Now";

const getInitials = (name) => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p.charAt(0).toUpperCase()).join("");
};

const firstName = (name) => {
  if (!name) return "";
  return name.trim().split(/\s+/)[0];
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);
  const pathName = usePathname();
  // `token` is no longer destructured: with the SSO hand-off pattern, the JWT
  // never leaves the axios interceptor — we only forward a one-time exchange
  // code to the fantasy app.
  const { isAuthed, user, openLogin, logout } = useAuth();

  const isPathActive = (path) => {
    if (!path || /^https?:\/\//.test(path)) return false;
    if (path === "/") return pathName === "/";
    return pathName === path || pathName.startsWith(`${path}/`);
  };

  const openExternal = (url) => {
    if (typeof window === "undefined") return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // SSO hand-off into the fantasy app. Lazy by design (only on click) — codes
  // expire in 30s, so prefetching is worse than useless. Never logs the code:
  // it's a single-use credential, same hygiene as any other auth token.
  //
  // popup is OPENED synchronously inside the click handler — async work
  // happens AFTER, navigating the already-open tab. If we awaited first then
  // tried window.open(), Safari/Chrome would block it as a non-user-gesture
  // popup.
  const handoffToFantasy = async (popup, destPath = "/") => {
    try {
      const { code } = await requestSsoHandoff();
      if (!code) throw new Error("no_code_in_response");
      // Always start the path with "/" so concatenation is well-formed
      // regardless of what callers pass in.
      const safePath = destPath?.startsWith("/") ? destPath : "/";
      const url = `${FANTASY_WEB_BASE}${safePath}?code=${encodeURIComponent(code)}`;
      if (popup && !popup.closed) {
        popup.location.replace(url);
      } else {
        // Popup blocked or user closed it during the fetch — fall back to a
        // same-tab navigation so the click still does something.
        window.location.href = url;
      }
    } catch (err) {
      if (popup && !popup.closed) popup.close();
      throw err;
    }
  };

  const handleGatedNavClick = (item, afterClick) => {
    // SSO hand-off navigates IN-PLACE (same tab) — product decision: the
    // fantasy app is the natural next step from the t20 web nav, not a
    // side-by-side companion, so opening a new tab created a stray tab the
    // user then had to manage. The previous popup logic that seeded a blank
    // tab with a splash is gone; handoffToFantasy(null, …) takes the
    // window.location.href fallback path which is exactly what we want now.
    const finish = async () => {
      try {
        if (item.ssoHandoff) {
          await handoffToFantasy(null, item.destPath || "/");
        } else if (/^https?:\/\//.test(item.path)) {
          openExternal(item.path);
        } else if (typeof window !== "undefined") {
          window.location.href = item.path;
        }
      } catch (err) {
        // SSO handoff failed — likely a 401 (session expired between mount and
        // click) or a 5xx / network blip. Surface to the user instead of
        // silently doing nothing. Replace with the project's toast system when
        // one exists; alert() is the lowest-friction stand-in for now.
        // eslint-disable-next-line no-console
        console.error("[fantasy] hand-off failed", err?.response?.status, err?.response?.data || err?.message);
        if (typeof window !== "undefined") {
          if (err?.response?.status === 401) {
            window.alert("Your session has expired. Please sign in again.");
          } else {
            window.alert("Couldn't open Fantasy right now. Please try again.");
          }
        }
      } finally {
        afterClick?.();
      }
    };
    if (!isAuthed) {
      openLogin(finish, { variant: "fantasy" });
      return;
    }
    finish();
  };

  if (pathName === "/auction-info") return;
  const matchesPageBg =
    pathName.includes(routes.fixtures) ||
    pathName.startsWith("/scores") ||
    pathName.includes(routes.matchcentre);
  return (
    <div
      className={
        matchesPageBg
          ? "relative bg-[#081d65] lg:h-[100px] h-[72px]"
          : pathName.includes(routes.yourPhotos)
          ? "bg-gradient-to-r from-[#060A17] to-[#203376] lg:h-[100px] h-[72px]"
          : ""
      }
    >
      {matchesPageBg &&
        !pathName.includes(routes.fixtures) &&
        !pathName.includes(routes.matchcentre) && (
        <>
          <div
            className="pointer-events-none absolute inset-0 bg-no-repeat bg-cover bg-top opacity-90"
            style={{
              backgroundImage: "url('/images/fixtures/fixtures-bg.svg')",
            }}
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute inset-0 bg-[rgba(13,55,169,0.55)]" />
        </>
      )}
      <div className="absolute top-0 z-50 w-full overflow-hidden bg-[#F68323] py-0.5">
        <div className="flex w-max animate-[topMarquee_80s_linear_infinite] items-center whitespace-nowrap">
          {[...Array(2)].map((_, groupIdx) => (
            <div key={groupIdx} className="flex shrink-0 items-center">
              {[...Array(8)].map((_, idx) => (
                <Link
                  key={`${groupIdx}-${idx}`}
                  href="/go/cl"
                  className="mx-6 inline-flex items-center gap-2 text-xs font-semibold text-white transition-opacity hover:opacity-80 sm:text-xs lg:text-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  {TOP_MARQUEE_TEXT}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="z-50 absolute top-[28px] w-full flex justify-center ">
        <div className="relative w-[95%] lg:w-auto">
          {/* Logo Section */}

          <nav className="flex items-center justify-between gap-1 lg:gap-2 rounded-full relative overflow-visible w-full h-[115%] lg:h-auto lg:w-auto pl-1.5 pr-1.5 lg:pl-3 lg:pr-2 py-1 lg:py-1.5 border border-white/15 bg-[rgba(8,18,55,0.55)] backdrop-blur-2xl shadow-[0_10px_40px_-12px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.18)]">
            <div
              className="relative shrink-0 mx-auto lg:mx-0 px-1.5 lg:px-3"
              style={{ zIndex: 9999 }}
            >
              {!menuOpen && (
                <Link href="/" className="flex items-center justify-center gap-2 w-full">
                  <Image
                    src={"https://mca-cdn.ken42.com/mca-logos/t20-m.png"}
                    alt="T20 Mumbai logo"
                    className="h-11 w-auto sm:h-8 md:h-9 lg:h-11 cursor-pointer drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
                    width={100}
                    height={100}
                    onClick={() => redirect("/")}
                  />
                  <span aria-hidden className="h-5 w-px bg-white/30 sm:h-6 md:h-6 lg:h-8" />
                  <Image
                    src={"/images/home/logo-w.png"}
                    alt="Women's league logo"
                    className="h-11 w-auto sm:h-8 md:h-9 lg:h-11 cursor-pointer drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
                    width={100}
                    height={100}
                  />
                </Link>
              )}
            </div>
            {/* Navigation Links */}
            <div className="items-center lg:flex hidden">
              <ul className="flex items-center gap-0.5 xl:gap-1">
                {navLinks.map((item, i) => {
                  const isExternal = /^https?:\/\//.test(item.path);
                  const hasChildren =
                    Array.isArray(item.children) && item.children.length > 0;
                  const isActive =
                    isPathActive(item.path) ||
                    (hasChildren &&
                      item.children.some((c) => isPathActive(c.path)));

                  if (hasChildren) {
                    return (
                      <li key={i} className="relative group">
                        <button
                          type="button"
                          className={`flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-full px-2 md:px-3 xl:px-4 py-1.5 md:py-2 text-xs xl:text-[13px] font-semibold tracking-wide transition-all duration-200 ${
                            isActive
                              ? "bg-gradient-to-b from-[#F68323] to-[#E07E27] text-white shadow-[0_4px_14px_-4px_rgba(246,131,35,0.65)]"
                              : "text-white/85 hover:text-white hover:bg-white/10"
                          }`}
                          aria-haspopup="menu"
                          aria-expanded="false"
                        >
                          {item.title}
                          <FiChevronDown
                            size={14}
                            className="transition-transform duration-200 group-hover:rotate-180"
                          />
                        </button>
                        <span
                          aria-hidden
                          className="absolute left-1/2 top-full z-40 h-3 w-[200px] -translate-x-1/2"
                        />
                        <ul
                          role="menu"
                          className="invisible absolute left-1/2 top-full z-50 mt-3 w-[210px] -translate-x-1/2 translate-y-1 overflow-hidden rounded-2xl border border-white/10 bg-[rgba(8,18,55,0.92)] p-1.5 opacity-0 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
                        >
                          {item.children.map((child, j) => {
                            const childActive = isPathActive(child.path);
                            const childClass = `flex items-center justify-between gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold capitalize tracking-wide transition-all duration-150 ${
                              childActive
                                ? "bg-gradient-to-b from-[#F68323] to-[#E07E27] text-white shadow-[0_4px_14px_-4px_rgba(246,131,35,0.55)]"
                                : "text-white/85 hover:bg-white/10 hover:text-white"
                            }`;
                            const childInner = (
                              <>
                                <span>{child.title}</span>
                                {child.comingSoon && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#F2A23A] to-[#FFD166] px-1.5 py-[2px] text-[8px] font-extrabold uppercase tracking-wider text-[#0B1545] shadow-[0_2px_6px_rgba(242,162,58,0.45)]">
                                    <span className="h-1 w-1 rounded-full bg-[#0B1545]" />
                                    Soon
                                  </span>
                                )}
                              </>
                            );
                            return (
                              <li key={j} role="none">
                                {/* SSO-gated children (e.g. Fantasy → Home /
                                    Matches / Leaderboard) re-use the parent's
                                    SSO hand-off path so the dropdown can
                                    deep-link straight into a fantasy page
                                    after auth. Plain children fall through
                                    to a static <Link>. */}
                                {child.requiresAuth ? (
                                  <button
                                    type="button"
                                    role="menuitem"
                                    onClick={() => handleGatedNavClick(child)}
                                    className={`w-full cursor-pointer ${childClass}`}
                                  >
                                    {childInner}
                                  </button>
                                ) : (
                                  <Link
                                    href={child.path}
                                    role="menuitem"
                                    className={childClass}
                                  >
                                    {childInner}
                                  </Link>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    );
                  }

                  if (item.requiresAuth) {
                    return (
                      <li key={i}>
                        <button
                          type="button"
                          onClick={() => handleGatedNavClick(item)}
                          className={`inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap rounded-full px-2 md:px-3 xl:px-4 py-1.5 md:py-2 text-xs xl:text-[13px] font-semibold tracking-wide transition-all duration-200 ${
                            isActive
                              ? "bg-gradient-to-b from-[#F68323] to-[#E07E27] text-white shadow-[0_4px_14px_-4px_rgba(246,131,35,0.65)]"
                              : "text-white/85 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          {item.title}
                          {item.comingSoon && (
                            <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-gradient-to-r from-[#F2A23A] to-[#FFD166] px-1.5 py-[2px] text-[8px] font-extrabold uppercase tracking-wider text-[#0B1545] shadow-[0_2px_6px_rgba(242,162,58,0.45)]">
                              <span className="h-1 w-1 rounded-full bg-[#0B1545]" />
                              Coming Soon
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  }

                  return (
                    <li key={i}>
                      <Link
                        href={item.path}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        className={`inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap rounded-full px-2 md:px-3 xl:px-4 py-1.5 md:py-2 text-xs xl:text-[13px] font-semibold tracking-wide transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-b from-[#F68323] to-[#E07E27] text-white shadow-[0_4px_14px_-4px_rgba(246,131,35,0.65)]"
                            : "text-white/85 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {item.title}
                        {item.comingSoon && (
                          <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-gradient-to-r from-[#F2A23A] to-[#FFD166] px-1.5 py-[2px] text-[8px] font-extrabold uppercase tracking-wider text-[#0B1545] shadow-[0_2px_6px_rgba(242,162,58,0.45)]">
                            <span className="h-1 w-1 rounded-full bg-[#0B1545]" />
                            Coming Soon
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
                <li className="relative group ml-1">
                  {isAuthed ? (
                    <>
                      <button
                        type="button"
                        className="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-white/[0.06] py-1 pl-1 pr-3 text-xs md:text-sm font-semibold text-white/90 transition hover:border-[#F2A23A]/50 hover:bg-white/[0.1]"
                        aria-haspopup="menu"
                      >
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-b from-[#F68323] to-[#E07E27] text-[10px] font-extrabold text-white shadow-[0_4px_10px_-4px_rgba(246,131,35,0.7)]">
                          {getInitials(user?.name || user?.team_name) || "U"}
                        </span>
                        <span className="max-w-[110px] truncate">
                          {firstName(user?.name) || "Account"}
                        </span>
                        <FiChevronDown
                          size={14}
                          className="transition-transform duration-200 group-hover:rotate-180"
                        />
                      </button>
                      <span
                        aria-hidden
                        className="absolute right-0 top-full z-40 h-3 w-[220px]"
                      />
                      <ul
                        role="menu"
                        className="invisible absolute right-0 top-full z-50 mt-3 w-[230px] translate-y-1 overflow-hidden rounded-2xl border border-white/10 bg-[rgba(8,18,55,0.92)] p-1.5 opacity-0 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
                      >
                        <li className="px-3 pb-2 pt-1.5">
                          <p className="truncate text-sm font-bold text-white">
                            {user?.name || "Signed in"}
                          </p>
                          {user?.mobile && (
                            <p className="truncate text-[11px] text-white/55">
                              +91 {user.mobile}
                            </p>
                          )}
                        </li>
                        <li className="my-1 h-px bg-white/10" role="none" />
                        <li role="none">
                          <button
                            type="button"
                            onClick={() => logout()}
                            className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/85 transition hover:bg-white/10 hover:text-white"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                              aria-hidden
                            >
                              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                              <polyline points="16 17 21 12 16 7" />
                              <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            Log out
                          </button>
                        </li>
                      </ul>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openLogin(null, { mode: "signin" })}
                      className="group/signin inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border border-white/25 bg-white/[0.06] px-4 py-1.5 text-xs md:text-sm xl:text-[14px] font-semibold tracking-wide text-white/90 backdrop-blur-sm transition-all duration-200 hover:border-[#F2A23A]/60 hover:bg-white/[0.1] hover:text-white"
                    >
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white transition-colors group-hover/signin:bg-[#F2A23A]/20 group-hover/signin:text-[#F2A23A]">
                        <FiUser className="h-3.5 w-3.5" aria-hidden />
                      </span>
                      Sign in
                    </button>
                  )}
                </li>
              </ul>
            </div>

            {/* Mobile Menu Icon - Only visible on mobile */}
            <div className="lg:hidden absolute right-3 top-1/2 -translate-y-1/2">
              <RxHamburgerMenu
                className="text-white text-2xl cursor-pointer transition-opacity hover:opacity-80"
                onClick={() => setMenuOpen(true)}
              />
            </div>
          </nav>
        </div>
        <div
          className={`fixed top-0 right-0 h-full w-[75%] border-l border-white/20 bg-[#0c1334]/70 backdrop-blur-2xl z-50 transform transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center p-5">
            <div className="flex items-center gap-2">
              <Image
                src="https://mca-cdn.ken42.com/mca-logos/t20-m.png"
                width={80}
                height={80}
                alt="T20 Mumbai logo"
                className="h-12 w-auto"
              />
              <span aria-hidden className="h-8 w-px bg-white/40" />
              <Image
                src="/images/home/logo-w.png"
                width={80}
                height={80}
                alt="Women's league logo"
                className="h-12 w-auto"
              />
            </div>
            <RxCross2
              className="text-white text-2xl cursor-pointer transition-opacity hover:opacity-80"
              onClick={() => setMenuOpen(false)}
            />
          </div>

          <ul className="flex flex-col gap-6 mt-10 px-6">
            {navLinks.map((item, i) => {
              const isExternal = /^https?:\/\//.test(item.path);
              const hasChildren =
                Array.isArray(item.children) && item.children.length > 0;
              const isActive =
                isPathActive(item.path) ||
                (hasChildren &&
                  item.children.some((c) => isPathActive(c.path)));

              if (hasChildren) {
                const isExpanded = expandedItem === i;
                return (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => setExpandedItem(isExpanded ? null : i)}
                      className={`flex w-full items-center justify-between text-base transition-colors hover:text-orange-400 ${
                        isActive ? "text-orange-500" : "text-white"
                      }`}
                      aria-expanded={isExpanded}
                    >
                      <span>{item.title}</span>
                      <FiChevronDown
                        size={18}
                        className={`transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isExpanded ? (
                      <ul className="mt-3 flex flex-col gap-3 border-l border-white/15 pl-4">
                        {item.children.map((child, j) => {
                          const childActive = isPathActive(child.path);
                          const childClass = `inline-flex items-center gap-2 text-sm transition-colors hover:text-orange-400 ${
                            childActive ? "text-orange-500" : "text-white/85"
                          }`;
                          const closeAfter = () => {
                            setMenuOpen(false);
                            setExpandedItem(null);
                          };
                          const childInner = (
                            <>
                              {child.title}
                              {child.comingSoon && (
                                <span className="rounded-full bg-[#F2A23A]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#F2A23A]">
                                  Coming Soon
                                </span>
                              )}
                            </>
                          );
                          return (
                            <li key={j}>
                              {/* Same SSO-gated child handling as the desktop
                                  dropdown above — Fantasy sub-pages deep-link
                                  into the fantasy app after auth. */}
                              {child.requiresAuth ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleGatedNavClick(child, closeAfter)
                                  }
                                  className={`cursor-pointer ${childClass}`}
                                >
                                  {childInner}
                                </button>
                              ) : (
                                <Link
                                  href={child.path}
                                  className={childClass}
                                  onClick={closeAfter}
                                >
                                  {childInner}
                                </Link>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </li>
                );
              }

              if (item.requiresAuth) {
                return (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() =>
                        handleGatedNavClick(item, () => setMenuOpen(false))
                      }
                      className={`inline-flex items-center gap-2 cursor-pointer text-base transition-colors hover:text-orange-400 ${
                        isActive ? "text-orange-500" : "text-white"
                      }`}
                    >
                      {item.title}
                      {item.comingSoon && (
                        <span className="rounded-full bg-[#F2A23A]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#F2A23A]">
                          Coming Soon
                        </span>
                      )}
                    </button>
                  </li>
                );
              }

              return (
                <li key={i}>
                  <Link
                    href={item.path}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className={`inline-flex items-center gap-2 cursor-pointer text-base transition-colors hover:text-orange-400 ${
                      isActive ? "text-orange-500" : "text-white"
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.title}
                    {item.comingSoon && (
                      <span className="rounded-full bg-[#F2A23A]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#F2A23A]">
                        Coming Soon
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-8 border-t border-white/15 px-6 pt-6">
            {isAuthed ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-b from-[#F68323] to-[#E07E27] text-sm font-extrabold text-white shadow-[0_4px_10px_-4px_rgba(246,131,35,0.7)]">
                    {getInitials(user?.name || user?.team_name) || "U"}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-white">
                      {user?.name || "Signed in"}
                    </p>
                    {user?.mobile && (
                      <p className="truncate text-[11px] text-white/55">
                        +91 {user.mobile}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.06] py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/10"
                >
                  Log out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openLogin(null, { mode: "signin" });
                }}
                className="flex w-full cursor-pointer items-center justify-center rounded-full bg-gradient-to-b from-[#F68323] to-[#E07E27] py-2.5 text-sm font-bold uppercase tracking-wide text-white shadow-[0_4px_14px_-4px_rgba(246,131,35,0.65)]"
              >
                Sign in
              </button>
            )}
          </div>
          {/* <div className="w-fit p-6">
            <a
              href={"/auction-info"}
              className="px-4 py-2 md:px-6 md:py-3   rounded-full   text-white text-sm md:text-base text-center cursor-pointer flex gap-4 items-center"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, #142A7C -11.26%, #344CA2 44.6%, #243FA3 100.45%)",
              }}
            >
              Auction Info
              <span>
                <Image
                  src="/images/home/hero/buttonIcon.svg"
                  alt="button-icon"
                  width={24}
                  height={24}
                  className="w-5 h-5"
                />
              </span>
            </a>
          </div> */}
        </div>

        {/* Optional Backdrop */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black/45 backdrop-blur-[2px] z-40"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Navbar;
