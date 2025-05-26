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
      {/* <Hero
        imgUrl="/images/banner/fixture.jpg"
        // heading="Season 3 Fixtures"
        // subheading="Player Profile"
      /> */}
      <div className="w-full relative flex justify-end lg:py-36 py-20 bg-[url('/images/banner/fixture.jpg')] bg-cover  bg-center bg-no-repeat ">
        {/* <div className="w-full relative flex justify-end lg:py-36 py-20 bg-[url('/images/banner/mobileBgFixture.jpg')]  sm:bg-[url('/images/banner/fixture.jpg')] bg-cover sm:bg-right bg-center bg-no-repeat "> */}
        <div className="relative z-10  pt-8 h-full  flex-col overflow-hidden justify-between text-white flex gap-24  mt-20 section-width">
          <div className="w-full flex flex-col items-start justify-between bg-transparent gap-20">
            <h1>Fixtures</h1>
          </div>
        </div>
      </div>
      <div className="section-width">
        {/* <div className="flex flex-col md:flex-row items-center justify-between pt-8 px-4 md:px-0">
          <h2 className="uppercase text-black">Season 3 Fixtures</h2>
          <h2 className="uppercase text-black">{season} Fixtures</h2>  
          <div className="flex md:flex-row flex-col lg:gap-10 gap-4">
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
          </div> 
        </div> */}

        {/* Conditional Rendering based on Season */}
        <FixturesSeason3 />
      </div>
    </div>
  );
}
