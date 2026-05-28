"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getTeamDetailsClient } from "@/app/api/clientApi";
import { teamGradients, teamSubtitles } from "@/utilis/helper";
import routes from "@/utilis/route";
import teamDetailsDataSeason4 from "../../constant/team/teamDetailsDataSeason4.json";

const MEN_TAB = "men";
const WOMEN_TAB = "women";
const FALLBACK_TEAMS = teamDetailsDataSeason4?.data || [];
const WOMENS_TEAM_FALLBACK_NAMES = ["Aakash Tigers MWS", "SoBo Mumbai Falcons"];

const getTeamNameKey = (name = "") => name.replace(/\s*\(W\)\s*$/i, "").trim();

const getTeamBucket = (teamType = "") =>
  `${teamType}`.toLowerCase().includes("women") ? WOMEN_TAB : MEN_TAB;

const getFilteredTeams = (teams, bucket) =>
  [...(teams || [])]
    .filter((team) => getTeamBucket(team?.Team_Type__c) === bucket)
    .sort((a, b) => (a?.Name || "").localeCompare(b?.Name || ""));

const resolveTeamHeader = (rawName = "") => {
  const key = getTeamNameKey(rawName);
  const mapped = teamSubtitles[key];
  if (mapped) return { name: mapped.name, subtitle: mapped.subtitle };
  return { name: rawName, subtitle: "" };
};

const TeamLogoCard = ({ team, onClick }) => {
  const normalized = getTeamNameKey(team?.Name);
  const gradient = teamGradients[normalized];
  const header = resolveTeamHeader(team?.Name || "");

  const gradientStyle = gradient
    ? {
        backgroundImage: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
      }
    : { backgroundColor: "#1b2f93" };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={header.name}
      className="group relative aspect-[5/4] w-full cursor-pointer overflow-hidden rounded-xl ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1 hover:ring-2 hover:ring-[#F2A23A] hover:shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
      style={gradientStyle}
    >
      <span
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.22),transparent_55%)]"
      />
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/55"
      />
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex min-h-0 flex-1 items-center justify-center px-3 pt-3 sm:px-4 sm:pt-4">
          <img
            src={team?.Logo_URL__c}
            alt=""
            className="max-h-full max-w-[70%] object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="px-2 pb-2 pt-1 text-center sm:px-3 sm:pb-3">
          <p className="line-clamp-1 text-[11px] font-bold uppercase tracking-wide text-white sm:text-sm md:text-base">
            {header.name}
          </p>
        </div>
      </div>
    </button>
  );
};

const SectionHeading = ({ eyebrow, line1, line2, variant = "dark" }) => {
  const isLight = variant === "light";
  const solidColorClass = isLight ? "text-[#02103D]" : "text-white";
  const strokeColor = isLight ? "#02103D" : "#ffffff";
  return (
    <div>
      <span className="mb-2 inline-block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F2A23A]">
        {eyebrow}
      </span>
      <h2
        className={`flex flex-col text-3xl font-extrabold uppercase italic leading-[0.95] sm:text-4xl lg:text-5xl ${solidColorClass}`}
      >
        <span
          className="text-transparent"
          style={{ WebkitTextStroke: `1.5px ${strokeColor}` }}
        >
          {line1}
        </span>
        <span>{line2}</span>
      </h2>
    </div>
  );
};

const normalizeWomenName = (name = "") =>
  name.replace(/\s*\(w\)\s*$/i, "").trim().toLowerCase();

const HomeTeamSection = () => {
  const router = useRouter();
  const [allTeams, setAllTeams] = useState(FALLBACK_TEAMS);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const response = await getTeamDetailsClient();
      if (cancelled) return;
      const records = response?.data || [];
      if (Array.isArray(records) && records.length > 0) {
        setAllTeams(records);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const mensTeams = useMemo(
    () => getFilteredTeams(allTeams, MEN_TAB),
    [allTeams],
  );

  const womensTeams = useMemo(() => {
    const apiWomensTeams = getFilteredTeams(allTeams, WOMEN_TAB);
    const fallbackWomensTeams = WOMENS_TEAM_FALLBACK_NAMES.map((teamName) =>
      allTeams.find(
        (team) =>
          normalizeWomenName(team?.Name) === normalizeWomenName(teamName),
      ),
    ).filter(Boolean);

    const baseWomensTeams =
      apiWomensTeams.length > 0 ? apiWomensTeams : fallbackWomensTeams;

    const dedupedByName = new Map();
    for (const team of baseWomensTeams) {
      const key = normalizeWomenName(team?.Name);
      if (!dedupedByName.has(key)) {
        dedupedByName.set(key, team);
      }
    }

    return [...dedupedByName.values()].sort((a, b) =>
      (a?.Name || "").localeCompare(b?.Name || ""),
    );
  }, [allTeams]);

  const handleTeamClick = (team, teamType) => {
    const params = new URLSearchParams();
    if (team?.Name) params.set("team", team.Name);
    params.set("type", teamType);
    router.push(`${routes.teams}?${params.toString()}`);
  };

  const handleViewAll = (teamType) => {
    router.push(`${routes.teams}?type=${teamType}`);
  };

  return (
    <>
      {mensTeams.length > 0 && (
        <section className="relative overflow-x-hidden bg-white pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-20 lg:pb-24">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-[#F2A23A]/10 blur-3xl"
          />
          <div className="section-width relative px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
              <SectionHeading
                eyebrow="The Squads"
                line1="Men's"
                line2="Teams"
                variant="light"
              />
              <button
                type="button"
                onClick={() => handleViewAll(MEN_TAB)}
                className="inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-b from-[#d84800] to-[#f68323] px-6 text-xs font-medium uppercase italic tracking-wide text-white shadow-[0_4px_18px_rgba(216,72,0,0.3)] transition-opacity hover:opacity-90 sm:text-sm"
              >
                View all
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
              {mensTeams.map((team, index) => (
                <TeamLogoCard
                  key={team?.Id || `men-${index}`}
                  team={team}
                  onClick={() => handleTeamClick(team, MEN_TAB)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {womensTeams.length > 0 && (
        <section className="relative overflow-x-hidden bg-[#101b52] pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-20 lg:pb-24">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-[#F2A23A]/10 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[#1C398E]/40 blur-3xl"
          />
          <div className="section-width relative px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
              <SectionHeading
                eyebrow="The Squads"
                line1="Women's"
                line2="Teams"
              />
              <button
                type="button"
                onClick={() => handleViewAll(WOMEN_TAB)}
                className="inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-b from-[#d84800] to-[#f68323] px-6 text-xs font-medium uppercase italic tracking-wide text-white shadow-[0_4px_18px_rgba(216,72,0,0.3)] transition-opacity hover:opacity-90 sm:text-sm"
              >
                View all
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
              {womensTeams.map((team, index) => (
                <TeamLogoCard
                  key={team?.Id || `women-${index}`}
                  team={team}
                  onClick={() => handleTeamClick(team, WOMEN_TAB)}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default HomeTeamSection;
