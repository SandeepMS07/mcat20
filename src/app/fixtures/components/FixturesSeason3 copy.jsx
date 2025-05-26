"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import fixtures3Raw from "@/utilis/fixtures/fixtures3.js";

const fixtures3Array = Array.isArray(fixtures3Raw)
  ? fixtures3Raw
  : Array.isArray(fixtures3Raw.default)
  ? fixtures3Raw.default
  : Array.isArray(fixtures3Raw.matches)
  ? fixtures3Raw.matches
  : [];

const totalMatches = fixtures3Array.filter(
  (match) => match.match_no !== null
).length;
const upcomingMatches = fixtures3Array.filter(
  (f) => parseStaticDate(f.date, f.time) >= new Date() && f.match_no !== null
).length;

function parseStaticDate(dateStr, timeStr = "") {
  const dayOnly = dateStr.replace(/(\d+)(st|nd|rd|th)/, "$1");
  return new Date(`${dayOnly} June 2025 ${timeStr}`);
}

const upcomingFixtures3 = fixtures3Array
  .filter((f) => parseStaticDate(f.date, f.time) >= new Date())
  .map((f) => ({
    game_id: f.match_no?.toString() || "",
    event_status: "UPCOMING",
    participants: [
      {
        name: f.home_team,
        short_name: f.home_team.replace(/\s+/g, "").toLowerCase(),
        value: "",
      },
      {
        name: f.away_team || "",
        short_name: (f.away_team || "").replace(/\s+/g, "").toLowerCase(),
        value: "",
      },
    ],
    event_sub_status: `${f.date} • ${f.time} @ ${f.venue}`,
    start_date: parseStaticDate(f.date, f.time).toISOString(),
    venue_name: f.venue,
  }));

function processMatches(jsonData) {
  return (jsonData.matches || []).map((m) => {
    const game_id = m.game_id;
    const [p1 = {}, p2 = {}] = m.participants || [];
    const fmt = (p) => ({
      name: p.name || "",
      logo: p.short_name
        ? `/images/fixtures/${p.short_name}.svg`
        : "/images/fixtures/default.svg",
      score: (p.value || "").split(" ")[0] || "",
      overs: p.value?.match(/\(([^)]+)\)/)?.[1] || "",
    });

    return {
      game_id,
      status: m.event_status.toUpperCase(),
      team1: fmt(p1),
      team2: fmt(p2),
      matchInfo: {
        result: m.event_sub_status,
        location: m.venue || "Unknown location", // Add location here
        date: new Date(m.start_date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      },
    };
  });
}

const FixturesSeason3 = () => {
  const allMatches = React.useMemo(
    () => processMatches({ matches: upcomingFixtures3 }),
    []
  );

  return (
    <div className="md:py-8 bg-white flex flex-col gap-6 py-8">
      {/* Display the current match out of total
      {upcomingMatches > 0 && (
        <div className="text-center py-4 text-gray-500">
          <strong>{upcomingMatches}</strong> / <strong>{totalMatches}</strong>{" "}
          match(es) remaining.
        </div>
      )} */}
      {allMatches.length > 0 ? (
        allMatches.map((match, idx) => (
          <div
            key={idx}
            className="rounded-md border overflow-hidden text-black"
          >
            {/* Header */}
            <div className="relative bg-[#E07E27] text-white text-sm font-semibold px-4 py-2 flex justify-between items-center">
              <span>Season 3</span>
              <div
                className="absolute top-0 right-0 h-full w-[120px] md:w-[150px] bg-black flex items-center justify-center text-xs font-bold"
                style={{
                  clipPath: "polygon(20% 0%,100% 0%,100% 100%,0% 100%)",
                }}
              >
                {match.status}
              </div>
            </div>
            {/* Teams & Scores */}
            <div className="flex flex-col lg:flex-row w-full">
              <div className="flex-1 flex flex-col md:flex-row items-center justify-between p-3">
                {/* Team 1 */}
                <div className="flex items-center gap-3 w-full md:w-[35%]">
                  <Image
                    src={`/images/fixtures/${match.team1.name}.svg`}
                    alt={`${match.team1.name} logo`}
                    width={50}
                    height={60}
                    className="object-contain h-28 w-28"
                  />
                  <div className="text-[10px] sm:text-base font-semibold uppercase">
                    {match.team1.name}
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center">
                  <div className="text-sm sm:text-lg font-semibold">vs</div>

                  <p>{`${match.game_id}/20`}</p>
                </div>

                {/* Team 2 */}
                <div className="flex items-center gap-3 w-full md:w-[30%]">
                  <Image
                    src={`/images/fixtures/${match.team2.name}.svg`}
                    alt={`${match.team2.name} logo`}
                    width={50}
                    height={60}
                    className="object-contain h-28 w-28"
                  />
                  <div className="text-[10px] sm:text-base font-semibold uppercase">
                    {match.team2.name}
                  </div>
                </div>
              </div>
              {/* Match Info */}
              <div className="bg-[#F5F5F5] px-12 py-8 flex flex-col justify-center lg:w-1/4">
                <div className="text-xs sm:text-base font-bold text-[#E07E27]">
                  MATCH INFO
                </div>
                <div className="text-base font-semibold leading-tight mb-1 pt-2">
                  {match.matchInfo.result.split(" @").map((part, idx) => (
                    <span key={idx} className={idx === 0 ? "" : "block"}>
                      <p>{part}</p>
                    </span>
                  ))}
                </div>
                {/* 
                <Link href={`/scores/${match.game_id}`}>
                  <span className="mt-4 inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-semibold">
                    Match center
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M9.33333 3.33333L13.3333 7.33333M13.3333 7.33333L9.33333 11.3333M13.3333 7.33333H2.66667"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Link> */}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12 text-gray-500">
          {/* No fixtures found. */}
        </div>
      )}
    </div>
  );
};

export default FixturesSeason3;
