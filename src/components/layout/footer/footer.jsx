"use client";
import Image from "next/image";
import Link from "next/link";
import "./style.css";
import { usePathname } from "next/navigation";
import routes from "@/utilis/route";

const FOOTER_COLUMNS = [
  {
    title: "Match Highlights",
    links: [
      { label: "Home", href: routes.home },
      { label: "Fixtures", href: routes.fixtures },
      { label: "Points Table", href: routes.pointsTable },
      { label: "Teams", href: routes.teams },
      { label: "Fan Wall", href: routes.fanWall },
    ],
  },
  {
    title: "Latest Updates",
    links: [
      { label: "Videos", href: routes.videos },
      { label: "News", href: routes.latestUpdates },
      { label: "Photos", href: routes.gallery },
    ],
  },
  // {
  //   title: "Fan Zone",
  //   links: [
  //     { label: "Fan Poll", href: routes.fanPoll },
  //     { label: "Viewers' Choice", href: routes.choice },
  //   ],
  // },
];

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: routes.instagram,
    icon: "/images/footer/insta.svg",
  },
  {
    label: "X",
    href: routes.twitter,
    icon: "/images/footer/twitter.svg",
  },
  {
    label: "Facebook",
    href: routes.facebook,
    icon: "/images/footer/facebook.svg",
  },
  {
    label: "YouTube",
    href: routes.youtube,
    icon: "/images/footer/youtube.svg",
  },
];

const Footer = () => {
  const pathName = usePathname();

  if (pathName === "/auction-info" || pathName === "/matchcentre" || pathName.startsWith("/matchcentre/")) return;

  return (
    <footer className="w-full bg-[#192A66]">
      <div className="section-width pt-10 pb-6 md:pt-16">
        <div className="grid gap-6 md:gap-10 lg:grid-cols-[260px_1fr]">
          <div>
            <Link
              href={routes.home}
              aria-label="T20 Mumbai home"
              className="inline-flex items-center gap-2 md:gap-3"
            >
              <Image
                src="https://mca-cdn.ken42.com/mca-logos/t20-m.png"
                alt="T20 Mumbai"
                className="h-12 w-auto sm:h-16 md:h-20"
                width={120}
                height={120}
              />
              <span aria-hidden className="h-8 w-px bg-white/40 sm:h-10 md:h-12" />
              <Image
                src="/images/home/logo-w.png"
                alt="Women's T20 Mumbai"
                className="h-12 w-auto sm:h-16 md:h-20"
                width={120}
                height={120}
              />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-6 sm:gap-8 lg:grid-cols-4">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <h4 className="mb-2.5 text-sm font-bold tracking-[0.01em] text-white md:mb-3.5">
                  {column.title}
                </h4>
                <ul className="space-y-2 md:space-y-3">
                  {column.links.map((link) => (
                    <li
                      key={link.label}
                      className="text-sm text-[#E6EDF6]/85"
                    >
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="transition-colors hover:text-white"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="transition-colors hover:text-white"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="col-span-2 lg:col-span-1">
              <h4 className="mb-2.5 text-sm font-bold tracking-[0.01em] text-white md:mb-3.5">
                Social
              </h4>
              <div className="flex items-center gap-3.5">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="opacity-90 transition-opacity hover:opacity-100"
                  >
                    <Image
                      src={social.icon}
                      alt={social.label}
                      width={18}
                      height={18}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-5 md:mt-14">
          <div className="flex flex-col gap-3 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
            <p>All Rights Reserved © 2026 T20Mumbai</p>
            <div className="flex items-center gap-6 md:gap-8">
              <Link
                href={routes.privacyPolicy}
                className="transition-colors hover:text-white"
              >
                Privacy Policy
              </Link>
              <Link
                href={routes.termsAndConditions}
                className="transition-colors hover:text-white"
              >
                Creator's League T&C
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
