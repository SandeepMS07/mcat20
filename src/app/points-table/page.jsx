"use client";

import { useEffect, useMemo, useState } from "react";
import standingsData from "@/constant/oldSeason/standings/standings_data_v3.json";
import { getStandings, getStandingsV2Client, getTeamDetailsClient } from "../api/clientApi";
import { season3TeamLogo, season4TeamLogo, teamShortName } from "@/utilis/helper";
import Sponsorship from "@/components/common/Sponsorship";
import CustomSelect from "@/components/common/CustomSelect";

const SEASON_OPTIONS = [
  { label: "Season 4", value: "season_4" },
  { label: "Season 3", value: "season_3" },
  { label: "Season 2", value: "season_2" },
  { label: "Season 1", value: "season_1" },
];

const RECENT_FORM_TEMPLATE = ["W", "L", "L", "W", "W"];

const SEASON4_QUALIFIED_NAMES = {
  men: ["north mumbai panthers"],
  women: ["sobo mumbai falcons"],
};

const SEASON4_ELIMINATED_NAMES = {
  men: ["triumph knights mne", "triumph knights mumbai north east", "bandra blasters", "namo bandra blasters"],
  women: [],
};

const isQualified = (name, gender) =>
  (SEASON4_QUALIFIED_NAMES[gender] || []).includes(name.toLowerCase());

const isEliminated = (name, gender) =>
  (SEASON4_ELIMINATED_NAMES[gender] || []).includes(name.toLowerCase());

const getTeamName = (team) => team?.TeamName || team?.team_name || "Unknown";

const getTeamLogo = (team, season, teamLogoMap = {}) => {
  const name = getTeamName(team);
  if (season === "season_4") {
    const nameLower = name.toLowerCase();
    const apiLogo = Object.entries(teamLogoMap).find(([k]) => k.toLowerCase() === nameLower)?.[1];
    const staticLogo = Object.entries(season4TeamLogo).find(([k]) => k.toLowerCase() === nameLower)?.[1];
    return apiLogo || staticLogo || "";
  }
  return team?.TeamLogo || team?.team_logo || season3TeamLogo[name] || "";
};

const getMatches = (team) => Number(team?.Matches ?? team?.matches ?? team?.played ?? 0);
const getWins = (team) => Number(team?.Wins ?? team?.wins ?? team?.won ?? 0);
const getLosses = (team) => Number(team?.Loss ?? team?.loss ?? team?.lost ?? 0);
const getTies = (team) => Number(team?.Tied ?? team?.tied ?? team?.draw ?? 0);
const getNetRunRate = (team) => Number(team?.NetRunRate ?? team?.net_run_rate ?? 0);
const getFor = (team) => team?.ForTeams ?? team?.for_teams ?? "-";
const getAgainst = (team) => team?.AgainstTeam ?? team?.against_team ?? "-";
const getPoints = (team) => Number(team?.Points ?? team?.points ?? 0);

const getSeasonData = (season, standingsSeason3, season4Data, season4Gender) => {
  if (season === "season_4") return season4Data[season4Gender] ?? [];
  if (season === "season_3") return Array.isArray(standingsSeason3) ? standingsSeason3 : [];
  return standingsData[season] || [];
};

const buildTeamLabel = (team, season, teamLogoMap) => {
  const name = getTeamName(team);
  const shortName = teamShortName[name] || name;
  const logo = getTeamLogo(team, season, teamLogoMap);
  return { name, shortName, logo };
};

