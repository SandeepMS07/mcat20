"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { teamGradients, teamSubtitles } from "@/utilis/helper";

const getTeamNameKey = (name = "") => name.replace(/\s*\(W\)\s*$/i, "").trim();

const resolveTeamHeader = (rawName = "") => {
  const key = getTeamNameKey(rawName);
  const mapped = teamSubtitles[key];
  if (mapped) return { name: mapped.name, subtitle: mapped.subtitle };
  return { name: rawName, subtitle: "" };
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

  if (!selectedTeam) {
    return null;
  }

  const selectedHeader = resolveTeamHeader(selectedTeam?.Name || "");

  return (
    <div className="w-full">
      {/* Top zone: team logo grid + selected team panel (royal blue) */}
      <div className="w-full bg-[#101b52] pt-40 sm:pt-36 md:pt-32 lg:pt-36 pb-6">
        {/* Logo grid (left) + selected team panel (right) */}
        <div className="px-2 sm:px-6 md:px-10 lg:px-14 xl:px-20 mx-auto">
          <div
            className="rounded-xl md:rounded-2xl bg-[#1b2f93] ring-1 ring-white/10 p-4 md:p-6 lg:p-7"
            style={{
              boxShadow:
                "0 12px 28px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-8 items-center">
              {/* Left: Men/Women toggle + 4x2 logo grid */}
              <div className="flex flex-col gap-3 md:gap-4">
                <div
                  role="tablist"
                  aria-label="Team type"
                  className="relative inline-grid grid-cols-2 w-[180px] md:w-[200px] rounded-full p-0.5 overflow-hidden self-start"
                  style={{
                    background:
                      "radial-gradient(73.95% 52.29% at 49.38% 41.83%, #ECD815 0%, #F58220 70%, #F15A22 100%)",
                  }}
                >
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute top-0.5 left-0.5 h-[calc(100%-4px)] w-[calc(50%-2px)] rounded-full bg-white shadow-md transition-transform duration-300 ease-out ${
                      activeTeamType === menTab
                        ? "translate-x-0"
                        : "translate-x-full"
                    }`}
                  />
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTeamType === menTab}
                    onClick={() => onTeamTypeChange?.(menTab)}
                    className={`relative z-10 py-1 text-xs md:text-sm font-extrabold italic tracking-wide uppercase transition-colors duration-300 ${
                      activeTeamType === menTab
                        ? "text-[#162362]"
                        : "text-white hover:text-white/90"
                    }`}
                  >
                    Men
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTeamType === womenTab}
                    onClick={() => onTeamTypeChange?.(womenTab)}
                    className={`relative z-10 py-1 text-xs md:text-sm font-extrabold italic tracking-wide uppercase transition-colors duration-300 ${
                      activeTeamType === womenTab
                        ? "text-[#162362]"
                        : "text-white hover:text-white/90"
                    }`}
                  >
                    Women
                  </button>
                </div>

                <ul className="grid grid-cols-4 grid-rows-2 gap-3 md:gap-4">
                  {data.map((team, index) => {
                    const isActive = index === selectedTeamIndex;
                    const normalizedTeamName = getTeamNameKey(team?.Name);
                    const gradient = teamGradients[normalizedTeamName];
                    const gradientStyle = gradient
                      ? {
                          backgroundImage: `linear-gradient(to bottom, ${gradient.from}, ${gradient.to})`,
                        }
                      : {};

                    return (
                      <li key={team?.Id || index}>
                        <button
                          type="button"
                          onClick={() => handleLogoClick(index)}
                          aria-pressed={isActive}
                          aria-label={team?.Name}
                          className={`group relative block w-full aspect-[6/5] rounded-lg overflow-hidden border-0 transition-all duration-300 ${
                            isActive
                              ? "shadow-[0_8px_20px_rgba(0,0,0,0.45)] ring-2 ring-white/90"
                              : "hover:ring-1 hover:ring-white/35"
                          }`}
                          style={gradientStyle}
                        >
                          <Image
                            src="/images/elements/teamCardRoundElement.png"
                            width={200}
                            height={140}
                            alt=""
                            aria-hidden
                            className="absolute inset-0 w-full h-full opacity-60 pointer-events-none"
                          />
                          <Image
                            src="/images/elements/teamCardElement.png"
                            width={200}
                            height={140}
                            alt=""
                            aria-hidden
                            className="absolute inset-0 w-full h-full pointer-events-none"
                          />
                          <span className="relative z-10 flex h-full w-full items-center justify-center p-2 md:p-3">
                            <img
                              src={team.Logo_URL__c}
                              alt=""
                              className="max-h-[82%] max-w-[82%] object-contain"
                            />
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Divider (desktop only) */}
              <div className="hidden lg:block w-px h-40 bg-white/20 justify-self-center" />

              {/* Right: selected team logo + name */}
              <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-5 sm:gap-6 lg:gap-8 xl:gap-10 px-2">
                <div className="flex items-center justify-center w-[160px] h-[120px] md:w-[180px] md:h-[135px] lg:w-[200px] lg:h-[150px] xl:w-[240px] xl:h-[180px] shrink-0">
                  <img
                    src={selectedTeam?.Logo_URL__c}
                    alt={`${selectedHeader.name} logo`}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="text-white min-w-0">
                  <h2 className="text-2xl md:text-[26px] lg:text-[28px] xl:text-4xl 2xl:text-5xl font-bold leading-[1.1] break-words">
                    {selectedHeader.name}
                  </h2>
                  {selectedHeader.subtitle ? (
                    <p className="mt-1.5 text-base md:text-[15px] lg:text-base xl:text-lg 2xl:text-2xl font-semibold text-white/90 leading-[1.2] break-words">
                      {selectedHeader.subtitle}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamSection;
