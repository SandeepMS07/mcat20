"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { teamGradients } from "@/utilis/helper";

const getTeamNameKey = (name = "") => name.replace(/\s*\(W\)\s*$/i, "").trim();

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
    [onTeamSelect]
  );

  const selectedTeam = data?.[selectedTeamIndex];

  if (!selectedTeam) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Top zone: toggle + team logo strip (royal blue) */}
      <div className="w-full bg-[#101b52] pt-28 md:pt-32 lg:pt-36 pb-6">
        <div className="section-width">
          {/* MEN / WOMEN toggle */}
          <div className="flex justify-center">
            <div
              role="tablist"
              aria-label="Team type"
              className="relative grid grid-cols-2 w-[260px] md:w-[300px] rounded-full p-1 overflow-hidden"
              style={{
                background:
                  "radial-gradient(73.95% 52.29% at 49.38% 41.83%, #ECD815 0%, #F58220 70%, #F15A22 100%)",
              }}
            >
              <span
                aria-hidden
                className={`pointer-events-none absolute top-1 left-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-full bg-white shadow-md transition-transform duration-300 ease-out ${
                  activeTeamType === menTab ? "translate-x-0" : "translate-x-full"
                }`}
              />
              <button
                type="button"
                role="tab"
                aria-selected={activeTeamType === menTab}
                onClick={() => onTeamTypeChange?.(menTab)}
                className={`relative z-10 py-1 md:py-1.5 text-sm md:text-base font-extrabold italic tracking-wide uppercase transition-colors duration-300 ${
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
                className={`relative z-10 py-1 md:py-1.5 text-sm md:text-base font-extrabold italic tracking-wide uppercase transition-colors duration-300 ${
                  activeTeamType === womenTab
                    ? "text-[#162362]"
                    : "text-white hover:text-white/90"
                }`}
              >
                Women
              </button>
            </div>
          </div>
        </div>

        {/* Team logo strip — extra width, breaks out of section-width */}
        <div className="mt-10 md:mt-14 px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20">
          <div
            className="rounded-2xl bg-[#1b2f93] ring-1 ring-white/10 p-4 md:p-6 lg:p-7"
            style={{
              boxShadow:
                "0 12px 28px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
            }}
          >
            <ul className="flex gap-3 md:gap-4 overflow-x-auto md:overflow-visible scrollbar-hide snap-x snap-mandatory">
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
                <li
                  key={team?.Id || index}
                  className="snap-start shrink-0 basis-[128px] md:shrink md:grow md:basis-0 md:min-w-0"
                >
                  <button
                    type="button"
                    onClick={() => handleLogoClick(index)}
                    aria-pressed={isActive}
                    aria-label={team?.Name}
                    className={`group relative block w-full aspect-[4/3] md:aspect-[6/5] rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      isActive
                        ? "border-white shadow-[0_8px_20px_rgba(0,0,0,0.45)] scale-[1.03]"
                        : "border-transparent hover:border-white/40"
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
                    <span className="relative z-10 flex h-full w-full items-center justify-center p-3 md:p-4">
                      <img
                        src={team.Logo_URL__c}
                        alt=""
                        className="max-h-[85%] max-w-[85%] object-contain"
                      />
                    </span>
                  </button>
                </li>
              );
            })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamSection;