const PointsTablePage = () => {
  const [activeSeason, setActiveSeason] = useState("season_4");
  const [season4Gender, setSeason4Gender] = useState("men");
  const [standingsSeason3, setStandingsSeason3] = useState([]);
  const [season4Data, setSeason4Data] = useState({ men: [], women: [] });
  const [loading, setLoading] = useState(false);
  const [teamLogoMap, setTeamLogoMap] = useState({});

  useEffect(() => {
    if (activeSeason !== "season_4") return;
    const category = season4Gender === "women" ? "Women" : "Men";
    const extractList = (res) =>
      Array.isArray(res) ? res
      : Array.isArray(res?.standings) ? res.standings
      : Array.isArray(res?.data) ? res.data
      : [];
    setLoading(true);
    getStandingsV2Client(category)
      .then((res) => {
        setSeason4Data((prev) => ({ ...prev, [season4Gender]: extractList(res) }));
      })
      .catch((err) => console.error("Failed to load season 4 standings", err))
      .finally(() => setLoading(false));
  }, [activeSeason, season4Gender]);

  useEffect(() => {
    getTeamDetailsClient()
      .then((res) => {
        const records = res?.data || [];
        const map = {};
        records.forEach((team) => {
          if (team?.Name && team?.Logo_URL__c) map[team.Name.trim()] = team.Logo_URL__c;
        });
        setTeamLogoMap(map);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (activeSeason !== "season_3" || standingsSeason3.length > 0) return;
    getStandings()
      .then((res) => {
        setStandingsSeason3(res?.data?.season_3?.points || []);
      })
      .catch((err) => console.error("Failed to load season 3 standings", err));
  }, [activeSeason, standingsSeason3.length]);

  const rankedSeasonData = useMemo(() => {
    const seasonData = getSeasonData(activeSeason, standingsSeason3, season4Data, season4Gender);
    const sorted =
      activeSeason === "season_4"
        ? [...seasonData].sort((a, b) => getPoints(b) - getPoints(a) || getNetRunRate(b) - getNetRunRate(a))
        : seasonData;
    return sorted.map((team, index) => ({ team, rank: index + 1 }));
  }, [activeSeason, standingsSeason3, season4Data, season4Gender]);

  const rows = useMemo(() => {
    return rankedSeasonData.map(({ team, rank }) => {
      const teamMeta = buildTeamLabel(team, activeSeason, teamLogoMap);
      return {
        rank,
        ...teamMeta,
        p: getMatches(team),
        w: getWins(team),
        l: getLosses(team),
        t: getTies(team),
        nrr: getNetRunRate(team).toFixed(3),
        for: getFor(team),
        against: getAgainst(team),
        pts: getPoints(team),
        recentForm: team?.recentForm || RECENT_FORM_TEMPLATE,
      };
    });
  }, [rankedSeasonData, activeSeason, teamLogoMap]);

  return (
    <div className="w-full bg-[#1E2F7D]">
      <section className="relative overflow-hidden pb-14 pt-40 bg-[url('/images/texture-bg.png')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,88,210,0.35),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(26,40,116,0.65),transparent_45%)]" />
        <div className="relative section-width">
          {/* Mobile header */}
          <div className="md:hidden">
            <div className="mb-6 flex flex-col items-center gap-4">
              <h1 className="flex gap-2 text-3xl font-extrabold uppercase italic leading-[0.9] text-white">
                <span className="text-transparent" style={{ WebkitTextStroke: "1.5px #7E93DB" }}>
                  Points
                </span>
                <span>Table</span>
              </h1>
              {activeSeason === "season_4" && (
                <div className="inline-flex rounded-full bg-white/10 p-1 text-xs font-semibold uppercase backdrop-blur-sm ring-1 ring-white/15">
                  {[{ label: "Men", value: "men" }, { label: "Women", value: "women" }].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setSeason4Gender(opt.value)}
                      className={`rounded-full px-5 py-1.5 transition-colors ${
                        season4Gender === opt.value
                          ? "bg-[#F68323] text-white shadow-[0_4px_14px_rgba(246,131,35,0.4)]"
                          : "text-white/80 hover:text-white"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative z-20 mb-6 rounded-2xl border border-white/10 bg-[#0E1A47]/60 p-2 backdrop-blur-sm">
              <CustomSelect
                label="Season"
                value={activeSeason}
                options={SEASON_OPTIONS.map((o) => o.value)}
                onChange={setActiveSeason}
                formatOption={(v) => (SEASON_OPTIONS.find((o) => o.value === v)?.label || v).toUpperCase()}
              />
            </div>
          </div>

          {/* Desktop header */}
          <div className="mb-8 hidden flex-col gap-5 md:flex md:flex-row md:items-end md:justify-between">
            <h1 className="flex flex-row gap-2 text-5xl font-extrabold uppercase italic leading-[0.9] text-white sm:text-6xl">
              <span className="text-transparent [-webkit-text-stroke:2px_#7E93DB]" style={{ WebkitTextStroke: "2px #7E93DB" }}>
                Points
              </span>
              <span>Table</span>
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              {activeSeason === "season_4" && (
                <div className="inline-flex rounded-full border border-white/20 bg-white/5 p-1 text-xs font-semibold uppercase tracking-wide">
                  {[{ label: "Men", value: "men" }, { label: "Women", value: "women" }].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setSeason4Gender(opt.value)}
                      className={`rounded-full px-4 py-1.5 transition-colors ${
                        season4Gender === opt.value ? "bg-[#F68323] text-white" : "text-white/80 hover:text-white"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
              <div className="min-w-[160px]">
                <CustomSelect
                  value={activeSeason}
                  options={SEASON_OPTIONS.map((o) => o.value)}
                  onChange={setActiveSeason}
                  formatOption={(v) => (SEASON_OPTIONS.find((o) => o.value === v)?.label || v).toUpperCase()}
                />
              </div>
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
              <table className="w-full min-w-[700px] md:min-w-[1100px] text-white border-separate border-spacing-y-3 italic">
                <thead>
                  <tr className="text-left text-[10px] sm:text-xs uppercase text-[#FFE24A] bg-[#243374]">
                    {activeSeason !== "season_4" && (
                      <th className="rounded-l-full px-2 py-2.5 sm:px-4 sm:py-3">Pos</th>
                    )}
                    <th className={`px-2 py-2.5 sm:px-4 sm:py-3 ${activeSeason === "season_4" ? "rounded-l-full" : ""}`}>
                      Teams
                    </th>
                    <th className="px-2 py-2.5 sm:px-4 sm:py-3">M</th>
                    <th className="px-2 py-2.5 sm:px-4 sm:py-3">W</th>
                    <th className="px-2 py-2.5 sm:px-4 sm:py-3">L</th>
                    <th className="px-2 py-2.5 sm:px-4 sm:py-3">T</th>
                    <th className="px-2 py-2.5 sm:px-4 sm:py-3">NRR</th>
                    <th className="px-2 py-2.5 sm:px-4 sm:py-3">For</th>
                    <th className="px-2 py-2.5 sm:px-4 sm:py-3">Against</th>
                    <th className="rounded-r-full px-2 py-2.5 sm:px-4 sm:py-3">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const qualified = activeSeason === "season_4" && isQualified(row.name, season4Gender);
                    const eliminated = activeSeason === "season_4" && isEliminated(row.name, season4Gender);
                    const goldBorder = qualified ? "border-y border-[#C8960C]" : "";
                    return (
                      <tr key={`${row.name}-${row.rank}`} className="text-xs sm:text-sm">
                        {activeSeason !== "season_4" && (
                          <td
                            className="px-1 sm:px-2 text-3xl sm:text-5xl font-black italic leading-none text-transparent [-webkit-text-stroke:2px_#7E93DB] w-8 sm:w-12"
                            style={{ WebkitTextStroke: "2px #7E93DB" }}
                          >
                            {row.rank}
                          </td>
                        )}
                        <td className={`bg-[#243374] rounded-l-full relative ${qualified ? "border-y border-l border-[#C8960C]" : ""}`}>
                          <div className="relative flex items-center gap-1.5 sm:gap-2 overflow-hidden rounded-l-full bg-[#243374] pr-3 sm:pr-6">
                            <div className="z-10 flex h-8 w-8 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-white border border-[#AF313A] m-0.5">
                              {row.logo ? (
                                <img
                                  src={row.logo}
                                  alt={row.shortName}
                                  className="h-6 w-6 sm:h-10 sm:w-10 rounded-full object-contain"
                                />
                              ) : null}
                            </div>
                            <span className="z-10 text-[10px] sm:text-xs font-extrabold uppercase text-[#FFE150] truncate">
                              {row.name}
                            </span>
                            {qualified && (
                              <span className="z-10 shrink-0 rounded-full bg-gradient-to-r from-[#F5C518] to-[#C8960C] px-2 py-0.5 text-[8px] font-black uppercase text-[#3B2200] shadow-[0_2px_8px_rgba(200,150,12,0.5)]">
                                Qualified
                              </span>
                            )}
                            {eliminated && (
                              <span className="z-10 shrink-0 rounded-full bg-[#6B7280] px-2 py-0.5 text-[8px] font-black uppercase text-white">
                                Eliminated
                              </span>
                            )}
                            {activeSeason !== "season_4" && row.rank <= (activeSeason === "season_1" ? 2 : 4) && (
                              <span className="absolute right-[10px] sm:right-[22px] z-10 flex h-4 w-4 items-center justify-center rounded-full bg-[#FFE24A] text-[9px] font-black text-[#1d2d70]">
                                Q
                              </span>
                            )}
                          </div>
                        </td>
                        <td className={`px-2 py-2 sm:px-4 font-semibold bg-[#192A66] relative text-center sm:text-left ${goldBorder}`}>
                          <div className="h-3/5 w-[.5px] bg-[#9F3BE3]/70 absolute top-0 bottom-0 my-auto right-0"></div>
                          {row.p}
                        </td>
                        <td className={`px-2 py-2 sm:px-4 font-semibold bg-[#192A66] relative text-center sm:text-left ${goldBorder}`}>
                          <div className="h-3/5 w-[.5px] bg-[#9F3BE3]/70 absolute top-0 bottom-0 my-auto right-0"></div>
                          {row.w}
                        </td>
                        <td className={`px-2 py-2 sm:px-4 font-semibold bg-[#192A66] relative text-center sm:text-left ${goldBorder}`}>
                          <div className="h-3/5 w-[.5px] bg-[#9F3BE3]/70 absolute top-0 bottom-0 my-auto right-0"></div>
                          {row.l}
                        </td>
                        <td className={`px-2 py-2 sm:px-4 font-semibold bg-[#192A66] relative text-center sm:text-left ${goldBorder}`}>
                          <div className="h-3/5 w-[.5px] bg-[#9F3BE3]/70 absolute top-0 bottom-0 my-auto right-0"></div>
                          {row.t}
                        </td>
                        <td className={`px-2 py-2 sm:px-4 font-semibold bg-[#192A66] relative text-center sm:text-left ${goldBorder}`}>
                          <div className="h-3/5 w-[.5px] bg-[#9F3BE3]/70 absolute top-0 bottom-0 my-auto right-0"></div>
                          {row.nrr}
                        </td>
                        <td className={`px-2 py-2 sm:px-4 font-semibold bg-[#192A66] relative text-center sm:text-left ${goldBorder}`}>
                          <div className="h-3/5 w-[.5px] bg-[#9F3BE3]/70 absolute top-0 bottom-0 my-auto right-0"></div>
                          {row.for}
                        </td>
                        <td className={`px-2 py-2 sm:px-4 font-semibold bg-[#192A66] relative text-center sm:text-left ${goldBorder}`}>
                          <div className="h-3/5 w-[.5px] bg-[#9F3BE3]/70 absolute top-0 bottom-0 my-auto right-0"></div>
                          {row.against}
                        </td>
                        <td className={`px-2 py-2 sm:px-4 font-semibold bg-[#192A66] rounded-r-full relative z-10 border-r text-center sm:text-left ${qualified ? "border-y border-r border-[#C8960C]" : "border-[#243374]"}`}>
                          {row.pts}
                        </td>
                      </tr>
                    );
                  })}
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
