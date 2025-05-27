"use client";
import Image from "next/image";
import React, { useState } from "react";
import TeamCard from "../common/TeamCard";
import TitleComponent from "../common/TitleComponent";
import { SwiperSlide } from "swiper/react";
import { Carousel } from "../Carousel";

import teamDetailsDataSeason3 from "../../constant/team/teamDetailsDataSeason3.json";
import { teamGradients } from "@/utilis/helper";

const teamsDataHomePage = [
  {
    logo: "/images/home/team/aakashTigers.png",
    team: "Aakash Tigers MWS",
    gradient: {
      from: "#FD7E00",
      to: "#0244AA",
    },
  },
  {
    logo: "/images/home/team/arcsAndheri.png",
    team: "ARCS Andheri",
    gradient: {
      from: "#263C90",
      to: "#8C2B8E",
    },
  },
  {
    logo: "/images/home/team/eagleThaneStrikers.png",
    team: "Eagle Thane Strikers",
    gradient: {
      from: "#FBC92E",
      to: "#262262",
    },
  },
  {
    logo: "/images/home/team/bandraBlasters.png",
    team: "Bandra Blasters",
    gradient: {
      from: "#4B1C86",
      to: "#E51C21",
    },
  },
  {
    logo: "/images/home/team/northMumbaiPanthers.png",
    team: "North Mumbai Panthers",
    gradient: {
      from: "#FEB713",
      to: "#845C00",
    },
  },
  {
    logo: "/images/home/team/shivajiParkLions.png",
    team: "Mumbai South Central Maratha Royals",
    gradient: {
      from: "#1000A1",
      to: "#B84124",
    },
  },
  {
    logo: "/images/home/team/soboSuperSonics.png",
    team: "SoBo Mumbai Falcons",
    gradient: {
      from: "#FFF4E9",
      to: "#882626",
    },
  },
  {
    logo: "/images/home/team/triumphKnights.png",
    team: "Triumph Knights Mumbai North East",
    gradient: {
      from: "#E8D273",
      to: "#9E7437",
    },
  },
];

const HomeTeamSection = () => {
  const [teamDetails, setTeamDetails] = useState(teamDetailsDataSeason3.data);

  return (
    <div className="relative">
    <img src="/images/elements/section-element.png" className="absolute left-0 bottom-0 rotate-180" alt="element" /> 
      <div className="section-width padding-top padding-bottom">
        <TitleComponent title={"Teams"} />
        <div className="w-full flex flex-col gap-7 relative">
          <div className="w-full overflow-x-auto  scrollbar-hide">
            <div className="sm:grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 2xl:gap-8 gap-5 hidden">
              {[...teamDetails]
                .sort((a, b) => a.Name.localeCompare(b.Name))
                ?.map((item, i) => {
                  return <TeamCard data={item} key={i} />;
                })}
            </div>
            <div className="w-full sm:hidden block">
              <Carousel
                sectionName="clientLogo"
                sliderPerView={1}
                spaceBetween={50}
                loop={true}
              >
                {[...teamDetails]
                  .sort((a, b) => a.Name.localeCompare(b.Name))
                  .map((item, i) => (
                    <SwiperSlide key={i}>
                      <TeamCard data={item} key={i} />
                    </SwiperSlide>
                  ))}
              </Carousel>
              {/* {teamsDataHomePage.map((item, i) => {
                return <TeamCard data={item} key={i} />;
              })} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeTeamSection;
