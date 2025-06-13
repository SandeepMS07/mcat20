"use client";
import Image from "next/image";
import Link from "next/link";
import { navLinks } from "./data";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import { useState } from "react";
import routes from "@/utilis/route";
import { redirect, usePathname } from "next/navigation";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathName = usePathname();

  if (pathName === "/auction-info" ) return;
  return (
   <div
      className={
        pathName.includes(routes.fixtures) || pathName.startsWith("/scores") || pathName.includes(routes.matchcentre) || pathName.includes(routes.yourPhotos)
          ? "bg-gradient-to-r from-[#060A17] to-[#203376] lg:h-[120px] h-[85px]"
          : ""
      }
    >
      <div className=" z-50 absolute top-[20px] w-full  flex justify-center">
        <div className="relative w-[90%]">
          {/* Logo Section */}

          <nav className="flex justify-between items-center  section-width bg-[#ffffff1f] rounded-full relative overflow-visible w-full py-2 px-4">
            <div className="-my-24" style={{ zIndex: 9999 }}>
              {!menuOpen && (
                <Link href="/">
                  <Image
                    src={"/images/home/logo.svg"}
                    alt="logo"
                    className="h-20 w-auto lg:h-28 cursor-pointer "
                    width={100}
                    height={100}
                    onClick={() => redirect("/")}
                  />
                </Link>
              )}
            </div>
            {/* Navigation Links */}
            <div className="items-center lg:flex hidden">
              <div className="flex justify-center">
                <ul className="flex items-center justify-between gap-8 xl:gap-10 bg-transparent  xl:pl-10 py-2 pr-2 rounded-full">
                  {navLinks.map((item, i) => (
                    <li key={i}>
                      <Link
                        href={item.path}
                        className={`text-sm md:text-base xl:text-lg ${
                          pathName === item.path
                            ? "text-orange-500"
                            : "text-white"
                        }`}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}

                  {/* <a
                    href={"/auction-info"}
                    s
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
                  </a> */}
                </ul>
              </div>
            </div>

            {/* Mobile Menu Icon - Only visible on mobile */}
            <div className="lg:hidden block">
              <RxHamburgerMenu
                className="text-white text-2xl cursor-pointer"
                onClick={() => setMenuOpen(true)}
              />
            </div>
          </nav>
        </div>
        <div
          className={`fixed top-0 right-0 h-full w-[75%] bg-[#0F0F0F] z-50 transform transition-transform duration-300 ${
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
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Navbar;
