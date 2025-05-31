"use client"; // This is required to mark this as a client-side component
import React, { useState } from "react";
import Image from "next/image";
import Hero from "@/components/hero/Hero";
import "./styles.css";
import routes from "@/utilis/route";
import TitleComponent from "@/components/common/TitleComponent";
function ScoreCard({ match }) {
  const homeId = match.Matchdetail.Team_Home;
  const awayId = match.Matchdetail.Team_Away;
  const teams = match.Teams;
  const innings = match.Innings || [];
  const venue = match.Matchdetail.Venue.Name.toLowerCase()
    .replace(/mumbai/i, "")
    .replace(/,/g, "")
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
    const matchTime = match.Matchdetail.Match.Time
    const matchNumber=match.Matchdetail.Match.Number.replace("Match", "").trim()
    const stauts = match.Matchdetail.Status 
    const matchDate = match.Matchdetail.Match.Date
    // console.log(match.Matchdetail.Match.Date)

  const homeTeam = teams[homeId];
  const awayTeam = teams[awayId];
  const homeTeamName = homeTeam?.Name_Full ?? "Unknown Team";
  const awayTeamName = awayTeam?.Name_Full ?? "Unknown Team";

  const homeLogo = `/images/fixtures/${homeTeam?.Name_Short?.toLowerCase()}.svg`;
  const awayLogo = `/images/fixtures/${awayTeam?.Name_Short?.toLowerCase()}.svg`;

  const homeInnings = innings.find((i) => i.Battingteam === homeId) || {};
  const awayInnings = innings.find((i) => i.Battingteam === awayId) || {};

  const [activeInnings, setActiveInnings] = useState("home"); // 'home' or 'away'

  const batting =
    (activeInnings === "home" ? homeInnings : awayInnings).Batsmen || [];
  const extras = {
    byes: Number(
      (activeInnings === "home" ? homeInnings : awayInnings).Byes || 0
    ),
    legByes: Number(
      (activeInnings === "home" ? homeInnings : awayInnings).Legbyes || 0
    ),
    wides: Number(
      (activeInnings === "home" ? homeInnings : awayInnings).Wides || 0
    ),
    noBalls: Number(
      (activeInnings === "home" ? homeInnings : awayInnings).Noballs || 0
    ),
    penalty: Number(
      (activeInnings === "home" ? homeInnings : awayInnings).Penalty || 0
    ),
  };
  extras.total = Object.values(extras).reduce((sum, v) => sum + v, 0);

  const fallOfWickets =
    (activeInnings === "home" ? homeInnings : awayInnings).FallofWickets || [];
  const partnerships =
    (activeInnings === "home" ? homeInnings : awayInnings).Partnerships || [];

  const switchTab = (inningsType) => {
    setActiveInnings(inningsType);
  };

  const getBowlerName = (bowlerId) => {
    const bowlerPlayer = Object.values(
      teams[activeInnings === "home" ? awayId : homeId].Players
    ).find((player) => player.Position === bowlerId);
    return bowlerPlayer?.Name_Full || "Unknown Bowler";
  };

  const didNotBat = batting.filter((p) => !p.Howout);

  const oppositeTeamName =
    activeInnings === "home" ? awayTeamName : homeTeamName;

  return (
    <>
      <Hero
        imgUrl="/images/teams/hero/bg.svg"
        heading="Fixtures"
        subheading="Player Profile"
      />
      <div className=" section-width">
        <div className="mt-12">
          <TitleComponent title={"Upcoming Matches"} />
        </div>

        <div className=" text-white  sm:mt-20 border-[2px] rounded-lg border-[#001B31]">
          <div className="bg-[#001B31] text-center py-1 ">
               <div className="relative bg-[#001B31] text-white text-sm md:text-base lg:text-lg font-semibold px-4 py-2 flex justify-between items-center">
              <span>Match {matchNumber} </span>
            

              <div
                className="absolute top-0 right-0 h-full w-[200px] md:w-[250px] bg-gradient-to-r from-[#203376] via-black to-black flex items-center justify-center text-xs md:text-sm lg:text-base font-bold"
                style={{
                  clipPath: "polygon(20% 0%,100% 0%,100% 100%,0% 100%)",
                }}
              >
              {venue}
              </div>
            </div>
          </div>
          <div className="py-4 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-16">
            {/* Left Section: Home Team Logo and Score */}
            <div className="flex items-center space-x-3">
              <Image
                src={`/images/scorecard/${homeTeamName}.svg`}
                alt={homeTeamName}
                width={100}
                height={100}
                className="object-contain"
              />
              <div className="font-semibold uppercase text-sm">
                {homeTeamName}
              </div>
            </div>

            {/* Center Section: Match Details */}
            <div className="py-4 flex flex-col items-center sm:flex-row sm:justify-center px-4 sm:px-16">
              <div className="flex flex-col items-center sm:flex-row sm:space-x-4">
                {/* Home score */}
                <div className="flex items-baseline space-x-1 whitespace-nowrap">
                  <span className="text-2xl font-bold text-orange-400">
                    {homeInnings.Total}/{homeInnings.Wickets}
                  </span>
                  <span className="text-sm text-black">
                    ({homeInnings.Overs} Overs)
                  </span>
                </div>

                {/* VS */}
                <span className="my-2 sm:my-0 text-xl text-black font-bold">
                  VS
                </span>

                {/* Away score */}
                <div className="flex items-baseline space-x-1 whitespace-nowrap">
                  <span className="text-2xl font-bold text-orange-400">
                    {awayInnings.Total}/{awayInnings.Wickets}
                  </span>
                  <span className="text-sm text-black">
                    ({awayInnings.Overs} Overs)
                  </span>
                </div>
              </div>
            </div>

            {/* Right Section: Away Team Logo and Score */}
            <div className="flex items-center space-x-3">
              <div className="font-semibold uppercase text-sm text-right">
                {awayTeamName}
              </div>
              <Image
                src={`/images/scorecard/${awayTeamName}.svg`}
                alt={awayTeamName}
                width={100}
                height={100}
                className="object-contain"
              />
            </div>
          </div>
          <div className="flex justify-center pb-4">
            <span className="text-sm font-medium uppercase bg-[#001B31] text-center py-2 rounded-lg px-6">
              {match.Matchdetail.Equation}
            </span>
          </div>
        </div>

        <div className="w-full overflow-x-auto ">
          <div className="w-full">
            <div className="min-w-[1000px]">
              {/* Tabs for switching innings */}
              <div className="flex justify-center mt-10 bg-transparent rounded-t-lg bg-gradient-to-r from-[#203376] via-black to-[#203376] min-w-[800px]">
                <button
                  onClick={() => switchTab("home")}
                  className={`flex-1 px-4 py-2 text-center ${
                    activeInnings === "home"
                      ? "text-orange-500 border-b-4 border-orange-500"
                      : "bg-transparent text-white"
                  }`}
                >
                  {homeTeamName}
                </button>
                <button
                  onClick={() => switchTab("away")}
                  className={`flex-1 px-4 py-2 text-center ${
                    activeInnings === "away"
                      ? "text-orange-500 border-b-4 border-orange-500"
                      : "bg-transparent text-white"
                  }`}
                >
                  {awayTeamName}
                </button>
              </div>

              {/* Scorecard */}
              <div className="bg-white  shadow-md mb-8 ">
                <div className="flex items-center bg-[#0F1A2D] rounded-b-lg text-white px-6 py-4">
                  <div className="flex items-center space-x-3 flex-1">
                    <Image
                      src={
                        activeInnings === "home"
                          ? `/images/scorecard/${homeTeamName}.svg`
                          : `/images/scorecard/${awayTeamName}.svg`
                      }
                      alt={
                        activeInnings === "home" ? homeTeamName : awayTeamName
                      }
                      width={100}
                      height={100}
                    />
                    <span className="uppercase font-medium">
                      {activeInnings === "home" ? homeTeamName : awayTeamName}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">
                      {
                        (activeInnings === "home" ? homeInnings : awayInnings)
                          .Total
                      }
                      /
                      {
                        (activeInnings === "home" ? homeInnings : awayInnings)
                          .Wickets
                      }
                    </span>
                    <span className="ml-2">
                      (
                      {
                        (activeInnings === "home" ? homeInnings : awayInnings)
                          .Overs
                      }{" "}
                      Overs)
                    </span>
                  </div>
                </div>

                {/* Batting Table */}
                <div className="overflow-x-auto  text-white  mt-3  py-4">
                  <div className="w-full overflow-auto">
                    <table className="w-full table-auto border-collapse text-sm relative min-w-[800px]">
                      {/* Top decorative border */}
                      <div
                        className="bg-[#001B31] w-[100%] border-r-[50px] top-3 border-[#F15A22] h-10 z-10 absolute"
                        style={{
                          clipPath:
                            "polygon(0% 0%, 100% 0%, 98% 100%, 0% 100%)",
                        }}
                      />

                      {/* Custom styled header */}
                      <thead
                        className="bg-[#999FA4] m-1 italic z-50 relative mb-4 mr-2  custom-heading-border"
                        style={{
                          clipPath:
                            "polygon(0% 0%, 100% 0%, 97% 100%, 0% 100%)",
                        }}
                      >
                        <tr>
                          <div className="grid grid-cols-[3fr_2.5fr_1fr_1fr_1fr_1fr_1fr] w-full ">
                            <th
                              className="py-4  pl-[2rem] text-left font-bold text-2xl  uppercase text-transparent bg-clip-text"
                              style={{
                                backgroundImage:
                                  "linear-gradient(180deg, #666666 20.89%, #FFFFFF 48.4%, #666666 80.91%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                              }}
                            >
                              Batting
                            </th>
                            <th
                              className="py-4 text-left font-bold text-2xl text-transparent bg-clip-text whitespace-nowrap"
                              style={{
                                backgroundImage:
                                  "linear-gradient(180deg, #666666 20.89%, #FFFFFF 48.4%, #666666 80.91%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                              }}
                            ></th>
                            <th
                              className="py-4 text-center font-bold text-2xl text-transparent  uppercase bg-clip-text"
                              style={{
                                backgroundImage:
                                  "linear-gradient(180deg, #666666 20.89%, #FFFFFF 48.4%, #666666 80.91%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                              }}
                            >
                              R
                            </th>
                            <th
                              className="py-4 text-center font-bold text-2xl text-transparent  uppercase bg-clip-text"
                              style={{
                                backgroundImage:
                                  "linear-gradient(180deg, #666666 20.89%, #FFFFFF 48.4%, #666666 80.91%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                              }}
                            >
                              B
                            </th>
                            <th
                              className="py-4 text-center font-bold text-2xl text-transparent  uppercase bg-clip-text"
                              style={{
                                backgroundImage:
                                  "linear-gradient(180deg, #666666 20.89%, #FFFFFF 48.4%, #666666 80.91%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                              }}
                            >
                              4S
                            </th>
                            <th
                              className="py-4 text-center font-bold text-2xl  uppercase text-transparent bg-clip-text"
                              style={{
                                backgroundImage:
                                  "linear-gradient(180deg, #666666 20.89%, #FFFFFF 48.4%, #666666 80.91%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                              }}
                            >
                              6S
                            </th>
                            <th
                              className="py-4 pr-[13px] text-center text-2xl  uppercase font-bold text-transparent bg-clip-text"
                              style={{
                                backgroundImage:
                                  "linear-gradient(180deg, #666666 20.89%, #FFFFFF 48.4%, #666666 80.91%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                              }}
                            >
                              S/R
                            </th>
                          </div>
                        </tr>
                      </thead>

                      <tbody>
                        {batting
                          .filter((p) => p.Howout)
                          .map((p, i) => (
                            <tr key={i} className="relative mt-6 mb-6">
                              {/* Background orange border div for data row */}
                              <td colSpan="7" className="relative p-0">
                                <div
                                  className="bg-[#001B31] w-[100%] border-r-[50px] border-[#F15A22] top-3 h-10 z-10 absolute"
                                  style={{
                                    clipPath:
                                      "polygon(0% 0%, 100% 0%, 97.8% 100%, 0% 100%)",
                                  }}
                                />

                                {/* Data row with same design as header */}
                                <div
                                  className="bg-[#999FA4] my-1 italic z-50 relative custom-heading-border"
                                  style={{
                                    clipPath:
                                      "polygon(0% 0%, 100% 0%, 97% 100%, 0% 100%)",
                                  }}
                                >
                                  <div className="grid grid-cols-[3fr_2.5fr_1fr_1fr_1fr_1fr_1fr] w-full">
                                    <div className="py-4 pl-[2rem] text-left font-medium text-white whitespace-nowrap overflow-hidden text-ellipsis">
                                      {
                                        teams[
                                          activeInnings === "home"
                                            ? homeId
                                            : awayId
                                        ].Players[p.Batsman]?.Name_Full
                                      }
                                    </div>
                                    <div className="py-4 text-left font-medium text-white whitespace-nowrap overflow-hidden text-ellipsis">
                                      {p.Howout}
                                    </div>
                                    <div className="py-4 text-center font-medium text-white">
                                      {p.Runs}
                                    </div>
                                    <div className="py-4 text-center font-medium text-white">
                                      {p.Balls}
                                    </div>
                                    <div className="py-4 text-center font-medium text-white">
                                      {p.Fours}
                                    </div>
                                    <div className="py-4 text-center font-medium text-white">
                                      {p.Sixes}
                                    </div>
                                    <div className="py-4 pr-[13px] text-center font-medium text-white">
                                      {p.Strikerate}
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Did Not Bat */}
                {didNotBat.length > 0 && (
                  <div className="bg-[#0F1A2D] mt-6 text-white  py-4 border rounded-lg border-gray-700 ">
                    <div className="uppercase text-2xl border-b-[2px] px-6  font-bold pb-3">
                      Did Not Bat
                    </div>
                    <ul className="text-sm px-6">
                      {didNotBat.map((p, i) => (
                        <li key={i} className="py-2">
                          {
                            teams[activeInnings === "home" ? homeId : awayId]
                              .Players[p.Batsman]?.Name_Full
                          }
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="sm:my-20 my-10 ">
          {fallOfWickets.length > 0 && (
            <div className="bg-[#E5EBFF] px-4 border-[#0A3C7E] border-[2px] rounded-lg pb-5">
              <div className="flex items-center">
                <Image
                  src={
                    activeInnings === "home"
                      ? `/images/scorecard/${homeTeamName}.svg`
                      : `/images/scorecard/${awayTeamName}.svg`
                  }
                  alt={activeInnings === "home" ? homeTeamName : awayTeamName}
                  width={100}
                  height={100}
                  className="my-5"
                />
                <h3 className="text-2xl font-semibold text-black uppercase">
                  Fall of Wickets
                </h3>
              </div>
              <div className="text-black">
                {fallOfWickets.map((wicket, index) => (
                  <span key={index}>
                    <span className="font-bold"> {wicket.Score}</span> (
                    {
                      teams[activeInnings === "home" ? homeId : awayId].Players[
                        wicket.Batsman
                      ]?.Name_Full
                    }
                    , {wicket.Overs} Overs),
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-full overflow-x-auto">
          <div className="w-full">
            {/* Bowling Stats */}
            <div className=" text-white rounded-lg mb-10 min-w-[1000px]">
              <div className="flex items-center bg-[url('/images/scorecard/bgcard.svg')] rounded-lg mb-6">
                <Image
                  src={
                    activeInnings === "home"
                      ? `/images/scorecard/${awayTeamName}.svg`
                      : `/images/scorecard/${homeTeamName}.svg`
                  }
                  alt={activeInnings === "home" ? homeTeamName : awayTeamName}
                  width={100}
                  height={100}
                  className="my-5"
                />
                <h3 className="text-xl font-semibold mb-4">
                  {oppositeTeamName}
                </h3>
              </div>
              {/* Bowling Table */}
              <div className="overflow-x-auto text-white mt-3 py-4">
                <div className="w-full overflow-auto">
                  <table className="w-full table-auto border-collapse text-sm relative min-w-[800px]">
                    {/* Top decorative border */}
                    <div
                      className="bg-[#001B31] w-[100%] border-r-[50px] top-3 border-[#F15A22] h-10 z-10 absolute"
                      style={{
                        clipPath: "polygon(0% 0%, 100% 0%, 98% 100%, 0% 100%)",
                      }}
                    />

                    {/* Custom styled header */}
                    <thead
                      className="bg-[#999FA4] m-1 italic z-50 relative mb-4 mr-2 custom-heading-border"
                      style={{
                        clipPath: "polygon(0% 0%, 100% 0%, 97% 100%, 0% 100%)",
                      }}
                    >
                      <tr>
                        <div className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] w-full">
                          <th
                            className="py-4 pl-[2rem] text-left text-2xl uppercase font-bold text-transparent bg-clip-text"
                            style={{
                              backgroundImage:
                                "linear-gradient(180deg, #666666 20.89%, #FFFFFF 48.4%, #666666 80.91%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          >
                            Bowling
                          </th>
                          <th
                            className="py-4 text-center font-bold text-2xl uppercase text-transparent bg-clip-text"
                            style={{
                              backgroundImage:
                                "linear-gradient(180deg, #666666 20.89%, #FFFFFF 48.4%, #666666 80.91%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          >
                            O
                          </th>
                          <th
                            className="py-4 text-center font-bold text-2xl uppercase text-transparent bg-clip-text"
                            style={{
                              backgroundImage:
                                "linear-gradient(180deg, #666666 20.89%, #FFFFFF 48.4%, #666666 80.91%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          >
                            M
                          </th>
                          <th
                            className="py-4 text-center font-bold text-2xl uppercase text-transparent bg-clip-text"
                            style={{
                              backgroundImage:
                                "linear-gradient(180deg, #666666 20.89%, #FFFFFF 48.4%, #666666 80.91%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          >
                            R
                          </th>
                          <th
                            className="py-4 text-center font-bold  text-2xl uppercase text-transparent bg-clip-text"
                            style={{
                              backgroundImage:
                                "linear-gradient(180deg, #666666 20.89%, #FFFFFF 48.4%, #666666 80.91%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          >
                            W
                          </th>
                          <th
                            className="py-4 text-center font-bold text-2xl uppercase text-transparent bg-clip-text"
                            style={{
                              backgroundImage:
                                "linear-gradient(180deg, #666666 20.89%, #FFFFFF 48.4%, #666666 80.91%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          >
                            NB
                          </th>
                          <th
                            className="py-4 text-center font-bold text-2xl uppercase text-transparent bg-clip-text"
                            style={{
                              backgroundImage:
                                "linear-gradient(180deg, #666666 20.89%, #FFFFFF 48.4%, #666666 80.91%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          >
                            WD
                          </th>
                          <th
                            className="py-4 pr-[13px] text-center text-2xl uppercase font-bold text-transparent bg-clip-text"
                            style={{
                              backgroundImage:
                                "linear-gradient(180deg, #666666 20.89%, #FFFFFF 48.4%, #666666 80.91%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          >
                            E/R
                          </th>
                        </div>
                      </tr>
                    </thead>

                    <tbody>
                      {(activeInnings === "home"
                        ? homeInnings
                        : awayInnings
                      ).Bowlers?.map((bowler, index) => (
                        <tr key={index} className="relative mt-6 mb-6">
                          {/* Background orange border div for data row */}
                          <td colSpan="8" className="relative p-0">
                            <div
                              className="bg-[#001B31] w-[100%] border-r-[50px] border-[#F15A22] top-3 h-10 z-10 absolute"
                              style={{
                                clipPath:
                                  "polygon(0% 0%, 100% 0%, 97.8% 100%, 0% 100%)",
                              }}
                            />

                            {/* Data row with same design as header */}
                            <div
                              className="bg-[#999FA4] my-1 italic z-50 relative custom-heading-border"
                              style={{
                                clipPath:
                                  "polygon(0% 0%, 100% 0%, 97% 100%, 0% 100%)",
                              }}
                            >
                              <div className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] w-full">
                                <div className="py-4 pl-[2rem] text-left font-medium text-white whitespace-nowrap overflow-hidden text-ellipsis">
                                  {
                                    teams[
                                      activeInnings === "home" ? awayId : homeId
                                    ].Players[bowler.Bowler]?.Name_Full
                                  }
                                </div>
                                <div className="py-4 text-center font-medium text-white">
                                  {bowler.Overs}
                                </div>
                                <div className="py-4 text-center font-medium text-white">
                                  {bowler.Maidens}
                                </div>
                                <div className="py-4 text-center font-medium text-white">
                                  {bowler.Runs}
                                </div>
                                <div className="py-4 text-center font-medium text-white">
                                  {bowler.Wickets}
                                </div>
                                <div className="py-4 text-center font-medium text-white">
                                  {bowler.Noballs}
                                </div>
                                <div className="py-4 text-center font-medium text-white">
                                  {bowler.Wides}
                                </div>
                                <div className="py-4 pr-[13px] text-center font-medium text-white">
                                  {bowler.Economyrate}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ScoreCard;
