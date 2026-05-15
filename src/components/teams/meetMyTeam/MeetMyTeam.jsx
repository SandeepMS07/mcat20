import React from "react";
import { teamSubtitles } from "@/utilis/helper";
import "./style.css";

const getTeamNameKey = (name = "") => name.replace(/\s*\(W\)\s*$/i, "").trim();

const resolveTeamHeader = (rawName = "") => {
  const key = getTeamNameKey(rawName);
  const mapped = teamSubtitles[key];
  if (mapped) return { name: mapped.name, subtitle: mapped.subtitle };
  return { name: rawName, subtitle: "" };
};

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
  return str.split(" ").filter(Boolean).slice(1).join(" ").toUpperCase();
};

const SECTION_CONFIG = [
  { title: "Batters", roleKey: "Batsman" },
  { title: "Bowlers", roleKey: "Bowler" },
  { title: "All-Rounders", roleKey: "All - rounder" },
  { title: "Wicket Keepers", roleKey: "Wicketkeeper" },
];

const MeetMyTeam = ({ data }) => {
  const PlayerRecords = data?.Player_Registrations__r?.records || [];

  const groupedByRole = {};

  PlayerRecords.forEach((player) => {
    const role = player.Primary_Role__c;
    const id = player.Id;
    const fullName = player.Player__r?.Name || "";
    const name = toTitleCaseWithInitials(fullName) || "Unknown";
    const firstName = getFirstName(fullName);
    const restName = getRestOfName(fullName);
    const rawImg = player.Player__r?.Photo_URL_1__c;
    const img = rawImg && rawImg.trim() !== "" ? rawImg : "";

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

  const header = resolveTeamHeader(data?.Name || "");

  return (
    <div className="mtt-wrapper relative">
      <div className="mtt-header-zone">
        <div className="px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20 pt-16 md:pt-24 pb-16 md:pb-24">
          {/* Team header */}
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-8 px-2 md:px-6 lg:px-10">
            <div className="flex items-center justify-center w-[200px] h-[130px] md:w-[260px] md:h-[170px] shrink-0">
              <img
                src={data?.Logo_URL__c}
                alt={`${header.name} logo`}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="hidden sm:block w-px h-32 md:h-40 bg-white/30" />
            <div className="text-white text-center sm:text-left">
              <h2 className="text-2xl md:text-4xl font-bold leading-[1.15]">
                {header.name}
              </h2>
              {header.subtitle ? (
                <p className="mt-2 text-2xl md:text-4xl font-bold text-white leading-[1.15]">
                  {header.subtitle}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-14 md:mt-20 h-px w-full bg-white/15" />

          <h2 className="mtt-heading mt-14 md:mt-20 px-2 md:px-6 lg:px-10">
            <span className="mtt-heading-thin">MEET</span>
            <span className="mtt-heading-bold">THE TEAM</span>
          </h2>
        </div>
      </div>

      {/* Player cards container — extra width */}
      <div className="px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20 pb-12 md:pb-16">
        <div className="mtt-cards-panel rounded-2xl p-6 md:p-10 lg:p-12">
          <div className="flex flex-col gap-20 md:gap-28">
            {sections.length === 0 ? (
              <p className="text-white/70 italic">
                Players will be announced soon.
              </p>
            ) : (
              sections.map((section) => (
                <section key={section.title}>
                  <h3 className="mtt-section-title px-2 md:px-3">{section.title}</h3>
                  <div className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 md:gap-x-10 lg:gap-x-12 gap-y-12 md:gap-y-14 pt-10 md:pt-12">
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

const PlayerCard = ({ player }) => {
  return (
    <div className="mtt-card">
      <div className="mtt-card-gradient" aria-hidden />
      <div className="mtt-card-stripes" aria-hidden />

      {player.img ? (
        <img
          src={player.img}
          alt={player.name}
          className="mtt-card-photo"
          loading="lazy"
        />
      ) : (
        <div className="mtt-card-photo-fallback">
          <span>{player.firstName.charAt(0)}</span>
        </div>
      )}

      <div className="mtt-card-name">
        <span className="mtt-firstname">{player.firstName.toUpperCase()}</span>
        {player.restName ? (
          <span className="mtt-restname">{player.restName}</span>
        ) : null}
      </div>
    </div>
  );
};

export default MeetMyTeam;
