"use client";

import React, { useEffect, useState } from "react";
import { teamDetails, teamsLogo } from "./teamLogo";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";


const teamsDataHomePage = [
  {
    team: "Aakash Tigers MWS",
    gradient: {
      from: "#FD7E00",
      to: "#0244AA",
    },
  },
  {
    team: "Arcs Andheri",
    gradient: {
      from: "#263C90",
      to: "#8C2B8E",
    },
  },
  {
    team: "Eagle Thane Strikers",
    gradient: {
      from: "#FBC92E",
      to: "#262262",
    },
  },
  {
    team: "Bandra Blasters",
    gradient: {
      from: "#4B1C86",
      to: "#E51C21",
    },
  },
  {
    team: "North Mumbai Panthers",
    gradient: {
      from: "#FEB713",
      to: "#845C00",
    },
  },
  {
    team: "MSC Maratha Royals",
    gradient: {
      from: "#1000A1",
      to: "#B84124",
    },
  },
  {
    team: "SoBo Mumbai Falcons",
    gradient: {
      from: "#FFF4E9",
      to: "#882626",
    },
  },
  {
    team: "Triumph Knights Mumbai North East",
    gradient: {
      from: "#E8D273",
      to: "#9E7437",
    },
  },
];

const TeamSection = ({data,onTeamSelect}) => {
  const [selectedTeamIndex, setSelectedTeamIndex] = useState(0);
  const [teamDetails,setTeamDetails] = useState(data[selectedTeamIndex]);
  const [players,setPlayers] = useState(teamDetails?.Player_Registrations__r?.records || []);
  const [totalPlayers,setTotalPlayers] = useState(teamDetails?.Player_Registrations__r?.totalSize || 0);

  const handleLogoClick = (index) => {
    setSelectedTeamIndex(index);
    if (onTeamSelect) {
      onTeamSelect(index); 
    }
  };

  useEffect(() => {
    setTeamDetails(data[selectedTeamIndex]);
    setPlayers(teamDetails?.Player_Registrations__r?.records || []);
    setTotalPlayers(teamDetails?.Player_Registrations__r?.totalSize || 0);
  }, [selectedTeamIndex]);
  
  // Used to calculate the category count
  const getCategoryCount = (level) => players.filter((p) => p.Recent_Competitive_Level__c === level).length;

  console.log(data);

  return (
    <div className="w-full">
      {/* Background & Header */}
      <div
        className="w-full bg-cover bg-center pt-24 pb-40 overflow-x-auto md:overflow-visible md:pt-40 md:pb-40 flex flex-col gap-8 relative scrollbar-hide"
        style={{ backgroundImage: "url('/images/teams/hero/teamsBg.svg')" }}
      >
        <div className="section-width">
          {/* Team Carousel */}
          <div className="w-full h-full grid grid-cols-4 gap-4 xl:flex xl:flex-row xl:gap-6 justify-center xl:justify-between my-6 p-2 xl:p-8 bg-black bg-opacity-[0.6] rounded-md">
          
             {data.map((team, index) => {
                  const gradientMatch = teamsDataHomePage.find(t => t.team === team.Name);

                  const gradientStyle = gradientMatch
                    ? {
                        backgroundImage: `linear-gradient(to bottom, ${gradientMatch.gradient.from}, ${gradientMatch.gradient.to})`,
                      }
                   : {};
                    
                 return (
                   <div
                     key={index}
                     onClick={() => handleLogoClick(index)}
                     className={`w-16 md:w-full flex items-center justify-center rounded-[5.5px] p-1 cursor-pointer ${
                       index === selectedTeamIndex ? "scale-[1.1]" : "hover:scale-[1.1]"
                     } transition-transform duration-300`}
                     style={gradientStyle}
                    >
                      <TeamLogo
                        image={team.Logo_URL__c}
                        isSelected={index === selectedTeamIndex}
                      />
                    </div>
                  );
                })}
          </div>

          {/* Team Details */}
          <div className="w-full flex flex-col lg:flex-row justify-between gap-6 my-6 p-4 bg-black bg-opacity-[0.6] rounded-md">
            <div className="flex flex-col sm:flex-row justify-center items-center sm:items-center">
              <TeamDetailLogo image={data[selectedTeamIndex].Logo_URL__c} />
              <div className="hidden sm:block w-px h-12 sm:h-16 m-2 bg-gray-500"></div>
              <div className="text-white sm:ml-4 mt-4 sm:mt-0">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center md:text-start">

                  {/* Break the team to two lines */}
                  {data[selectedTeamIndex].Name.split(" ").length > 4 ? (
                      (() => {
                        const words = data[selectedTeamIndex].Name.split(" ");
                        const firstLine = words.slice(0, 2).join(" ");
                        const secondLine = words.slice(2).join(" ");
                        return (
                          <>
                            <span>{firstLine}</span>
                            <br />
                            <span className="inline-block">{secondLine}</span>
                          </>
                        );
                     })()
                    ) : (
                        <span>{data[selectedTeamIndex].Name}</span>
                    )}
                </h2>
              </div>
            </div>

            {/* Right side: Captain / Coach / Owner */}
            <div className="flex  justify-center gap-4 mt-6 lg:mt-0 items-center">

              <div className="basis-1/5 p-4  flex items-center flex-col justify-center my-6 text-center">
                <h3 className=" font-medium mb-2 text-[#E07E27]">Total Players</h3>
                <h3 className=" font-bold text-white">{totalPlayers}/18</h3>
              </div>
              
              <div className="flex flex-col w-full items-center p-4">
                {[              
                  {
                    label: "Icon",
                    key: "indian senior team",
                    minPlayerCount: 1,
                  },
                 {
                    label: "Senior",
                    key: "First class, list A, BCCI Senior Men T20",
                    minPlayerCount: 4,
                 },
                 {
                   label: "Emerging",
                    key: "Mumbai age group team (under 23 or under 19)",
                    minPlayerCount: 5,
                 },
                 {
                   label: "Development",
                   key: "Local club team",
                   minPlayerCount: 5,
                  },
                  ].map((level, idx) => {
                  const count = getCategoryCount(level.key);
                  const label = level.label;

                  return (
                    <div key={label} className="flex flex-col w-full justify-center">
                      <div className="flex flex-row items-center justify-around gap-4 px-2 sm:px-6">
                        <span className="w-[33%] text-sm sm:text-md font-semibold text-[#E07E27]">
                          {label}
                        </span>
                        <span className="w-[23%] text-sm sm:text-md text-white pr-2">-</span>
                        <span className="w-[43%] text-sm sm:text-md text-white">
                          {count}/{level.minPlayerCount}
                        </span>
                      </div>
                  
                     {idx < 3 && (
                        <div className="w-full border-t border-gray-700 my-2" />
                      )}
                    </div>
                  );
                })}
              </div>
           
            </div>
          </div>

          {/* Upcoming Matches Heading */}
          <div className="text-xl sm:text-2xl font-semibold my-8 sm:my-16 text-white">
            UPCOMING MATCHES
          </div>
        </div>
      </div>

      {/* Match Cards Section */}
      <div className="relative w-full bg-white pt-32 pb-16">
        <div className="flex flex-col items-center gap-8 section-width -mt-[286px]">
          {/* Mobile View - Carousel */}
          <div className="block 2xl:hidden w-full">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              loop={true}
            >
              <SwiperSlide>
                <MatchCard headerText="Match 1" />
              </SwiperSlide>
              <SwiperSlide>
                <MatchCard headerText="Match 2" />
              </SwiperSlide>
              <SwiperSlide>
                <MatchCard headerText="Match 3" />
              </SwiperSlide>
            </Swiper>
          </div>

          {/* Desktop View - Grid */}
          <div className="hidden 2xl:grid grid-cols-1 2xl:grid-cols-3 gap-6 sm:gap-8 2xl:gap-12 w-full">
            <MatchCard />
            <MatchCard />
            <MatchCard />
          </div>
        </div>
      </div>
    </div>
  );
};

