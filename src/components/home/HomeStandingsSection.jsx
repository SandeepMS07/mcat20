"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import routes from "@/utilis/route";
import { getStandings } from "@/app/api/serverApi";
import "./style.css";

const HEADERS = [
  { key: "pos", label: "POS" },
  { key: "teams", label: "TEAMS" },
  { key: "p", label: "P" },
  { key: "w", label: "W" },
  { key: "l", label: "L" },
  { key: "t", label: "T" },
  { key: "nrr", label: "NRR" },
  { key: "for", label: "FOR" },
  { key: "against", label: "AGAINST" },
  { key: "pts", label: "PTS" },
  { key: "form", label: "RECENT FORM" },
];

const getTeamAbbreviation = (teamName) => {
  if (!teamName) return "";
  return teamName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
};

const synthesiseRecentForm = (wins, losses) => {
  const form = [];
  for (let i = 0; i < Math.min(wins, 3); i += 1) form.push("W");
  for (let i = 0; i < Math.min(losses, 5 - form.length); i += 1) form.push("L");
  return form.slice(0, 5);
};

const HomeStandingsSection = () => {
  const [standingsData, setStandingsData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const standingsRes = await getStandings();
      const points =
        standingsRes?.data?.season_4?.points ||
        standingsRes?.data?.season_3?.points ||
        [];
      setStandingsData(points);
      setLoading(false);
    };
    fetchData();
  }, []);

  const rows = Array.isArray(standingsData) ? standingsData : [];

  return (
    <section className="bg-[#192a66] py-12 sm:py-16">
      <div className="section-width">
        <div className="mb-6 flex items-end justify-between gap-3 sm:mb-8">
          <h2 className="flex flex-col text-3xl font-extrabold uppercase italic leading-none text-white sm:text-4xl lg:text-5xl">
            <span className="text-white/70">Season 4</span>
            <span>Standings</span>
          </h2>
          <Link
            href={routes.standing || "#"}
            className="inline-flex h-10 items-center justify-center rounded-full border border-white/40 px-5 text-xs font-medium uppercase italic tracking-wide text-white transition-colors hover:bg-white/10 sm:text-sm"
          >
            View More
          </Link>
        </div>

        {loading ? (
          <div className="py-10 text-center text-white/60">Loading...</div>
        ) : rows.length === 0 ? (
          <div className="py-10 text-center text-white/60">
            Standings will appear when Season 4 begins.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[900px] space-y-2">
              <div className="flex h-12 items-center rounded-3xl bg-[#1b3eb9] px-3 text-xs font-bold uppercase italic tracking-wide text-[#ffda00]">
                {HEADERS.map((h) => (
                  <div
                    key={h.key}
                    className={`${
                      h.key === "teams"
                        ? "flex-[2] pl-12"
                        : h.key === "pos"
                          ? "w-14 text-center"
                          : h.key === "form"
                            ? "flex-1 text-center"
                            : "flex-1 text-center"
                    }`}
                  >
                    {h.label}
                  </div>
                ))}
              </div>

              {rows.map((team, index) => {
                const fullName = team?.TeamName || team?.team_name || "";
                const abbr = getTeamAbbreviation(fullName);
                const wins = parseInt(team?.Wins || "0", 10);
                const losses = parseInt(team?.Loss || "0", 10);
                const form = synthesiseRecentForm(wins, losses);
                const runsFor = team?.RunsScored ?? team?.runs_for ?? "—";
                const runsAgainst =
                  team?.RunsConceded ?? team?.runs_against ?? "—";

                return (
                  <div
                    key={fullName + index}
                    className="relative flex h-14 items-center rounded-3xl bg-[#1b3eb9] px-3 text-sm text-white"
                  >
                    <div className="w-14 text-center text-2xl font-extrabold italic text-[#F2A23A]">
                      {index + 1}
                    </div>

                    <div className="ml-1 flex flex-1 items-center rounded-3xl bg-[#192a66] py-2 pl-3 pr-3">
                      <div className="flex flex-[2] items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E07E27]">
                          {team?.TeamLogo ? (
                            <img
                              src={team.TeamLogo}
                              alt={fullName}
                              className="h-6 w-6 object-contain"
                            />
                          ) : (
                            <span className="text-xs font-bold text-white">
                              {abbr}
                            </span>
                          )}
                        </span>
                        <span className="font-semibold">{fullName}</span>
                      </div>
                      <div className="flex-1 text-center">
                        {parseInt(team?.Matches || "0", 10)}
                      </div>
                      <div className="flex-1 text-center">{wins}</div>
                      <div className="flex-1 text-center">{losses}</div>
                      <div className="flex-1 text-center">
                        {parseInt(team?.Tied || "0", 10)}
                      </div>
                      <div className="flex-1 text-center">
                        {parseFloat(team?.NetRunRate || "0").toFixed(3)}
                      </div>
                      <div className="flex-1 text-center text-white/80">
                        {runsFor}
                      </div>
                      <div className="flex-1 text-center text-white/80">
                        {runsAgainst}
                      </div>
                      <div className="flex-1 text-center text-base font-extrabold text-[#F2A23A]">
                        {parseInt(team?.Points || "0", 10)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-center gap-1.5">
                          {form.length === 0 ? (
                            <span className="text-xs text-white/40">—</span>
                          ) : (
                            form.map((r, i) => (
                              <span
                                key={i}
                                className={`h-3 w-3 rounded-full ring-1 ${
                                  r === "W"
                                    ? "bg-[#16b652] ring-[#16b652]/60"
                                    : "bg-[#ff0101] ring-[#ff0101]/60"
                                }`}
                                aria-label={r === "W" ? "Win" : "Loss"}
                              />
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <Link
          href={routes.standing || "#"}
          className="mx-auto mt-6 inline-flex h-10 w-fit items-center justify-center rounded-full border border-white/40 px-5 text-xs font-medium uppercase italic tracking-wide text-white sm:hidden"
        >
          View More
        </Link>
      </div>
    </section>
  );
};

export default HomeStandingsSection;
