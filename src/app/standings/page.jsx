"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import standingsData from "@/constant/oldSeason/standings/standings_data_v3.json";
import CustomTable from "@/components/common/CustomTable";
import Hero from "@/components/hero/Hero";
import { teamLogoStats } from "@/utilis/helper";
import TitleComponent from "@/components/common/TitleComponent";
import { DropDown } from "@/components/common/DropDown";

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
  const [activeSeason, setActiveSeason] = useState("season_1");
  const [activeTeam, setActiveTeam] = useState("All Teams");

  const teamsInSeason = useMemo(() => {
    const currentSeasonData = standingsData[activeSeason] || [];
    const teamNames = currentSeasonData.map((team) => team.team_name);
    return ["All Teams", ...teamNames];
  }, [activeSeason]);

  const filteredData = useMemo(() => {
    const seasonData = standingsData[activeSeason] || [];
    return activeTeam === "All Teams"
      ? seasonData
      : seasonData.filter((team) => team.team_name === activeTeam);
  }, [activeSeason, activeTeam]);

  const tableData = filteredData.map((team, index) => ({
    RANK: index + 1,
    TEAM: (
      <div className="flex items-center gap-2 min-w-40 text-left">
        <div className="w-6 h-6 flex justify-center items-center mr-2">
          <img
            src={teamLogoStats[team?.team_name]}
            alt="logo"
            className="object-contain w-full h-full"
          />
        </div>
        {team.team_name}
      </div>
    ),
    MP: team.played,
    WON: team.won,
    LOST: team.lost,
    TIED: team.tied,
    "N/R": team.no_result,
    "NET RR": team.net_run_rate,
    PTS: team.points,
  }));

  return (
    <div className="w-full bg-white">
      <Hero
        imgUrl={"/images/stats/bg.svg"}
        heading="Standings"
        subheading="Player Profile"
      />

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
                    seasonOptions={Object.keys(standingsData)}
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
            seasonOptions={Object.keys(standingsData)}
            teamOptions={teamsInSeason}
            onSeasonChange={setActiveSeason}
            onTeamChange={setActiveTeam}
          />
        </div>
        {tableData.length > 0 ? (
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
              <option key={option} value={option}>
                {option.replace(/_/g, " ").toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-row gap-2 items-center">
          <select
            name="team"
            value={team}
            onChange={(e) => onTeamChange(e.target.value)}
            className="px-4 xl:py-2 py-1 bg-[#E07E27] uppercase text-white xl:text-sm text-xs lg:w-40 w-28"
          >
            {teamOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TableTabComponent;
