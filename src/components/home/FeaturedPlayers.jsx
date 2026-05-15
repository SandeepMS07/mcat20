"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import TitleComponent from "../common/TitleComponent";
import routes from "@/utilis/route";
import statsData from "@/constant/stats/statsData.json";
import { season3TeamLogo, toTitleCase } from "@/utilis/helper";

const DEFAULT_PLAYER_IMG = "/images/playerProfile/1.svg";

const getTeamLogo = (teamName) => season3TeamLogo?.[teamName] || "";

const buildPlayers = () => {
  const players = Object.entries(statsData)
    .map(([id, p]) => ({
      id,
      name: p.name_full,
      photo: p.player_photo || DEFAULT_PLAYER_IMG,
      season: p.seasons?.season_3,
    }))
    .filter(
      (p) =>
        p.season &&
        (p.season.batting?.matches_played > 0 ||
          p.season.bowling?.matches_played > 0),
    );

  const pick = (sorted, label, statsBuilder) => {
    const top = sorted[0];
    if (!top) return null;
    return {
      label,
      name: top.name,
      photo: top.photo,
      team: top.season.team_name,
      teamLogo: getTeamLogo(top.season.team_name),
      stats: statsBuilder(top.season),
    };
  };

  const fmt = (n) => (typeof n === "number" ? n.toFixed(2) : n);

  const topBatsman = pick(
    [...players]
      .filter((p) => p.season.batting?.runs > 0)
      .sort((a, b) => b.season.batting.runs - a.season.batting.runs),
    "TOP BATSMAN",
    (s) => [
      { label: "HS", value: s.batting.highest_score || 0 },
      { label: "MATCHES", value: s.batting.matches_played },
      { label: "RUNS", value: s.batting.runs },
      { label: "SR", value: fmt(s.batting.strike_rate) },
    ],
  );

  const topBowler = pick(
    [...players]
      .filter((p) => p.season.bowling?.wickets > 0)
      .sort((a, b) => b.season.bowling.wickets - a.season.bowling.wickets),
    "TOP BOWLER",
    (s) => [
      { label: "WK", value: s.bowling.wickets },
      { label: "MATCHES", value: s.bowling.matches_played },
      { label: "ECO", value: fmt(s.bowling.economy_rate) },
      { label: "MAID", value: s.bowling.maidens },
    ],
  );

  const topStrikeRate = pick(
    [...players]
      .filter((p) => p.season.batting?.runs >= 100)
      .sort(
        (a, b) => b.season.batting.strike_rate - a.season.batting.strike_rate,
      ),
    "TOP STRIKE RATE",
    (s) => [
      { label: "SR", value: fmt(s.batting.strike_rate) },
      { label: "MATCHES", value: s.batting.matches_played },
      { label: "RUNS", value: s.batting.runs },
      { label: "HS", value: s.batting.highest_score || 0 },
    ],
  );

  const bestEconomy = pick(
    [...players]
      .filter(
        (p) =>
          p.season.bowling?.matches_played > 0 &&
          p.season.bowling?.economy_rate > 0 &&
          p.season.bowling?.innings_bowled >= 3,
      )
      .sort(
        (a, b) => a.season.bowling.economy_rate - b.season.bowling.economy_rate,
      ),
    "BEST ECONOMY",
    (s) => [
      { label: "ECO", value: fmt(s.bowling.economy_rate) },
      { label: "MATCHES", value: s.bowling.matches_played },
      { label: "WK", value: s.bowling.wickets },
      { label: "MAID", value: s.bowling.maidens },
    ],
  );

  const topFielder = pick(
    [...players]
      .filter((p) => p.season.fielding)
      .sort(
        (a, b) =>
          (b.season.fielding.total_dismissals_effected || 0) -
          (a.season.fielding.total_dismissals_effected || 0),
      ),
    "TOP FIELDER",
    (s) => [
      { label: "DISM", value: s.fielding?.total_dismissals_effected || 0 },
      { label: "MATCHES", value: s.fielding?.matches_played || 0 },
      {
        label: "CATCH",
        value:
          (s.fielding?.catches_fielder || 0) +
          (s.fielding?.catches_keeper || 0),
      },
      { label: "RO", value: s.fielding?.run_outs_involved || 0 },
    ],
  );

  const highestScore = pick(
    [...players]
      .filter((p) => p.season.batting?.highest_score > 0)
      .sort(
        (a, b) =>
          (b.season.batting.highest_score || 0) -
          (a.season.batting.highest_score || 0),
      ),
    "HIGHEST SCORE",
    (s) => [
      { label: "HS", value: s.batting.highest_score || 0 },
      { label: "MATCHES", value: s.batting.matches_played },
      { label: "RUNS", value: s.batting.runs },
      { label: "SR", value: fmt(s.batting.strike_rate) },
    ],
  );

  return [
    topBatsman,
    topBowler,
    topStrikeRate,
    bestEconomy,
    topFielder,
    highestScore,
  ].filter(Boolean);
};

