"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import TitleComponent from "../common/TitleComponent";
import { truncateTextSpells } from "@/utilis/helper";
import { useRouter } from "next/navigation";
import path from "path";
import routes from "@/utilis/route";
const tabs = ["All", "Latest", "Reviews", "NewSection"];

const updateItems = [
  {
    title:
      "From Shivam Dube’s 5 sixes in an over to Suryakumar Yadav’s title-winning knock: Top 5 unforgettable moments of T20 Mumbai League",
    date: "Mumbai, May 30, 2025",
    img: "/images/latestUpdates/u2.png",
    bordered: true,
    path: "latest-updates/from-shivam-dube-s-5-sixes-in-an-over-to-suryakumar-yadav-s-title-winning-knock-top-5-unforgettable-moments-of-t20-mumbai-league",
  },
  {
    title:
      "T20 Mumbai League Caravan Ignites Cricket Passion at Mumbai’s Iconic Maidans",
    date: "Mumbai, May 26, 2025",
    img: "/images/latestUpdates/u1.png",
    bordered: true,
    path: "latest-updates/t20-mumbai-league-caravan-ignites-cricket-passion-at-mumbai-s-iconic-maidans",
  },
  {
    title:
      "MCA reschedules T20 Mumbai League 2025, Wankhede Stadium and DY Patil Stadium to host 23 exciting matches from June 4 to 12",
    date: "Mumbai, May 20, 2025",
    img: "/images/latestUpdates/u3.png",
    bordered: false,
    path: "latest-updates/mca-reschedules-t20-mumbai-league-2025-wankhede-stadium-and-dy-patil-stadium-to-host-23-exciting-matches-from-june-4-to-12",
  },
];

const LatestUpdates = () => {
  const router = useRouter();
  const [tab, setTab] = useState("All");

  return (
    <div className="bg-[url('/images/home/latestUpdateBg.png')] bg-cover bg-center bg-no-repeat">
      <div className="section-width section-padding">
        <TitleComponent
          title={"Latest Updates"}
          button
          buttonLink={routes.latestUpdates}
          buttonText="View All Updates"
          hideButtonOnMobile={true}
        />

        <div className="w-full flex flex-col gap-7 relative">
          <div className="w-full overflow-x-auto scrollbar-hide">
            <div className="relative w-full h-fit">
              <div className="w-full top-0 left-0 lg:flex">
                {/* Left Block */}
               <div
  className="relative xl:flex-[60%] lg:flex-[55%] flex bg-[url('/images/home/latestUpdateImage.jpg')] bg-cover bg-no-repeat bg-center max-lg:h-[400px] cursor-pointer"
  onClick={() => {
    router.push(
      "/latest-updates/mca-reschedules-t20-mumbai-league-2025-wankhede-stadium-and-dy-patil-stadium-to-host-23-exciting-matches-from-june-4-to-12"
    );
  }}
>
  {/* Black overlay gradient */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-0"></div>

  {/* Content on top */}
  <div className="p-10 bottom-0 max-w-2xl mt-auto relative z-10">
    <h3 className="text-white xl:text-3xl sm:text-2xl text-xl font-semibold">
      MCA Adds Star Power to T20 Mumbai League, Unveils Rohit Sharma as Face of Season 3
    </h3>
    <ul className="list-disc ml-5 text-[#E07E27] xl:text-base text-sm sm:flex gap-8 md:mt-6 mt-2">
      <li>T20 Mumbai League 2025 fixtures announced</li>
      <li>Mumbai, May 20, 2025</li>
    </ul>
  </div>
</div>

                {/* Right Block (Mapped) */}
                <div className="xl:flex-[40%] lg:flex-[45%] flex flex-col">
                  {updateItems.map((item, index) => (
                    <div
                      key={index}
                      className={`flex-1 flex justify-between items-center bg-[#E07E27] hover:bg-[#D3731E] cursor-pointer ${
                        item.bordered ? "border-b border-[#D3731E]" : ""
                      }`}
                      onClick={() => {
                        router.push(item.path);
                      }}
                    >
                      <div className="max-w-80 p-4">
                        <h5 className="mb-2 text-white 2xl:text-2xl xl:text-xl lg:text-base text-sm font-medium">
                          {truncateTextSpells(item.title, 80)}
                        </h5>
                        <p className="text-black xl:text-base sm:text-sm text-xs font-medium">
                          {item.date}
                        </p>
                      </div>
                      <div>
                        <img
                          src={item.img}
                          className="xl:max-h-[200px] xl:max-w-[200px] sm:max-w-[150px] max-w-[120px] h-auto object-cover"
                          alt="latest update"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile button - show only on mobile, hide on larger screens */}
        <Link
          href={routes.latestUpdates || "#"}
          className="md:hidden flex items-center gap-2 w-fit mx-auto btn-primary mt-6"
          // style={{
          //   background:
          //     "radial-gradient(43.3% 61.24% at 50% 50%, #FFF200 0%, #FFF200 26%, #FBB040 97%)",
          //   WebkitBackgroundClip: "text",
          //   WebkitTextFillColor: "transparent",
          //   backgroundClip: "text",
          //   color: "transparent",
          // }}
        >
          View All Updates
          <Image
            src="/images/home/hero/buttonIcon.svg"
            alt="button-icon"
            width={24}
            height={24}
            className="w-5 h-5"
          />
        </Link>
      </div>
    </div>
  );
};

export default LatestUpdates;
