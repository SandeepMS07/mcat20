"use client";

import React from "react";
import TitleComponent from "../common/TitleComponent";
import { Carousel } from "../Carousel";
import { SwiperSlide } from "swiper/react";
import { teamGradients, teamLogoBN } from "@/utilis/helper";

const winnersData = [
  {
    seasonLabel: "Season 3",
    teamKey: "MSC Maratha Royals",
    teamName: "Mumbai South Central Maratha Royals",
    imageUrl: "/images/home/winners/season-3.jpeg",
    logoClassName: "h-48",
  },
  {
    seasonLabel: "Season 2",
    teamKey: "North Mumbai Panthers",
    teamName: "North Mumbai Panthers",
    imageUrl: "/images/home/winners/season-2.jpeg",
  },
  {
    seasonLabel: "Season 1",
    teamKey: "Triumph Knights Mumbai North East",
    teamName: "Triumph Knights MNE",
    imageUrl: "/images/home/winners/season-1.jpeg",
        logoClassName: "h-40",

  },
];

const WinnerCard = ({
  seasonLabel,
  teamKey,
  teamName,
  imageUrl,
  logoOverride,
  logoClassName,
}) => {
  const gradient = teamGradients[teamKey] || { from: "#1e1e1e", to: "#444" };
  const logo =
    logoOverride || teamLogoBN[teamKey] || "/images/logo/playerTeamLogo.png";

  return (
    <div className="w-full flex flex-col items-center text-center">
      <div className="relative w-full">
        <div className="relative rounded-xl overflow-hidden">
          <img
            src={imageUrl}
            alt={teamName}
            className="w-full h-[270px] md:h-[300px] object-cover 2xl:object-center"
          />
        </div>

        <div
          className="absolute left-1/2 -bottom-20 -translate-x-1/2 w-40 h-40 rounded-md flex items-center justify-center p-4  overflow-hidden"
          style={{
            background: `linear-gradient(180deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
          }}
        >
          <img
            src="/images/elements/teamCardRoundElement.png"
            className="absolute inset-0 w-full h-full opacity-60"
            alt=""
          />
          <img
            src="/images/elements/teamCardElement.png"
            className="absolute inset-0 w-full h-full"
            alt=""
          />
          <img
            src={logo}
            alt={`${teamName} logo`}
            className={`relative z-10 w-auto ${
              logoClassName || "h-20"
            } object-contain`}
          />
        </div>
      </div>

      <div className="mt-[105px] flex flex-col items-center">
        <div className="bg-[#E07E27] text-lg md:text-lg text-white font-semibold px-8 py-2 rounded-lg tracking-wide">
          {seasonLabel}
        </div>
        <p className="mt-4 text-white text-lg md:text-lg font-semibold">
          {teamName}
        </p>
      </div>
    </div>
  );
};

const Winners = () => {
  return (
    <div className="relative bg-[url('/images/gallery/background.jpg')] bg-cover bg-center bg-no-repeat py-20">
      <div className="absolute inset-0 bg-[#071C48]/70" />

      <div className="relative section-width">
        <TitleComponent orange title={"Champions Through The Years"} button={false} />

        <div className="w-full">
          {/* Desktop / Tablet */}
          <div className="hidden sm:grid grid-cols-1 lg:grid-cols-3 gap-10 xl:gap-16 2xl:gap-20">
            {winnersData.map((item) => (
              <WinnerCard key={item.seasonLabel} {...item} />
            ))}
          </div>

          {/* Mobile */}
          <div className="sm:hidden block">
            <Carousel
              sectionName="clientLogo"
              sliderPerView={1}
              spaceBetween={20}
              loop={true}
            >
              {winnersData.map((item) => (
                <SwiperSlide key={item.seasonLabel}>
                  <WinnerCard {...item} />
                </SwiperSlide>
              ))}
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Winners;
