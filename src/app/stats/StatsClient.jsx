"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import PaginationControls from "./components/PaginationControls";
import CustomSelect from "@/components/common/CustomSelect";
import { season3TeamLogo } from "@/utilis/helper";
import {
  SEASON4_TEAM_LOGO_MAP,
  SEASON4_LOGO_ALIASES,
} from "@/utilis/fixtures/fixtures4";
import "./style.css";

const resolveTeamLogo = (teamName = "") => {
  if (!teamName) return "";
  const direct = SEASON4_TEAM_LOGO_MAP[teamName];
  if (direct) return direct;
  const aliased = SEASON4_LOGO_ALIASES[teamName];
  if (aliased && SEASON4_TEAM_LOGO_MAP[aliased]) {
    return SEASON4_TEAM_LOGO_MAP[aliased];
  }
  return season3TeamLogo[teamName] || "";
};

const columnMap = {
  batting: [
    "POS",
    "PLAYER",
    "MAT",
    "NO",
    "RUNS",
    "HS",
    "AVE",
    "S/R",
    "100S",
    "50S",
    "4S",
    "6S",
    "DUCKS",
  ],
  bowling: [
    "POS",
    "PLAYER",
    "MAT",
    "OVERS",
    "MAIDENS",
    "RUNS",
    "WKTS",
    "AVG",
    "ECON",
    "3W",
    "5W",
  ],
  fielding: [
    "POS",
    "PLAYER",
    "MAT",
    "CATCHES",
    "DISMISSALS",
    "RUN OUTS",
    "STUMPINGS",
  ],
};

const MOBILE_VISIBLE_COLUMNS = {
  batting: new Set(["POS", "PLAYER", "RUNS", "AVE"]),
  bowling: new Set(["POS", "PLAYER", "WKTS", "ECON"]),
  fielding: new Set(["POS", "PLAYER", "CATCHES", "RUN OUTS"]),
};

const LAST_MOBILE_COLUMN = {
  batting: "AVE",
  bowling: "ECON",
  fielding: "RUN OUTS",
};

const MOBILE_CARD_STATS = {
  batting: ["RUNS", "AVE", "MAT", "S/R", "HS", "50S"],
  bowling: ["WKTS", "ECON", "MAT", "OVERS", "AVG", "BBI"],
  fielding: ["CATCHES", "DISMISSALS", "MAT", "RUN OUTS", "STUMPINGS"],
};

const sortByOptions = {
  batting: [
    "Most Runs",
    "Highest Individual Score",
    "Highest Strike Rate",
    "Highest Averages",
    "Most Sixes",
    "Most Fours",
    "Most Fifties",
    "Most Centuries",
  ],
  bowling: [
    "Most Wickets",
    "Best Economy",
    "Best Average",
    "Best Strike Rate",
    "Most Runs Conceded (Innings)",
    "Most Maiden Overs Bowled",
  ],
  fielding: ["Most Catches", "Most Run Outs", "Most Stumpings"],
};

