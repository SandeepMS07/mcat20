"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const ArrowLeftIcon = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      d="M19 12H5M12 19l-7-7 7-7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PinIcon = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M12 22s7-7.16 7-12a7 7 0 10-14 0c0 4.84 7 12 7 12z" strokeLinejoin="round" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

const TROPHY_LOGO_FALLBACK = "/images/fixtures/logoPlaceHolder.png";

const titleCase = (str) =>
  (str || "")
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

const SectionCard = ({ children, className = "" }) => (
  <div
    className={`rounded-lg bg-white/10 border-2 border-white/5 overflow-hidden ${className}`}
  >
    {children}
  </div>
);

const InningsPillToggle = ({ options, value, onChange }) => (
  <div className="flex items-center gap-1 rounded-full p-1 bg-[#091d65] border border-white/80 w-full max-w-full sm:w-auto sm:max-w-[640px] mx-auto overflow-hidden">
    {options.map((opt) => {
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
          {opt.label}
        </button>
      );
    })}
  </div>
);

const TeamHero = ({ name, logo, summary, winner, align = "left" }) => (
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
          src={logo || TROPHY_LOGO_FALLBACK}
          alt={`${name} logo`}
          onError={(e) => {
            e.currentTarget.src = TROPHY_LOGO_FALLBACK;
          }}
          className="size-full object-contain"
        />
      </div>
      <div className="min-w-0 text-white font-extrabold uppercase text-[12px] sm:text-sm md:text-[15px] lg:text-base leading-tight tracking-wide line-clamp-2">
        {name}
      </div>
    </div>
    {summary && (
      <div className="flex flex-col items-center gap-0.5">
        <span
          className={`font-semibold text-xl sm:text-2xl md:text-3xl leading-none ${
            winner ? "text-[#ef4123]" : "text-white"
          }`}
        >
          {summary}
        </span>
      </div>
    )}
  </div>
);

const StatsTable = ({ headers, rows, colGridClass, emptyText = "No data" }) => (
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
        {rows.length === 0 ? (
          <div className="px-4 sm:px-6 py-6 text-center text-slate-400 text-xs italic">
            {emptyText}
          </div>
        ) : (
          rows.map((row, i) => (
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
          ))
        )}
      </div>
    </div>
  </div>
);

const SectionHeading = ({ children }) => (
  <h3 className="text-white font-extrabold italic uppercase tracking-wide text-base sm:text-lg md:text-xl mb-3 md:mb-4">
    {children}
  </h3>
);

