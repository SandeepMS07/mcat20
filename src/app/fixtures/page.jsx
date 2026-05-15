"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import fixtures1 from "@/utilis/fixtures/fixtures1.js";
import fixtures2 from "@/utilis/fixtures/fixtures2.js";
import fixtures4, { resolveSeason4Logo } from "@/utilis/fixtures/fixtures4";
import { teamShortName } from "@/utilis/helper";
import routes from "@/utilis/route";
import FixtureWidget from "./components/FixtureWidget";
import Sponsorship from "@/components/common/Sponsorship";

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const DOWS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const ALL_TEAMS = "All Teams";
const ALL_VENUES = "All Venues";
const INITIAL_VISIBLE = 5;
const PAGE_INCREMENT = 5;

const SEASONS = [
  { value: "season1", label: "Season 1" },
  { value: "season2", label: "Season 2" },
  { value: "season3", label: "Season 3" },
  { value: "season4", label: "Season 4" },
];

const SEASON_LABEL = Object.fromEntries(SEASONS.map((s) => [s.value, s.label]));
const SEASON_VALUE = Object.fromEntries(SEASONS.map((s) => [s.label, s.value]));

function formatBigDate(date) {
  if (!date) return "";
  return `${MONTHS[date.getMonth()]}, ${DOWS[date.getDay()]} ${String(date.getDate()).padStart(2, "0")}`;
}

function formatTime(date) {
  if (!date) return "";
  return (
    date
      .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
      .replace("AM", "am")
      .replace("PM", "pm") + " IST"
  );
}

function parseSeason4Date(dateStr, timeStr) {
  if (!dateStr) return null;
  const t = (timeStr || "12:00 PM").trim();
  const date = new Date(`${dateStr} ${t}`);
  return isNaN(date.getTime()) ? null : date;
}

const ClockIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PinIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M12 22s7-7.16 7-12a7 7 0 10-14 0c0 4.84 7 12 7 12z" strokeLinejoin="round" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

