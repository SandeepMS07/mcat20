"use client";

import React, { useEffect, useState, useCallback } from "react";
import { teamGradients } from "@/utilis/helper";

const getTeamNameKey = (name = "") => name.replace(/\s*\(W\)\s*$/i, "").trim();

export const TeamTypeToggle = ({
  activeTeamType,
  onTeamTypeChange,
  menTab,
  womenTab,
}) => (
  <div
    role="tablist"
    aria-label="Team type"
    className="relative inline-grid w-[160px] grid-cols-2 overflow-hidden rounded-full border border-white/15 bg-black/20 p-0.5 backdrop-blur-sm"
  >
    <span
      aria-hidden
      className={`pointer-events-none absolute top-0.5 left-0.5 h-[calc(100%-4px)] w-[calc(50%-2px)] rounded-full bg-[#F2A23A] shadow-[0_2px_10px_rgba(242,162,58,0.45)] transition-transform duration-300 ease-out ${
        activeTeamType === menTab ? "translate-x-0" : "translate-x-full"
      }`}
    />
    <button
      type="button"
      role="tab"
      aria-selected={activeTeamType === menTab}
      onClick={() => onTeamTypeChange?.(menTab)}
      className={`relative z-10 cursor-pointer py-1 text-[11px] font-bold uppercase tracking-wider transition-colors duration-300 ${
        activeTeamType === menTab ? "text-[#02103D]" : "text-white/75"
      }`}
    >
      Men
    </button>
    <button
      type="button"
      role="tab"
      aria-selected={activeTeamType === womenTab}
      onClick={() => onTeamTypeChange?.(womenTab)}
      className={`relative z-10 cursor-pointer py-1 text-[11px] font-bold uppercase tracking-wider transition-colors duration-300 ${
        activeTeamType === womenTab ? "text-[#02103D]" : "text-white/75"
      }`}
    >
      Women
    </button>
  </div>
);

const TeamCard = ({ team, isActive, onClick }) => {
  const normalized = getTeamNameKey(team?.Name);
  const gradient = teamGradients[normalized];
  const gradientStyle = gradient
    ? {
        backgroundImage: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
      }
    : { backgroundColor: "#1b2f93" };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={team?.Name}
      className={`group relative block aspect-square w-20 sm:w-24 md:w-28 lg:w-32 cursor-pointer overflow-hidden rounded-xl transition-all duration-300 ${
        isActive
          ? "scale-[1.04] ring-2 ring-[#F2A23A] shadow-[0_8px_20px_rgba(0,0,0,0.4)]"
          : "ring-1 ring-white/10 hover:ring-white/30 hover:-translate-y-0.5"
      }`}
      style={gradientStyle}
    >
      <span
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_55%)]"
      />
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"
      />
      <span className="relative z-10 flex h-full w-full items-center justify-center p-1.5 sm:p-2">
        <img
          src={team.Logo_URL__c}
          alt=""
          className="max-h-[72%] max-w-[72%] object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.45)] transition-transform duration-300 group-hover:scale-105"
        />
      </span>
    </button>
  );
};

const TeamSection = ({ data, onTeamSelect, TeamIndex = 0 }) => {
  const [selectedTeamIndex, setSelectedTeamIndex] = useState(TeamIndex);

  useEffect(() => {
    setSelectedTeamIndex(TeamIndex);
  }, [TeamIndex]);

  const handleLogoClick = useCallback(
    (index) => {
      setSelectedTeamIndex(index);
      onTeamSelect?.(index);
    },
    [onTeamSelect],
  );

  const selectedTeam = data?.[selectedTeamIndex];
  if (!selectedTeam) return null;

  return (
    <div className="w-full">
      <div className="w-full bg-[#101b52] pt-6 pb-6 sm:pt-8 sm:pb-8">
        <div className="px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20">
          <ul className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {data.map((team, index) => (
              <li key={team?.Id || index}>
                <TeamCard
                  team={team}
                  isActive={index === selectedTeamIndex}
                  onClick={() => handleLogoClick(index)}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TeamSection;
