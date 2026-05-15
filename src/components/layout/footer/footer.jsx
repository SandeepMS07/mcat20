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
      "Team Schedules",
      "Match Results",
      "Fair Play Guidelines",
      "Venue Information",
      "Player Code of Conduct",
      "Equipment Regulations",
      "Fan Zone Community",
      "Ticketing Support",
    ],
  },
  {
    title: "Tickets and Packages",
    links: ["League News", "Stats and Records"],
  },
  {
    title: "New League Initiatives",
    links: ["Rules and Regulations", "Sponsorships", "Event Coordination"],
  },
  {
    title: "Downloads and Apps",
    links: ["Breaking News", "Join Our Team", "Fan Testimonials"],
  },
  {
    title: "Match Day Guide",
    links: ["Our Commitment to Privacy", "Terms of Use", "Legal Information"],
  },
];

const Footer = () => {
  const pathName = usePathname();

  if (pathName === "/auction-info") return;

  return (
    <footer className="w-full bg-[#1D2F78]">
      <div className="section-width py-14 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[320px_1fr]">
          <div className="flex flex-col items-start justify-between gap-10">
            <Image
              src="/images/footer/t20logo.svg"
              alt="T20 Mumbai"
              className="h-auto w-44 md:w-52"
              width={210}
              height={150}
            />
            <div>
              <p className="mb-4 text-base font-semibold text-white">Social</p>
              <div className="flex items-center gap-4">
                <a target="_blank" rel="noreferrer" href={routes.instagram}>
                  <Image
                    src="/images/footer/insta.svg"
                    alt="Instagram"
                    width={20}
                    height={20}
                  />
                </a>
                <a target="_blank" rel="noreferrer" href={routes.twitter}>
                  <Image
                    src="/images/footer/twitter.svg"
                    alt="X"
                    width={20}
                    height={20}
                  />
                </a>
                <a target="_blank" rel="noreferrer" href={routes.facebook}>
                  <Image
                    src="/images/footer/facebook.svg"
                    alt="Facebook"
                    width={20}
                    height={20}
                  />
                </a>
              </div>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <h4 className="mb-4 text-lg font-semibold text-white">
                  {column.title}
                </h4>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link} className="text-sm text-white/70">
                      {link}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-7">
          <div className="flex flex-col gap-4 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
            <p className="text-sm">All Rights Reserved © 2025 T20Mumbai</p>
            <div className="flex items-center gap-8">
              <Link href={routes.privacyPolicy}>Privacy Policy</Link>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