const ChevronDown = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PillToggle = ({ options, value, onChange, variant = "outline" }) => (
  <div
    className={`flex items-center gap-1 rounded-full p-1 w-full max-w-full sm:w-auto sm:inline-flex overflow-hidden ${
      variant === "filled"
        ? "bg-[#f68323] border border-[#f68323]"
        : "bg-[#091d65] border border-white/80"
    }`}
  >
    {options.map((opt) => {
      const active = value === opt.value;
      return (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex-1 sm:flex-none min-w-0 px-3 sm:px-7 py-1.5 rounded-full text-[12px] sm:text-sm font-medium italic uppercase tracking-wide transition-colors truncate ${
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

const FilterSelect = ({ value, options, onChange, label }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className="appearance-none bg-white/10 border border-gray-300/40 rounded-md text-white text-xs sm:text-sm font-extrabold italic uppercase tracking-wide pl-4 pr-9 py-2 min-w-[140px] sm:min-w-[160px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#f68323]/60 hover:bg-white/15"
    >
      {options.map((opt) => (
        <option key={opt} value={opt} className="bg-[#091d65] text-white">
          {opt.toUpperCase()}
        </option>
      ))}
    </select>
    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-white pointer-events-none" />
  </div>
);

const TeamSide = ({ name, logo, score, overs, winner, align = "left" }) => {
  const hasScore = !!(score || overs);
  return (
    <div className="flex flex-col gap-3 min-w-0">
      <div
        className={`flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0 ${
          align === "right" ? "flex-row-reverse text-right" : "flex-row text-left"
        }`}
      >
        <div
          className={`shrink-0 size-11 sm:size-[56px] md:size-[60px] rounded-full bg-white border ${
            winner ? "border-[#ef4123]" : "border-[#af313a]"
          } flex items-center justify-center p-1 overflow-hidden`}
        >
          <img
            src={logo || "/images/fixtures/logoPlaceHolder.png"}
            alt={`${name} logo`}
            onError={(e) => {
              e.currentTarget.src = "/images/fixtures/logoPlaceHolder.png";
            }}
            className="size-full object-contain"
          />
        </div>
        <div className="min-w-0 text-white font-extrabold uppercase text-[11px] sm:text-[13px] md:text-[14px] lg:text-[15px] leading-tight tracking-wide line-clamp-2">
          {name}
        </div>
      </div>
      {hasScore && (
        <div className="flex flex-col items-center gap-0.5">
          <span
            className={`font-semibold text-2xl sm:text-[26px] md:text-3xl leading-none ${
              winner ? "text-[#ef4123]" : "text-white"
            }`}
          >
            {score || "-"}
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

const VsBadge = ({ subText, subTextItalic }) => (
  <div className="px-3 sm:px-4 shrink-0 flex flex-col items-center gap-2 self-center">
    <div className="-skew-x-12">
      <div className="font-black italic text-white text-2xl sm:text-3xl md:text-[34px] leading-none tracking-wider">
        V/S
      </div>
    </div>
    {subText && (
      <div className="flex flex-col items-center gap-0.5 max-w-[180px]">
        <div className="text-[11px] sm:text-xs text-slate-400 text-center font-medium leading-tight">
          {subText}
        </div>
        {subTextItalic && (
          <div className="text-[11px] sm:text-xs text-slate-400 italic text-center font-medium leading-tight">
            {subTextItalic}
          </div>
        )}
      </div>
    )}
  </div>
);

const MatchCard = ({ match }) => {
  const isCompleted = match.isCompleted;
  const isReserve = match.isReserve;

  if (isReserve) {
    return (
      <div className="flex flex-col md:grid md:grid-cols-[200px_1fr] lg:grid-cols-[236px_1fr] md:gap-0 gap-4 items-stretch w-full min-w-0">
        {/* Left meta */}
        <div className="relative md:pr-8 min-w-0">
          <div className="-skew-x-12 inline-block border border-white/10 px-3 py-2">
            <div className="skew-x-12">
              <span className="text-white font-black text-[10px] sm:text-xs tracking-[0.12em] uppercase leading-tight whitespace-nowrap">
                {match.matchLabel}
              </span>
            </div>
          </div>
          <h3 className="mt-3 md:mt-6 font-black italic uppercase text-white text-[22px] sm:text-3xl md:text-[28px] lg:text-[30px] leading-tight whitespace-nowrap">
            {match.bigDate}
          </h3>
          <div className="hidden md:block absolute left-[105px] right-[-32px] top-[15px] h-px bg-white/40" />
        </div>

        {/* Reserve card */}
        <div className="rounded-lg bg-white/5 border-2 border-dashed border-white/15 p-6 sm:p-8 md:p-10 flex items-center justify-center min-w-0 w-full">
          <span className="font-extrabold italic uppercase text-base sm:text-lg md:text-xl tracking-[0.15em] text-slate-300 text-center">
            {match.reserveLabel}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:grid md:grid-cols-[200px_1fr] lg:grid-cols-[236px_1fr] md:gap-0 gap-4 items-stretch w-full min-w-0">
      {/* Left: match meta */}
      <div className="relative md:pr-8 min-w-0">
        {!isCompleted && (
          <div className="-skew-x-12 inline-block border border-white/10 px-3 py-2">
            <div className="skew-x-12">
              <span className="text-white font-black text-[10px] sm:text-xs tracking-[0.12em] uppercase leading-tight whitespace-nowrap">
                {match.matchLabel}
              </span>
            </div>
          </div>
        )}
        {isCompleted && match.matchLabel && (
          <div className="-skew-x-12 inline-block border border-white/10 px-3 py-1.5">
            <div className="skew-x-12">
              <span className="text-white font-black text-[10px] tracking-[0.12em] uppercase leading-tight whitespace-nowrap">
                {match.matchLabel}
              </span>
            </div>
          </div>
        )}
        <h3
          className={`${
            !isCompleted || match.matchLabel ? "mt-3 md:mt-6" : ""
          } font-black italic uppercase text-white text-[22px] sm:text-3xl md:text-[28px] lg:text-[30px] leading-tight whitespace-nowrap`}
        >
          {match.bigDate}
        </h3>
        {match.timeStr && (
          <div className="mt-1.5 flex items-center gap-1.5 text-slate-400">
            <ClockIcon className="w-4 h-4" />
            <span className="text-[13px] sm:text-sm font-bold">{match.timeStr}</span>
          </div>
        )}
        <div className="hidden md:block absolute right-0 top-3 h-px w-28 lg:w-32 bg-gradient-to-l from-white/30 to-transparent" />
      </div>

      {/* Right: match details card */}
      <div className="rounded-lg bg-white/10 border-2 border-white/5 p-4 sm:p-6 md:p-7 lg:p-8 flex flex-col gap-4 md:gap-5 min-w-0 w-full overflow-hidden">
        {match.venueFull && (
          <div className="flex items-center gap-2 text-slate-400 pb-4 border-b border-white/10 min-w-0">
            <PinIcon className="w-4 h-4 shrink-0" />
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.1em] truncate">
              {match.venueFull}
            </span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6 w-full min-w-0">
          <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2 sm:gap-4 w-full min-w-0 lg:flex-1">
            <TeamSide
              name={match.homeName}
              logo={match.homeLogo}
              score={match.homeScore}
              overs={match.homeOvers}
              winner={match.homeWinner}
              align="left"
            />
            <VsBadge subText={match.resultSubText} subTextItalic={match.resultSubTextItalic} />
            <TeamSide
              name={match.awayName}
              logo={match.awayLogo}
              score={match.awayScore}
              overs={match.awayOvers}
              winner={match.awayWinner}
              align="right"
            />
          </div>

          {isCompleted && (
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 w-full lg:w-auto min-w-0 border-t border-white/10 pt-4 lg:border-t-0 lg:pt-0 lg:pl-6 lg:border-l">
              <Link
                href={match.matchCentreHref || routes.matchcentre}
                className="flex-1 lg:flex-none bg-[#ef4123] hover:bg-[#d83a1d] transition-colors text-white text-[11px] sm:text-xs lg:text-sm font-extrabold uppercase tracking-wide rounded-md px-2 sm:px-4 lg:px-6 py-2.5 sm:py-3 text-center min-w-0"
              >
                Match Centre
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ title, description }) => (
  <div className="rounded-xl bg-white/5 border border-white/10 px-6 py-16 text-center">
    <h3 className="text-white text-xl sm:text-2xl font-extrabold italic uppercase tracking-wide">
      {title}
    </h3>
    {description && <p className="mt-2 text-slate-300 text-sm">{description}</p>}
  </div>
);

/* ===================== Data shapers ===================== */

function normalizeSeason4Match(m) {
  const date = parseSeason4Date(m.date, m.time);
  const isPlayoff = m.type === "playoff";
  const isReserve = m.type === "reserve";
  const matchLabel = isReserve
    ? "RESERVE"
    : isPlayoff
    ? (m.label || "PLAYOFF").toUpperCase()
    : `MATCH ${m.match_no}`;

  return {
    raw: m,
    matchLabel,
    bigDate: formatBigDate(date) || m.date,
    timeStr: isReserve ? "" : formatTime(date),
    venueFull: isReserve ? "" : fixtures4.venue,
    homeName: m.home_team,
    homeLogo: resolveSeason4Logo(m.home_team, m.category),
    awayName: m.away_team,
    awayLogo: resolveSeason4Logo(m.away_team, m.category),
    reserveLabel: m.label || "Reserve Day",
    ticketLink: null,
    matchCentreHref: routes.matchcentre,
    date,
    category: m.category,
    type: m.type,
    isCompleted: false,
    isReserve,
  };
}

function resolveLegacyLogo(name) {
  if (!name) return "/images/fixtures/logoPlaceHolder.png";
  // Every legacy team has a matching SVG in /public/images/fixtures/.
  // Use it directly — the <img onError> handler swaps to placeholder if missing.
  return `/images/fixtures/${encodeURIComponent(name)}.svg`;
}

function parseLegacyScore(value) {
  if (!value) return { score: "", overs: "" };
  const oversMatch = value.match(/\(([^)]+)\)/);
  const overs = oversMatch ? oversMatch[1] : "";
  const score = value.replace(/\s*\([^)]*\)\s*/, "").trim();
  return { score, overs };
}

function ballsLeftFromOvers(overs, maxOvers = 20) {
  if (!overs) return null;
  const parts = String(overs).split(".");
  const o = parseInt(parts[0], 10);
  const b = parseInt(parts[1] || "0", 10);
  if (isNaN(o)) return null;
  const bowled = o * 6 + (isNaN(b) ? 0 : b);
  const left = maxOvers * 6 - bowled;
  return left > 0 ? left : null;
}

function buildResultSubText(m, h, a) {
  if (!m.winning_margin) return { main: "", italic: "" };
  const winnerSide = h.winner ? h : a.winner ? a : null;
  if (!winnerSide) return { main: "", italic: "" };
  const short = teamShortName[winnerSide.name];
  const who = short || winnerSide.name;
  const main = `${who} won by ${m.winning_margin}`;
  // Show balls left only for "by N wickets" wins (chase scenario)
  let italic = "";
  if (/wicket/i.test(m.winning_margin)) {
    const balls = ballsLeftFromOvers(winnerSide.overs);
    if (balls) italic = `(${balls} ball${balls === 1 ? "" : "s"} left)`;
  }
  return { main, italic };
}

function processLegacyMatches(jsonData) {
  if (!jsonData || !jsonData.matches) return [];
  return jsonData.matches.map((m) => {
    const [p1 = {}, p2 = {}] = m.participants || [];
    const start = m.start_date ? new Date(m.start_date) : null;
    const fmt = (p) => {
      const { score, overs } = parseLegacyScore(p.value);
      return {
        name: p.name || "",
        logo: resolveLegacyLogo(p.name),
        score,
        overs,
        winner: p.highlight === "true" || p.highlight === true,
      };
    };
    const h = fmt(p1);
    const a = fmt(p2);
    const isCompleted =
      m.event_status === "Match Ended" || !!m.event_sub_status;
    const { main, italic } = buildResultSubText(m, h, a);
    return {
      raw: m,
      game_id: m.game_id,
      matchLabel: m.event_name ? m.event_name.toUpperCase() : "",
      bigDate: formatBigDate(start),
      timeStr: formatTime(start),
      venueFull: m.venue_name || "",
      homeName: h.name,
      homeLogo: h.logo,
      homeScore: h.score,
      homeOvers: h.overs,
      homeWinner: h.winner,
      awayName: a.name,
      awayLogo: a.logo,
      awayScore: a.score,
      awayOvers: a.overs,
      awayWinner: a.winner,
      resultSubText: main,
      resultSubTextItalic: italic,
      ticketLink: null,
      matchCentreHref: m.game_id ? `/scores/${m.game_id}` : routes.matchcentre,
      date: start,
      isCompleted,
      category: "Men",
    };
  });
}

/* ===================== Heading ===================== */

const Heading = ({ status }) => {
  const word = status === "completed" ? "RESULTS" : "FIXTURES";
  return (
    <h2 className="font-extrabold italic uppercase leading-[0.95] tracking-tight">
      <span
        className="block text-[36px] sm:text-[44px] md:text-[52px] lg:text-[56px]"
        style={{
          WebkitTextStroke: "1.5px white",
          color: "transparent",
        }}
      >
        {word}
      </span>
      <span className="block text-white text-[36px] sm:text-[44px] md:text-[52px] lg:text-[56px]">
        TABLE
      </span>
    </h2>
  );
};

/* ===================== Page ===================== */

export default function FixturesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSeason = searchParams.get("season") || "season4";
  const initialStatus = searchParams.get("status") || "upcoming";
  const initialGender = searchParams.get("gender") || "men";
  const initialTeam = searchParams.get("team") || ALL_TEAMS;
  const initialVenue = searchParams.get("venue") || ALL_VENUES;

  const [season, setSeason] = useState(
    SEASONS.some((s) => s.value === initialSeason) ? initialSeason : "season4"
  );
  const [status, setStatus] = useState(initialStatus);
  const [gender, setGender] = useState(initialGender);
  const [team, setTeam] = useState(initialTeam);
  const [venue, setVenue] = useState(initialVenue);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  // Upcoming view only supports Season 4 — force it when status flips to upcoming
  useEffect(() => {
    if (status === "upcoming" && season !== "season4") {
      setSeason("season4");
    }
  }, [status, season]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("season", season);
    params.set("status", status);
    if (season === "season4") params.set("gender", gender);
    if (team !== ALL_TEAMS) params.set("team", team);
    if (venue !== ALL_VENUES) params.set("venue", venue);
    router.replace(`?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [season, status, gender, team, venue]);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [season, status, gender, team, venue]);

  useEffect(() => {
    setTeam(ALL_TEAMS);
    setVenue(ALL_VENUES);
  }, [season]);

  // Build the source list per season
  const sourceMatches = useMemo(() => {
    if (season === "season1") return processLegacyMatches(fixtures1);
    if (season === "season2") return processLegacyMatches(fixtures2);
    if (season === "season4")
      return fixtures4.matches.map(normalizeSeason4Match);
    return [];
  }, [season]);

  // Filter by gender (Season 4 only) — legacy seasons have no women's data
  // Reserve days always pass through (they apply to both men's and women's schedules).
  const genderFiltered = useMemo(() => {
    if (season !== "season4") return sourceMatches;
    const target = gender === "men" ? "Men" : "Women";
    return sourceMatches.filter((m) => m.isReserve || m.category === target);
  }, [sourceMatches, season, gender]);

  const teamOptions = useMemo(() => {
    const set = new Set();
    genderFiltered.forEach((m) => {
      if (m.homeName && m.homeName !== "TBD") set.add(m.homeName);
      if (m.awayName && m.awayName !== "TBD") set.add(m.awayName);
    });
    return [ALL_TEAMS, ...Array.from(set).sort()];
  }, [genderFiltered]);

  const venueOptions = useMemo(() => {
    const set = new Set();
    genderFiltered.forEach((m) => m.venueFull && set.add(m.venueFull));
    return [ALL_VENUES, ...Array.from(set).sort()];
  }, [genderFiltered]);

  const seasonOptions = useMemo(() => SEASONS.map((s) => s.label), []);

  const filtered = useMemo(() => {
    const now = new Date();
    return genderFiltered.filter((m) => {
      const upcoming = m.isCompleted
        ? false
        : m.date
        ? m.date.getTime() >= now.getTime()
        : true;
      if (status === "upcoming" && !upcoming) return false;
      if (status === "completed" && upcoming) return false;
      // Reserve days have no team/venue — keep them when filters are applied
      if (m.isReserve) return true;
      if (team !== ALL_TEAMS && m.homeName !== team && m.awayName !== team)
        return false;
      if (venue !== ALL_VENUES && m.venueFull !== venue) return false;
      return true;
    });
  }, [genderFiltered, status, team, venue]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;

  return (
    <div className="relative bg-[#091d65] min-h-screen w-full overflow-x-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-no-repeat bg-cover bg-top opacity-90"
        style={{ backgroundImage: "url('/images/fixtures/fixtures-bg.svg')" }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-gradient-to-b from-[rgba(13,55,169,0.55)] via-[rgba(13,55,169,0.25)] to-transparent" />

      <div className="section-width relative z-10 py-10 md:py-14 lg:py-16 w-full">
        {/* Top toggles */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-12 mb-8 md:mb-12">
          <PillToggle
            variant="outline"
            value={status}
            onChange={setStatus}
            options={[
              { label: "Upcoming", value: "upcoming" },
              { label: "Completed", value: "completed" },
            ]}
          />
          {season === "season4" && (
            <PillToggle
              variant="filled"
              value={gender}
              onChange={setGender}
              options={[
                { label: "Men", value: "men" },
                { label: "Women", value: "women" },
              ]}
            />
          )}
        </div>

        {/* Heading + filters */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-8 md:mb-10">
          <Heading status={status} />

          <div className="flex flex-wrap gap-3 md:gap-5">
            {status === "completed" && (
              <FilterSelect
                label="Filter by season"
                value={SEASON_LABEL[season]}
                onChange={(label) => setSeason(SEASON_VALUE[label])}
                options={seasonOptions}
              />
            )}
            <FilterSelect
              label="Filter by team"
              value={team}
              onChange={setTeam}
              options={teamOptions}
            />
            {season === "season4" && (
              <FilterSelect
                label="Filter by venue"
                value={venue}
                onChange={setVenue}
                options={venueOptions}
              />
            )}
          </div>
        </div>

        {/* Content */}
        {season === "season3" ? (
          <div className="rounded-xl bg-white/5 border border-white/10 p-3 sm:p-4 md:p-6">
            <FixtureWidget />
          </div>
        ) : visible.length === 0 ? (
          <EmptyState
            title={
              status === "completed"
                ? "No completed matches yet"
                : season !== "season4"
                ? "No upcoming matches in this season"
                : gender === "women"
                ? "No women's matches found"
                : "No matches found"
            }
            description="Stay tuned — schedule updates will appear here."
          />
        ) : (
          <div className="flex flex-col gap-6 md:gap-8 lg:gap-10">
            {visible.map((match, idx) => (
              <MatchCard
                key={`${match.game_id || match.raw?.match_no || idx}-${idx}`}
                match={match}
              />
            ))}
          </div>
        )}

        {season !== "season3" && hasMore && (
          <div className="flex justify-center mt-10 md:mt-12">
            <button
              type="button"
              onClick={() => setVisibleCount((c) => c + PAGE_INCREMENT)}
              className="bg-white/10 border border-white/30 hover:bg-white/15 transition-colors text-white text-sm font-semibold rounded-[10px] px-6 py-3"
            >
              View More &gt;
            </button>
          </div>
        )}
      </div>

      <div className="relative z-10 bg-white">
        <Sponsorship />
      </div>
    </div>
  );
}
