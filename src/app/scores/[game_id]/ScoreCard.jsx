"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const ArrowLeftIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PinIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M12 22s7-7.16 7-12a7 7 0 10-14 0c0 4.84 7 12 7 12z" strokeLinejoin="round" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

const ClockIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const teamLogoForName = (name) => {
  if (!name) return "/images/fixtures/logoPlaceHolder.png";
  return `/images/fixtures/${encodeURIComponent(name)}.svg`;
};

const InningsPillToggle = ({ home, away, homeShort, awayShort, value, onChange }) => (
  <div className="flex items-center gap-1 rounded-full p-1 bg-[#091d65] border border-white/80 w-full max-w-full sm:w-auto sm:max-w-[640px] mx-auto overflow-hidden">
    {[
      { value: "home", label: home, short: homeShort || home },
      { value: "away", label: away, short: awayShort || away },
    ].map((opt) => {
      const active = value === opt.value;
      return (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex-1 sm:flex-none min-w-0 px-3 sm:px-5 md:px-6 py-1.5 rounded-full text-[11px] sm:text-xs md:text-sm font-medium italic uppercase tracking-wide transition-colors truncate ${
            active
              ? "bg-white text-[#192a66]"
              : "bg-transparent text-white hover:bg-white/10"
          }`}
          title={opt.label}
        >
          <span className="sm:hidden">{opt.short}</span>
          <span className="hidden sm:inline">{opt.label}</span>
        </button>
      );
    })}
  </div>
);

const TeamColumn = ({ name, logo, score, overs, wickets, winner, align = "left" }) => {
  const scoreStr =
    score !== undefined && score !== null
      ? wickets !== undefined && wickets !== null
        ? `${score}/${wickets}`
        : `${score}`
      : "";
  return (
    <div className="flex flex-col gap-3 min-w-0">
      <div
        className={`flex items-center gap-3 sm:gap-4 min-w-0 ${
          align === "right" ? "flex-row-reverse text-right" : "flex-row text-left"
        }`}
      >
        <div
          className={`shrink-0 size-14 sm:size-[64px] md:size-[72px] rounded-full bg-white border ${
            winner ? "border-[#ef4123]" : "border-[#af313a]"
          } flex items-center justify-center p-1 overflow-hidden`}
        >
          <img
            src={logo}
            alt={`${name} logo`}
            onError={(e) => {
              e.currentTarget.src = "/images/fixtures/logoPlaceHolder.png";
            }}
            className="size-full object-contain"
          />
        </div>
        <div className="min-w-0 text-white font-extrabold uppercase text-[12px] sm:text-sm md:text-[15px] lg:text-base leading-tight tracking-wide line-clamp-2">
          {name}
        </div>
      </div>
      {scoreStr && (
        <div className="flex flex-col items-center gap-0.5">
          <span
            className={`font-semibold text-2xl sm:text-3xl md:text-[34px] leading-none ${
              winner ? "text-[#ef4123]" : "text-white"
            }`}
          >
            {scoreStr}
          </span>
          {overs && (
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
              ({overs} OV)
            </span>
          )}
        </div>
      )}
    </div>
  );
};

const SectionCard = ({ children, className = "" }) => (
  <div
    className={`rounded-lg bg-white/10 border-2 border-white/5 overflow-hidden ${className}`}
  >
    {children}
  </div>
);

const StatsTable = ({ headers, rows, colGridClass }) => (
  <div className="overflow-x-auto">
    <div className="min-w-[720px]">
      <div
        className={`grid ${colGridClass} bg-white/5 px-4 sm:px-6 py-3 border-b border-white/10`}
      >
        {headers.map((h, i) => (
          <div
            key={i}
            className={`text-[11px] sm:text-xs font-extrabold italic uppercase tracking-[0.1em] text-slate-400 ${
              i === 0 || i === 1 ? "text-left" : "text-center"
            }`}
          >
            {h}
          </div>
        ))}
      </div>
      <div className="divide-y divide-white/5">
        {rows.map((row, i) => (
          <div
            key={i}
            className={`grid ${colGridClass} px-4 sm:px-6 py-3 sm:py-4 items-center hover:bg-white/5 transition-colors`}
          >
            {row.map((cell, j) => (
              <div
                key={j}
                className={`text-white text-[13px] sm:text-sm font-medium ${
                  j === 0 || j === 1 ? "text-left" : "text-center"
                } ${j === 0 ? "font-semibold" : ""} ${
                  j === 1 ? "text-slate-400 text-[11px] sm:text-xs" : ""
                }`}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function ScoreCard({ match }) {
  const router = useRouter();
  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/fixtures");
    }
  };

  const homeId = match.Matchdetail.Team_Home;
  const awayId = match.Matchdetail.Team_Away;
  const teams = match.Teams;
  const innings = match.Innings || [];

  const venue = match.Matchdetail?.Venue?.Name || "";

  const homeTeam = teams[homeId];
  const awayTeam = teams[awayId];
  const homeTeamName = homeTeam?.Name_Full ?? "Home Team";
  const awayTeamName = awayTeam?.Name_Full ?? "Away Team";
  const homeTeamShort = homeTeam?.Name_Short ?? homeTeamName;
  const awayTeamShort = awayTeam?.Name_Short ?? awayTeamName;

  const homeLogo = teamLogoForName(homeTeamName);
  const awayLogo = teamLogoForName(awayTeamName);

  const isSuperOverInnings = (i) => {
    if (!i) return false;
    const number = Number(i.Number || i.Innings_Number || i.InningsNumber || 0);
    if (number > 2) return true;
    const flag = i.Issuperover ?? i.IsSuperover ?? i.SuperOver ?? i.Superover;
    if (typeof flag === "string") return /^(yes|true|1)$/i.test(flag);
    return Boolean(flag);
  };

  const regularInnings = innings.filter((i) => !isSuperOverInnings(i));
  const superOverInnings = innings.filter(isSuperOverInnings);

  const homeInnings =
    regularInnings.find((i) => i.Battingteam === homeId) || {};
  const awayInnings =
    regularInnings.find((i) => i.Battingteam === awayId) || {};
  const homeSuperOver = superOverInnings.find((i) => i.Battingteam === homeId);
  const awaySuperOver = superOverInnings.find((i) => i.Battingteam === awayId);
  const hasSuperOver = Boolean(homeSuperOver || awaySuperOver);

  const result = match.Matchdetail.Equation || "";
  const wasSuperOver =
    hasSuperOver || /super\s*over/i.test(result || "");

  // Determine winner: the team mentioned BEFORE "beat/won" is the winner
  const winnerName = (() => {
    if (!result) return "";
    const lower = result.toLowerCase();
    const beatIdx = lower.search(/\b(beat|won)\b/);
    if (beatIdx === -1) return "";
    const winnerPart = result.slice(0, beatIdx).trim().toLowerCase();
    if (winnerPart.includes(homeTeamName.toLowerCase())) return homeTeamName;
    if (winnerPart.includes(awayTeamName.toLowerCase())) return awayTeamName;
    return "";
  })();
  const homeWinner = winnerName === homeTeamName;
  const awayWinner = winnerName === awayTeamName;

  const [activeInnings, setActiveInnings] = useState("home");

  const currentInnings = activeInnings === "home" ? homeInnings : awayInnings;
  const currentTeamId = activeInnings === "home" ? homeId : awayId;
  const opposingTeamId = activeInnings === "home" ? awayId : homeId;
  const currentTeamName = activeInnings === "home" ? homeTeamName : awayTeamName;
  const opposingTeamName = activeInnings === "home" ? awayTeamName : homeTeamName;
  const currentTeamLogo = activeInnings === "home" ? homeLogo : awayLogo;
  const opposingTeamLogo = activeInnings === "home" ? awayLogo : homeLogo;

  const batting = currentInnings.Batsmen || [];
  const bowlers = currentInnings.Bowlers || [];

  const extras = {
    byes: Number(currentInnings.Byes || 0),
    legByes: Number(currentInnings.Legbyes || 0),
    wides: Number(currentInnings.Wides || 0),
    noBalls: Number(currentInnings.Noballs || 0),
    penalty: Number(currentInnings.Penalty || 0),
  };
  extras.total = Object.values(extras).reduce((sum, v) => sum + v, 0);

  const fallOfWickets = currentInnings.FallofWickets || [];
  const didNotBat = batting.filter((p) => !p.Howout);
  const dismissed = batting.filter((p) => p.Howout);

  const battingHeaders = ["Batter", "Dismissal", "R", "B", "4s", "6s", "S/R"];
  const battingColGrid = "grid-cols-[2.5fr_3fr_0.7fr_0.7fr_0.7fr_0.7fr_0.9fr] gap-2";
  const battingRows = dismissed.map((p) => {
    const name = teams[currentTeamId]?.Players[p.Batsman]?.Name_Full || "—";
    return [
      name,
      p.Howout || "",
      p.Runs,
      p.Balls,
      p.Fours,
      p.Sixes,
      p.Strikerate,
    ];
  });

  const bowlingHeaders = ["Bowler", "O", "M", "R", "W", "NB", "WD", "E/R"];
  const bowlingColGrid = "grid-cols-[3fr_0.7fr_0.7fr_0.7fr_0.7fr_0.7fr_0.7fr_0.9fr] gap-2";
  const bowlingRows = bowlers.map((b) => {
    const name = teams[opposingTeamId]?.Players[b.Bowler]?.Name_Full || "—";
    return [
      name,
      "", // empty cell for dismissal column alignment — actually bowling has different headers
    ];
  });
  // Rebuild bowling rows properly (without dismissal column)
  const bowlingRowsFinal = bowlers.map((b) => {
    const name = teams[opposingTeamId]?.Players[b.Bowler]?.Name_Full || "—";
    return [
      name,
      b.Overs,
      b.Maidens,
      b.Runs,
      b.Wickets,
      b.Noballs,
      b.Wides,
      b.Economyrate,
    ];
  });

  return (
    <div className="relative bg-[#091d65] min-h-screen w-full overflow-x-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-no-repeat bg-cover bg-top opacity-90"
        style={{ backgroundImage: "url('/images/fixtures/fixtures-bg.svg')" }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-gradient-to-b from-[rgba(13,55,169,0.55)] via-[rgba(13,55,169,0.25)] to-transparent" />

      <div className="section-width relative z-10 py-10 md:py-14 lg:py-16 w-full">
        {/* Back button */}
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/30 text-white text-xs sm:text-sm font-extrabold italic uppercase tracking-wide rounded-full px-4 sm:px-5 py-2 mb-6 md:mb-8 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back
        </button>

        {/* Page heading */}
        <h2 className="font-extrabold italic uppercase leading-[0.95] tracking-tight mb-8 md:mb-10">
          <span
            className="block text-[36px] sm:text-[44px] md:text-[52px] lg:text-[56px]"
            style={{
              background:
                "radial-gradient(80% 100% at 50% 50%, #FFF200 0%, #FBB040 95%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            MATCH
          </span>
          <span className="block text-white text-[36px] sm:text-[44px] md:text-[52px] lg:text-[56px]">
            CENTRE
          </span>
        </h2>

        {/* Match summary card */}
        <SectionCard className="mb-8 md:mb-10">
          <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-5 md:gap-6">
            {venue && (
              <div className="flex items-center gap-2 text-slate-400 pb-4 border-b border-white/10">
                <PinIcon className="w-4 h-4 shrink-0" />
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.1em]">
                  {venue}
                </span>
              </div>
            )}

            <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-3 sm:gap-6 w-full min-w-0">
              <TeamColumn
                name={homeTeamName}
                logo={homeLogo}
                score={homeInnings.Total}
                overs={homeInnings.Overs}
                wickets={homeInnings.Wickets}
                winner={homeWinner}
                align="left"
              />
              <div className="px-2 sm:px-4 shrink-0 flex flex-col items-center self-center">
                <div className="-skew-x-12">
                  <div className="font-black italic text-white text-2xl sm:text-3xl md:text-[34px] leading-none tracking-wider">
                    V/S
                  </div>
                </div>
              </div>
              <TeamColumn
                name={awayTeamName}
                logo={awayLogo}
                score={awayInnings.Total}
                overs={awayInnings.Overs}
                wickets={awayInnings.Wickets}
                winner={awayWinner}
                align="right"
              />
            </div>

            {hasSuperOver && (
              <div className="rounded-lg border border-[#FFD166]/40 bg-gradient-to-r from-[#1B0F5C] via-[#192a66] to-[#1B0F5C] px-4 py-4 sm:px-6 sm:py-5">
                <div className="mb-3 flex items-center justify-center gap-2">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5 text-[#FFD166]"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
                  </svg>
                  <span className="text-[10px] sm:text-[11px] font-extrabold uppercase italic tracking-[0.24em] text-[#FFD166]">
                    Super Over
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5 text-[#FFD166]"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
                  </svg>
                </div>
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
                  <div className="text-left">
                    <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wide text-slate-300 line-clamp-1">
                      {homeTeamName}
                    </div>
                    <div
                      className={`mt-1 text-xl sm:text-2xl font-extrabold leading-none ${
                        homeWinner ? "text-[#FFD166]" : "text-white"
                      }`}
                    >
                      {homeSuperOver?.Total ?? "-"}
                      {homeSuperOver?.Wickets !== undefined &&
                      homeSuperOver?.Wickets !== null
                        ? `/${homeSuperOver.Wickets}`
                        : ""}
                    </div>
                    {homeSuperOver?.Overs && (
                      <div className="mt-0.5 text-[10px] sm:text-[11px] font-medium text-slate-400">
                        ({homeSuperOver.Overs} OV)
                      </div>
                    )}
                  </div>
                  <div className="-skew-x-12">
                    <span className="font-black italic text-white/80 text-base sm:text-lg leading-none tracking-wider">
                      V/S
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wide text-slate-300 line-clamp-1">
                      {awayTeamName}
                    </div>
                    <div
                      className={`mt-1 text-xl sm:text-2xl font-extrabold leading-none ${
                        awayWinner ? "text-[#FFD166]" : "text-white"
                      }`}
                    >
                      {awaySuperOver?.Total ?? "-"}
                      {awaySuperOver?.Wickets !== undefined &&
                      awaySuperOver?.Wickets !== null
                        ? `/${awaySuperOver.Wickets}`
                        : ""}
                    </div>
                    {awaySuperOver?.Overs && (
                      <div className="mt-0.5 text-[10px] sm:text-[11px] font-medium text-slate-400">
                        ({awaySuperOver.Overs} OV)
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {result && (
              <div className="flex justify-center pt-2">
                <span
                  className={`inline-flex items-center gap-2 text-white text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.12em] rounded-md px-5 py-2.5 text-center ${
                    wasSuperOver
                      ? "bg-gradient-to-r from-[#F2A23A] to-[#FFD166] text-[#0B1545]"
                      : "bg-[#ef4123]"
                  }`}
                >
                  {wasSuperOver && (
                    <svg
                      viewBox="0 0 24 24"
                      className="h-3 w-3"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
                    </svg>
                  )}
                  {result}
                </span>
              </div>
            )}
          </div>
        </SectionCard>

        {/* Innings tabs */}
        <div className="flex justify-center mb-6 md:mb-8 w-full min-w-0">
          <InningsPillToggle
            home={homeTeamName}
            away={awayTeamName}
            homeShort={homeTeamShort}
            awayShort={awayTeamShort}
            value={activeInnings}
            onChange={setActiveInnings}
          />
        </div>

        {/* Innings summary header */}
        <SectionCard className="mb-6 md:mb-8">
          <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="shrink-0 size-10 sm:size-12 rounded-full bg-white border border-[#af313a] flex items-center justify-center p-1 overflow-hidden">
                <img
                  src={currentTeamLogo}
                  alt={`${currentTeamName} logo`}
                  onError={(e) => {
                    e.currentTarget.src = "/images/fixtures/logoPlaceHolder.png";
                  }}
                  className="size-full object-contain"
                />
              </div>
              <span className="text-white font-extrabold uppercase text-sm sm:text-base tracking-wide truncate">
                {currentTeamName}
              </span>
            </div>
            <div className="flex items-baseline gap-2 shrink-0">
              <span className="font-semibold text-white text-xl sm:text-2xl md:text-3xl leading-none">
                {currentInnings.Total ?? "-"}
                {currentInnings.Wickets !== undefined &&
                  currentInnings.Wickets !== null &&
                  `/${currentInnings.Wickets}`}
              </span>
              {currentInnings.Overs && (
                <span className="text-slate-400 text-[11px] sm:text-xs font-medium">
                  ({currentInnings.Overs} Overs)
                </span>
              )}
            </div>
          </div>
        </SectionCard>

        {/* Batting table */}
        {dismissed.length > 0 && (
          <SectionCard className="mb-6 md:mb-8">
            <div className="px-4 sm:px-6 py-4 border-b border-white/10 flex items-center gap-3">
              <span
                className="font-extrabold italic uppercase text-lg sm:text-xl tracking-wide"
                style={{
                  background:
                    "radial-gradient(80% 100% at 50% 50%, #FFF200 0%, #FBB040 95%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Batting
              </span>
            </div>
            <StatsTable
              headers={battingHeaders}
              rows={battingRows}
              colGridClass={battingColGrid}
            />
            {/* Extras row */}
            <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3 border-t border-white/10 text-[12px] sm:text-sm">
              <span className="text-slate-400 font-extrabold italic uppercase tracking-[0.1em]">
                Extras
              </span>
              <span className="text-white font-medium">
                {extras.total}
                {extras.total > 0 && (
                  <span className="text-slate-400 ml-2">
                    (b {extras.byes}, lb {extras.legByes}, w {extras.wides}, nb{" "}
                    {extras.noBalls}
                    {extras.penalty ? `, p ${extras.penalty}` : ""})
                  </span>
                )}
              </span>
            </div>
            {currentInnings.Total !== undefined && (
              <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3 border-t border-white/10 text-[12px] sm:text-sm bg-white/[0.03]">
                <span className="text-white font-extrabold italic uppercase tracking-[0.1em]">
                  Total
                </span>
                <span className="text-white font-extrabold">
                  {currentInnings.Total}
                  {currentInnings.Wickets !== undefined &&
                    `/${currentInnings.Wickets}`}
                  {currentInnings.Overs && (
                    <span className="text-slate-400 font-medium ml-2">
                      ({currentInnings.Overs} Overs)
                    </span>
                  )}
                </span>
              </div>
            )}
          </SectionCard>
        )}

        {/* Did Not Bat */}
        {didNotBat.length > 0 && (
          <SectionCard className="mb-6 md:mb-8">
            <div className="px-4 sm:px-6 py-4 border-b border-white/10">
              <span
                className="font-extrabold italic uppercase text-base sm:text-lg tracking-wide"
                style={{
                  background:
                    "radial-gradient(80% 100% at 50% 50%, #FFF200 0%, #FBB040 95%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Did Not Bat
              </span>
            </div>
            <div className="px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap gap-x-2 gap-y-1 text-white text-[12px] sm:text-sm">
              {didNotBat.map((p, i) => {
                const name =
                  teams[currentTeamId]?.Players[p.Batsman]?.Name_Full || "—";
                return (
                  <span key={i} className="font-medium">
                    {name}
                    {i < didNotBat.length - 1 ? "," : ""}
                  </span>
                );
              })}
            </div>
          </SectionCard>
        )}

        {/* Fall of Wickets */}
        {fallOfWickets.length > 0 && (
          <SectionCard className="mb-6 md:mb-8">
            <div className="px-4 sm:px-6 py-4 border-b border-white/10">
              <span
                className="font-extrabold italic uppercase text-base sm:text-lg tracking-wide"
                style={{
                  background:
                    "radial-gradient(80% 100% at 50% 50%, #FFF200 0%, #FBB040 95%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Fall of Wickets
              </span>
            </div>
            <div className="px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap gap-x-3 gap-y-2 text-[12px] sm:text-sm">
              {fallOfWickets.map((wicket, idx) => {
                const playerName =
                  teams[currentTeamId]?.Players[wicket.Batsman]?.Name_Full || "—";
                return (
                  <span key={idx} className="text-white">
                    <span className="font-extrabold text-[#ef4123]">
                      {wicket.Score}
                    </span>
                    <span className="text-slate-300">
                      {" "}
                      ({playerName}, {wicket.Overs} ov){idx < fallOfWickets.length - 1 ? "," : ""}
                    </span>
                  </span>
                );
              })}
            </div>
          </SectionCard>
        )}

        {/* Bowling */}
        {bowlingRowsFinal.length > 0 && (
          <SectionCard className="mb-6 md:mb-8">
            <div className="px-4 sm:px-6 py-4 border-b border-white/10 flex items-center gap-3">
              <div className="shrink-0 size-8 sm:size-10 rounded-full bg-white border border-[#af313a] flex items-center justify-center p-1 overflow-hidden">
                <img
                  src={opposingTeamLogo}
                  alt={`${opposingTeamName} logo`}
                  onError={(e) => {
                    e.currentTarget.src = "/images/fixtures/logoPlaceHolder.png";
                  }}
                  className="size-full object-contain"
                />
              </div>
              <span
                className="font-extrabold italic uppercase text-base sm:text-lg tracking-wide"
                style={{
                  background:
                    "radial-gradient(80% 100% at 50% 50%, #FFF200 0%, #FBB040 95%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Bowling — {opposingTeamName}
              </span>
            </div>
            <StatsTable
              headers={bowlingHeaders}
              rows={bowlingRowsFinal}
              colGridClass={bowlingColGrid}
            />
          </SectionCard>
        )}
      </div>
    </div>
  );
}
