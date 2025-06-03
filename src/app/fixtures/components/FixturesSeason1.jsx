"use client";

import React from "react";
import fixtures1 from "@/utilis/fixtures/fixtures1.js";
import Image from "next/image";
import Link from "next/link";
import { teamLogoStats } from "@/utilis/helper";

const FixturesSeason1 = ({ selectedTeam = "" }) => {
  // Process Season 1 fixtures data
  function processMatches(jsonData) {
    if (!jsonData || !jsonData.matches) {
      return [];
    }

    return jsonData.matches.map((m) => {
      const game_id = m.game_id;
      const [p1 = {}, p2 = {}] = m.participants || [];

      return {
        game_id,
        status: m.event_status.toUpperCase(),
        team1: {
          name: p1.name || "",
          score: (p1.value || "").split(" ")[0] || "",
          overs: p1.value?.match(/\(([^)]+)\)/)?.[1] || "",
        },
        team2: {
          name: p2.name || "",
          score: (p2.value || "").split(" ")[0] || "",
          overs: p2.value?.match(/\(([^)]+)\)/)?.[1] || "",
        },
        matchInfo: {
          result: m.event_sub_status,
          date: new Date(m.start_date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          location: m.venue_name || "",
          matchNumber: m.event_name || `Match ${m.game_id}`,
        },
      };
    });
  }

  const allMatches = processMatches(fixtures1 || {});

  const filteredMatches = allMatches.filter((match) => {
    if (selectedTeam && selectedTeam !== "All Teams") {
      return (
        match.team1.name === selectedTeam || match.team2.name === selectedTeam
      );
    }
    return true;
  });

  return (
    <div className="md:py-8 bg-white flex flex-col gap-6 py-8">
      {filteredMatches.map((match, idx) => {
        const teamLogo1 = teamLogoStats[match.team1.name];
        const teamLogo2 = teamLogoStats[match.team2.name];

        return (
          <div
            key={match.game_id || idx}
            className="rounded-md border overflow-hidden text-black"
          >
            {/* Header */}
            <div className="relative bg-[#001B31] text-white text-sm md:text-base lg:text-lg font-semibold px-4 py-2 flex justify-between items-center">
              <span>{match.matchInfo.matchNumber}</span>
            

              <div
                className="absolute top-0 right-0 h-full w-[200px] md:w-[250px] bg-gradient-to-r from-[#203376] via-black to-black flex items-center justify-center text-xs md:text-sm lg:text-base font-bold"
                style={{
                  clipPath: "polygon(20% 0%,100% 0%,100% 100%,0% 100%)",
                }}
              >
                {match.matchInfo.location
                  .toLowerCase()
                  .replace(/mumbai/i, "")
                  .replace(/,/g, "")
                  .trim()
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row w-full">
              <div className="lg:w-[calc(100%-250px)] flex flex-row items-center justify-between p-3">
                {/* Team 1 */}
                <div className="flex max-md:flex-1 lg:flex-row flex-col lg:justify-between justify-center items-center gap-3 md:w-[35%] text-center">
                  <img
                    src={teamLogo1 || "/images/fixtures/logoPlaceHolder.png"}
                    alt={`${match.team1.name} logo`}
                    width={50}
                    height={60}
                    className="object-contain md:h-28 md:w-28 h-16 w-16"
                  />
                  <div className="text-[10px] lg:text-left text-center sm:text-base font-semibold uppercase">
                    {match.team1.name}
                  </div>
                  {match.team1.score && (
                    <div className="text-2xl font-bold">
                      {match.team1.score}{" "}
                      <br />
                      {match.team1.overs && `(${match.team1.overs})`}
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-center items-center">
                  <div className="text-base sm:text-2xl font-semibold">vs</div>
                  {match.status && (
                    <div className="text-xs text-gray-600 mt-1">
                      {match.status}
                    </div>
                  )}
                </div>

                <div className="flex max-md:flex-1 lg:flex-row flex-col lg:justify-between justify-center items-center gap-3 w-full md:w-[40%] text-center">
                  {match.team2.score && (
                    <div className="text-2xl font-bold">
                      {match.team2.score}{" "}
                      <br />
                      {match.team2.overs && `(${match.team2.overs})`}
                    </div>
                  )}
                  <img
                    src={teamLogo2 || "/images/fixtures/logoPlaceHolder.png"}
                    alt={`${match.team2.name} logo`}
                    width={50}
                    height={60}
                    className="object-contain md:h-28 h-16 w-16 md:w-28"
                  />
                  <div className="text-[10px] sm:text-base lg:text-left text-center font-semibold uppercase">
                    {match.team2.name}
                  </div>
                  
                </div>
              </div>

              <div className="bg-[#F5F5F5] flex lg:flex-col items-center md:items-start text-left lg:px-12 lg:py-8 sm:p-6 p-4 lg:w-[250px] lg:justify-start justify-between">
                <div className="flex lg:flex-col justify-between w-full h-full">
                  <div className="">
                    <p className="text-xs sm:text-base font-bold text-[#E07E27]">
                      MATCH INFO
                    </p>
                    <p className="lg:hidden block">{match.matchInfo.date}</p>
                  </div>
                  <div className="text-base font-semibold leading-tight lg:pt-2 flex lg:flex-col flex-row gap-2">
                    <div className="lg:block hidden">
                      <p>{match.matchInfo.date}</p>
                      {match.matchInfo.result && (
                        <p className="text-sm text-gray-600">
                          {match.matchInfo.result}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className=" lg:mt-2">
                    <Link href={`/scores/${match.game_id}`}>
                      <span className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-gray-800 transition-colors text-sm">
                        Match center
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M9.33333 3.33333L13.3333 7.33333M13.3333 7.33333L9.33333 11.3333M13.3333 7.33333H2.66667"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="lg:hidden block text-center">
                {match.matchInfo.result && (
                  <p className="text-sm text-gray-600">
                    {match.matchInfo.result}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FixturesSeason1;
