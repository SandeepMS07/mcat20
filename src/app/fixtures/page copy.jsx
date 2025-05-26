"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Hero from "@/components/hero/Hero";
import Image from "next/image";
import Link from "next/link";
import fixtures1 from "@/utilis/fixtures/fixtures1.js";
import fixtures2 from "@/utilis/fixtures/fixtures2.js";
import fixtures3 from "@/utilis/fixtures/fixtures3.js"; // Add Season 3 fixtures
import FixturesSeason3 from "./components/FixturesSeason3"; // Import FixturesSeason3

function parseStaticDate(dateStr, timeStr = "") {
  const dayOnly = dateStr.replace(/(\d+)(st|nd|rd|th)/, "$1");
  return new Date(`${dayOnly} June 2025 ${timeStr}`);
}

const TOURNAMENT_IDS = {
  "Season 1": fixtures1,
  "Season 2": fixtures2,
  "Season 3": fixtures3, // Add Season 3
};

function processMatches(jsonData) {
  // Ensure jsonData and jsonData.matches are defined
  if (!jsonData || !jsonData.matches) {
    return [];
  }

  return jsonData.matches.map((m) => {
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
        date: new Date(m.start_date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        location: m.venue_name?.toUpperCase() || "",
      },
    };
  });
}

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSeason = searchParams.get("season") || "Season 3"; // Default to "Season 3"
  const initialTeam = searchParams.get("team") || "All Teams";

  const [season, setSeason] = React.useState(initialSeason);
  const [team, setTeam] = React.useState(initialTeam);

  React.useEffect(() => {
    const params = new URLSearchParams();
    params.set("season", season);
    params.set("team", team);
    router.push(`?${params.toString()}`, { shallow: true });
  }, [season, team, router]);

  React.useEffect(() => {
    setTeam("All Teams");
  }, [season]);

  // Ensure safe access to the season data
  const allMatches = React.useMemo(
    () => processMatches(TOURNAMENT_IDS[season] || {}),
    [season]
  );

  const matches = React.useMemo(
    () =>
      allMatches.filter(
        (m) =>
          team === "All Teams" || m.team1.name === team || m.team2.name === team
      ),
    [allMatches, team]
  );

  const teamOptions = React.useMemo(() => {
    const names = new Set();
    allMatches.forEach((m) => {
      names.add(m.team1.name);
      names.add(m.team2.name);
    });

    // Adding teams for Season 3
    if (season === "Season 3") {
      names.add("Arcs Andheri");
      names.add("Sobo Mumbai Falcons");
      names.add("Maratha Royals");
      names.add("Aakash Tigers");
      names.add("Eagle Thane Strikers");
      names.add("Triumph Knights");
      names.add("Bandra Blasters");
      names.add("North Mumbai Panthers");
    }

    return ["All Teams", ...Array.from(names)];
  }, [allMatches, season]); // Recalculate when the season or matches change

  return (
    <div className="w-full bg-white">
      <Hero
        imgUrl="/images/teams/hero/bg.svg"
        heading="Fixtures"
        subheading="Player Profile"
      />
      <div className="section-width">
        <div className="flex flex-col md:flex-row items-center justify-between py-8 px-4 md:px-0">
          <h2 className="uppercase text-black">{season} Fixtures</h2>
          <div className="flex md:flex-row flex-col lg:gap-10 gap-4">
            {/* Season Filter */}
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
            {/* Team Filter */}
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
          </div>
        </div>

        {/* Conditional Rendering based on Season */}
        {season === "Season 3" && <FixturesSeason3 />}

        {/* Fixtures List */}
        <div className="md:py-8 bg-white flex flex-col gap-6 pb-8">
          {matches.length > 0 ? (
            matches.map((match, idx) => (
              <div
                key={idx}
                className="rounded-md border overflow-hidden text-black"
              >
                {/* Header */}
                <div className="relative bg-[#E07E27] text-white text-sm font-semibold px-4 py-2 flex justify-between items-center">
                  <span>{season}</span>
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
                    {/* Score 1 */}
                    <div className="text-center">
                      <div className="font-bold text-sm sm:text-3xl text-[#894B14AB]">
                        {match.team1.score}
                      </div>
                      <div className="text-[10px] sm:text-xs text-[#894B14AB]">
                        ({match.team1.overs})
                      </div>
                    </div>
                    {/* vs */}
                    <div className="text-sm sm:text-lg font-semibold">vs</div>
                    {/* Score 2 */}
                    <div className="text-center">
                      <div className="font-bold text-sm sm:text-3xl text-[#E07E27]">
                        {match.team2.score}
                      </div>
                      <div className="text-[10px] sm:text-xs text-[#E07E27]">
                        ({match.team2.overs})
                      </div>
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
                      {match.matchInfo.result}
                    </div>
                    <div className="text-xs text-black flex flex-col sm:flex-row justify-between gap-1">
                      <span>{match.matchInfo.date}</span>
                      <span>{match.matchInfo.location}</span>
                    </div>
                    <Link href={`/scores/${match.game_id}`}>
                      <span className="mt-4 inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-semibold">
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
            ))
          ) : (
            <div className="text-center text-gray-500">
              {/* No fixtures found. */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
