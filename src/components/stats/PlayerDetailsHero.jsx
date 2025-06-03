"use client";
import Image from "next/image";
import React from "react";

const PlayerDetailsHero = ({ player, selectedTab }) => {
  const getPlayerStats = () => {
    if (selectedTab === "batting") {
      return [
        { label: "Runs", value: player.runs },
        { label: "Matches", value: player.mat },
        { label: "Average", value: player.ave },
        { label: "Strike Rate", value: player.sr },
        { label: "H.S. Score", value: player.hs ?? "" },
      ];
    } else if (selectedTab === "bowling") {
      return [
        { label: "Wickets", value: player.wkts },
        { label: "Matches", value: player.mat },
        { label: "Economy", value: player.econ },
        { label: "Average", value: player.avg },
        { label: "Best", value: player.bbi ?? "" },
      ];
    } else {
      return [
        { label: "Dismissals", value: player.dismissals },
        { label: "Matches", value: player.mat },
        { label: "Catches", value: player.catches },
        { label: "Run Outs", value: player.runOuts },
        { label: "Stumpings", value: player.stumpings },
      ];
    }
  };

  const stats = getPlayerStats();

  return (
    <div className="relative w-full h-[28rem] bg-[url('/images/stats/statsBg.png')] bg-no-repeat bg-center bg-cover flex justify-start items-end overflow-hidden">
      {/* Heading */}
      <div className="text-white w-full flex justify-start items-center px-20 md:px-60 py-20  ">
        <p className="text-5xl font-extrabold leading-snug uppercase">Stats</p>
      </div>

      {/* Background Position Number */}
      {/* <div className="absolute left-[20%] bottom-0 z-0 flex items-start leading-none">
        <span className="text-[120px] font-extrabold italic text-[#3188b1] opacity-70">
          #
        </span>
        <span className="text-[350px] h-full flex justify-end items-end font-extrabold italic text-[#3188b1] opacity-70">
          {player.pos}
        </span>
      </div> */}

      {/* Player Image */}
      {/* <div className="absolute left-[27%] bottom-0 z-10">
        <Image
          src={player.playerImg || "/images/stats/player-img.svg"}
          width={300}
          height={300}
          alt={player.player}
          className="object-contain"
        />
      </div> */}

      {/* Player Details and Stats */}
      <div className="relative z-20 ml-[20rem] mb-6 text-white">
        {/* <h1 className="text-5xl font-bold mb-2">{player.player}</h1> */}
        {/* <div className="flex items-center gap-3 mb-8">
          {player.teamLogo && (
            <Image
              src={player.teamLogo}
              width={24}
              height={24}
              alt={player.team}
            />
          )}
          <p className="text-xl">{player.team}</p>
        </div> */}
        {/* 
        <div className="flex flex-wrap rounded-lg overflow-hidden border border-gray-700 divide-x divide-gray-600 bg-black bg-opacity-60">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="py-3 px-6 min-w-[6rem] flex flex-col items-center justify-center"
            >
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-gray-300">{stat.label}</p>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default PlayerDetailsHero;
