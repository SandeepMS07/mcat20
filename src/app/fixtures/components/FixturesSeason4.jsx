"use client";

import React, { useCallback, useMemo, useState } from "react";
import fixtures4 from "@/utilis/fixtures/fixtures4.js";

const MEN_TAB = "men";
const WOMEN_TAB = "women";

const PLACEHOLDER_LOGO = "/images/fixtures/logoPlaceHolder.png";

const TEAM_LOGOS = [
  {
    Name: "Aakash Tigers MWS",
    Logo_URL__c:
      "https://storage.googleapis.com/mca-bucket-gcp/Dev%2F1778842478566-ezfc2ljp90o-akash-tigers.png",
  },
  {
    Name: "Arcs Andheri",
    Logo_URL__c:
      "https://storage.googleapis.com/mca-bucket-gcp/Dev%2F1778842569141-45uzrai3pcd-arcs-andheri.png",
  },
  {
    Name: "Bandra Blasters",
    Logo_URL__c:
      "https://storage.googleapis.com/mca-bucket-gcp/Dev%2F1778842716680-g3173uqh5ht-bandra-blasters.png",
  },
  {
    Name: "Eagle Thane Strikers",
    Logo_URL__c:
      "https://storage.googleapis.com/mca-bucket-gcp/Dev%2F1778842606667-rsb03v6i3ti-eagle-thane-strikers.png",
  },
  {
    Name: "MSC Maratha Royals",
    Logo_URL__c:
      "https://storage.googleapis.com/mca-bucket-gcp/Dev%2F1778842937458-mm7skn7fp9-maratha-royals.png",
  },
  {
    Name: "North Mumbai Panthers",
    Logo_URL__c:
      "https://storage.googleapis.com/mca-bucket-gcp/Dev%2F1778842431724-z2fgjqs7dcf-mumbai-panthers.png",
  },
  {
    Name: "SoBo Mumbai Falcons",
    Logo_URL__c:
      "https://storage.googleapis.com/mca-bucket-gcp/Dev%2F1778842647889-jnbsdkw5go9-sobo-mumbai-falcons.png",
  },
  {
    Name: "Triumph Knights Mumbai North East",
    Logo_URL__c:
      "https://storage.googleapis.com/mca-bucket-gcp/Dev%2F1778842830696-oq3rgu179n-triumph-knights.png",
  },
  {
    Name: "Aakash Tigers MWS (W)",
    Logo_URL__c:
      "https://storage.googleapis.com/mca-bucket-gcp/Dev%2F1778842478566-ezfc2ljp90o-akash-tigers.png",
  },
  {
    Name: "SoBo Mumbai Falcons (W)",
    Logo_URL__c:
      "https://storage.googleapis.com/mca-bucket-gcp/Dev%2F1778842647889-jnbsdkw5go9-sobo-mumbai-falcons.png",
  },
  {
    Name: "Thane Skyrisers (W)",
    Logo_URL__c:
      "https://storage.googleapis.com/mca-bucket-gcp/Dev%2F1778842743856-v9mzpsye2s-Thane-Skyrises.png",
  },
];

const TEAM_LOGO_MAP = TEAM_LOGOS.reduce((acc, t) => {
  acc[t.Name] = t.Logo_URL__c;
  return acc;
}, {});

// Map fixtures4.js team names to canonical names in TEAM_LOGO_MAP
const LOGO_ALIASES = {
  "Sobo Mumbai Falcons": "SoBo Mumbai Falcons",
  "Triumph Knights MNE": "Triumph Knights Mumbai North East",
  "Maratha Royals": "MSC Maratha Royals",
};

const WOMEN_NAME_TO_LOGO_KEY = {
  "Aakash Tigers": "Aakash Tigers MWS (W)",
  "Sobo Mumbai Falcons": "SoBo Mumbai Falcons (W)",
  "Thane Sky Risers": "Thane Skyrisers (W)",
};

const isWomen = (category) => `${category}`.toLowerCase() === "women";

const resolveLogo = (name, category) => {
  if (!name) return PLACEHOLDER_LOGO;
  if (isWomen(category)) {
    const womenKey = WOMEN_NAME_TO_LOGO_KEY[name];
    if (womenKey && TEAM_LOGO_MAP[womenKey]) return TEAM_LOGO_MAP[womenKey];
  }
  return (
    TEAM_LOGO_MAP[name] ||
    TEAM_LOGO_MAP[LOGO_ALIASES[name]] ||
    PLACEHOLDER_LOGO
  );
};

