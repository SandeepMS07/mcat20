import React from "react";
import "./style.css";
import PlayerCard from "./PlayerCard";
import { resolvePlayerPhotoOverride } from "@/utilis/playerPhotoOverrides";

const toTitleCaseWithInitials = (str) => {
  if (!str) return "";

  const words = str.toLowerCase().split(" ").filter(Boolean);
  if (words.length === 0) return "";

  const firstName = words[0].charAt(0).toUpperCase() + words[0].slice(1);

  const initials = words
    .slice(1)
    .map((word, index, arr) => {
      const initial = word.charAt(0).toUpperCase();
      return index === arr.length - 1 ? initial : initial + ".";
    })
    .join(" ");

  return initials ? `${firstName} ${initials}` : firstName;
};

const getFirstName = (str) => {
  if (!str) return "";
  const word = str.toLowerCase().split(" ").filter(Boolean)[0];
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
};

const getRestOfName = (str) => {
  if (!str) return "";
  const rest = str.split(" ").filter(Boolean).slice(1);
  if (rest.length === 0) return "";
  // For long names (3+ middle/last words), keep the surname and initialize the middles
  // e.g. "Ahmed Naushad Ahmed Khan" -> "A. N. A. KHAN"
  if (rest.length >= 3) {
    const last = rest[rest.length - 1];
    const initials = rest.slice(0, -1).map((w) => `${w.charAt(0)}.`).join(" ");
    return `${initials} ${last}`.toUpperCase();
  }
  return rest.join(" ").toUpperCase();
};

const SECTION_CONFIG = [
  { title: "Batters", roleKey: "Batsman" },
  { title: "Bowlers", roleKey: "Bowler" },
  { title: "All-Rounders", roleKey: "All - rounder" },
  { title: "Wicket Keepers", roleKey: "Wicketkeeper" },
];

const MeetMyTeam = ({ data }) => {
  const PlayerRecords = data?.Player_Registrations__r?.records || [];
  const teamDisplayName = (data?.Name || "")
    .replace(/\s*\(w\)\s*$/i, "")
    .trim()
    .toUpperCase();

  const groupedByRole = {};

  PlayerRecords.forEach((player) => {
    const role = player.Primary_Role__c;
    const id = player.Id;
    const fullName = player.Player__r?.Name || "";
    const name = toTitleCaseWithInitials(fullName) || "Unknown";
    const firstName = getFirstName(fullName);
    const restName = getRestOfName(fullName);
    const rawImg = player.Player__r?.Photo_URL_1__c;
    const apiImg = rawImg && rawImg.trim() !== "" ? rawImg : "";
    const overrideImg = resolvePlayerPhotoOverride(data?.Name, fullName);
    const img = overrideImg || apiImg;

    const playerObj = { id, name, firstName, restName, img, role };

    if (!groupedByRole[role]) {
      groupedByRole[role] = [];
    }
    groupedByRole[role].push(playerObj);
  });

  const sections = SECTION_CONFIG.map((s) => ({
    title: s.title,
    players: groupedByRole[s.roleKey] || [],
  })).filter((s) => s.players.length > 0);

  return (
    <div className="mtt-wrapper relative">
      <div className="mtt-header-zone">
        <div className="px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20 pt-8 md:pt-10 pb-8 md:pb-10">
          <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-center sm:gap-5 sm:text-left md:gap-6 md:px-6 lg:px-10">
            {data?.Logo_URL__c ? (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white p-2 shadow-[0_6px_20px_rgba(0,0,0,0.35)] ring-1 ring-white/20 sm:h-20 sm:w-20 md:h-24 md:w-24 md:p-2.5 lg:h-28 lg:w-28 lg:p-3">
                <img
                  src={data.Logo_URL__c}
                  alt={`${teamDisplayName} logo`}
                  className="h-full w-full object-contain"
                />
              </div>
            ) : null}
            <h2 className="mtt-heading mtt-heading--responsive flex-1">
              <span className="mtt-heading-thin">MEET</span>{" "}
              <span className="mtt-heading-bold">
                {teamDisplayName || "THE TEAM"}
              </span>
            </h2>
          </div>
        </div>
      </div>

      <div className="px-2 sm:px-6 md:px-10 lg:px-14 xl:px-20 pb-12 md:pb-16 pt-6 md:pt-8">
        <div className="mtt-cards-panel rounded-xl md:rounded-2xl p-3 sm:p-6 md:p-8 lg:p-10">
          <div className="flex flex-col gap-16 md:gap-24 lg:gap-28">
            {sections.length === 0 ? (
              <p className="text-white/70 italic">
                Players will be announced soon.
              </p>
            ) : (
              sections.map((section) => (
                <section key={section.title}>
                  <h3 className="mtt-section-title px-2 md:px-3">
                    {section.title}
                  </h3>
                  <div className="mt-5 md:mt-6 pt-3 md:pt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 sm:gap-x-10 md:gap-x-14 lg:gap-x-16 gap-y-8 sm:gap-y-14 md:gap-y-20">
                    {section.players.map((player) => (
                      <PlayerCard key={player.id} player={player} />
                    ))}
                  </div>
                </section>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetMyTeam;
