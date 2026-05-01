"use client";
import React, { useState } from "react";
import TeamCard from "../common/TeamCard";
import TitleComponent from "../common/TitleComponent";
import { SwiperSlide } from "swiper/react";
import { Carousel } from "../Carousel";
import routes from "@/utilis/route";
import teamDetailsDataSeason3 from "../../constant/team/teamDetailsDataSeason3.json";
// import CountdownTimer from "./CountdownTimer";

const womensTeamNames = ["Aakash Tigers MWS", "SoBo Mumbai Falcons"];

const HomeTeamSection = () => {
  const [teamDetails, setTeamDetails] = useState(teamDetailsDataSeason3.data);
  const womensTeams = [
    ...womensTeamNames
      .map((teamName) => teamDetails.find((t) => t?.Name === teamName))
      .filter(Boolean),
    {
      Name: "Thane Skyrisers",
      Logo_URL__c:
        "https://storage.googleapis.com/mca-bucket-gcp/Dev%2F1777550579538-2rnu5ffs2is-Vihang_Thane-Risers-Logo.png",
    },
  ];

  return (
    <>
      {/* <div className="pl-5 mt-8 md:hidden block"><CountdownTimer/></div> */}
      <div className="relative">
        <img
          src="/images/elements/section-element.png"
          className="absolute right-0 top-0 md:block hidden"
          alt="element"
        />
        <img
          src="/images/elements/section-element.png"
          className="absolute left-0 bottom-0 rotate-180 md:block hidden"
          alt="element"
        />

        <div className="section-width padding-top padding-bottom">
          <TitleComponent
            title={"Men's Teams"}
            button={false}
            buttonLink={routes.teams}
          />
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
              </div>
            </div>
          </div>

          <div className="mt-16">
            <TitleComponent title={"Women's Teams"} button={false} />
            <div className="w-full flex flex-col gap-7 relative mt-8">
              <div className="w-full overflow-x-auto scrollbar-hide">
                <div className="sm:grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 2xl:gap-8 gap-5 hidden">
                  {womensTeams.map((item, i) => (
                    <TeamCard data={item} key={i} />
                  ))}
                </div>
                <div className="w-full sm:hidden block">
                  <Carousel
                    sectionName="womensTeam"
                    sliderPerView={1}
                    spaceBetween={50}
                    loop={true}
                  >
                    {womensTeams.map((item, i) => (
                      <SwiperSlide key={i}>
                        <TeamCard data={item} key={i} />
                      </SwiperSlide>
                    ))}
                  </Carousel>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeTeamSection;
