"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import TitleComponent from "../common/TitleComponent";
import { truncateTextSpells, formatTitleForURL } from "@/utilis/helper";
import { useRouter } from "next/navigation";
import path from "path";
import routes from "@/utilis/route";
import { getLatestUpdatesClient } from "@/app/api/clientApi";
import LoadingPage from "@/app/loading";

const tabs = ["All", "Latest", "Reviews", "NewSection"];

// const updateItems = [
//   {
//     title:
//       "All-round Sairaj powers Eagle Thane Strikers to second straight win of T20 Mumbai League 2025; Arcs Andheri register first win",
//     date: "Mumbai, June 5, 2025",
//     img: "/images/latestUpdates/u14.png",
//     bordered: true,
//     path: "latest-updates/all-round-sairaj-powers-eagle-thane-strikers-to-second-straight-win-of-t20-mumbai-league-2025-arcs-andheri-register-first-win",
//   },
//   {
//     title:
//       "Sairaj steals spotlight after SKY show on T20 Mumbai League 2025 opening day",
//     date: "Mumbai, June 4, 2025",
//     img: "/images/latestUpdates/u5.png",
//     bordered: true,
//     path: "latest-updates/sairaj-steals-spotlight-after-sky-show-on-t20-mumbai-league-2025-opening-day",
//   },
//   {
//     title:
//       "T20 Mumbai League 2025 to kick off today with Suryakumar Yadav and Shivam Dube in action; here is everything you need to know about Season 3",
//     date: "Mumbai, June 4, 2025",
//     img: "/images/latestUpdates/u4.png",
//     bordered: true,
//     path: "latest-updates/t20-mumbai-league-2025-to-kick-off-today-with-suryakumar-yadav-and-shivam-dube-in-action-here-is-everything-you-need-to-know-about-season-3",
//   },
// ];

const LatestUpdates = () => {
  const router = useRouter();
  const [latestUpdates, setLatestUpdates] = useState([]);
  const [primaryItem, setPrimaryItem] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("All");

  // Fetch the Latest Updates
  useEffect(() => {
    const fetchUpdates = async () => {
      setLoading(true);
      const data = await getLatestUpdatesClient();
      if (data?.data?.length) {
        setLatestUpdates(data.data);
        setPrimaryItem(data?.data[0]);
      }
      setLoading(false);
    };

    fetchUpdates();
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  if(latestUpdates.length < 1){
    return null;
  }

  const handleLatestUpdateClick = (title) => {
    router.push(`${routes.latestUpdates}/${formatTitleForURL(title)}`);
  };

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
                  className={`relative xl:flex-[60%] lg:flex-[55%] flex max-lg:h-[400px] cursor-pointer`}
                  style={{
                    backgroundImage:
                      primaryItem?.Order__c === 14
                        ? `url('/images/latestUpdates/update14-main.jpg')`
                        : primaryItem?.Image_URL__c
                        ? `url(${primaryItem.Image_URL__c})`
                        : "/images/latestUpdates/latest-updates-bg.png",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                  onClick={() => {
                    handleLatestUpdateClick(primaryItem?.Title__c);
                  }}
                >
                  {/* Black overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-0"></div>

                  {/* Content on top */}
                  <div className="p-10 bottom-0 max-w-2xl mt-auto relative z-10">
                    <h3 className="text-white xl:text-3xl sm:text-2xl text-xl font-semibold">
                      {primaryItem?.Title__c}{" "}
                    </h3>
                    <ul className="list-disc ml-5 text-[#E07E27] xl:text-base text-sm sm:flex gap-8 md:mt-6 mt-2">
                      <li>T20 Mumbai League 2025</li>
                      <li>
                        Mumbai,{"  "}
                        {primaryItem.Date__c
                          ? new Date(primaryItem.Date__c).toLocaleDateString(
                              "en-IN",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
                          : ""}
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Right Block (Mapped) */}
                <div className="xl:flex-[40%] lg:flex-[45%] flex flex-col">
                  {latestUpdates.slice(0, 3).map((item, index) => (
                    <div
                      key={index}
                      className={`flex-1 flex justify-between items-center bg-[#E07E27] hover:bg-[#D3731E] cursor-pointer ${
                        item.bordered ? "border-b border-[#D3731E]" : ""
                      }`}
                      onClick={() => {
                        handleLatestUpdateClick(item?.Title__c);
                      }}
                    >
                      <div className="max-w-80 p-4">
                        <h5 className="mb-2 text-white 2xl:text-2xl xl:text-xl lg:text-base text-sm font-medium">
                          {truncateTextSpells(item?.Title__c, 80)}
                        </h5>
                        <p className="text-black xl:text-base sm:text-sm text-xs font-medium">
                          {"Mumbai, "}
                          {item.Date__c
                            ? new Date(item.Date__c).toLocaleDateString(
                                "en-IN",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
                            : ""}
                        </p>
                      </div>
                      <div>
                        <img
                          src={
                            item?.Order__c == 14
                              ? "/images/latestUpdates/update14-main.jpg"
                              : item?.Image_URL__c
                          }
                          className="xl:max-h-[200px] xl:max-w-[200px] sm:max-w-[150px] max-w-[120px] min-h-[95px] lg:min-h-[190px] h-auto object-cover"
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
