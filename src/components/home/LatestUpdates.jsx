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
  // plain JS: no <…> after useState
  const router = useRouter();
  const [tab, setTab] = useState("All");

  return (
    <div className="bg-[url('/images/home/latestUpdateBg.png')] bg-cover bg-center bg-no-repeat">
      <div className="section-width section-padding">
        <div className=" sm:flex sm:justify-between sm:items-start">
          <TitleComponent orange title={"Latest Updates"} />

          {/* Only show the button on non-mobile screens */}
          <div className="hidden sm:block">
            <Link href={routes.latestUpdates}>
              <div
                className="  flex items-center justify-between py-3 px-6 gap-4"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, #142A7C -11.26%, #344CA2 44.6%, #243FA3 100.45%)",
                }}
              >
                <p className="text-sm font-bold">View All Updates</p>
                <Image
                  src="/images/home/hero/buttonIcon.svg"
                  alt="button-icon"
                  width={24}
                  height={24}
                  className="w-5 h-5"
                />
              </div>
            </Link>{" "}
          </div>
        </div>

        <div className="w-full flex flex-col gap-7 relative">
          <div className="w-full overflow-x-auto scrollbar-hide">
            <div className="relative w-full h-fit">
              <div className="w-full top-0 left-0 lg:flex">
                {/* Left Block */}
               <div
  className="relative xl:flex-[60%] lg:flex-[55%] flex bg-[url('/images/home/latestUpdateImage.jpg')] bg-cover bg-no-repeat bg-center max-lg:h-[400px] cursor-pointer"
  onClick={() => {
    router.push(
      "/latest-updates/mca-adds-star-power-to-t20-mumbai-league-unveils-rohit-sharma-as-face-of-season-3"
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
      <li>Launch Event Press Conference</li>
      <li>Mumbai, April 18, 2025</li>
    </ul>
  </div>
</div>

                {/* Right Block (Mapped) */}
                <div className="xl:flex-[40%] lg:flex-[45%] flex flex-col">
                  {updateItems.map((item, index) => (
                    <div
                      key={index}
                      className={`flex-1 flex justify-between items-center bg-[#BB4B24] hover:bg-[#E07E27] cursor-pointer ${
                        item.bordered ? "border-b border-[#E07E27]" : ""
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
      </div>
    </div>

    // <section className="min-h-screen w-full bg-white px-4 md:px-8 lg:px-16 py-8">
    //   {/* Header */}
    //   <header className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
    //     <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
    //       LATEST UPDATES
    //     </h1>
    //     <Link href="/latestUpdates" className="text-[#616161] font-semibold">
    //       View all Updates
    //     </Link>
    //   </header>

    //   {/* Main + Sidebar */}
    //   <div className="flex flex-col lg:flex-row gap-6">
    //     {/* Highlight */}
    //     <article className="flex-1 relative rounded-lg overflow-hidden">
    //       <Image
    //         src={updates[0].bgImg}
    //         alt="highlight"
    //         fill
    //         className="object-cover"
    //       />
    //       <div className="relative z-10 p-6 md:p-8 lg:p-12 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end h-full text-white">
    //         <p className="text-xl md:text-2xl lg:text-3xl font-bold mb-4">
    //           {updates[0].title}
    //         </p>
    //         <div className="flex flex-wrap gap-4 text-sm md:text-base items-center">
    //           <span className="flex items-center gap-2">
    //             <Image
    //               src={updates[0].avatarDot}
    //               alt=""
    //               width={8}
    //               height={8}
    //               className="h-2 w-2"
    //             />
    //             {updates[0].author}
    //           </span>
    //           <span className="flex items-center gap-2">
    //             <Image
    //               src={updates[0].avatarDot}
    //               alt=""
    //               width={8}
    //               height={8}
    //               className="h-2 w-2"
    //             />
    //             {updates[0].date}
    //           </span>
    //         </div>
    //       </div>
    //     </article>

    //     {/* Sidebar */}
    //     <aside className="w-full lg:w-1/3 flex flex-col">
    //       {/* Tabs */}
    //       <nav className="flex bg-black text-white rounded-t-md overflow-hidden">
    //         {tabs.map((label) => (
    //           <button
    //             key={label}
    //             onClick={() => setTab(label)}
    //             className={`
    //               flex-1 text-center py-3 md:py-4 font-medium
    //               ${tab === label ? "bg-[#E07E27] text-black" : ""}
    //               transition-colors
    //             `}
    //           >
    //             {label === "NewSection" ? "New Season" : label}
    //           </button>
    //         ))}
    //       </nav>

    //       {/* Update Cards */}
    //       <div className="flex-1 flex flex-col divide-y border border-t-0 border-gray-200 overflow-y-auto">
    //         {updates.slice(1, 4).map((u, i) => (
    //           <div
    //             key={i}
    //             className="group flex items-stretch hover:scale-105 transition-transform"
    //           >
    //             <div className="flex-1 p-4 md:p-6 bg-[#121212C7] group-hover:bg-[#E07E27] text-white flex flex-col justify-between">
    //               <h2 className="text-lg md:text-xl font-semibold">
    //                 {u.title}
    //               </h2>
    //               <button className="self-start mt-2 text-xs md:text-sm uppercase px-3 py-1 rounded-md bg-[#E07E278A] group-hover:bg-[rgba(50,13,0,0.46)] transition">
    //                 Read More
    //               </button>
    //             </div>
    //             <div className="w-1/3 md:w-2/5 lg:w-1/3 overflow-hidden">
    //               <Image
    //                 src="/images/home/tech/img1.png"
    //                 alt=""
    //                 width={300}
    //                 height={200}
    //                 className="object-cover h-full w-full"
    //               />
    //             </div>
    //           </div>
    //         ))}
    //       </div>
    //     </aside>
    //   </div>
    // </section>
  );
};

export default LatestUpdates;
