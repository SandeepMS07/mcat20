"use client";
import Image from "next/image";
import Link from "next/link";
import { navLinks } from "./data";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import { FiChevronDown } from "react-icons/fi";
import { useState } from "react";
import routes from "@/utilis/route";
import { redirect, usePathname } from "next/navigation";

const TOP_MARQUEE_TEXT =
  "T20 Mumbai Men’s & Women’s League | June 1-13 | Wankhede Stadium";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);
  const pathName = usePathname();

  const isPathActive = (path) => {
    if (!path || /^https?:\/\//.test(path)) return false;
    if (path === "/") return pathName === "/";
    return pathName === path || pathName.startsWith(`${path}/`);
  };

  if (pathName === "/auction-info") return;
  const matchesPageBg =
    pathName.includes(routes.fixtures) || pathName.startsWith("/scores");
  return (
    <div
      className={
        matchesPageBg
          ? "relative bg-[#091d65] lg:h-[120px] h-[85px]"
          : pathName.includes(routes.matchcentre) ||
            pathName.includes(routes.yourPhotos)
          ? "bg-gradient-to-r from-[#060A17] to-[#203376] lg:h-[120px] h-[85px]"
          : ""
      }
    >
      {matchesPageBg && (
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
      <div className="absolute top-0 z-50 w-full overflow-hidden bg-[#F68323] py-1">
        <div className="flex w-max animate-[topMarquee_80s_linear_infinite] items-center whitespace-nowrap">
          {[...Array(2)].map((_, groupIdx) => (
            <div key={groupIdx} className="flex shrink-0 items-center">
              {[...Array(8)].map((_, idx) => (
                <span
                  key={`${groupIdx}-${idx}`}
                  className="mx-6 inline-flex items-center gap-2 text-xs font-semibold text-white sm:text-xs lg:text-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  {TOP_MARQUEE_TEXT}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="z-50 absolute top-[40px] w-full flex justify-center ">
        <div className="relative w-full lg:w-auto">
          {/* Logo Section */}

          <nav className="flex items-center justify-between gap-1.5 lg:gap-2 rounded-full relative overflow-visible w-full lg:w-auto pl-2 pr-2 lg:pl-3 lg:pr-2 py-1.5 border border-white/15 bg-[rgba(8,18,55,0.55)] backdrop-blur-2xl shadow-[0_10px_40px_-12px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.18)]">
            <div
              className="relative shrink-0 mx-auto lg:mx-0 px-2 lg:px-3"
              style={{ zIndex: 9999 }}
            >
              {!menuOpen && (
                <Link href="/" className="flex items-center justify-center gap-2.5 sm:gap-3 w-full">
                  <Image
                    src={"https://mca-cdn.ken42.com/mca-logos/t20-m.png"}
                    alt="T20 Mumbai logo"
                    className="h-9 w-auto sm:h-10 md:h-11 lg:h-12 cursor-pointer drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
                    width={100}
                    height={100}
                    onClick={() => redirect("/")}
                  />
                  <span aria-hidden className="h-6 w-px bg-white/30 sm:h-7 md:h-7 lg:h-8" />
                  <Image
                    src={"/images/home/logo-w.png"}
                    alt="Women's league logo"
                    className="h-9 w-auto sm:h-10 md:h-11 lg:h-12 cursor-pointer drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
                    width={100}
                    height={100}
                  />
                </Link>
              )}
            </div>
            {/* Navigation Links */}
            <div className="items-center lg:flex hidden">
              <ul className="flex items-center gap-1 xl:gap-1.5">
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
                          className={`flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-full px-3 xl:px-4 py-2 text-xs md:text-sm xl:text-[14px] font-semibold tracking-wide transition-all duration-200 ${
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
                            return (
                              <li key={j} role="none">
                                <Link
                                  href={child.path}
                                  role="menuitem"
                                  className={`flex items-center justify-between gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold capitalize tracking-wide transition-all duration-150 ${
                                    childActive
                                      ? "bg-gradient-to-b from-[#F68323] to-[#E07E27] text-white shadow-[0_4px_14px_-4px_rgba(246,131,35,0.55)]"
                                      : "text-white/85 hover:bg-white/10 hover:text-white"
                                  }`}
                                >
                                  <span>{child.title}</span>
                                  {child.comingSoon && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#F2A23A] to-[#FFD166] px-1.5 py-[2px] text-[8px] font-extrabold uppercase tracking-wider text-[#0B1545] shadow-[0_2px_6px_rgba(242,162,58,0.45)]">
                                      <span className="h-1 w-1 rounded-full bg-[#0B1545]" />
                                      Soon
                                    </span>
                                  )}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    );
                  }

                  return (
                    <li key={i}>
                      <Link
                        href={item.path}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        className={`inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap rounded-full px-3 xl:px-4 py-2 text-xs md:text-sm xl:text-[14px] font-semibold tracking-wide transition-all duration-200 ${
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
                          return (
                            <li key={j}>
                              <Link
                                href={child.path}
                                className={`inline-flex items-center gap-2 text-sm transition-colors hover:text-orange-400 ${
                                  childActive
                                    ? "text-orange-500"
                                    : "text-white/85"
                                }`}
                                onClick={() => {
                                  setMenuOpen(false);
                                  setExpandedItem(null);
                                }}
                              >
                                {child.title}
                                {child.comingSoon && (
                                  <span className="rounded-full bg-[#F2A23A]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#F2A23A]">
                                    Coming Soon
                                  </span>
                                )}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
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