const CARD_GRADIENTS = [
  "linear-gradient(160deg, #F4A03B 0%, #E07E27 60%, #C95E10 100%)",
  "linear-gradient(160deg, #FDD835 0%, #F2A23A 100%)",
  "linear-gradient(160deg, #1B3FA0 0%, #04123C 100%)",
  "linear-gradient(160deg, #B0006B 0%, #6D0040 100%)",
  "linear-gradient(160deg, #0C7C5A 0%, #054532 100%)",
  "linear-gradient(160deg, #C9457B 0%, #7C2350 100%)",
];

const PlayerCard = ({ player, index }) => {
  if (!player) return null;
  return (
    <div className="relative overflow-hidden rounded-xl shadow-lg bg-gradient-to-b from-[#ED8E00] to-[#C93900]">
      <div className="flex items-start justify-between px-4 pt-3 text-white">
        <span className="rounded bg-black/30 px-2 py-1 text-[10px] font-bold uppercase tracking-wide sm:text-xs">
          {player.label}
        </span>
        <img src={"/images/home/logo.svg"} alt="" className="h-14 w-auto" />
      </div>
      <div className="relative flex h-44 items-end justify-center sm:h-56">
        <img
          src={player.photo}
          alt={player.name}
          className="absolute inset-x-0 bottom-0 mx-auto h-full w-auto object-contain"
          onError={(e) => {
            if (e.currentTarget.dataset.fallbackApplied) return;
            e.currentTarget.dataset.fallbackApplied = "true";
            e.currentTarget.src = DEFAULT_PLAYER_IMG;
          }}
        />
      </div>
      <div className="bg-black/15 px-4 pb-3 pt-2 text-center">
        <h4 className="truncate text-base font-extrabold uppercase italic text-white sm:text-lg">
          {toTitleCase(player.name)}
        </h4>
      </div>
      <div className="grid grid-cols-2 gap-px bg-white/10 text-white">
        {player.stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center justify-center bg-black/40 px-2 py-2"
          >
            <span className="text-[10px] font-semibold uppercase tracking-wide text-white/70 sm:text-xs">
              {stat.label}
            </span>
            <span className="text-lg font-extrabold sm:text-xl">
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const FeaturedPlayers = () => {
  const [tab, setTab] = useState("men");
  const menPlayers = useMemo(() => buildPlayers(), []);
  const players = tab === "men" ? menPlayers : [];

  return (
    <div
      className="bg-[url('/images/home/player-section-texture.png')] bg-cover bg-center bg-no-repeat bg-[#192A66]
    "
    >
      <div className="section-width section-padding">
        <div className="flex items-end justify-between gap-3">
          <h2 className="flex flex-col text-3xl font-extrabold uppercase italic leading-[0.95] text-[#ffffff] sm:text-4xl lg:text-6xl mb-6">
            <span
              className="text-transparent [-webkit-text-stroke:1.5px_#ffffff]"
              style={{ WebkitTextStroke: "1.5px #ffffff" }}
            >
              FEATURED
            </span>
            <span>PLAYERS</span>
          </h2>
          <div className="mb-12 hidden gap-1 self-center rounded-full bg-[#E07E27] p-1 sm:flex ">
            <button
              type="button"
              onClick={() => setTab("men")}
              className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition  italic ${
                tab === "men"
                  ? "bg-[#fff] text-black"
                  : "text-white hover:text-white"
              }`}
            >
              Men
            </button>
            <button
              type="button"
              onClick={() => setTab("women")}
              className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition italic ${
                tab === "women"
                  ? "bg-[#fff] text-black"
                  : "text-white hover:text-white"
              }`}
            >
              Women
            </button>
          </div>
        </div>

        <div className="mb-6 flex justify-center gap-1 rounded-full bg-black/30 p-1 sm:hidden">
          <button
            type="button"
            onClick={() => setTab("men")}
            className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide ${
              tab === "men" ? "bg-[#E07E27] text-white" : "text-white/70"
            }`}
          >
            Men
          </button>
          <button
            type="button"
            onClick={() => setTab("women")}
            className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide ${
              tab === "women" ? "bg-[#E07E27] text-white" : "text-white/70"
            }`}
          >
            Women
          </button>
        </div>

        {players.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {players.map((player, idx) => (
              <PlayerCard
                key={`${player.label}-${idx}`}
                player={player}
                index={idx}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-black/30 py-16 text-center text-white/70">
            Women&apos;s player stats coming soon for Season 4.
          </div>
        )}

        <Link
          href={routes.stats || "#"}
          className="btn-primary mx-auto mt-8 flex w-fit items-center gap-2 sm:hidden"
        >
          View All Players
          <img
            src="/images/home/hero/buttonIcon.svg"
            alt="arrow"
            width={24}
            height={24}
            className="h-5 w-5"
          />
        </Link>
      </div>
    </div>
  );
};

export default FeaturedPlayers;