const TeamLogo = ({ image, onClick, isSelected }) => {
  return (
    <div
      onClick={onClick}
      className={`w-16 md:w-full flex items-center justify-center rounded-[5.5px]`}
    >
      <img
        src={image}
        alt="team-logo"
        className={`w-full h-full rounded-[5.5px] object-contain cursor-pointer transition-all duration-300 border-[1px]
          ${
            isSelected
              ? "border-grey-700 shadow-[0_2px_10px_rgba(224,126,39,0.6)] scale-[1.1]"
              : "border-none hover:border-none hover:shadow-[0_2px_10px_rgba(224,126,39,0.6)] hover:scale-[1.1]"
          }`}
      />
    </div>
  );
};

const TeamDetailLogo = ({ image }) => {
  return (
    <div className="flex item-center">
      <img
        src={image}
        alt="team-detail-logo"
        className="w-56 h-auto px-4 object-contain"
      />
    </div>
  );
};

const MatchCard = ({
  date = "24 MAR, 2025",
  time = "7:30 pm IST",
  status = "UPCOMING",
}) => {
  return (
    <div className="bg-white shadow-lg rounded-xl justify-between border-[rgba(194,194,194,1)] border-[2px] rounded-lg h-80 flex flex-col">
      {/* Header */}
      <div className="relative h-1/4 w-full rounded-t-xl flex overflow-hidden">
        <div
          className="flex flex-col justify-center px-4 text-white w-[55%] h-full z-10 px-6 gap-1"
          style={{
    background: "linear-gradient(90deg, #000000 0%, #000000 21.84%, #203376 101.04%)",
            clipPath: "polygon(0% 0%, 80% 0%, 100% 100%, 0% 100%)",
          }}
        >
          <span className="text-lg font-semibold">{date}</span>
          <div className="flex flex-row gap-2">
            <img
              src="/images/elements/moon.svg"
              alt="moon"
              style={{ height: "15px", marginTop: "1.5px" }}
            />
            <span className="text-sm">{time}</span>
          </div>
        </div>

        <div
          className="absolute top-0 right-0 h-full flex items-center w-[60%] justify-center text-white text-lg font-semibold pl-8"
          style={{
            backgroundColor: "#003967",
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 20% 100%)",
          }}
        >
          {status}
        </div>
      </div>

      {/* Content */}
      <div className="flex h-3/4 flex-row justify-center gap-10 text-center items-center p-10">
        <div className="w-[33%] flex flex-col justify-center items-center gap-6">
          <img src="/images/teams/hero/teamLogo/arcs.svg" alt="arcs" />
          <span className="text-sm font-semibold text-black">ARCS ANDHERI</span>
        </div>
        <div className="w-[33%] flex flex-col justify-center items-center gap-6">
          <span className="text-[rgba(224,126,39,1)] font-bold italic tracking-widest">
            VS
          </span>
          <span className="text-[rgba(134,134,134,1)] text-xs font-semibold">
            MATCH 25/74
          </span>
        </div>
        <div className="w-[33%] flex flex-col justify-center items-center gap-6">
          <img src="/images/teams/hero/teamLogo/thane.svg" alt="arcs" />
          <span className="text-sm font-semibold text-black">
            EAGLE THANE STRIKERS
          </span>
        </div>
      </div>
    </div>
  );
};

export default TeamSection;
