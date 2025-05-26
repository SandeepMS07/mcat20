"use client";

import React, { useState } from "react";
import fixtures3 from "@/utilis/fixtures/fixtures3.js";
import { teamLogoBN } from "@/utilis/helper";
import routes from "@/utilis/route";
import Image from "next/image";

const FixturesSeason3 = () => {
  const [selectedTeam, setSelectedTeam] = useState("");

  const blockedPatterns = [
    "rest",
    "semi final",
    "position - 1 (tbd)",
    "position - 2 (tbd)",
    "position - 3 (tbd)",
    "position - 4 (tbd)",
    "sf winner 1",
    "sf winner 2",
  ];

  const cleanedFixtures = fixtures3.filter((match) => {
    const home = match.home_team?.toLowerCase() || "";
    const away = match.away_team?.toLowerCase() || "";

    const blockedPatterns = [
      "rest",
      "semi final",
      "position - 1 (tbd)",
      "position - 2 (tbd)",
      "position - 3 (tbd)",
      "position - 4 (tbd)",
      "sf winner 1",
      "sf winner 2",
    ];

    const isBlocked = blockedPatterns.some(
      (pattern) => home.includes(pattern) || away.includes(pattern)
    );

    return !isBlocked;
  });

  const allTeams = Array.from(
    new Set(fixtures3.flatMap((match) => [match.home_team, match.away_team]))
  )
    .filter(Boolean)
    .filter((team) => {
      const lower = team.toLowerCase();
      return !blockedPatterns.some((pattern) => lower.includes(pattern));
    })
    .sort();

  // const filteredFixtures = selectedTeam
  //   ? fixtures3.filter(
  //       (match) =>
  //         match.home_team === selectedTeam || match.away_team === selectedTeam
  //     )
  //   : fixtures3.slice(0, -3); // same logic as before
  // const filteredFixtures = cleanedFixtures.filter((match) =>
  //   selectedTeam
  //     ? match.home_team === selectedTeam || match.away_team === selectedTeam
  //     : true
  // );
  const filteredFixtures = fixtures3.filter((match) =>
    selectedTeam
      ? match.home_team === selectedTeam || match.away_team === selectedTeam
      : true
  );

  return (
    <div className="md:py-8 bg-white flex flex-col gap-6 py-8">
      <div className="flex flex-col md:flex-row items-center md:justify-between justify-center pt-8 pb-4 px-4 md:px-0">
        <h2 className="uppercase text-black">Season 3</h2>
        <div className="w-full max-w-xs md:ml-auto max-md:mt-4 flex flex-row gap-2 items-center">
          <p className="text-black w-28">Filter by:</p>
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="w-full border border-gray-300 text-black rounded px-4 py-2 text-sm"
          >
            <option value="">All Teams</option>
            {allTeams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>
        {/* <h2 className="uppercase text-black">{season} Fixtures</h2> */}
        {/* <div className="flex md:flex-row flex-col lg:gap-10 gap-4">
            <select
              name="season"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="px-4 py-2 border border-orange-500 text-orange-500 rounded mt-2 md:mt-0 relative"
            >
              <option value="Season 1">Season 1</option>
              <option value="Season 2">Season 2</option>
              <option value="Season 3">Season 3</option>
            </select>
            <select
              name="team"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              className="px-4 py-2 border border-orange-500 text-orange-500 rounded mt-2 md:mt-0"
            >
              {teamOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div> */}
      </div>

      {filteredFixtures.map((match, idx) => {
        const teamLogo1 = teamLogoBN[match?.home_team];
        const teamLogo2 = teamLogoBN[match?.away_team];
        return (
          <div
            key={idx}
            className="rounded-md border overflow-hidden text-black"
          >
            {/* Header */}
            <div className="relative bg-[#E07E27] text-white text-sm md:text-base lg:text-lg  font-semibold px-4 py-2 flex justify-between items-center">
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
                className="absolute top-0 right-0 h-full w-[200px] md:w-[250px] bg-black flex items-center justify-center text-xs md:text-sm lg:text-base  font-bold"
                style={{
                  clipPath: "polygon(20% 0%,100% 0%,100% 100%,0% 100%)",
                }}
              >
                {match.venue}
              </div>
            </div>
            {/* Teams & Scores */}
            <div className="flex flex-col lg:flex-row w-full">
              <div className="lg:w-[calc(100%-250px)] flex  flex-row items-center justify-between p-3">
                {/* Team 1 */}
                <div className="flex max-md:flex-1 lg:flex-row flex-col lg:justify-start justify-center items-center gap-3  md:w-[35%]">
                  <img
                    src={teamLogo1 || "/images/fixtures/logoPlaceHolder.png"}
                    // alt={`${match.team1.name} logo`}
                    width={50}
                    height={60}
                    className="object-contain md:h-28  md:w-28  h-16 w-16"
                  />
                  <div className="text-[10px] lg:text-left text-center sm:text-base font-semibold uppercase">
                    {match.home_team}
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center">
                  <div className="text-base sm:text-2xl font-semibold">vs</div>

                  {/* <p>{`${match.match_no}/23`}</p> */}
                </div>

                {/* Team 2 */}
                <div className="flex max-md:flex-1 lg:flex-row flex-col lg:justify-start justify-center items-center gap-3 w-full md:w-[40%]">
                  <img
                    src={teamLogo2 || "/images/fixtures/logoPlaceHolder.png"}
                    alt={teamLogo2}
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
              <div className="bg-[#F5F5F5] lg:px-12 lg:py-8 sm:p-6 p-4 flex lg:flex-col lg:justify-center justify-between lg:w-[250px]">
                <div className="text-xs sm:text-base font-bold text-[#E07E27]">
                  MATCH INFO
                </div>
                <div className="text-base font-semibold leading-tight mb-1 lg:pt-2 flex lg:flex-col flex-row gap-2">
                  <p>{match.date}</p>
                  <p>{match.time}</p>
                </div>
                {match.ticketLink && (
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
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FixturesSeason3;
