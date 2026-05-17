"use client";

import { useEffect, useMemo, useState } from "react";
import standingsData from "@/constant/oldSeason/standings/standings_data_v3.json";
import { getStandings } from "../api/serverApi";
import { season3TeamLogo, teamShortName } from "@/utilis/helper";
import Sponsorship from "@/components/common/Sponsorship";

const SEASON_OPTIONS = [
  { label: "Season 3", value: "season_3" },
  { label: "Season 2", value: "season_2" },
  { label: "Season 1", value: "season_1" },
];

const RECENT_FORM_TEMPLATE = ["W", "L", "L", "W", "W"];

const getSeasonData = (season, standingsSeason3) => {
  if (season === "season_3") {
    return Array.isArray(standingsSeason3) ? standingsSeason3 : [];
  }
  return standingsData[season] || [];
};

const buildTeamLabel = (team, isSeason3) => {
  const name = isSeason3 ? team?.TeamName : team?.team_name || "Unknown";
  const shortName = isSeason3 ? name : teamShortName[name] || name;
  const logo = isSeason3 ? team?.TeamLogo : season3TeamLogo[name] || "";
  return { name, shortName, logo };
};

const PointsTablePage = () => {
  const [activeSeason, setActiveSeason] = useState("season_3");
  const [activeTeam, setActiveTeam] = useState("All Teams");
  const [standingsSeason3, setStandingsSeason3] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const standingsRes = await getStandings();
        setStandingsSeason3(standingsRes?.data?.season_3?.points || []);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const teamsInSeason = useMemo(() => {
    const seasonData = getSeasonData(activeSeason, standingsSeason3);
    const teamNames = seasonData.map((team) =>
      activeSeason === "season_3"
        ? team?.TeamName
        : team?.team_name || "Unknown",
    );
    return ["All Teams", ...teamNames];
  }, [activeSeason, standingsSeason3]);

  const rankedSeasonData = useMemo(() => {
    const seasonData = getSeasonData(activeSeason, standingsSeason3);
    return seasonData.map((team, index) => ({ team, rank: index + 1 }));
  }, [activeSeason, standingsSeason3]);

  const filteredData = useMemo(() => {
    if (activeTeam === "All Teams") return rankedSeasonData;
    return rankedSeasonData.filter(({ team }) =>
      activeSeason === "season_3"
        ? team?.TeamName === activeTeam
        : team?.team_name === activeTeam,
    );
  }, [activeSeason, activeTeam, rankedSeasonData]);

  const rows = useMemo(() => {
    const isSeason3 = activeSeason === "season_3";
    return filteredData.map(({ team, rank }) => {
      const teamMeta = buildTeamLabel(team, isSeason3);
      return {
        rank,
        ...teamMeta,
        p: isSeason3 ? team?.Matches : team?.played,
        w: isSeason3 ? team?.Wins : team?.won,
        l: isSeason3 ? team?.Loss : team?.lost,
        t: isSeason3 ? team?.Tied : team?.tied,
        nrr: isSeason3 ? team?.NetRunRate : team?.net_run_rate,
        for: isSeason3 ? team?.ForTeams : "-",
        against: isSeason3 ? team?.AgainstTeam : "-",
        pts: isSeason3 ? team?.Points : team?.points,
        recentForm: team?.recentForm || RECENT_FORM_TEMPLATE,
      };
    });
  }, [filteredData, activeSeason]);

  return (
    <div className="w-full bg-[#1E2F7D]">
      <section className="relative overflow-hidden pb-14 pt-40 bg-[url('/images/texture-bg.png')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,88,210,0.35),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(26,40,116,0.65),transparent_45%)]" />
        <div className="relative section-width">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <h1 className="flex flex-col text-5xl font-extrabold uppercase italic leading-[0.9] text-white sm:text-6xl">
              <span
                className="text-transparent [-webkit-text-stroke:2px_#7E93DB]"
                style={{ WebkitTextStroke: "2px #7E93DB" }}
              >
                Points
              </span>
              <span>Table</span>
            </h1>

            <div className="flex gap-3">
              <select
                value={activeTeam}
                onChange={(e) => setActiveTeam(e.target.value)}
                className="rounded-lg border border-white/20 bg-[#314A98] px-4 py-2 text-sm font-semibold text-white outline-none"
              >
                {teamsInSeason.map((team) => (
                  <option key={team} value={team} className="text-black">
                    {team}
                  </option>
                ))}
              </select>
              <select
                value={activeSeason}
                onChange={(e) => setActiveSeason(e.target.value)}
                className="rounded-lg border border-white/20 bg-[#314A98] px-4 py-2 text-sm font-semibold text-white outline-none"
              >
                {SEASON_OPTIONS.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="text-black"
                  >
                    {option.label.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-[#223783] p-8 text-center text-white/80">
              Loading points table...
            </div>
          ) : rows.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#223783] p-8 text-center text-white/80">
              No data available for selected filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[1100px] w-full text-white border-separate border-spacing-y-3 italic">
                <thead>
                  <tr className="text-left text-xs uppercase text-[#FFE24A] bg-[#1F43C5]">
                    <th className="rounded-l-full px-4 py-3">Pos</th>
                    <th className="px-4 py-3">Teams</th>
                    <th className="px-4 py-3">P</th>
                    <th className="px-4 py-3">W</th>
                    <th className="px-4 py-3">L</th>
                    <th className="px-4 py-3">T</th>
                    <th className="px-4 py-3">NRR</th>
                    <th className="px-4 py-3">For</th>
                    <th className="px-4 py-3">Against</th>
                    <th className="px-4 py-3 rounded-r-full">Pts</th>
                    {/* <th className="rounded-r-full px-4 py-3">Recent Form</th> */}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={`${row.name}-${row.rank}`} className="text-sm">
                      <td
                        className="px-2 text-5xl font-black italic leading-none text-transparent [-webkit-text-stroke:2px_#7E93DB] w-12"
                        style={{ WebkitTextStroke: "2px #7E93DB" }}
                      >
                        {row.rank}
                      </td>
                      <td className="bg-[#2447C6] rounded-l-full relative">
                        <div class="w-[54.5px] h-[32px] bg-[#D18FDB] rounded-t-full absolute z-10 -rotate-90 -right-[11.5px] top-[11px]"></div>
                        <div class="w-[54.5px] h-[32px] bg-[#192A66] rounded-t-full absolute z-10 -rotate-90 -right-[12px] top-[11px]"></div>
                        <div className="relative flex items-center gap-2 overflow-hidden rounded-l-full bg-[#2447C6] pr-6">
                          <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white border border-[#AF313A] m-0.5">
                            {row.logo ? (
                              <img
                                src={row.logo}
                                alt={row.shortName}
                                className="h-10 w-10 rounded-full object-contain"
                              />
                            ) : null}
                          </div>
                          <span className="z-10 pr-5 text-xs font-extrabold uppercase text-[#FFE150]">
                            {row.shortName}
                          </span>
                          <span className="absolute right-[22px] z-10 flex h-4 w-4 items-center justify-center rounded-full bg-[#FFE24A] text-[9px] font-black text-[#1A2C76]">
                            Q
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2 font-semibold bg-[#192A66] relative">
                        <div className="h-3/5 w-[.5px] bg-[#9F3BE3]/70 absolute top-0 bottom-0 my-auto right-0"></div>
                        {row.p}
                      </td>
                      <td className="px-4 py-2 font-semibold bg-[#192A66] relative">
                        <div className="h-3/5 w-[.5px] bg-[#9F3BE3]/70 absolute top-0 bottom-0 my-auto right-0"></div>
                        {row.w}
                      </td>
                      <td className="px-4 py-2 font-semibold bg-[#192A66] relative">
                        <div className="h-3/5 w-[.5px] bg-[#9F3BE3]/70 absolute top-0 bottom-0 my-auto right-0"></div>
                        {row.l}
                      </td>
                      <td className="px-4 py-2 font-semibold bg-[#192A66] relative">
                        <div className="h-3/5 w-[.5px] bg-[#9F3BE3]/70 absolute top-0 bottom-0 my-auto right-0"></div>
                        {row.t}
                      </td>
                      <td className="px-4 py-2 font-semibold bg-[#192A66] relative">
                        <div className="h-3/5 w-[.5px] bg-[#9F3BE3]/70 absolute top-0 bottom-0 my-auto right-0"></div>
                        {row.nrr}
                      </td>
                      <td className="px-4 py-2 font-semibold bg-[#192A66] relative">
                        <div className="h-3/5 w-[.5px] bg-[#9F3BE3]/70 absolute top-0 bottom-0 my-auto right-0"></div>
                        {row.for}
                      </td>
                      <td className="px-4 py-2 font-semibold bg-[#192A66] relative">
                        <div className="h-3/5 w-[.5px] bg-[#9F3BE3]/70 absolute top-0 bottom-0 my-auto right-0"></div>
                        {row.against}
                      </td>
                      <td className="px-4 py-2 font-semibold bg-[#192A66] rounded-r-full relative z-10 border-r border-[#2447C6]">
                        {/* <div class="w-[54px] h-[32px] bg-[#D18FDB] rounded-t-full absolute z-10 rotate-90 -right-[10.5px] top-[11px]"></div> */}
                        {row.pts}
                      </td>
                      {/* <td className="px-2 py-2 bg-[#192A66] rounded-r-full relative">
                        <div className="h-3/5 w-[.5px] bg-[#9F3BE3]/70 absolute top-0 bottom-0 my-auto right-0"></div>
                        <div className="flex items-center gap-1.5 rounded-r-full px-3 py-1.5 min-w-[190px] justify-end">
                          <div className="flex items-center gap-1.5">
                            {row.recentForm.map((result, idx) => {
                              const isWin = `${result}`.toUpperCase() === "W";
                              return (
                                <span
                                  key={`${row.name}-${idx}`}
                                  className={`flex h-5 w-5 items-center justify-center rounded-full border text-[9px] font-bold ${
                                    isWin
                                      ? "border-[#20D96A] text-[#20D96A]"
                                      : "border-[#EF4444] text-[#EF4444]"
                                  }`}
                                >
                                  {isWin ? "W" : "L"}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <div className="bg-[#F1F2F8]">
        <Sponsorship />
      </div>
    </div>
  );
};

export default PointsTablePage;