const DATE_FORMAT_OPTIONS = {
  day: "2-digit",
  month: "short",
  year: "numeric",
};

const formatDate = (isoDate) =>
  new Date(`${isoDate}T00:00:00`).toLocaleDateString("en-GB", DATE_FORMAT_OPTIONS);

const formatVenueBadge = (venue) =>
  (venue || "")
    .toLowerCase()
    .replace(/mumbai/i, "")
    .replace(/,/g, "")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const getBucketForCategory = (category) =>
  isWomen(category) ? WOMEN_TAB : MEN_TAB;

const ALL_MATCHES = Array.isArray(fixtures4?.matches) ? fixtures4.matches : [];

const TOGGLE_GRADIENT_STYLE = {
  background:
    "radial-gradient(73.95% 52.29% at 49.38% 41.83%, #ECD815 0%, #F58220 70%, #F15A22 100%)",
};

const HEADER_BADGE_STYLE = {
  clipPath: "polygon(20% 0%,100% 0%,100% 100%,0% 100%)",
};

const matchKey = (m, idx) => {
  if (m.type === "match") return `match-${m.match_no}-${m.date}-${m.time}`;
  if (m.type === "playoff") return `playoff-${m.label}-${m.date}`;
  if (m.type === "reserve") return `reserve-${m.date}`;
  return `row-${idx}`;
};

