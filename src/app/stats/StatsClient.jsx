"use client";
import React, { useState, useMemo, useEffect } from "react";
import PlayerDetailsHero from "@/components/stats/PlayerDetailsHero";
import PaginationControls from "./components/PaginationControls";
import { season3TeamLogo } from "@/utilis/helper";
import "./style.css";

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
    "BBI",
    "AVG",
    "ECON",
    "S/R",
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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[1100px] w-full text-white border-separate border-spacing-y-3 italic">
        <thead>
          <tr className="text-left text-xs uppercase text-[#FFE24A] bg-[#1F43C5]">
            {headers.map((h, i) => (
              <th
                key={h}
                className={`px-4 py-3 ${i === 0 ? "rounded-l-full" : ""} ${
                  i === headers.length - 1 ? "rounded-r-full" : ""
                } ${i === 1 ? "" : "text-center"}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((player) => {
            const isSelected = player.player === selectedPlayer?.player;
            return (
              <tr
                key={`${player.pos}-${player.player}`}
                className={`text-sm cursor-pointer transition-opacity ${
                  isSelected ? "" : "hover:opacity-90"
                }`}
                onClick={() => onPlayerSelect(player)}
              >
                <td
                  className="px-2 text-4xl font-black italic leading-none text-transparent w-12 align-middle"
                  style={{ WebkitTextStroke: "2px #7E93DB" }}
                >
                  {player.pos}
                </td>
                <td className="bg-[#2447C6] rounded-l-full">
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                      {player.teamLogo ? (
                        <img
                          src={player.teamLogo}
                          alt={player.team}
                          className="h-8 w-8 rounded-full object-contain"
                        />
                      ) : null}
                    </div>
                    <div className="leading-tight">
                      <p className="text-xs font-extrabold uppercase text-white">
                        {player.player}
                      </p>
                      <p className="text-[10px] uppercase text-[#FFE150]">
                        {player.team}
                      </p>
                    </div>
                  </div>
                </td>
                {headers.slice(2).map((key, idx) => {
                  const isLast = idx === headers.length - 3;
                  return (
                    <td
                      key={key}
                      className={`px-4 py-2 font-semibold bg-[#192A66] text-center relative ${
                        isLast ? "rounded-r-full" : ""
                      }`}
                    >
                      {!isLast && (
                        <div className="h-3/5 w-[.5px] bg-[#9F3BE3]/70 absolute top-0 bottom-0 my-auto right-0" />
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
        const teamLogo = season3TeamLogo[t.team_name] || "";

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
      <PlayerDetailsHero player={selectedPlayer} selectedTab={selected} />
      <section className="relative overflow-hidden pb-14 pt-12 bg-[url('/images/texture-bg.png')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,88,210,0.35),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(26,40,116,0.65),transparent_45%)]" />
        <div className="relative section-width">
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

            <div className="flex flex-wrap gap-3">
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="rounded-lg border border-white/20 bg-[#314A98] px-4 py-2 text-sm font-semibold text-white outline-none"
              >
                {seasons.map((s) => (
                  <option key={s} value={s} className="text-black">
                    {formatSeasonLabel(s)}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-white/20 bg-[#314A98] px-4 py-2 text-sm font-semibold text-white outline-none"
              >
                {(sortByOptions[selected] || []).map((o) => (
                  <option key={o} value={o} className="text-black">
                    {o}
                  </option>
                ))}
              </select>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="rounded-lg border border-white/20 bg-[#314A98] px-4 py-2 text-sm font-semibold text-white outline-none"
              >
                {teams.map((t) => (
                  <option key={t} value={t} className="text-black">
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <PlayerTable
            selected={selected}
            onPlayerSelect={setSelectedPlayer}
            selectedPlayer={selectedPlayer}
            data={displayedData}
          />

          <div className="mt-6">
            <PaginationControls
              count={filteredByTeam.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={(newPage) => setPage(newPage)}
              onRowsPerPageChange={(newRPP) => setRowsPerPage(newRPP)}
              rowsPerPageOptions={[5, 10, 15, 30, 50]}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