const PlayerTable = ({ selected, onPlayerSelect, selectedPlayer, data }) => {
  const headers = columnMap[selected];

  const getCellValue = (player, key) => {
    const map = {
      MAT: player.mat,
      NO: player.no,
      RUNS: player.runs,
      HS: player.hs,
      AVE: player.ave,
      "S/R": player.sr,
      "100S": player.hundreds,
      "50S": player.fifties,
      "4S": player.fours,
      "6S": player.sixes,
      DUCKS: player.ducks,
      OVERS: player.overs,
      MAIDENS: player.maidens,
      WKTS: player.wkts,
      BBI: player.bbi,
      AVG: player.avg,
      ECON: player.econ,
      "3W": player.threeW,
      "5W": player.fiveW,
      CATCHES: player.catches,
      DISMISSALS: player.dismissals,
      "RUN OUTS": player.runOuts,
      STUMPINGS: player.stumpings,
    };
    return map[key] ?? "-";
  };

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#223783] p-8 text-center text-white/80">
        No players match the selected filters.
      </div>
    );
  }

  const mobileVisible = MOBILE_VISIBLE_COLUMNS[selected];
  const lastMobileKey = LAST_MOBILE_COLUMN[selected];
  const isMobileHidden = (key) =>
    mobileVisible && !mobileVisible.has(key) ? "hidden md:table-cell" : "";

  const mobileStatKeys = MOBILE_CARD_STATS[selected] || headers.slice(2, 8);
  const rankAccent = (pos) => {
    if (pos === 1)
      return { stroke: "#FFD56B", glow: "rgba(255,213,107,0.35)" };
    if (pos === 2)
      return { stroke: "#D8DCE6", glow: "rgba(216,220,230,0.3)" };
    if (pos === 3)
      return { stroke: "#E6A074", glow: "rgba(230,160,116,0.3)" };
    return { stroke: "#7E93DB", glow: "rgba(126,147,219,0.0)" };
  };

  return (
    <>
      {/* Mobile card list */}
      <div className="space-y-3 md:hidden">
        {data.map((player) => {
          const isSelected = player.player === selectedPlayer?.player;
          const accent = rankAccent(player.pos);
          return (
            <button
              type="button"
              key={`m-${player.pos}-${player.player}`}
              onClick={() => onPlayerSelect(player)}
              className={`group relative flex w-full items-stretch overflow-hidden rounded-xl border bg-[#142A7C] text-left transition ${
                isSelected
                  ? "border-[#FFE150] shadow-[0_6px_18px_rgba(255,225,80,0.2)]"
                  : "border-white/10 hover:border-white/25"
              }`}
            >
              {/* Left rank strip */}
              <div
                className="flex w-10 shrink-0 items-center justify-center bg-gradient-to-b from-[#0E1A47] to-[#192A66]"
                style={{
                  borderRight: `2px solid ${accent.stroke}`,
                }}
              >
                <span
                  className="text-2xl font-black italic leading-none"
                  style={{ color: accent.stroke }}
                >
                  {player.pos}
                </span>
              </div>

              <div className="min-w-0 flex-1 px-3 py-2.5">
                {/* Header: logo + name + primary stat */}
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                    {player.teamLogo ? (
                      <img
                        src={player.teamLogo}
                        alt={player.team}
                        className="h-7 w-7 rounded-full object-contain"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-extrabold uppercase italic leading-tight text-white">
                      {player.player}
                    </p>
                    <p className="truncate text-[9.5px] font-semibold uppercase leading-tight text-[#FFE150]/90">
                      {player.team}
                    </p>
                  </div>
                  {mobileStatKeys[0] && (
                    <div className="flex shrink-0 flex-col items-end leading-none">
                      <p className="text-[8px] font-bold uppercase tracking-wider text-[#FFE150]">
                        {mobileStatKeys[0]}
                      </p>
                      <p className="mt-0.5 text-xl font-extrabold italic text-white">
                        {getCellValue(player, mobileStatKeys[0])}
                      </p>
                    </div>
                  )}
                </div>

                {/* Secondary stats inline with dividers */}
                {mobileStatKeys.length > 1 && (
                  <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2">
                    {mobileStatKeys.slice(1).map((key, idx, arr) => (
                      <div
                        key={`m-${key}`}
                        className={`flex flex-1 flex-col items-center leading-none ${
                          idx < arr.length - 1
                            ? "border-r border-white/10"
                            : ""
                        }`}
                      >
                        <p className="text-[8px] font-bold uppercase tracking-wider text-white/50">
                          {key}
                        </p>
                        <p className="mt-1 text-[12px] font-extrabold italic text-white">
                          {getCellValue(player, key)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Desktop/tablet table */}
      <div className="hidden overflow-x-auto md:block">
      <table className="w-full md:min-w-[1100px] text-white border-separate border-spacing-y-3 italic">
        <thead>
          <tr className="text-left text-[10px] sm:text-xs uppercase text-[#FFE24A] bg-[#1F43C5]">
            {headers.map((h, i) => {
              const isLastHeader = i === headers.length - 1;
              const isLastOnMobile = h === lastMobileKey;
              const roundedRight = isLastHeader
                ? isLastOnMobile
                  ? "rounded-r-full"
                  : "md:rounded-r-full"
                : isLastOnMobile
                ? "rounded-r-full md:rounded-none"
                : "";
              return (
                <th
                  key={h}
                  className={`px-2 py-2.5 sm:px-4 sm:py-3 ${
                    i === 0 ? "rounded-l-full" : ""
                  } ${roundedRight} ${i === 1 ? "" : "text-center"} ${isMobileHidden(
                    h,
                  )}`}
                >
                  {h}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((player) => {
            const isSelected = player.player === selectedPlayer?.player;
            return (
              <tr
                key={`${player.pos}-${player.player}`}
                className={`text-xs sm:text-sm cursor-pointer transition-opacity ${
                  isSelected ? "" : "hover:opacity-90"
                }`}
                onClick={() => onPlayerSelect(player)}
              >
                <td
                  className="px-1 sm:px-2 text-2xl sm:text-4xl font-black italic leading-none text-transparent w-8 sm:w-12 align-middle"
                  style={{ WebkitTextStroke: "2px #7E93DB" }}
                >
                  {player.pos}
                </td>
                <td className="bg-[#2447C6] rounded-l-full">
                  <div className="flex items-center gap-2 px-2 py-1.5 sm:gap-3 sm:px-3 sm:py-2">
                    <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white">
                      {player.teamLogo ? (
                        <img
                          src={player.teamLogo}
                          alt={player.team}
                          className="h-6 w-6 sm:h-8 sm:w-8 rounded-full object-contain"
                        />
                      ) : null}
                    </div>
                    <div className="leading-tight min-w-0">
                      <p className="text-[10px] sm:text-xs font-extrabold uppercase text-white truncate">
                        {player.player}
                      </p>
                      <p className="text-[9px] sm:text-[10px] uppercase text-[#FFE150] truncate">
                        {player.team}
                      </p>
                    </div>
                  </div>
                </td>
                {headers.slice(2).map((key, idx) => {
                  const isLast = idx === headers.length - 3;
                  const isLastOnMobile = key === lastMobileKey;
                  const roundedClass = isLast
                    ? isLastOnMobile
                      ? "rounded-r-full"
                      : "md:rounded-r-full"
                    : isLastOnMobile
                    ? "rounded-r-full md:rounded-none"
                    : "";
                  return (
                    <td
                      key={key}
                      className={`px-2 py-2 sm:px-4 font-semibold bg-[#192A66] text-center relative ${roundedClass} ${isMobileHidden(
                        key,
                      )}`}
                    >
                      {!isLast && (
                        <div
                          className={`h-3/5 w-[.5px] bg-[#9F3BE3]/70 absolute top-0 bottom-0 my-auto right-0 ${
                            isLastOnMobile ? "hidden md:block" : ""
                          }`}
                        />
                      )}
                      {getCellValue(player, key)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </>
  );
};

export default function StatsClient({ statsData }) {
  const cleanValue = (value) => {
    if (value === "inf" || value === Infinity || value === "Infinity")
      return "N/A";
    return value;
  };

  const seasons = Object.keys(
    statsData[Object.keys(statsData)[0]].seasons,
  ).filter((s) => s.toLowerCase() !== "overall");

  const makeCategoryData = (category, season) => {
    return Object.values(statsData)
      .map((p) => {
        const t = p.seasons[season] || {};
        const s = p.seasons[season]?.[category] || {};
        const teamLogo = resolveTeamLogo(t.team_name);

        if (s.matches_played === 0 || !t.team_name) return null;

        if (category === "batting") {
          return {
            player: p.name_full,
            team: t.team_name,
            teamLogo,
            playerImg: "",
            mat: s.matches_played || 0,
            no: s.not_outs || 0,
            runs: s.runs || 0,
            hs: s.highest_score || 0,
            ave: cleanValue(s.average) || 0,
            sr: cleanValue(s.strike_rate) || 0,
            hundreds: s.hundreds || 0,
            fifties: s.fifties || 0,
            fours: s.fours || 0,
            sixes: s.sixes || 0,
            ducks: 0,
            ballsFaced: s.balls || 0,
          };
        }
        if (category === "bowling") {
          const overs = (s.balls_bowled || 0) / 6;
          if (!t.team_name || overs < 1) return null;
          return {
            player: p.name_full,
            team: t.team_name,
            teamLogo,
            playerImg: "",
            mat: s.matches_played || 0,
            overs: s.overs_bowled_str,
            maidens: s.maidens || 0,
            runs: s.runs_conceded || 0,
            wkts: s.wickets || 0,
            bbi: `${s.wickets || 0}/${s.runs_conceded || 0}`,
            avg: cleanValue(s.average) || 0,
            econ: s.economy_rate || 0,
            sr: cleanValue(s.strike_rate) || 0,
            threeW: s.three_wickets || 0,
            fiveW: s.five_wickets || 0,
            ballsBowled: s.balls_bowled || 0,
          };
        }
        if (category === "fielding") {
          if (s.matches_played === 0 || !t.team_name) return null;
          const runOuts = (s.run_outs_direct || 0) + (s.run_outs_assisted || 0);
          const dismissals = (s.catches || 0) + (s.stumpings || 0) + runOuts;
          return {
            player: p.name_full,
            team: t.team_name,
            teamLogo,
            playerImg: "",
            mat: s.matches_played || 0,
            catches: s.catches || 0,
            dismissals,
            runOuts,
            stumpings: s.stumpings || 0,
          };
        }
        return null;
      })
      .filter(Boolean);
  };

  const sortData = (data, category, sortBy) => {
    const sorted = [...data];

    if (category === "batting") {
      switch (sortBy) {
        case "Most Runs":
          sorted.sort((a, b) => {
            if (b.runs !== a.runs) return b.runs - a.runs;
            return a.ballsFaced - b.ballsFaced;
          });
          break;
        case "Least Runs":
          sorted.sort((a, b) => a.runs - b.runs);
          break;
        case "Highest Individual Score":
          sorted.sort((a, b) => b.hs - a.hs);
          break;
        case "Highest Strike Rate":
          sorted.sort((a, b) => b.sr - a.sr);
          break;
        case "Highest Averages":
          sorted.sort((a, b) => b.ave - a.ave);
          break;
        case "Most Sixes":
        case "Most Sixes (Innings)":
          sorted.sort((a, b) => b.sixes - a.sixes);
          break;
        case "Most Fours":
        case "Most Fours (Innings)":
          sorted.sort((a, b) => b.fours - a.fours);
          break;
        case "Most Fifties":
          sorted.sort((a, b) => b.fifties - a.fifties);
          break;
        case "Most Centuries":
          sorted.sort((a, b) => b.hundreds - a.hundreds);
          break;
        case "Fastest Fifties":
        case "Fastest Centuries":
          sorted.sort((a, b) => b.sr - a.sr);
          break;
      }
    } else if (category === "bowling") {
      switch (sortBy) {
        case "Most Wickets":
          sorted.sort((a, b) => {
            if (b.wkts !== a.wkts) return b.wkts - a.wkts;
            return a.ballsBowled - b.ballsBowled;
          });
          break;
        case "Best Economy":
        case "Best Economy (Innings)":
          sorted.sort((a, b) => a.econ - b.econ);
          break;
        case "Best Average":
          sorted.sort((a, b) => a.avg - b.avg);
          break;
        case "Best Strike Rate":
        case "Best Strike Rate (Innings)":
          sorted.sort((a, b) => a.sr - b.sr);
          break;
        case "Most Runs Conceded (Innings)":
          sorted.sort((a, b) => b.runs - a.runs);
          break;
        case "Most Dot Balls Bowled":
        case "Most Dot Balls Bowled (Innings)":
          sorted.sort((a, b) => b.dotBalls - a.dotBalls);
          break;
        case "Most Maiden Overs Bowled":
          sorted.sort((a, b) => b.maidens - a.maidens);
          break;
      }
    } else {
      switch (sortBy) {
        case "Most Catches":
          sorted.sort((a, b) => b.catches - a.catches);
          break;
        case "Most Run Outs":
          sorted.sort((a, b) => b.runOuts - a.runOuts);
          break;
        case "Most Stumpings":
          sorted.sort((a, b) => b.stumpings - a.stumpings);
          break;
      }
    }

    return sorted.map((row, i) => ({ pos: i + 1, ...row }));
  };

  const defaultSortOptions = {
    batting: "Most Runs",
    bowling: "Most Wickets",
    fielding: "Most Run Outs",
  };

  const [selected, setSelected] = useState("batting");
  const [season, setSeason] = useState(seasons[2] || seasons[0]);
  const [sortBy, setSortBy] = useState(defaultSortOptions.batting);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [selectedTeam, setSelectedTeam] = useState("All Teams");

  const teams = useMemo(() => {
    const seasonTeams = new Set();
    Object.values(statsData).forEach((player) => {
      const seasonData = player.seasons[season];
      if (seasonData && seasonData.team_name) {
        seasonTeams.add(seasonData.team_name);
      }
    });
    return ["All Teams", ...Array.from(seasonTeams)];
  }, [statsData, season]);

  const rawData = useMemo(
    () => makeCategoryData(selected, season),
    [selected, season],
  );
  const data = useMemo(
    () => sortData(rawData, selected, sortBy),
    [rawData, selected, sortBy],
  );

  const filteredByTeam =
    selectedTeam === "All Teams"
      ? data
      : data.filter((player) => player.team === selectedTeam);

  const displayedData = useMemo(() => {
    return filteredByTeam.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    );
  }, [filteredByTeam, page, rowsPerPage]);

  const listTopRef = useRef(null);
  const handlePageChange = (newPage) => {
    setPage(newPage);
    if (listTopRef.current) {
      const top =
        listTopRef.current.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const [selectedPlayer, setSelectedPlayer] = useState(displayedData[0] || {});

  useEffect(() => {
    setSortBy(defaultSortOptions[selected]);
  }, [selected]);

  useEffect(() => {
    setPage(0);
    setSelectedTeam("All Teams");
  }, [selected, season, sortBy]);

  useEffect(() => {
    setSelectedPlayer(displayedData[0] || {});
  }, [displayedData]);

  const formatSeasonLabel = (s) =>
    s.replace(/^season[\s_-]*/i, "Season ").toUpperCase();

  return (
    <div className="w-full bg-[#1E2F7D]">
      <section className="relative overflow-hidden pb-14 pt-32 sm:pt-36 lg:pt-40 bg-[url('/images/texture-bg.png')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,88,210,0.35),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(26,40,116,0.65),transparent_45%)]" />
        <div className="relative section-width">
          {/* Mobile header — new design */}
          <div className="md:hidden">
            <div className="mb-6 flex flex-col items-center gap-4">
              <h1 className="flex flex-col text-3xl font-extrabold uppercase italic leading-[0.9] text-white">
                <span
                  className="text-transparent"
                  style={{ WebkitTextStroke: "1.5px #7E93DB" }}
                >
                  Player
                </span>
                <span>Stats</span>
              </h1>

              <div className="inline-flex rounded-full bg-white/10 p-1 text-xs font-semibold uppercase backdrop-blur-sm ring-1 ring-white/15">
                {["batting", "bowling"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setSelected(tab)}
                    className={`rounded-full px-5 py-1.5 transition-colors ${
                      selected === tab
                        ? "bg-[#F68323] text-white shadow-[0_4px_14px_rgba(246,131,35,0.4)]"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative z-20 mb-6 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-[#0E1A47]/60 p-2 backdrop-blur-sm">
              <div className="col-span-2">
                <CustomSelect
                  label="Season"
                  value={season}
                  options={seasons}
                  onChange={setSeason}
                  formatOption={formatSeasonLabel}
                />
              </div>
              <CustomSelect
                label="Stat"
                value={sortBy}
                options={sortByOptions[selected] || []}
                onChange={setSortBy}
              />
              <CustomSelect
                label="Team"
                value={selectedTeam}
                options={teams}
                onChange={setSelectedTeam}
              />
            </div>
          </div>

          {/* Desktop header — original design */}
          <div className="hidden md:block">
            <div className="mb-8 flex flex-wrap items-center justify-center gap-4 border-b border-white/15 pt-5">
              <div className="inline-flex rounded-full bg-white p-1 text-sm font-semibold uppercase -mb-[23px]">
                {["batting", "bowling"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setSelected(tab)}
                    className={`rounded-full px-8 py-2 transition-colors ${
                      selected === tab
                        ? "bg-[#F68323] text-white"
                        : "text-[#1A2C76]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <h1 className="flex flex-col text-5xl font-extrabold uppercase italic leading-[0.9] text-white sm:text-6xl">
                <span
                  className="text-transparent"
                  style={{ WebkitTextStroke: "2px #7E93DB" }}
                >
                  Player
                </span>
                <span>Stats</span>
              </h1>

              <div className="relative z-20 flex flex-wrap items-end gap-3">
                <div className="min-w-[160px]">
                  <CustomSelect
                    value={season}
                    options={seasons}
                    onChange={setSeason}
                    formatOption={formatSeasonLabel}
                  />
                </div>
                <div className="min-w-[200px]">
                  <CustomSelect
                    value={sortBy}
                    options={sortByOptions[selected] || []}
                    onChange={setSortBy}
                  />
                </div>
                <div className="min-w-[180px]">
                  <CustomSelect
                    value={selectedTeam}
                    options={teams}
                    onChange={setSelectedTeam}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Top pagination — visible on mobile so users don't have to scroll */}
          <div ref={listTopRef} className="mb-4 md:hidden">
            <PaginationControls
              count={filteredByTeam.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handlePageChange}
              onRowsPerPageChange={(newRPP) => setRowsPerPage(newRPP)}
              rowsPerPageOptions={[5, 10, 15, 30, 50]}
            />
          </div>

          <PlayerTable
            selected={selected}
            onPlayerSelect={setSelectedPlayer}
            selectedPlayer={selectedPlayer}
            data={displayedData}
          />

          <div className="mt-6 hidden md:block">
            <PaginationControls
              count={filteredByTeam.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handlePageChange}
              onRowsPerPageChange={(newRPP) => setRowsPerPage(newRPP)}
              rowsPerPageOptions={[5, 10, 15, 30, 50]}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