const FixturesSeason4 = ({ selectedTeam = "" }) => {
  const [activeTab, setActiveTab] = useState(MEN_TAB);

  const selectMen = useCallback(() => setActiveTab(MEN_TAB), []);
  const selectWomen = useCallback(() => setActiveTab(WOMEN_TAB), []);

  const matchesForTab = useMemo(
    () =>
      ALL_MATCHES.filter((m) => {
        if (m.type === "reserve") return activeTab === MEN_TAB;
        return getBucketForCategory(m.category) === activeTab;
      }),
    [activeTab]
  );

  const filteredMatches = useMemo(() => {
    if (!selectedTeam || selectedTeam === "All Teams") return matchesForTab;
    return matchesForTab.filter(
      (m) =>
        m.type === "match" &&
        (m.home_team === selectedTeam || m.away_team === selectedTeam)
    );
  }, [matchesForTab, selectedTeam]);

  return (
    <div className="md:py-8 bg-white flex flex-col gap-6 py-8">
      {/* MEN / WOMEN toggle */}
      <div className="w-full flex justify-start">
        <div
          className="relative grid grid-cols-2 w-[220px] md:w-[240px] rounded-[43.5px] p-1 overflow-hidden"
          style={TOGGLE_GRADIENT_STYLE}
        >
          <span
            className={`pointer-events-none absolute top-1 left-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-[43.5px] bg-white transition-transform duration-300 ease-out ${
              activeTab === MEN_TAB ? "translate-x-0" : "translate-x-full"
            }`}
          />
          <button
            type="button"
            onClick={selectMen}
            aria-pressed={activeTab === MEN_TAB}
            className={`relative z-10 px-3 md:px-4 py-2 text-sm md:text-base font-bold leading-none transition-colors duration-300 ${
              activeTab === MEN_TAB
                ? "text-[#243874]"
                : "text-white hover:text-white/90"
            }`}
          >
            MEN
          </button>
          <button
            type="button"
            onClick={selectWomen}
            aria-pressed={activeTab === WOMEN_TAB}
            className={`relative z-10 px-3 md:px-4 py-2 text-sm md:text-base font-bold leading-none transition-colors duration-300 ${
              activeTab === WOMEN_TAB
                ? "text-[#243874]"
                : "text-white hover:text-white/90"
            }`}
          >
            WOMEN
          </button>
        </div>
      </div>

      {filteredMatches.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          No matches scheduled for this category.
        </div>
      )}

      {filteredMatches.map((match, idx) => {
        const key = matchKey(match, idx);

        if (match.type === "reserve") {
          return (
            <div
              key={key}
              className="rounded-md border overflow-hidden text-black"
            >
              <div className="relative bg-[#001B31] text-white text-sm md:text-base lg:text-lg font-semibold px-4 py-2 flex justify-between items-center">
                <span>{match.label}</span>
                <div
                  className="absolute top-0 right-0 h-full w-[200px] md:w-[250px] bg-gradient-to-r from-[#203376] via-black to-black flex items-center justify-center text-xs md:text-sm lg:text-base font-bold"
                  style={HEADER_BADGE_STYLE}
                >
                  {match.day}
                </div>
              </div>
              <div className="flex flex-col lg:flex-row w-full">
                <div className="lg:w-[calc(100%-250px)] flex items-center justify-center p-6">
                  <div className="text-center">
                    <p className="text-xl md:text-2xl font-bold uppercase text-[#E07E27]">
                      Reserve Day
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      No matches scheduled
                    </p>
                  </div>
                </div>
                <div className="bg-[#F5F5F5] flex lg:flex-col items-center md:items-start text-left lg:px-12 lg:py-8 sm:p-6 p-4 lg:w-[250px] lg:justify-start justify-between">
                  <div className="flex lg:flex-col justify-between w-full">
                    <div>
                      <p className="text-xs sm:text-base font-bold text-[#E07E27]">
                        MATCH INFO
                      </p>
                      <p className="lg:hidden block">{formatDate(match.date)}</p>
                    </div>
                    <div className="text-base font-semibold leading-tight mb-1 lg:pt-2">
                      <div className="lg:block hidden">
                        <p>{formatDate(match.date)}</p>
                        <p className="text-sm text-gray-600">{match.day}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        const isPlayoff = match.type === "playoff";
        const team1Name = isPlayoff ? match.label || "TBD" : match.home_team;
        const team2Name = isPlayoff ? "TBD" : match.away_team;
        const teamLogo1 = isPlayoff
          ? PLACEHOLDER_LOGO
          : resolveLogo(team1Name, match.category);
        const teamLogo2 = isPlayoff
          ? PLACEHOLDER_LOGO
          : resolveLogo(team2Name, match.category);
        const headerLeft = isPlayoff ? match.label : `Match ${match.match_no}`;

        return (
          <div
            key={key}
            className="rounded-md border overflow-hidden text-black"
          >
            <div className="relative bg-[#001B31] text-white text-sm md:text-base lg:text-lg font-semibold px-4 py-2 flex justify-between items-center">
              <span>{headerLeft}</span>
              <div
                className="absolute top-0 right-0 h-full w-[200px] md:w-[250px] bg-gradient-to-r from-[#203376] via-black to-black flex items-center justify-center text-xs md:text-sm lg:text-base font-bold"
                style={HEADER_BADGE_STYLE}
              >
                {formatVenueBadge(match.venue)}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row w-full">
              <div className="lg:w-[calc(100%-250px)] flex flex-row items-center justify-between p-3">
                <div className="flex max-md:flex-1 lg:flex-row flex-col lg:justify-between justify-center items-center gap-3 md:w-[35%]">
                  <img
                    src={teamLogo1}
                    alt={`${team1Name} logo`}
                    width={50}
                    height={60}
                    loading="lazy"
                    decoding="async"
                    className="object-contain md:h-28 md:w-28 h-16 w-16"
                  />
                  <div className="text-[10px] lg:text-left text-center sm:text-base font-semibold uppercase">
                    {team1Name}
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center">
                  <div className="text-base sm:text-2xl font-semibold">vs</div>
                  {match.status && (
                    <div className="text-xs text-gray-600 mt-1">
                      {match.status}
                    </div>
                  )}
                </div>

                <div className="flex max-md:flex-1 lg:flex-row flex-col lg:justify-between justify-center items-center gap-3 w-full md:w-[40%]">
                  <img
                    src={teamLogo2}
                    alt={`${team2Name} logo`}
                    width={50}
                    height={60}
                    loading="lazy"
                    decoding="async"
                    className="object-contain md:h-28 h-16 w-16 md:w-28"
                  />
                  <div className="text-[10px] sm:text-base lg:text-left text-center font-semibold uppercase">
                    {team2Name}
                  </div>
                </div>
              </div>

              <div className="bg-[#F5F5F5] flex lg:flex-col items-center md:items-start text-left lg:px-12 lg:py-8 sm:p-6 p-4 lg:w-[250px] lg:justify-start justify-between">
                <div className="flex lg:flex-col justify-between w-full">
                  <div>
                    <p className="text-xs sm:text-base font-bold text-[#E07E27]">
                      MATCH INFO
                    </p>
                    <p className="lg:hidden block">
                      {formatDate(match.date)}
                      {match.time ? ` • ${match.time}` : ""}
                    </p>
                  </div>
                  <div className="text-base font-semibold leading-tight mb-1 lg:pt-2 flex lg:flex-col flex-row gap-2">
                    <div className="lg:block hidden">
                      <p>{formatDate(match.date)}</p>
                      <p className="text-sm text-gray-600">{match.day}</p>
                      {match.time && (
                        <p className="text-sm text-gray-600">{match.time}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(FixturesSeason4);
