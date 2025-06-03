"use client";

import React from "react";
import fixtures3 from "@/utilis/fixtures/fixtures3.js";
import { teamLogoBN } from "@/utilis/helper";
import routes from "@/utilis/route";
import Image from "next/image";

const FixturesSeason3 = ({ selectedTeam = "" }) => {
  const blockedPatterns = [
    "rest",
    "position - 1 (tbd)",
    "position - 2 (tbd)",
    "position - 3 (tbd)",
    "position - 4 (tbd)",
    "sf winner 1",
    "sf winner 2",
  ];

  const filteredFixtures = fixtures3.filter((match) => {
    const home = match.home_team?.toLowerCase() || "";
    const away = match.away_team?.toLowerCase() || "";
    
    // Check if it's a semifinal or final match (keep these)
    const isSemiFinalOrFinal = match.match_no === 21 || match.match_no === 22 || match.match_no === 23;
    
    // Filter out other blocked patterns
    const isBlocked = blockedPatterns.some(
      (pattern) => home.includes(pattern) || away.includes(pattern)
    );
    
    if (isBlocked && !isSemiFinalOrFinal) return false;
    
    // Filter by selected team
    if (selectedTeam && selectedTeam !== "All Teams") {
      return match.home_team === selectedTeam || match.away_team === selectedTeam;
    }
    
    return true;
  });

  return (
    <div className="md:py-8 bg-white flex flex-col gap-6 py-8">
      {filteredFixtures.map((match, idx) => {
        const teamLogo1 = teamLogoBN[match?.home_team];
        const teamLogo2 = teamLogoBN[match?.away_team];
        return (
          <div
            key={idx}
            className="rounded-md border overflow-hidden text-black"
          >
            {/* Header */}
            <div className="relative bg-[#001B31] text-white text-sm md:text-base lg:text-lg font-semibold px-4 py-2 flex justify-between items-center">
              {match.match_no === 23 ? (
                "Final"
              ) : match.match_no === 22 ? (
                "Semi Final 2"
              ) : match.match_no === 21 ? (
                "Semi Final 1"
              ) : (
                <span>Match {match.match_no} of 23</span>
              )}
              <div
                className="absolute top-0 right-0 h-full w-[200px] md:w-[250px] bg-gradient-to-r from-[#203376] via-black to-black flex items-center justify-center text-xs md:text-sm lg:text-base font-bold"
                style={{
                  clipPath: "polygon(20% 0%,100% 0%,100% 100%,0% 100%)",
                }}
              >
                {match.venue}
              </div>
            </div>
            {/* Teams & Scores */}
            <div className="flex flex-col lg:flex-row w-full">
              <div className="lg:w-[calc(100%-250px)] flex flex-row items-center justify-between p-3">
                {/* Team 1 */}
                <div className="flex max-md:flex-1 lg:flex-row flex-col lg:justify-start justify-center items-center gap-3 md:w-[35%]">
                  <img
                    src={teamLogo1 || "/images/fixtures/logoPlaceHolder.png"}
                    alt={`${match.home_team} logo`}
                    width={50}
                    height={60}
                    className="object-contain md:h-28 md:w-28 h-16 w-16"
                  />
                  <div className="text-[10px] lg:text-left text-center sm:text-base font-semibold uppercase">
                    {match.home_team}
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center">
                  <div className="text-base sm:text-2xl font-semibold">vs</div>
                </div>

                {/* Team 2 */}
                <div className="flex max-md:flex-1 lg:flex-row flex-col lg:justify-start justify-center items-center gap-3 w-full md:w-[40%]">
                  <img
                    src={teamLogo2 || "/images/fixtures/logoPlaceHolder.png"}
                    alt={`${match.away_team} logo`}
                    width={50}
                    height={60}
                    className="object-contain md:h-28 h-16 w-16 md:w-28"
                  />
                  <div className="text-[10px] sm:text-base lg:text-left text-center font-semibold uppercase">
                    {match.away_team}
                  </div>
                </div>
              </div>
              {/* Match Info */}
              {match.ticketLink ? (
                <div className="bg-[#F5F5F5] flex lg:flex-col items-center md:items-start text-left lg:px-12 lg:py-8 sm:p-6 p-4 lg:w-[250px] lg:justify-start justify-between">
                  <div className="flex lg:flex-col sm:flex-row flex-col sm:gap-8 lg:gap-0 items-center md:items-start">
                    <div className="text-xs sm:text-base font-bold text-[#E07E27]">
                      MATCH INFO
                    </div>
                    <div className="text-base font-semibold leading-tight mb-1 lg:pt-2 flex lg:flex-col flex-row gap-2">
                      <p>{match.date}</p>
                      <p>{match.time}</p>
                    </div>
                  </div>

                  <div>
                    <a
                      href={match.ticketLink}
                      target="_blank"
                      className="btn-black"
                    >
                      Buy Tickets
                      <Image
                        src="/images/home/hero/buttonIcon.svg"
                        alt="button-icon"
                        width={24}
                        height={24}
                        className="w-5 h-5"
                      />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-[#F5F5F5] flex lg:flex-col items-center md:items-start text-left lg:px-12 lg:py-8 sm:p-6 p-4 lg:w-[250px] lg:justify-start justify-between">
                  <div className="flex lg:flex-col justify-between w-full">
                    <div className="text-xs sm:text-base font-bold text-[#E07E27]">
                      MATCH INFO
                    </div>
                    <div className="text-base font-semibold leading-tight mb-1 lg:pt-2 flex lg:flex-col flex-row gap-2">
                      <p>{match.date}</p>
                      <p>{match.time}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FixturesSeason3;