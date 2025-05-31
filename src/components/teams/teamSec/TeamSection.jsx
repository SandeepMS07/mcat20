"use client";

import React, { useEffect, useState } from "react";
import { teamDetails, teamsLogo } from "./teamLogo";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/autoplay";
import Home from "@/app/page";
import HomeTeamSection from "@/components/home/HomeTeamSection";
import teampattern1 from "../../../../public/images/elements/teamCardElement.png";
import teampattern2 from "../../../../public/images/elements/teamCardRoundElement.png";
import UpcomingFixtures from "@/components/common/UpcomingFixtures";

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

const TeamSection = ({ data, fixtures, onTeamSelect, LogoDetails }) => {
  const [selectedTeamIndex, setSelectedTeamIndex] = useState(0);
  const [teamDetails, setTeamDetails] = useState(data[selectedTeamIndex]);
  const [players, setPlayers] = useState(
    teamDetails?.Player_Registrations__r?.records || []
  );
  const [totalPlayers, setTotalPlayers] = useState(
    teamDetails?.Player_Registrations__r?.totalSize || 0
  );
  const [CurrentTeam, setCurrentTeam] = useState(data[selectedTeamIndex].Name);

  const Matches = fixtures
    .sort((a, b) => a.match_no - b.match_no)
    .filter(
      (match) =>
        match.home_team === CurrentTeam || match.away_team === CurrentTeam
    )
    .slice(0, 3);

  const [upcomingMatches, setUpcomingMatches] = useState(Matches);

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
    setCurrentTeam(data[selectedTeamIndex].Name);
    setUpcomingMatches(
      fixtures
        .sort((a, b) => a.match_no - b.match_no)
        .filter(
          (match) =>
            match.home_team === CurrentTeam || match.away_team === CurrentTeam
        )
        .slice(0, 3)
    );
  }, [selectedTeamIndex]);

  const getCategoryCount = (level) =>
    players.filter((p) => p.Recent_Competitive_Level__c === level).length;

  return (
    <div className="w-full">
      <div
        className="w-full bg-cover bg-center pt-24  overflow-x-auto md:overflow-visible md:pt-40 flex flex-col gap-8 relative scrollbar-hide pb-32"
        style={{ backgroundImage: "url('/images/teams/hero/teamsBg.svg')" }}
      >
        <div className="section-width">
          <div className="w-full h-full grid grid-cols-4 gap-4 xl:flex xl:flex-row xl:gap-6 justify-center xl:justify-between my-6 p-2 xl:p-8 bg-black bg-opacity-[0.6] rounded-md">
            {data.map((team, index) => {
              const gradientMatch = teamsDataHomePage.find(
                (t) => t.team === team.Name
              );

              const gradientStyle = gradientMatch
                ? {
                    backgroundImage: `linear-gradient(to bottom, ${gradientMatch.gradient.from}, ${gradientMatch.gradient.to})`,
                  }
                : {};

              return (
                <div
                  key={index}
                  onClick={() => handleLogoClick(index)}
                  className={`relative w-full flex items-center justify-center rounded-[5.5px] p-1 cursor-pointer border border-white transition-transform duration-300
                       ${
                         index === selectedTeamIndex
                           ? "border-gray-700 shadow-[0_2px_10px_rgba(224,126,39,0.6)] scale-[1.1]"
                           : "border-none hover:border-none hover:shadow-[0_2px_10px_rgba(224,126,39,0.6)] hover:scale-[1.1]"
                       }`}
                  style={gradientStyle}
                >
                  {/*Background patterns and gradient for the team logo */}
                  <Image
                    src={teampattern2}
                    alt="pattern2"
                    className="absolute inset-0 w-full h-[80%] z-10 top-0 rounded-md"
                  />
                  <Image
                    src={teampattern1}
                    alt="pattern1"
                    className="absolute inset-0 w-full h-full z-20 rounded-md object-cover"
                  />
                  <div className="z-30 rounded-[5.5px]">
                    <TeamLogo
                      image={team.Logo_URL__c}
                      isSelected={index === selectedTeamIndex}
                      name={team.Name}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Team Details */}
          <div className="w-full flex flex-col lg:flex-row justify-between gap-6 my-6 p-4 bg-black bg-opacity-[0.6] rounded-md">
            <div className="flex flex-col sm:flex-row justify-center items-center sm:items-center w-full lg:w-full">
              <TeamDetailLogo image={data[selectedTeamIndex].Logo_URL__c} />
              <div className="hidden sm:block w-px h-12 sm:h-16 m-2 bg-gray-500"></div>
              <div className="text-white sm:ml-4 mt-4 sm:mt-0 w-full">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-center md:text-start">
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

            {/* Right side: Details Section */}
            <div className="flex  flex-col lg:flex-row justify-center gap-4 mt-6 lg:mt-0 items-center w-full lg:w-2/4">
              {/* <div className=" w-full lg:w-[50%] gap-4  flex items-center flex-row justify-center my-6 text-center ">
                <h3 className=" font-medium mb-2 text-[#E07E27]">
                  Total Players{" "}
                </h3>
                <h3 className="font-bold text-white">-</h3>
                <h3 className=" font-bold text-white"> {totalPlayers}</h3>
              </div> */}

              <div className="w-full flex flex-col   items-center p-4">
                {[
                  {
                    label: "Icon",
                    key: "Indian senior team",
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
                    <div
                      key={label}
                      className="flex flex-col w-full justify-center "
                    >
                      <div className="flex flex-row items-center justify-around gap-4 px-2 sm:px-6">
                        <span className="w-[40%] text-sm sm:text-md font-semibold text-[#E07E27]">
                          {label}
                        </span>
                        <span className="w-[20%] text-sm sm:text-md text-white pr-2">
                          -
                        </span>
                        <span className="w-[20%] text-sm sm:text-md text-white">
                          {count}/{level.minPlayerCount}
                        </span>
                      </div>

                      {idx < 3 && (
                        <div className="w-[80%] border-t border-gray-700 my-2  ml-4" />
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
      <div className="md:-mt-40 -mt-32 section-width relative">
        <UpcomingFixtures />
      </div>

      {/* Match Cards Section */}
      {/* <div className="relative w-full bg-white pt-32 pb-16">
        <div className="flex flex-col items-center gap-8 section-width -mt-[286px]">
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
              {upcomingMatches.map((match, index) => (
                <SwiperSlide key={match.match_no}>
                  <MatchCard
                    key={match.match_no}
                    headerText={`Match ${match.match_no}`}
                    time={match.time}
                    date={match.date}
                    homeTeam={match.home_team}
                    awayTeam={match.away_team}
                    venue={match.venue}
                    ticketLink={match.ticketLink}
                    CurrentTeam={CurrentTeam}
                    LogoDetails={LogoDetails}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="hidden 2xl:grid grid-cols-1 2xl:grid-cols-3 gap-6 sm:gap-8 2xl:gap-12 w-full">
            {upcomingMatches.map((match) => (
              <MatchCard
                key={match.match_no}
                headerText={`Match ${match.match_no}`}
                time={match.time}
                date={match.date}
                homeTeam={match.home_team}
                awayTeam={match.away_team}
                venue={match.venue}
                ticketLink={match.ticketLink}
                CurrentTeam={CurrentTeam}
                LogoDetails={LogoDetails}
              />
            ))}
          </div>
        </div>
      </div> */}
    </div>
  );
};

const TeamLogo = ({ image, onClick, name }) => {
  return (
    <div
      onClick={onClick}
      className={`sm:w-[100px] sm:h-[100px]   md:w-full flex items-center justify-center rounded-[5.5px] border-1 border-white relative`}
    >
      <img
        src={image}
        alt="team-logo"
        className={`
          p-2
           w-full h-full object-contain cursor-pointer transition-all duration-300 z-30`}
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
  headerText,
  time,
  date,
  homeTeam,
  awayTeam,
  venue,
  ticketLink,
  CurrentTeam,
  LogoDetails,
}) => {
  // Find the logos for the home and away teams
  const homeTeamLogo = LogoDetails?.find(
    (team) => team.name === CurrentTeam
  ) || { logo: "" };

  let opponentTeam = homeTeam === CurrentTeam ? awayTeam : homeTeam;
  const awayTeamLogo = LogoDetails?.find(
    (team) => team.name === opponentTeam
  ) || { logo: "" };

  const isAfter5PM = (() => {
    if (!time) return false;
    const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return false;

    let [_, hours, minutes, meridiem] = match;
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);
    meridiem = meridiem.toUpperCase();

    if (meridiem === "PM" && hours < 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;

    // Check if the match is scheduled after 5 PM (17:00)
    return hours > 17 || (hours === 17 && minutes > 0);
  })();

  return (
    <div className="bg-white shadow-lg  justify-between border-[rgba(194,194,194,1)] border-[2px] rounded-[10px] h-80 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="relative h-1/4 w-full flex overflow-hidden ">
        <div
          className="flex flex-col justify-center  text-white w-[55%] h-full z-10 px-6 gap-1"
          style={{
            background:
              "linear-gradient(90deg, #000000 0%, #000000 21.84%, #203376 101.04%)",
            clipPath: "polygon(0% 0%, 80% 0%, 100% 100%, 0% 100%)",
          }}
        >
          <span className="text-lg font-semibold">{date}</span>
          <div className="flex flex-row gap-2">
            <img
              src={
                isAfter5PM
                  ? "/images/elements/moon.svg"
                  : "/images/elements/sun.svg"
              }
              alt={isAfter5PM ? "moon" : "sun"}
              style={{ height: "15px" }}
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
          Upcoming
        </div>
      </div>

      {/* Content */}
      <div className="flex h-3/4 flex-row justify-center gap-10 text-center items-center p-10">
        <div className="w-[33%] flex flex-col justify-center items-center gap-6">
          <img src={homeTeamLogo.logo} alt={homeTeam} />
          <span className="text-sm font-semibold text-black">
            {CurrentTeam}
          </span>
        </div>
        <div className="w-[33%] flex flex-col justify-center items-center gap-6">
          <span className="text-[rgba(224,126,39,1)] font-bold italic tracking-widest">
            VS
          </span>
          <span className="text-[rgba(134,134,134,1)] text-xs font-semibold">
            {headerText}
          </span>
        </div>
        <div className="w-[33%] flex flex-col justify-center items-center gap-6">
          <img src={awayTeamLogo.logo} alt={awayTeam} />
          <span className="text-sm font-semibold text-black">
            {awayTeam == CurrentTeam ? homeTeam : awayTeam}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TeamSection;