export default function Season3ScoreCard({ match, innings1, innings2 }) {
  const router = useRouter();
  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/fixtures?season=season3&status=completed");
    }
  };

  const firstName = match.FirstBattingTeam;
  const secondName = match.SecondBattingTeam;
  const firstLogo = match.FirstBattingTeamLogo;
  const secondLogo = match.SecondBattingTeamLogo;
  const winningId = String(match.WinningTeamID || "");
  const firstWinner = winningId === String(match.FirstBattingTeamID);
  const secondWinner = winningId === String(match.SecondBattingTeamID);

  const firstSummary = match["1Summary"];
  const secondSummary = match["2Summary"];
  const result = (match.Comments || "").replace(/\(Winners\)/i, "").trim();

  const inningsOptions = [
    { value: "innings1", label: `Innings 1 — ${firstName}` },
    { value: "innings2", label: `Innings 2 — ${secondName}` },
  ];
  const [activeInnings, setActiveInnings] = useState("innings1");
  const current = activeInnings === "innings1" ? innings1 : innings2;
  const currentTeamName =
    activeInnings === "innings1" ? firstName : secondName;
  const currentSummary =
    activeInnings === "innings1" ? firstSummary : secondSummary;
  const currentTeamLogo =
    activeInnings === "innings1" ? firstLogo : secondLogo;

  const batting = current?.BattingCard || [];
  const bowling = current?.BowlingCard || [];
  const extras = current?.Extras?.[0] || null;
  const fallOfWickets = current?.FallOfWickets || [];

  const dismissed = batting.filter((p) => p.OutDesc);
  const didNotBat = batting.filter((p) => !p.OutDesc);

  const battingHeaders = ["Batter", "Dismissal", "R", "B", "4s", "6s", "S/R"];
  const battingColGrid =
    "grid-cols-[2.5fr_3fr_0.7fr_0.7fr_0.7fr_0.7fr_0.9fr] gap-2";
  const battingRows = dismissed.map((p) => [
    titleCase(p.PlayerName),
    p.OutDesc || "—",
    p.Runs,
    p.Balls,
    p.Fours,
    p.Sixes,
    p.StrikeRate,
  ]);

  const bowlingHeaders = ["Bowler", "O", "M", "R", "W", "NB", "WD", "E/R"];
  const bowlingColGrid =
    "grid-cols-[3fr_0.7fr_0.7fr_0.7fr_0.7fr_0.7fr_0.7fr_0.9fr] gap-2";
  const bowlingRows = bowling.map((b) => [
    titleCase(b.PlayerName),
    b.Overs,
    b.Maidens,
    b.Runs,
    b.Wickets,
    b.NoBalls,
    b.Wides,
    b.Economy,
  ]);

  return (
    <div className="relative bg-[#091d65] min-h-screen w-full overflow-x-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-no-repeat bg-cover bg-top opacity-90"
        style={{ backgroundImage: "url('/images/fixtures/fixtures-bg.svg')" }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-gradient-to-b from-[rgba(13,55,169,0.55)] via-[rgba(13,55,169,0.25)] to-transparent" />

      <div className="section-width relative z-10 py-10 md:py-14 lg:py-16 w-full">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/30 text-white text-xs sm:text-sm font-extrabold italic uppercase tracking-wide rounded-full px-4 sm:px-5 py-2 mb-6 md:mb-8 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back
        </button>

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

        <SectionCard className="mb-8 md:mb-10">
          <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-5 md:gap-6">
            {match.GroundName && (
              <div className="flex items-center gap-2 text-slate-400 pb-4 border-b border-white/10">
                <PinIcon className="w-4 h-4 shrink-0" />
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.1em]">
                  {match.GroundName}
                  {match.MatchDate ? ` • ${match.MatchDate}` : ""}
                </span>
              </div>
            )}

            <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-3 sm:gap-6 w-full min-w-0">
              <TeamHero
                name={firstName}
                logo={firstLogo}
                summary={firstSummary}
                winner={firstWinner}
                align="left"
              />
              <div className="px-2 sm:px-4 shrink-0 flex flex-col items-center self-center">
                <div className="-skew-x-12">
                  <div className="font-black italic text-white text-2xl sm:text-3xl md:text-[34px] leading-none tracking-wider">
                    V/S
                  </div>
                </div>
              </div>
              <TeamHero
                name={secondName}
                logo={secondLogo}
                summary={secondSummary}
                winner={secondWinner}
                align="right"
              />
            </div>

            {result && (
              <div className="flex justify-center pt-2">
                <span className="inline-block bg-[#ef4123] text-white text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.12em] rounded-md px-5 py-2.5 text-center">
                  {result}
                </span>
              </div>
            )}

            {match.TossDetails && (
              <div className="text-center text-slate-300 text-[11px] sm:text-xs italic">
                {match.TossDetails}
              </div>
            )}

            {match.MOM && (
              <div className="flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#f4a03b]/15 border border-[#f4a03b]/40 text-[#f4a03b] text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.1em] px-4 py-1.5">
                  Player of the Match: {titleCase(match.MOM)}
                </span>
              </div>
            )}
          </div>
        </SectionCard>

        <div className="flex justify-center mb-6 md:mb-8 w-full min-w-0">
          <InningsPillToggle
            options={inningsOptions}
            value={activeInnings}
            onChange={setActiveInnings}
          />
        </div>

        <SectionCard className="mb-6 md:mb-8">
          <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="shrink-0 size-10 sm:size-12 rounded-full bg-white border border-[#af313a] flex items-center justify-center p-1 overflow-hidden">
                <img
                  src={currentTeamLogo || TROPHY_LOGO_FALLBACK}
                  alt={`${currentTeamName} logo`}
                  onError={(e) => {
                    e.currentTarget.src = TROPHY_LOGO_FALLBACK;
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
                {currentSummary || "—"}
              </span>
            </div>
          </div>
        </SectionCard>

        {current ? (
          <>
            <div className="mb-8 md:mb-10">
              <SectionHeading>Batting</SectionHeading>
              <SectionCard>
                <StatsTable
                  headers={battingHeaders}
                  rows={battingRows}
                  colGridClass={battingColGrid}
                  emptyText="No batting data"
                />
              </SectionCard>
              {didNotBat.length > 0 && (
                <div className="text-[12px] sm:text-sm text-slate-300 mt-3">
                  <span className="font-bold uppercase tracking-wide text-slate-400 mr-2">
                    Did not bat:
                  </span>
                  {didNotBat.map((p) => titleCase(p.PlayerName)).join(", ")}
                </div>
              )}
              {extras && (
                <div className="text-[12px] sm:text-sm text-slate-300 mt-2">
                  <span className="font-bold uppercase tracking-wide text-slate-400 mr-2">
                    Extras:
                  </span>
                  {extras.TotalExtras} (b {extras.Byes}, lb {extras.LegByes}, w{" "}
                  {extras.Wides}, nb {extras.NoBalls})
                </div>
              )}
              {fallOfWickets.length > 0 && (
                <div className="text-[12px] sm:text-sm text-slate-300 mt-2">
                  <span className="font-bold uppercase tracking-wide text-slate-400 mr-2">
                    Fall of wickets:
                  </span>
                  {fallOfWickets
                    .map(
                      (w) =>
                        `${w.Score} ${titleCase(w.PlayerName)}`,
                    )
                    .join(" • ")}
                </div>
              )}
            </div>

            <div>
              <SectionHeading>Bowling</SectionHeading>
              <SectionCard>
                <StatsTable
                  headers={bowlingHeaders}
                  rows={bowlingRows}
                  colGridClass={bowlingColGrid}
                  emptyText="No bowling data"
                />
              </SectionCard>
            </div>
          </>
        ) : (
          <SectionCard className="px-6 py-10 text-center">
            <p className="text-slate-300 text-sm">
              Innings data unavailable.
            </p>
          </SectionCard>
        )}
      </div>
    </div>
  );
}
