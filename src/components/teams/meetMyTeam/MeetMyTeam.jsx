import React from "react";
import "./style.css";
import PlayerCard from "./PlayerCard";

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

  return (
    <div className="mtt-wrapper relative">
      <div className="mtt-header-zone">
        <div className="px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20 pt-10 md:pt-14 pb-10 md:pb-14">
          <h2 className="mtt-heading px-2 md:px-6 lg:px-10">
            <span className="mtt-heading-thin">MEET</span>
            <span className="mtt-heading-bold">THE TEAM</span>
          </h2>
        </div>
      </div>

      {/* Player cards container — extra width */}
      <div className="px-2 sm:px-6 md:px-10 lg:px-14 xl:px-20 pb-12 md:pb-16">
        <div className="mtt-cards-panel rounded-xl md:rounded-2xl p-3 sm:p-6 md:p-10 lg:p-12">
          <div className="flex flex-col gap-20 md:gap-28">
            {sections.length === 0 ? (
              <p className="text-white/70 italic">
                Players will be announced soon.
              </p>
            ) : (
              sections.map((section) => (
                <section key={section.title}>
                  <h3 className="mtt-section-title px-2 md:px-3">{section.title}</h3>
                  <div className="mt-6 md:mt-8 pt-4 md:pt-10 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-3 sm:gap-x-8 md:gap-x-10 lg:gap-x-12 gap-y-4 sm:gap-y-8 md:gap-y-20">
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
