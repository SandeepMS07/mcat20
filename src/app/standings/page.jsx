"use client";
import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import standingsData from "@/constant/oldSeason/standings/standings_data_v3.json";
import StandingsSeason3Data from "@/constant/oldSeason/standings/standings_data_s3.json";
import CustomTable from "@/components/common/CustomTable";
import Hero from "@/components/hero/Hero";
import { season3TeamLogo, teamLogoStats, teamShortName } from "@/utilis/helper";
import TitleComponent from "@/components/common/TitleComponent";
import { DropDown } from "@/components/common/DropDown";
import { getStandings } from "../api/serverApi";

const headers = [
  "RANK",
  "TEAM",
  "MP",
  "WON",
  "LOST",
  "TIED",
  "N/R",
  "NET RR",
  "PTS",
];

const headerStyles = {
  className: "bg-[#E07E27] text-black text-center",
};
const tBodyStyles = {
  className: "bg-[#0F1A2D] text-white text-left",
};
const rowStyles = {
  className: "p-5",
};

const TableTabComponent = () => {
  const [activeSeason, setActiveSeason] = useState("season_3");
  const [activeTeam, setActiveTeam] = useState("All Teams");
  const [standingsSeason3, setStandingsSeason3] = useState();
  const [loading, setLoading] = useState();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [standingsRes] = await Promise.all([getStandings()]);
      setStandingsSeason3(standingsRes?.data?.season_3?.points || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  // const teamsInSeason = useMemo(() => {
  //   const currentSeasonData = standingsData[activeSeason] || [];
  //   const teamNames = currentSeasonData.map((team) => team.team_name);
  //   return ["All Teams", ...teamNames];
  // }, [activeSeason]);

  const teamsInSeason = useMemo(() => {
    const currentSeasonData =
      activeSeason === "season_3"
        ? Array.isArray(standingsSeason3)
          ? standingsSeason3
          : []
        : standingsData[activeSeason] || [];
  
    const teamNames = currentSeasonData.map((team) =>
      activeSeason === "season_3" ? team?.TeamName : team?.team_name || "Unknown"
    );
  
    return ["All Teams", ...teamNames];
  }, [activeSeason, standingsSeason3]);

  const filteredData = useMemo(() => {
    const seasonData =
      activeSeason === "season_3"
        ? Array.isArray(standingsSeason3)
          ? standingsSeason3
          : []
        : standingsData[activeSeason] || [];
    return activeTeam === "All Teams"
      ? seasonData
      : seasonData.filter((team) =>
        activeSeason === "season_3"
          ? team?.TeamName === activeTeam
          : team?.team_name === activeTeam
      );
  }, [activeSeason, activeTeam, standingsSeason3]);

  // const filteredData = useMemo(() => {
  //   const seasonData = standingsData[activeSeason] || [];
  //   return activeTeam === "All Teams"
  //     ? seasonData
  //     : seasonData.filter((team) => team.team_name === activeTeam);
  // }, [activeSeason, activeTeam]);

  const tableData = filteredData.map((team, index) => {
    const isSeason3 = activeSeason === "season_3";
  
    const teamLogo = isSeason3
      ? team.TeamLogo
      : season3TeamLogo[team?.team_name] || "";
  
    const teamName = isSeason3
      ? team.TeamName
      : teamShortName[team?.team_name] || "";

    return {
      RANK: index + 1,
      TEAM: (
        <div className="flex items-center gap-2 min-w-40 text-left">
          <div className="w-6 h-6 flex justify-center items-center mr-2">
            <img
              src={teamLogo}
              alt="logo"
              className="object-contain w-full h-full"
            />
          </div>
          {teamName}
        </div>
      ),
      MP: isSeason3 ? team.Matches : team.played,
      WON: isSeason3 ? team.Wins : team.won,
      LOST: isSeason3 ? team.Loss : team.lost,
      TIED: isSeason3 ? team.Tied : team.tied,
      "N/R": isSeason3 ? team.NoResult : team.no_result,
      "NET RR": isSeason3 ? team.NetRunRate : team.net_run_rate,
      PTS: isSeason3 ? team.Points : team.points,
    };
  });

  return (
    <div className="w-full bg-white">
      <Hero
        imgUrl={"/images/stats/bg.svg"}
        heading="Standings"
        // subheading="Player Profile"
      />
      {}

      <div className="section-width section-padding">
        <div className="flex lg:flex-row flex-col justify-between lg:items-center pb-6 ">
          <div className="w-full bg-cover bg-center mb-6 ">
            <div className="relative">
              <div className=" w-full h-full justify-center">
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
              </div>
              <div className="flex items-center justify-between     z-10 absolute h-full top-0 left-0 right-0">
                <h3
                  className="capitalize  md:text-lg lg:text-xl xl:text-2xl md:ml-16 ml-12 italic"
                  style={{
                    background:
                      "radial-gradient(43.3% 61.24% at 50% 50%, #FFF200 0%, #FFF200 26%, #FBB040 97%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text", // fallback
                    color: "transparent", // ensure text color is transparent
                  }}
                >
                  STANDINGS
                </h3>
                <div className="hidden md:flex xl:mr-14 mr-8 max-md:mt-4 w-fit">
                  <StandingsFilter
                    season={activeSeason}
                    team={activeTeam}
                    seasonOptions={[
                      { label: "Season 3", value: "season_3" },
                      { label: "Season 2", value: "season_2" },
                      { label: "Season 1", value: "season_1" },
                    ]}
                    teamOptions={teamsInSeason}
                    onSeasonChange={setActiveSeason}
                    onTeamChange={setActiveTeam}
                  />
                </div>
                {/* <div className="w-1/2 flex items-center lg:justify-end gap-8 lg:mb-12">
                  <DropDown
                    label="Season"
                    options={Object.keys(standingsData)}
                    value={activeSeason}
                    onChange={(e) => setActiveSeason(e.target.value)}
                    bg="white"
                  />

                  <DropDown
                    label="Team"
                    options={teamsInSeason}
                    value={activeTeam}
                    onChange={(e) => setActiveTeam(e.target.value)}
                    bg="#E07E27"
                  />
                </div> */}
              </div>
            </div>
          </div>
        </div>

        <div className="flex md:hidden   w-fit mb-8">
          <StandingsFilter
            season={activeSeason}
            team={activeTeam}
            seasonOptions={[
              { label: "Season 3", value: "season_3" },
              { label: "Season 2", value: "season_2" },
              { label: "Season 1", value: "season_1" },
            ]}
            teamOptions={teamsInSeason}
            onSeasonChange={setActiveSeason}
            onTeamChange={setActiveTeam}
          />
        </div>
        {loading ? (
          <div className="flex justify-center py-10">
            <p className="text-orange-500 text-lg font-semibold">
              Loading standings...
            </p>
          </div>
        ) : tableData.length > 0 ? (
          <CustomTable
            headers={headers}
            data={tableData}
            customRenderers={{}}
            headerStyles={headerStyles}
            tBodyStyles={tBodyStyles}
            rowStyles={rowStyles}
          />
        ) : (
          <div className="text-center py-10 text-gray-400">
            No data available for this team in the selected season.
          </div>
        )}
      </div>
    </div>
  );
};

const StandingsFilter = ({
  season,
  team,
  seasonOptions,
  teamOptions,
  onSeasonChange,
  onTeamChange,
}) => {
  return (
    <div className="  xl:mr-14 md:mr-8   w-fit">
      <div className="flex-row lg:gap-4 gap-2 w-fit flex">
        <div className="flex flex-row gap-2 items-center">
          <p className="text-white font-semibold xl:text-lg md:block hidden lg:text-base text-sm mr-2">
            Filter By:
          </p>

          <select
            name="season"
            value={season}
            onChange={(e) => onSeasonChange(e.target.value)}
            className="px-4 xl:py-2 py-1 border border-[#E07E27] uppercase bg-transparent text-[#E07E27] xl:text-sm text-xs lg:w-40 w-28"
          >
            {seasonOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-row gap-2 items-center">
          <div className="relative lg:w-40 w-28">
            <select
              name="team"
              value={team}
              onChange={(e) => onTeamChange(e.target.value)}
              className="appearance-none px-4 xl:py-2 py-1 bg-[#E07E27] uppercase text-white xl:text-sm text-xs w-full rounded"
            >
              {teamOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {/* Custom SVG Down Arrow */}
            <div className="pointer-events-none absolute top-1/2 right-3 transform -translate-y-1/2 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableTabComponent;
