"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Hero from "@/components/hero/Hero";
import Image from "next/image";
import Link from "next/link";
import fixtures1 from "@/utilis/fixtures/fixtures1.js";
import fixtures2 from "@/utilis/fixtures/fixtures2.js";
import fixtures3 from "@/utilis/fixtures/fixtures3.js";
import FixturesSeason1 from "./components/FixturesSeason1";
import FixturesSeason2 from "./components/FixturesSeason2";
import FixturesSeason3 from "./components/FixturesSeason3";

function parseStaticDate(dateStr, timeStr = "") {
  const dayOnly = dateStr.replace(/(\d+)(st|nd|rd|th)/, "$1");
  return new Date(`${dayOnly} June 2025 ${timeStr}`);
}

const TOURNAMENT_IDS = {
  "Season 1": fixtures1,
  "Season 2": fixtures2,
  "Season 3": fixtures3,
};

function processMatches(jsonData) {
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

// Helper function to get teams for each season
function getTeamsForSeason(season) {
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

  let teams = [];

  if (season === "Season 1" || season === "Season 2") {
    // For Season 1 & 2, extract from processed matches
    const allMatches = processMatches(TOURNAMENT_IDS[season] || {});
    const names = new Set();
    allMatches.forEach((m) => {
      names.add(m.team1.name);
      names.add(m.team2.name);
    });
    teams = Array.from(names).filter(Boolean);
  } else if (season === "Season 3") {
    // For Season 3, extract from fixtures3 data
    teams = Array.from(
      new Set(fixtures3.flatMap((match) => [match.home_team, match.away_team]))
    )
      .filter(Boolean)
      .filter((team) => {
        const lower = team.toLowerCase();
        return !blockedPatterns.some((pattern) => lower.includes(pattern));
      });
  }

  return ["All Teams", ...teams.sort()];
}

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSeason = searchParams.get("season") || "Season 3";
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

  const teamOptions = React.useMemo(() => {
    return getTeamsForSeason(season);
  }, [season]);

  const renderFixturesComponent = () => {
    const commonProps = { selectedTeam: team };

    switch (season) {
      case "Season 1":
        return <FixturesSeason1 {...commonProps} />;
      case "Season 2":
        return <FixturesSeason2 {...commonProps} />;
      case "Season 3":
        return <FixturesSeason3 {...commonProps} />;
      default:
        return <FixturesSeason3 {...commonProps} />;
    }
  };

  return (
    <div className="w-full bg-white">
      <div className="w-full relative flex justify-end lg:py-36 py-20 bg-[url('/images/banner/fixture.jpg')] bg-cover bg-center bg-no-repeat">
        <div className="relative z-10 pt-8 h-full flex-col overflow-hidden justify-between text-white flex gap-24 mt-20 section-width">
          <div className="w-full flex flex-col items-start justify-between bg-transparent gap-20">
            <h1>Fixtures</h1>
          </div>
        </div>
      </div>

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

        <div className="section-width pt-10">
          {/* Season and Team Selection Header */}
          <div className="relative  mb-6">
            {/* Background image */}
            <Image
              src="/images/elements/small-title-bg.png"
              alt="Mobile Title"
              className="block md:hidden    w-full"
              width={200}
              height={0}
              priority
            />
            <Image
              src="/images/elements/title-bg.png"
              alt="Desktop Title"
              className="hidden md:block lg:block   w-full "
              width={700}
              height={200}
              priority
            />

            {/* Foreground content */}
            <div className="absolute top-0 left-0 h-full z-10 flex flex-col md:flex-row md:items-center md:justify-between justify-center   w-full">
              <h2
                className="uppercase max-sm:text-base md:text-lg lg:text-xl xl:text-2xl  xl:ml-16 ml-12 italic text-black"
                style={{
                  background:
                    "radial-gradient(43.3% 61.24% at 50% 50%, #FFF200 0%, #FFF200 26%, #FBB040 97%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {season} Fixtures
              </h2>

              {/* <div className="hidden md:flex-row xl:mr-14 mr-8   flex-col lg:gap-4 gap-2 max-md:mt-4 w-fit md:flex ">
                <div className="flex flex-row gap-2 items-center">
                  <p className="text-white font-semibold xl:text-lg lg:text-base text-sm  mr-2">
                    Filter By:
                  </p>
                  <select
                    name="season"
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    className="px-4 xl:py-2 py-1 border border-[#E07E27] uppercase bg-transparent text-[#E07E27]  xl:text-sm text-xs lg:w-40 w-28"
                  >
                    <option value="Season 1">Season 1</option>
                    <option value="Season 2">Season 2</option>
                    <option value="Season 3">Season 3</option>
                  </select>
                </div>

                <div className="flex flex-row gap-2 items-center">
                  <select
                    name="team"
                    value={team}
                    onChange={(e) => setTeam(e.target.value)}
                    className="px-4  xl:py-2 py-1 bg-[#E07E27] uppercase text-white  xl:text-sm text-xs   lg:w-40 w-28"
                  >
                    {teamOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div> */}
              <div className="hidden md:flex xl:mr-14 mr-8 max-md:mt-4 w-fit">
                <FixtureFilter
                  season={season}
                  team={team}
                  teamOptions={teamOptions}
                  onSeasonChange={setSeason}
                  onTeamChange={setTeam}
                />
              </div>
            </div>
          </div>
          <div className="flex md:hidden  mr-8 max-md:mt-4 w-fit">
            <FixtureFilter
              season={season}
              team={team}
              teamOptions={teamOptions}
              onSeasonChange={setSeason}
              onTeamChange={setTeam}
            />
          </div>

          {/* Render the appropriate fixtures component */}
          {renderFixturesComponent()}
        </div>
      </div>
    </div>
  );
}

const FixtureFilter = ({
  season,
  team,
  teamOptions,
  onSeasonChange,
  onTeamChange,
  isMobile = false,
}) => {
  return (
    <div
      className={`${
        isMobile ? "flex-col gap-3 mt-4 w-full" : "flex-row gap-4"
      } flex items-center`}
    >
      <div className="flex flex-row gap-2 items-center">
        <p className="md:text-white md:block hidden font-semibold xl:text-lg lg:text-base text-sm mr-2">
          Filter By:
        </p>

        <select
          name="season"
          value={season}
          onChange={(e) => onSeasonChange(e.target.value)}
          className={`px-4 ${
            isMobile ? "py-2" : "xl:py-2 py-1"
          } border border-[#E07E27] uppercase bg-transparent text-[#E07E27] xl:text-sm text-xs ${
            isMobile ? "w-full" : "lg:w-40 w-28"
          }`}
        >
          <option value="Season 1">Season 1</option>
          <option value="Season 2">Season 2</option>
          <option value="Season 3">Season 3</option>
        </select>
      </div>

      <div className="flex flex-row gap-2 items-center">
        <select
          name="team"
          value={team}
          onChange={(e) => onTeamChange(e.target.value)}
          className={`px-4 ${
            isMobile ? "py-2" : "xl:py-2 py-1"
          } bg-[#E07E27] uppercase text-white xl:text-sm text-xs ${
            isMobile ? "w-full" : "lg:w-40 w-28"
          }`}
        >
          {teamOptions.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
