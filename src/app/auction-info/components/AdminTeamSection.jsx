// components/AdminTeamSection.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { formatToIndianCurrencyWords2, teamGradients } from "@/utilis/helper";
// import {
//   formatToIndianCurrencyWords2,
//   teamGradients,
// } from "@/utils/helperFunctions";
// import { playerTeamLogo } from "@/assets";

const AdminTeamSection = ({ teamDetails, setStep, setSelectedTeamId }) => {
  return (
    <div className="w-full">
      <Link
        href="/"
        className="text-white text-lg flex items-center gap-2 mb-5"
      >
        Go Back
      </Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10  mx-auto">
        {[...teamDetails]
          .sort((a, b) => a.Name.localeCompare(b.Name))
          ?.map((team, i) => (
            <AdminTeamCard
              key={i}
              team={team}
              index={i}
              setStep={setStep}
              setSelectedTeamId={setSelectedTeamId}
            />
          ))}
      </div>
    </div>
  );
};

const AdminTeamCard = ({ team, index, setStep, setSelectedTeamId }) => {
  const players = team?.Player_Registrations__r?.records || [];
  const gradient = teamGradients[team?.Name] || { from: "#1e1e1e", to: "#444" };

  const getCategoryCount = (level) =>
    players.filter((p) => p.Recent_Competitive_Level__c === level).length;

  const totalPlayers = players.length;
  const remainingFundFormatted = formatToIndianCurrencyWords2(
    team?.Fund_Remaining__c
  );

  return (
    <div
      className={`relative rounded-xl p-4  min-h-[200px] text-center cursor-pointer`}
      style={{
        background: `linear-gradient(to bottom, ${gradient.from}, ${gradient.to})`,
      }}
      onClick={() => {
        setStep(2);
        // setSelectedTeamIndex(index);
        setSelectedTeamId(team.Id);
      }}
    >
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-[65px] h-[65px] rounded-full bg-white flex items-center justify-center p-3 z-10">
        <img
          src={
            team?.Name === "Aakash Tigers MWS"
              ? "https://turbostart.blob.core.windows.net/turbostart/48447191083078844-aakashTigers.png"
              : team?.Name === "MSC Maratha Royals"
              ? "https://mcadirectory.blob.core.windows.net/dev/4441894866960012-shivajiParkLions.png"
              : team?.Name === "Triumph Knights Mumbai North East"
              ? "https://mcadirectory.blob.core.windows.net/dev/007792959990218895-triumphKnights.png"
              : team?.Logo_URL__c || "/images/logo/playerTeamLogo.png"
          }
          alt="Team Logo"
          width={60}
          height={60}
          className="object-contain"
        />
      </div>
      <div className="mt-10">
        {/* <div className="text-white text-base font-medium mb-1">
          Fund remaining
        </div>
        <div className="text-white text-2xl font-bold mb-4">
          {remainingFundFormatted}
        </div> */}

        <div className="grid grid-cols-2 gap-2 mb-2">
          {[
            "Indian senior team",
            "First class, list A, BCCI Senior Men T20",
            "Mumbai age group team (under 23 or under 19)",
            "Local club team",
          ].map((level, idx) => (
            <div
              key={idx}
              className="bg-white/20 border border-white/30 rounded p-2"
            >
              <div className="text-sm font-bold text-white">
                {getCategoryCount(level)} /
                {level === "Indian senior team"
                  ? 1
                  : level === "First class, list A, BCCI Senior Men T20"
                  ? 4
                  : level === "Mumbai age group team (under 23 or under 19)"
                  ? 5
                  : 5}
              </div>
              <div className="text-sm text-white font-semibold capitalize">
                {level.includes("senior")
                  ? "Icon"
                  : level.includes("First class")
                  ? "Senior"
                  : level.includes("under")
                  ? "Emerging"
                  : "Development"}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/20 border border-white/30 rounded p-2">
          <div className="text-white font-bold text-base mb-1">
            {totalPlayers}/18
          </div>
          <div className="text-white font-semibold text-sm">Total Players</div>
        </div>
      </div>
    </div>
  );
};

export default AdminTeamSection;
