"use client";
import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import PlayerDetailsHero from "@/components/stats/PlayerDetailsHero";
import PaginationControls from "./components/PaginationControls";
import { season3TeamLogo, teamLogoStats } from "@/utilis/helper";
import { DropDown } from "@/components/common/DropDown";
import "./style.css";

const Cell = ({ children, className = "", style }) => (
  <div
    className={`p-4 text-center whitespace-nowrap ${className}`}
    style={style}
  >
    {children}
  </div>
);

const HeaderCell = ({ children, className = "" }) => (
  <th
    className={`py-4 pl-[2rem] text-left font-bold text-transparent bg-clip-text ${className}`}
    style={{
      backgroundImage:
        "linear-gradient(180deg, #666666 20.89%, #FFFFFF 48.4%, #666666 80.91%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}
  >
    {children}
  </th>
);

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

const PlayerTable = ({ selected, onPlayerSelect, selectedPlayer, data }) => {
  const headers = columnMap[selected];

  const getCellValue = (player, key) => {
    const map = {
      POS: player.pos,
      PLAYER: (
        <div className="flex items-center gap-3 text-left">
          <div>
            <p className="font-normal text-xs">{player.player}</p>
            {player.team && (
              <div className="flex items-center gap-2 text-sm">
                <img
                  src={player.teamLogo}
                  width={16}
                  height={16}
                  alt={player.team}
                />
                <span className="text-gray-400">{player.team}</span>
              </div>
            )}
          </div>
        </div>
      ),
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
    return map[key];
  };

  return (
    <div className="w-full overflow-auto">
      <div className="min-w-[1250px] relative">
        <div
          className="bg-[#001B31] w-[100%] border-r-[50px] top-2 border-[#F15A22] h-10 z-10 absolute"
          style={{
            clipPath: "polygon(0% 0%, 100% 0%, 97.8% 100%, 0% 100%)",
          }}
        ></div>

        <table className="w-full table-auto border-collapse text-sm">
          <div
            className="bg-[#999FA4] m-1 italic z-50 relative mb-4 mr-2 custom-heading-border"
            style={{
              clipPath: "polygon(0% 0%, 100% 0%, 97% 100%, 0% 100%)",
            }}
          >
            <div
              className="grid pr-[3rem]"
              style={{
                gridTemplateColumns: `1fr 3.5fr repeat(${
                  headers.length - 2
                }, 1fr)`,
              }}
            >
              {headers.map((h, index) => (
                <HeaderCell key={h} className={h === "PLAYER" ? "" : ""}>
                  {h}
                </HeaderCell>
              ))}
            </div>
          </div>

          <tbody className="text-[#D8D8D8]">
            {data.map((player) => {
              const isSelected = player.player === selectedPlayer?.player;

              return (
                <tr
                  key={player.pos}
                  className="cursor-pointer mb-4"
                  onClick={() => onPlayerSelect(player)}
                >
                  <td className="relative p-0" colSpan={headers.length}>
                    <div
                      className="absolute w-full h-10 z-10 mt-4 border-r-[50px] border-[#F15A22]"
                      style={{
                        clipPath:
                          "polygon(0% 0%, 100% 0%, 98.2% 100%, 0% 100%)",
                        background:
                          "linear-gradient(to right, rgba(224, 126, 39, 0.2) 60%, rgba(255, 255, 255, 0.2) 71%, rgba(224, 126, 39, 0.2) 100%)",
                      }}
                    >
                      <div className="flex z-50 pl-2 items-center relative h-full">
                        <span className="text-white font-medium ">
                          {player.pos}
                        </span>
                      </div>
                      <div className="custom-yellow-border"></div>
                      <div className="custom-black-gradient"></div>
                    </div>

                    <div
                      className="relative z-20 bg-[#999FA4] px-4 md:px-10 w-[98%] custom-border-bg left-6 mt-2"
                      style={{
                        clipPath:
                          "polygon(3% 0%, 100% 0%, 97.5% 100%, 0% 100%)",
                      }}
                    >
                      <div
                        className="grid px-4 items-center"
                        style={{
                          gridTemplateColumns: `1.5fr repeat(${headers.length}, 1fr)`,
                        }}
                      >
                        {headers.slice(1).map((key, index) => (
                          <Cell
                            key={key}
                            style={{ padding: "10px" }}
                            className={[
                              key === "PLAYER" ? "text-left" : "",
                              index === 0 ? "col-span-3" : "",
                              index !== headers.length - 2 ? "" : "",
                            ].join(" ")}
                          >
                            {getCellValue(player, key)}
                          </Cell>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
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
    statsData[Object.keys(statsData)[0]].seasons
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
            teamLogo: teamLogo,
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
            teamLogo: teamLogo,
            playerImg: "",
            mat: s.matches_played || 0,
            overs: +((s.balls_bowled || 0) / 6).toFixed(1),
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
            teamLogo: teamLogo,
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
            if (b.runs !== a.runs) {
              return b.runs - a.runs;
            }
            return a.ballsFaced - b.ballsFaced; // Fewer balls faced is better
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
          sorted.sort((a, b) => b.sixes - a.sixes);
          break;
        case "Most Sixes (Innings)":
          sorted.sort((a, b) => b.sixes - a.sixes);
          break;
        case "Most Fours":
          sorted.sort((a, b) => b.fours - a.fours);
          break;
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
          sorted.sort((a, b) => b.sr - a.sr);
          break;
        case "Fastest Centuries":
          sorted.sort((a, b) => b.sr - a.sr);
          break;
      }
    } else if (category === "bowling") {
      switch (sortBy) {
        case "Most Wickets":
          // sorted.sort((a, b) => b.wkts - a.wkts);
          sorted.sort((a, b) => {
            if (b.wkts !== a.wkts) {
              return b.wkts - a.wkts;
            }
            return a.ballsBowled - b.ballsBowled; // Fewer balls bowled is better
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
  const [season, setSeason] = useState(seasons[2]);
  const [sortBy, setSortBy] = useState(defaultSortOptions["batting"]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [selectedTeam, setSelectedTeam] = useState("All Teams");

  // const teams = useMemo(() => {
  //   const allTeams = new Set();
  //   Object.values(statsData).forEach((player) => {
  //     Object.values(player.seasons).forEach((season) => {
  //       if (season.team_name) {
  //         allTeams.add(season.team_name);
  //       }
  //     });
  //   });
  //   return ["All Teams", ...Array.from(allTeams)];
  // }, [statsData]);

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
    [selected, season]
  );
  const data = useMemo(
    () => sortData(rawData, selected, sortBy),
    [rawData, selected, sortBy]
  );

  // const displayedData = useMemo(
  //   () => data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
  //   [data, page, rowsPerPage]
  // );
  const filteredByTeam =
    selectedTeam === "All Teams"
      ? data
      : data.filter((player) => player.team === selectedTeam);

  const displayedData = useMemo(() => {
    return filteredByTeam.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredByTeam, page, rowsPerPage]);

  // const displayedData = useMemo(() => {
  //   const filteredByTeam =
  //     selectedTeam === "All Teams"
  //       ? data
  //       : data.filter((player) => player.team === selectedTeam);

  //   return filteredByTeam.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  // }, [data, page, rowsPerPage, selectedTeam]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [selectedPlayer, setSelectedPlayer] = useState(displayedData[0] || {});

  useEffect(() => {
    setSortBy(defaultSortOptions[selected]);
  }, [selected]);

  useEffect(() => {
    setPage(0);
    setSelectedTeam("All Teams");

    // if (filteredByTeam.length < rowsPerPage) {
    //   setRowsPerPage(Math.max(filteredByTeam.length, 5));
    // }
  }, [selected, season, sortBy, selectedTeam]);

  useEffect(() => {
    setSelectedPlayer(displayedData[0] || {});
  }, [displayedData]);

  return (
    <div className="w-full overflow-x-auto ">
      <div className="w-full">
        <PlayerDetailsHero player={selectedPlayer} selectedTab={selected} />
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
          <div className="section-width flex flex-col gap-10 bg-white text-black items-start pt-12">
            <div className="w-full bg-center bg-cover">
              <div className=" w-full h-full flex flex-col lg:flex-row gap-4 relative justify-between">
                <div className="h-full justify-center w-full">
                  <Image
                    src="/images/elements/small-title-bg.png"
                    alt="Mobile Title"
                    className="block md:hidden w-full"
                    width={200}
                    height={0}
                    priority
                  />
                  <Image
                    src="/images/elements/title-bg.png"
                    alt="Desktop Title"
                    className="hidden md:block lg:block w-full "
                    width={900}
                    height={200}
                    priority
                  />
                </div>

                <div className="flex items-center justify-between z-10 absolute h-full lg:h-full top-0 left-0 right-0">
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
                    STATS
                  </h3>

                  <div className="hidden flex-col md:flex-row lg:flex xl:mr-14 mr-8 max-md:mt-4 w-fit gap-4">
                    <DropDown
                      label="Season"
                      options={seasons}
                      value={season}
                      onChange={(e) => setSeason(e.target.value)}
                      bg="[#E07E27]"
                    />
                    <DropDown
                      label="Sort by"
                      options={
                        selected === "batting"
                          ? [
                              "Most Runs",
                              "Highest Individual Score",
                              "Highest Strike Rate",
                              "Highest Averages",
                              "Most Sixes",
                              // "Most Sixes (Innings)",
                              "Most Fours",
                              // "Most Fours (Innings)",
                              "Most Fifties",
                              "Most Centuries",
                              // "Fastest Fifties",
                              // "Fastest Centuries",
                            ]
                          : selected === "bowling"
                          ? [
                              "Most Wickets",
                              "Best Economy",
                              // "Best Economy (Innings)",
                              "Best Average",
                              "Best Strike Rate",
                              // "Best Strike Rate (Innings)",
                              "Most Runs Conceded (Innings)",
                              // "Most Dot Balls Bowled",
                              // "Most Dot Balls Bowled (Innings)",
                              "Most Maiden Overs Bowled",
                            ]
                          : ["Most Catches", "Most Run Outs", "Most Stumpings"]
                      }
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      bg="[#E07E27]"
                    />
                    <DropDown
                      label="Team"
                      options={teams}
                      value={selectedTeam}
                      onChange={(e) => setSelectedTeam(e.target.value)}
                      bg="[#E07E27]"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row lg:hidden items-center gap-4 w-full mt-4">
                <DropDown
                  label="Season"
                  options={seasons}
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  bg="[#E07E27]"
                  labelVisible={false}
                />
                <DropDown
                  label="Sort by"
                  options={
                    selected === "batting"
                      ? [
                          "Most Runs",
                          "Highest Individual Score",
                          "Highest Strike Rate",
                          "Highest Averages",
                          "Most Sixes",
                          // "Most Sixes (Innings)",
                          "Most Fours",
                          // "Most Fours (Innings)",
                          "Most Fifties",
                          "Most Centuries",
                          // "Fastest Fifties",
                          // "Fastest Centuries",
                        ]
                      : selected === "bowling"
                      ? [
                          "Most Wickets",
                          "Best Economy",
                          // "Best Economy (Innings)",
                          "Best Average",
                          "Best Strike Rate",
                          // "Best Strike Rate (Innings)",
                          "Most Runs Conceded (Innings)",
                          // "Most Dot Balls Bowled",
                          // "Most Dot Balls Bowled (Innings)",
                          "Most Maiden Overs Bowled",
                        ]
                      : ["Most Catches", "Most Run Outs", "Most Stumpings"]
                  }
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  bg="[#E07E27]"
                  labelVisible={false}
                />
                <DropDown
                  label="Team"
                  options={teams}
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  bg="[#E07E27]"
                  labelVisible={false}
                />
              </div>
            </div>
            <div className=" flex flex-col lg:flex-row items-start md:items-center justify-between gap-4 border border-1 rounded-lg ">
              <div className="flex items-center gap-4">
                {[
                  "batting",
                  "bowling",
                  // "fielding"
                ].map((tab) => (
                  <p
                    key={tab}
                    onClick={() => setSelected(tab)}
                    className={`font-semibold xl:text-base text-sm uppercase p-2 whitespace-nowrap cursor-pointer rounded-lg ${
                      selected === tab ? "bg-[#E07E27]" : "text-[#6A6A6A]"
                    }`}
                  >
                    {tab}
                  </p>
                ))}
              </div>
            </div>

            {/* Stats Table */}
            <PlayerTable
              selected={selected}
              onPlayerSelect={setSelectedPlayer}
              selectedPlayer={selectedPlayer}
              data={displayedData}
            />

            <div className="w-full">
              <PaginationControls
                count={filteredByTeam.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={(newPage) => setPage(newPage)}
                onRowsPerPageChange={(newRPP) => {
                  setRowsPerPage(newRPP);
                }}
                rowsPerPageOptions={[5, 10, 15, 30, 50]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client";
// import React, { useState, useMemo, useEffect } from "react";
// import Image from "next/image";
// import PlayerDetailsHero from "@/components/stats/PlayerDetailsHero";
// import PaginationControls from "./components/PaginationControls";
// import { teamLogoStats } from "@/utilis/helper";
// import { DropDown } from "@/components/common/DropDown";
// import "./style.css";

// const Cell = ({ children, className = "", style }) => (
//   <div
//     className={`p-4 text-center whitespace-nowrap ${className}`}
//     style={style}
//   >
//     {children}
//   </div>
// );

// const HeaderCell = ({ children, className = "" }) => (
//   <th
//     className={`py-4 pl-[2rem] text-left font-bold text-transparent bg-clip-text ${className}`}
//     style={{
//       backgroundImage:
//         "linear-gradient(180deg, #666666 20.89%, #FFFFFF 48.4%, #666666 80.91%)",
//       WebkitBackgroundClip: "text", // explicitly set for cross-browser support
//       WebkitTextFillColor: "transparent", // required for Safari
//     }}
//   >
//     {children}
//   </th>
// );

// const columnMap = {
//   batting: [
//     "POS",
//     "PLAYER",
//     "MAT",
//     "NO",
//     "RUNS",
//     "HS",
//     "AVE",
//     "S/R",
//     "100S",
//     "50S",
//     "4S",
//     "6S",
//     "DUCKS",
//   ],
//   bowling: [
//     "POS",
//     "PLAYER",
//     "MAT",
//     "OVERS",
//     "MAIDENS",
//     "RUNS",
//     "WKTS",
//     "BBI",
//     "AVG",
//     "ECON",
//     "S/R",
//     "3W",
//     "5W",
//   ],
//   fielding: [
//     "POS",
//     "PLAYER",
//     "MAT",
//     "CATCHES",
//     "DISMISSALS",
//     "RUN OUTS",
//     "STUMPINGS",
//   ],
// };

// const PlayerTable = ({ selected, onPlayerSelect, selectedPlayer, data }) => {
//   const headers = columnMap[selected];

//   const getCellValue = (player, key) => {
//     const map = {
//       POS: player.pos,
//       PLAYER: (
//         <div className="flex items-center gap-3 text-left">
//           <div>
//             <p className="font-normal text-xs">{player.player}</p>
//             {player.team && (
//               <div className="flex items-center gap-2 text-sm">
//                 <img
//                   src={player.teamLogo}
//                   width={16}
//                   height={16}
//                   alt={player.team}
//                 />
//                 <span className="text-gray-400">{player.team}</span>
//               </div>
//             )}
//           </div>
//         </div>
//       ),
//       MAT: player.mat,
//       NO: player.no,
//       RUNS: player.runs,
//       HS: player.hs,
//       AVE: player.ave,
//       "S/R": player.sr,
//       "100S": player.hundreds,
//       "50S": player.fifties,
//       "4S": player.fours,
//       "6S": player.sixes,
//       DUCKS: player.ducks,
//       OVERS: player.overs,
//       MAIDENS: player.maidens,
//       WKTS: player.wkts,
//       BBI: player.bbi,
//       AVG: player.avg,
//       ECON: player.econ,
//       "3W": player.threeW,
//       "5W": player.fiveW,
//       CATCHES: player.catches,
//       DISMISSALS: player.dismissals,
//       "RUN OUTS": player.runOuts,
//       STUMPINGS: player.stumpings,
//     };
//     return map[key];
//   };

//   return (
//     <div className="w-full overflow-auto">
//       <div className="min-w-[1250px] relative">
//         {/* orange heading gradient */}
//         <div
//           className="bg-[#001B31] w-[100%] border-r-[50px] top-2 border-[#F15A22] h-10 z-10 absolute"
//           style={{
//             clipPath: "polygon(0% 0%, 100% 0%, 97.8% 100%, 0% 100%)",
//           }}
//         ></div>

//         <table className="w-full table-auto border-collapse text-sm">
//           <div
//             className="bg-[#999FA4] m-1 italic z-50 relative mb-4 mr-2 custom-heading-border"
//             style={{
//               clipPath: "polygon(0% 0%, 100% 0%, 97% 100%, 0% 100%)",
//             }}
//           >
//             <div
//               className="grid pr-[3rem]"
//               style={{
//                 gridTemplateColumns: `1fr 3.5fr repeat(${
//                   headers.length - 2
//                 }, 1fr)`, // Second column will be larger
//               }}
//             >
//               {headers.map((h, index) => (
//                 <HeaderCell key={h} className={h === "PLAYER" ? "" : ""}>
//                   {h}
//                 </HeaderCell>
//               ))}
//             </div>
//           </div>

//           <tbody className="text-[#D8D8D8]">
//             {data.map((player) => {
//               const isSelected = player.player === selectedPlayer?.player;

//               return (
//                 <tr
//                   key={player.pos}
//                   className="cursor-pointer mb-4"
//                   onClick={() => onPlayerSelect(player)}
//                 >
//                   <td className="relative p-0" colSpan={headers.length}>
//                     {/* Main row backside card style*/}
//                     <div
//                       className="absolute w-full h-10 z-10 mt-4 border-r-[50px] border-[#F15A22]"
//                       style={{
//                         clipPath:
//                           "polygon(0% 0%, 100% 0%, 98.2% 100%, 0% 100%)",
//                         background:
//                           "linear-gradient(to right, rgba(224, 126, 39, 0.2) 60%, rgba(255, 255, 255, 0.2) 71%, rgba(224, 126, 39, 0.2) 100%)",
//                       }}
//                     >
//                       <div className="flex z-50 pl-2 items-center relative h-full">
//                         <span className="text-white font-medium ">
//                           {player.pos}
//                         </span>
//                       </div>
//                       <div className="custom-yellow-border"></div>
//                       <div className="custom-black-gradient"></div>
//                     </div>

//                     <div
//                       className="relative z-20 bg-[#999FA4] px-4 md:px-10 w-[98%] custom-border-bg left-6 mt-2"
//                       style={{
//                         clipPath:
//                           "polygon(3% 0%, 100% 0%, 97.5% 100%, 0% 100%)",
//                       }}
//                     >
//                       <div
//                         className="grid px-4 items-center"
//                         style={{
//                           gridTemplateColumns: `1.5fr repeat(${headers.length}, 1fr)`,
//                         }}
//                       >
//                         {headers.slice(1).map((key, index) => (
//                           <Cell
//                             key={key}
//                             style={{ padding: "10px" }}
//                             className={[
//                               key === "PLAYER" ? "text-left" : "",
//                               index === 0 ? "col-span-3" : "", // Apply larger space to the second column
//                               index !== headers.length - 2 ? "" : "",
//                             ].join(" ")}
//                           >
//                             {getCellValue(player, key)}
//                           </Cell>
//                         ))}
//                       </div>
//                     </div>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default function StatsClient({ statsData }) {
//   const seasons = Object.keys(
//     statsData[Object.keys(statsData)[0]].seasons
//   ).filter((s) => s.toLowerCase() !== "overall");
//   const makeCategoryData = (category, season) => {
//     return Object.values(statsData)
//       .map((p) => {
//         const t = p.seasons[season] || {};
//         const s = p.seasons[season]?.[category] || {};
//         const teamLogo = teamLogoStats[t.team_name] || "";

//         if (s.matches_played === 0 || !t.team_name) return null;

//         if (category === "batting") {
//           return {
//             player: p.name_full,
//             team: t.team_name,
//             teamLogo: teamLogo,
//             playerImg: "",
//             mat: s.matches_played || 0,
//             no: s.not_outs || 0,
//             runs: s.runs || 0,
//             hs: s.highest_score || 0,
//             ave: s.average || 0,
//             sr: s.strike_rate || 0,
//             hundreds: s.hundreds || 0,
//             fifties: s.fifties || 0,
//             fours: s.fours || 0,
//             sixes: s.sixes || 0,
//             ducks: 0,
//           };
//         }
//         if (category === "bowling") {
//           const overs = (s.balls_bowled || 0) / 6;

//           if (!t.team_name || overs < 1) return null;
//           return {
//             player: p.name_full,
//             team: t.team_name,
//             teamLogo: teamLogo,
//             playerImg: "",
//             mat: s.matches_played || 0,
//             overs: +((s.balls_bowled || 0) / 6).toFixed(1),
//             maidens: s.maidens || 0,
//             runs: s.runs_conceded || 0,
//             wkts: s.wickets || 0,
//             bbi: `${s.wickets || 0}/${s.runs_conceded || 0}`,
//             avg: s.average || 0,
//             econ: s.economy_rate || 0,
//             sr: s.strike_rate || 0,
//             threeW: s.three_wickets || 0,
//             fiveW: s.five_wickets || 0,
//           };
//         }
//         if (category === "fielding") {
//           if (s.matches_played === 0 || !t.team_name) return null;

//           const runOuts = (s.run_outs_direct || 0) + (s.run_outs_assisted || 0);
//           const dismissals = (s.catches || 0) + (s.stumpings || 0) + runOuts;
//           return {
//             player: p.name_full,
//             team: t.team_name,
//             teamLogo: teamLogo,
//             playerImg: "",
//             mat: s.matches_played || 0,
//             catches: s.catches || 0,
//             dismissals,
//             runOuts,
//             stumpings: s.stumpings || 0,
//           };
//         }
//         return null;
//       })
//       .filter(Boolean);
//   };

//   const sortData = (data, category, sortBy) => {
//     const sorted = [...data];

//     if (category === "batting") {
//       switch (sortBy) {
//         case "Most Runs":
//           sorted.sort((a, b) => b.runs - a.runs);
//           break;
//         case "Least Runs":
//           sorted.sort((a, b) => a.runs - b.runs);
//           break;
//         case "Highest Individual Score":
//           sorted.sort((a, b) => b.hs - a.hs);
//           break;
//         case "Highest Strike Rate":
//           sorted.sort((a, b) => b.sr - a.sr);
//           break;
//         case "Highest Averages":
//           sorted.sort((a, b) => b.ave - a.ave);
//           break;
//         case "Most Sixes":
//           sorted.sort((a, b) => b.sixes - a.sixes);
//           break;
//         case "Most Sixes (Innings)":
//           sorted.sort((a, b) => b.sixes - a.sixes);
//           break;
//         case "Most Fours":
//           sorted.sort((a, b) => b.fours - a.fours);
//           break;
//         case "Most Fours (Innings)":
//           sorted.sort((a, b) => b.fours - a.fours);
//           break;
//         case "Most Fifties":
//           sorted.sort((a, b) => b.fifties - a.fifties);
//           break;
//         case "Most Centuries":
//           sorted.sort((a, b) => b.hundreds - a.hundreds);
//           break;
//         case "Fastest Fifties":
//           sorted.sort((a, b) => b.sr - a.sr);
//           break;
//         case "Fastest Centuries":
//           sorted.sort((a, b) => b.sr - a.sr);
//           break;
//       }
//     } else if (category === "bowling") {
//       switch (sortBy) {
//         case "Most Wickets":
//           sorted.sort((a, b) => b.wkts - a.wkts);
//           break;
//         case "Best Economy":
//         case "Best Economy (Innings)":
//           sorted.sort((a, b) => a.econ - b.econ);
//           break;
//         case "Best Average":
//           sorted.sort((a, b) => a.avg - b.avg);
//           break;
//         case "Best Strike Rate":
//         case "Best Strike Rate (Innings)":
//           sorted.sort((a, b) => a.sr - b.sr);
//           break;
//         case "Most Runs Conceded (Innings)":
//           sorted.sort((a, b) => b.runs - a.runs);
//           break;
//         case "Most Dot Balls Bowled":
//         case "Most Dot Balls Bowled (Innings)":
//           sorted.sort((a, b) => b.dotBalls - a.dotBalls);
//           break;
//         case "Most Maiden Overs Bowled":
//           sorted.sort((a, b) => b.maidens - a.maidens);
//           break;
//       }
//     } else {
//       switch (sortBy) {
//         case "Most Catches":
//           sorted.sort((a, b) => b.catches - a.catches);
//           break;
//         case "Most Run Outs":
//           sorted.sort((a, b) => b.runOuts - a.runOuts);
//           break;
//         case "Most Stumpings":
//           sorted.sort((a, b) => b.stumpings - a.stumpings);
//           break;
//       }
//     }

//     return sorted.map((row, i) => ({ pos: i + 1, ...row }));
//   };

//   const defaultSortOptions = {
//     batting: "Most Runs",
//     bowling: "Most Wickets",
//     fielding: "Most Run Outs",
//   };

//   const [selected, setSelected] = useState("batting");
//   const [season, setSeason] = useState(seasons[0]);
//   const [sortBy, setSortBy] = useState(defaultSortOptions["batting"]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(15);
//   const [selectedTeam, setSelectedTeam] = useState("All Teams");

//   // const teams = useMemo(() => {
//   //   const allTeams = new Set();
//   //   Object.values(statsData).forEach((player) => {
//   //     Object.values(player.seasons).forEach((season) => {
//   //       if (season.team_name) {
//   //         allTeams.add(season.team_name);
//   //       }
//   //     });
//   //   });
//   //   return ["All Teams", ...Array.from(allTeams)];
//   // }, [statsData]);

//   const teams = useMemo(() => {
//     const seasonTeams = new Set();

//     Object.values(statsData).forEach((player) => {
//       const seasonData = player.seasons[season];
//       if (seasonData && seasonData.team_name) {
//         seasonTeams.add(seasonData.team_name);
//       }
//     });

//     return ["All Teams", ...Array.from(seasonTeams)];
//   }, [statsData, season]);

//   const rawData = useMemo(
//     () => makeCategoryData(selected, season),
//     [selected, season]
//   );
//   const data = useMemo(
//     () => sortData(rawData, selected, sortBy),
//     [rawData, selected, sortBy]
//   );

//   // const displayedData = useMemo(
//   //   () => data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
//   //   [data, page, rowsPerPage]
//   // );
//   const filteredByTeam =
//     selectedTeam === "All Teams"
//       ? data
//       : data.filter((player) => player.team === selectedTeam);

//   const displayedData = useMemo(() => {
//     return filteredByTeam.slice(
//       page * rowsPerPage,
//       page * rowsPerPage + rowsPerPage
//     );
//   }, [filteredByTeam, page, rowsPerPage]);

//   // const displayedData = useMemo(() => {
//   //   const filteredByTeam =
//   //     selectedTeam === "All Teams"
//   //       ? data
//   //       : data.filter((player) => player.team === selectedTeam);

//   //   return filteredByTeam.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
//   // }, [data, page, rowsPerPage, selectedTeam]);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const [selectedPlayer, setSelectedPlayer] = useState(displayedData[0] || {});

//   useEffect(() => {
//     setSortBy(defaultSortOptions[selected]);
//   }, [selected]);

//   useEffect(() => {
//     setPage(0);

//     // if (filteredByTeam.length < rowsPerPage) {
//     //   setRowsPerPage(Math.max(filteredByTeam.length, 5));
//     // }
//   }, [selected, season, sortBy, selectedTeam]);

//   useEffect(() => {
//     setSelectedPlayer(displayedData[0] || {});
//   }, [displayedData]);

//   return (
//     <div className="w-full overflow-x-auto ">
//       <div className="w-full">
//         <PlayerDetailsHero player={selectedPlayer} selectedTab={selected} />
//         <div className="relative">
//           <img
//             src="/images/elements/section-element.png"
//             className="absolute right-0 top-0 md:block hidden"
//             alt="element"
//           />
//           <img
//             src="/images/elements/section-element.png"
//             className="absolute left-0 bottom-0 rotate-180 md:block hidden"
//             alt="element"
//           />
//           <div className="section-width flex flex-col gap-10 bg-white text-black items-start pt-12">
//             <div className="w-full bg-center bg-cover">
//               <div className=" w-full h-full flex flex-col lg:flex-row gap-4 relative justify-between">
//                 <div className="h-full justify-center w-full">
//                   <Image
//                     src="/images/elements/small-title-bg.png"
//                     alt="Mobile Title"
//                     className="block md:hidden w-full"
//                     width={200}
//                     height={0}
//                     priority
//                   />
//                   <Image
//                     src="/images/elements/title-bg.png"
//                     alt="Desktop Title"
//                     className="hidden md:block lg:block w-full "
//                     width={900}
//                     height={200}
//                     priority
//                   />
//                 </div>

//                 <div className="flex items-center justify-between z-10 absolute h-full lg:h-full top-0 left-0 right-0">
//                   <h3
//                     className="capitalize  md:text-lg lg:text-xl xl:text-2xl md:ml-16 ml-12 italic"
//                     style={{
//                       background:
//                         "radial-gradient(43.3% 61.24% at 50% 50%, #FFF200 0%, #FFF200 26%, #FBB040 97%)",
//                       WebkitBackgroundClip: "text",
//                       WebkitTextFillColor: "transparent",
//                       backgroundClip: "text", // fallback
//                       color: "transparent", // ensure text color is transparent
//                     }}
//                   >
//                     STATS
//                   </h3>

//                   <div className="hidden flex-col md:flex-row lg:flex xl:mr-14 mr-8 max-md:mt-4 w-fit gap-4">
//                     <DropDown
//                       label="Season"
//                       options={seasons}
//                       value={season}
//                       onChange={(e) => setSeason(e.target.value)}
//                       bg="[#E07E27]"
//                     />
//                     <DropDown
//                       label="Sort by"
//                       options={
//                         selected === "batting"
//                           ? [
//                               "Most Runs",
//                               "Highest Individual Score",
//                               "Highest Strike Rate",
//                               "Highest Averages",
//                               "Most Sixes",
//                               // "Most Sixes (Innings)",
//                               "Most Fours",
//                               // "Most Fours (Innings)",
//                               "Most Fifties",
//                               "Most Centuries",
//                               // "Fastest Fifties",
//                               // "Fastest Centuries",
//                             ]
//                           : selected === "bowling"
//                           ? [
//                               "Most Wickets",
//                               "Best Economy",
//                               // "Best Economy (Innings)",
//                               "Best Average",
//                               "Best Strike Rate",
//                               // "Best Strike Rate (Innings)",
//                               "Most Runs Conceded (Innings)",
//                               // "Most Dot Balls Bowled",
//                               // "Most Dot Balls Bowled (Innings)",
//                               "Most Maiden Overs Bowled",
//                             ]
//                           : ["Most Catches", "Most Run Outs", "Most Stumpings"]
//                       }
//                       value={sortBy}
//                       onChange={(e) => setSortBy(e.target.value)}
//                       bg="[#E07E27]"
//                     />
//                     <DropDown
//                       label="Team"
//                       options={teams}
//                       value={selectedTeam}
//                       onChange={(e) => setSelectedTeam(e.target.value)}
//                       bg="[#E07E27]"
//                     />
//                   </div>
//                 </div>
//               </div>
//               <div className="flex flex-col md:flex-row lg:hidden items-center gap-4 w-full mt-4">
//                 <DropDown
//                   label="Season"
//                   options={seasons}
//                   value={season}
//                   onChange={(e) => setSeason(e.target.value)}
//                   bg="[#E07E27]"
//                   labelVisible={false}
//                 />
//                 <DropDown
//                   label="Sort by"
//                   options={
//                     selected === "batting"
//                       ? [
//                           "Most Runs",
//                           "Highest Individual Score",
//                           "Highest Strike Rate",
//                           "Highest Averages",
//                           "Most Sixes",
//                           // "Most Sixes (Innings)",
//                           "Most Fours",
//                           // "Most Fours (Innings)",
//                           "Most Fifties",
//                           "Most Centuries",
//                           // "Fastest Fifties",
//                           // "Fastest Centuries",
//                         ]
//                       : selected === "bowling"
//                       ? [
//                           "Most Wickets",
//                           "Best Economy",
//                           // "Best Economy (Innings)",
//                           "Best Average",
//                           "Best Strike Rate",
//                           // "Best Strike Rate (Innings)",
//                           "Most Runs Conceded (Innings)",
//                           // "Most Dot Balls Bowled",
//                           // "Most Dot Balls Bowled (Innings)",
//                           "Most Maiden Overs Bowled",
//                         ]
//                       : ["Most Catches", "Most Run Outs", "Most Stumpings"]
//                   }
//                   value={sortBy}
//                   onChange={(e) => setSortBy(e.target.value)}
//                   bg="[#E07E27]"
//                   labelVisible={false}
//                 />
//                 <DropDown
//                   label="Team"
//                   options={teams}
//                   value={selectedTeam}
//                   onChange={(e) => setSelectedTeam(e.target.value)}
//                   bg="[#E07E27]"
//                   labelVisible={false}
//                 />
//               </div>
//             </div>
//             <div className=" flex flex-col lg:flex-row items-start md:items-center justify-between gap-4 border border-1 rounded-lg ">
//               <div className="flex items-center gap-4">
//                 {["batting", "bowling", "fielding"].map((tab) => (
//                   <p
//                     key={tab}
//                     onClick={() => setSelected(tab)}
//                     className={`font-semibold xl:text-base text-sm uppercase p-2 whitespace-nowrap cursor-pointer rounded-lg ${
//                       selected === tab ? "bg-[#E07E27]" : "text-[#6A6A6A]"
//                     }`}
//                   >
//                     {tab}
//                   </p>
//                 ))}
//               </div>
//             </div>

//             {/* Stats Table */}
//             <PlayerTable
//               selected={selected}
//               onPlayerSelect={setSelectedPlayer}
//               selectedPlayer={selectedPlayer}
//               data={displayedData}
//             />

//             <div className="w-full">
//               <PaginationControls
//                 count={filteredByTeam.length}
//                 page={page}
//                 rowsPerPage={rowsPerPage}
//                 onPageChange={(newPage) => setPage(newPage)}
//                 onRowsPerPageChange={(newRPP) => {
//                   setRowsPerPage(newRPP);
//                 }}
//                 rowsPerPageOptions={[5, 10, 15, 30, 50]}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
