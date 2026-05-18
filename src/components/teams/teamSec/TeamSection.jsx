"use client";

import React, { useEffect, useState, useCallback } from "react";
import { teamGradients, teamSubtitles } from "@/utilis/helper";

const getTeamNameKey = (name = "") => name.replace(/\s*\(W\)\s*$/i, "").trim();

const resolveTeamHeader = (rawName = "") => {
  const key = getTeamNameKey(rawName);
  const mapped = teamSubtitles[key];
  if (mapped) return { name: mapped.name, subtitle: mapped.subtitle };
  return { name: rawName, subtitle: "" };
};

const Toggle = ({ activeTeamType, onTeamTypeChange, menTab, womenTab }) => (
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
      className={`group relative block aspect-[3/2] w-full cursor-pointer overflow-hidden rounded-lg transition-all duration-300 ${
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

const SelectedTeamInline = ({ team, header }) => {
  return (
    <div className="relative flex items-center gap-4 px-1 py-2 sm:gap-5 sm:px-2 lg:border-l lg:border-white/10 lg:pl-6 lg:pt-10">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] p-2 backdrop-blur-sm sm:h-24 sm:w-24 md:h-28 md:w-28">
        <img
          src={team?.Logo_URL__c}
          alt={`${header.name} logo`}
          className="max-h-full max-w-full object-contain drop-shadow-lg"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="text-lg font-extrabold uppercase italic leading-tight text-white sm:text-xl md:text-2xl">
          {header.name}
        </h2>
        {header.subtitle && (
          <p className="mt-1 text-xs font-medium text-white/70 sm:text-sm">
            {header.subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

const TeamSection = ({
  data,
  onTeamSelect,
  TeamIndex = 0,
  activeTeamType = "men",
  onTeamTypeChange,
  menTab = "men",
  womenTab = "women",
}) => {
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

  const selectedHeader = resolveTeamHeader(selectedTeam?.Name || "");

  return (
    <div className="w-full">
      <div className="w-full bg-[#101b52] pt-32 pb-4 sm:pt-36 md:pt-40 lg:pt-44">
        <div className="px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20">
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0c1850]/60 p-3 sm:p-4 lg:p-5">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background:
                  "radial-gradient(50% 70% at 85% 15%, rgba(242,162,58,0.18), transparent 60%), radial-gradient(50% 70% at 5% 100%, rgba(28,57,142,0.4), transparent 60%)",
              }}
            />
            <div className="relative z-20 mb-3 flex justify-end lg:absolute lg:right-5 lg:top-5 lg:mb-0">
              <Toggle
                activeTeamType={activeTeamType}
                onTeamTypeChange={onTeamTypeChange}
                menTab={menTab}
                womenTab={womenTab}
              />
            </div>
            <div className="relative grid gap-4 lg:grid-cols-[6fr_4fr] lg:items-center lg:gap-6">
              <ul className="grid grid-cols-4 gap-2 sm:gap-3">
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
              <SelectedTeamInline team={selectedTeam} header={selectedHeader} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamSection;
