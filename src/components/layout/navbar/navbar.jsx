"use client";
import Image from "next/image";
import Link from "next/link";
import { navLinks } from "./data";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import { useState } from "react";
import routes from "@/utilis/route";
import { redirect, usePathname } from "next/navigation";

const TOP_MARQUEE_TEXT =
  "Mumbai South Central Maratha Royals crowned T20 Mumbai League 2025 champions";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathName = usePathname();

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
            style={{ backgroundImage: "url('/images/fixtures/fixtures-bg.svg')" }}
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute inset-0 bg-[rgba(13,55,169,0.55)]" />
        </>
      )}
      <div className="absolute top-0 z-50 w-full overflow-hidden bg-[#F68323] py-1">
        <div className="flex w-max animate-[topMarquee_25s_linear_infinite] items-center whitespace-nowrap">
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
        <div className="relative w-[90%]">
          {/* Logo Section */}

          <nav className="flex items-center section-width rounded-full relative overflow-visible w-full px-4 border border-white/20 bg-gradient-to-b from-white/[0.18] via-white/[0.08] to-white/[0.04] backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.35)]">
            <div
              className="relative px-3 lg:px-10 lg:after:absolute lg:after:right-0 lg:after:inset-y-0 lg:after:w-[1.5px] lg:after:bg-white/40"
              style={{ zIndex: 9999 }}
            >
              {!menuOpen && (
                <Link href="/">
                  <Image
                    src={"/images/home/logo.svg"}
                    alt="logo"
                    className="h-12 w-auto lg:h-16 cursor-pointer "
                    width={100}
                    height={100}
                    onClick={() => redirect("/")}
                  />
                </Link>
              )}
            </div>
            {/* Navigation Links */}
            <div className="items-center lg:flex hidden py-1  w-full">
              <ul className="flex items-center justify-between gap-8 xl:gap-10 bg-transparent pl-8 xl:pl-12 pr-4 xl:pr-10 py-2 rounded-full w-full">
                {navLinks.map((item, i) => (
                  <li key={i}>
                    <Link
                      href={item.path}
                      className={`text-sm md:text-base xl:text-lg font-medium transition-colors hover:text-orange-400 ${
                        pathName === item.path
                          ? "text-orange-500"
                          : "text-white"
                      }`}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mobile Menu Icon - Only visible on mobile */}
            <div className="lg:hidden block ml-auto pr-2">
              <RxHamburgerMenu
                className="text-white text-2xl cursor-pointer"
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
            <Image
              src="/images/home/logo.svg"
              width={80}
              height={80}
              alt="logo"
            />
            <RxCross2
              className="text-white text-2xl cursor-pointer"
              onClick={() => setMenuOpen(false)}
            />
          </div>

          <ul className="flex flex-col gap-6 mt-10 px-6">
            {navLinks.map((item, i) => (
              <li key={i}>
                <Link
                  href={item.path}
                  className="text-white text-base"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.title}
                </Link>
              </li>
            ))}
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
