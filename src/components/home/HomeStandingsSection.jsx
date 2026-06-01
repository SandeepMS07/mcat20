"use client";
import { useEffect, useState } from "react";
import { getStandings } from "@/app/api/serverApi";
import "./style.css";

const TOP_N = 4;

const SEASON4_MEN_STATIC = [
  { TeamName: "Eagle Thane Strikers", TeamLogo: "", Matches: 1, Wins: 1, Loss: 0, Tied: 0, NetRunRate: 3.202, ForTeams: "194/15.2", AgainstTeam: "189/20.0", Points: 2 },
  { TeamName: "Aakash Tigers MWS",    TeamLogo: "", Matches: 0, Wins: 0, Loss: 0, Tied: 0, NetRunRate: 0,     ForTeams: "0/0.0",    AgainstTeam: "0/0.0",    Points: 0 },
  { TeamName: "Arcs Andheri",         TeamLogo: "", Matches: 0, Wins: 0, Loss: 0, Tied: 0, NetRunRate: 0,     ForTeams: "0/0.0",    AgainstTeam: "0/0.0",    Points: 0 },
  { TeamName: "Bandra Blasters",      TeamLogo: "", Matches: 1, Wins: 0, Loss: 1, Tied: 0, NetRunRate: -3.202, ForTeams: "189/20.0", AgainstTeam: "194/15.2", Points: 0 },
  { TeamName: "MSC Maratha Royals",   TeamLogo: "", Matches: 0, Wins: 0, Loss: 0, Tied: 0, NetRunRate: 0,     ForTeams: "0/0.0",    AgainstTeam: "0/0.0",    Points: 0 },
  { TeamName: "North Mumbai Panthers",TeamLogo: "", Matches: 0, Wins: 0, Loss: 0, Tied: 0, NetRunRate: 0,     ForTeams: "0/0.0",    AgainstTeam: "0/0.0",    Points: 0 },
  { TeamName: "SoBo Mumbai Falcons",  TeamLogo: "", Matches: 0, Wins: 0, Loss: 0, Tied: 0, NetRunRate: 0,     ForTeams: "0/0.0",    AgainstTeam: "0/0.0",    Points: 0 },
  { TeamName: "Triumph Knights Mumbai North East", TeamLogo: "", Matches: 0, Wins: 0, Loss: 0, Tied: 0, NetRunRate: 0, ForTeams: "0/0.0", AgainstTeam: "0/0.0", Points: 0 },
];

const getTeamAbbreviation = (teamName) => {
  if (!teamName) return "";
  return teamName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
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
        SEASON4_MEN_STATIC;
      setStandingsData(points);
      setLoading(false);
    };
    fetchData();
  }, []);

  const rows = (Array.isArray(standingsData) ? standingsData : [])
    .slice()
    .sort((a, b) => {
      const pts = (t) => Number(t?.Points ?? t?.points ?? 0);
      const nrr = (t) => Number(t?.NetRunRate ?? t?.net_run_rate ?? 0);
      const m = (t) => Number(t?.Matches ?? t?.played ?? 0);
      return pts(b) - pts(a) || m(b) - m(a) || nrr(b) - nrr(a);
    })
    .slice(0, TOP_N)
    .map((team, index) => {
      const fullName = team?.TeamName || team?.team_name || "Unknown";
      return {
        rank: index + 1,
        name: fullName,
        shortName: fullName,
        logo: team?.TeamLogo || "",
        p: parseInt(team?.Matches || "0", 10),
        w: parseInt(team?.Wins || "0", 10),
        l: parseInt(team?.Loss || "0", 10),
        t: parseInt(team?.Tied || "0", 10),
        nrr: parseFloat(team?.NetRunRate || "0").toFixed(3),
        for: team?.RunsScored ?? team?.ForTeams ?? "—",
        against: team?.RunsConceded ?? team?.AgainstTeam ?? "—",
        pts: parseInt(team?.Points || "0", 10),
      };
    });

  return (
    <section className="relative overflow-hidden bg-[#192A66] py-12 sm:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[url('/images/texture-bg.png')] bg-cover bg-center bg-no-repeat opacity-30"
      />
      <div className="relative section-width">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#1F2E7D] to-transparent px-5 py-8 sm:px-10 sm:py-10">
          <div className="mb-6 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <h2 className="flex flex-col text-4xl font-extrabold uppercase italic leading-[0.9] text-white sm:text-5xl lg:text-6xl">
              <span
                className="text-transparent [-webkit-text-stroke:2px_#7E93DB]"
                style={{ WebkitTextStroke: "2px #7E93DB" }}
              >
                Season 4
              </span>
              <span>Standings</span>
            </h2>

            <button
              type="button"
              className="inline-flex h-10 w-fit cursor-pointer items-center justify-center rounded-full border border-white/40 px-6 text-xs font-semibold uppercase italic tracking-wide text-white transition-colors hover:bg-white/10 sm:text-sm"
            >
              View More
            </button>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-[#223783] p-8 text-center text-white/80">
              Loading standings...
            </div>
          ) : rows.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#223783] p-8 text-center text-white/80">
              Standings will appear when Season 4 begins.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full border-separate border-spacing-y-3 italic text-white">
                <thead>
                  <tr className="bg-[#1F43C5] text-left text-xs uppercase text-[#FFE24A]">
                    <th className="rounded-l-full px-4 py-3">Pos</th>
                    <th className="px-4 py-3">Teams</th>
                    <th className="px-4 py-3">M</th>
                    <th className="px-4 py-3">W</th>
                    <th className="px-4 py-3">L</th>
                    <th className="px-4 py-3">T</th>
                    <th className="px-4 py-3">NRR</th>
                    <th className="px-4 py-3">For</th>
                    <th className="px-4 py-3">Against</th>
                    <th className="rounded-r-full px-4 py-3">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={`${row.name}-${row.rank}`} className="text-sm">
                      <td
                        className="w-12 px-2 text-5xl font-black italic leading-none text-transparent [-webkit-text-stroke:2px_#7E93DB]"
                        style={{ WebkitTextStroke: "2px #7E93DB" }}
                      >
                        {row.rank}
                      </td>
                      <td className="relative rounded-l-full bg-[#2447C6]">
                        <div className="absolute -right-[11.5px] top-[11px] z-10 h-[32px] w-[54.5px] -rotate-90 rounded-t-full bg-[#D18FDB]" />
                        <div className="absolute -right-[12px] top-[11px] z-10 h-[32px] w-[54.5px] -rotate-90 rounded-t-full bg-[#192A66]" />
                        <div className="relative flex items-center gap-2 overflow-hidden rounded-l-full bg-[#2447C6] pr-6">
                          <div className="z-10 m-0.5 flex h-12 w-12 items-center justify-center rounded-full border border-[#AF313A] bg-white">
                            {row.logo ? (
                              <img
                                src={row.logo}
                                alt={row.shortName}
                                className="h-10 w-10 rounded-full object-contain"
                              />
                            ) : (
                              <span className="text-[10px] font-bold text-[#1A2C76]">
                                {getTeamAbbreviation(row.name)}
                              </span>
                            )}
                          </div>
                          <span className="z-10 pr-5 text-xs font-extrabold uppercase text-[#FFE150]">
                            {row.shortName}
                          </span>
                          {row.rank <= 4 && (
                            <span
                              className="absolute right-[22px] z-10 flex h-4 w-4 items-center justify-center rounded-full bg-[#FFE24A] text-[9px] font-black text-[#1A2C76]"
                              title="Qualified"
                            >
                              Q
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="relative bg-[#192A66] px-4 py-2 font-semibold">
                        <div className="absolute right-0 top-0 bottom-0 my-auto h-3/5 w-px bg-[#9F3BE3]/70" />
                        {row.p}
                      </td>
                      <td className="relative bg-[#192A66] px-4 py-2 font-semibold">
                        <div className="absolute right-0 top-0 bottom-0 my-auto h-3/5 w-px bg-[#9F3BE3]/70" />
                        {row.w}
                      </td>
                      <td className="relative bg-[#192A66] px-4 py-2 font-semibold">
                        <div className="absolute right-0 top-0 bottom-0 my-auto h-3/5 w-px bg-[#9F3BE3]/70" />
                        {row.l}
                      </td>
                      <td className="relative bg-[#192A66] px-4 py-2 font-semibold">
                        <div className="absolute right-0 top-0 bottom-0 my-auto h-3/5 w-px bg-[#9F3BE3]/70" />
                        {row.t}
                      </td>
                      <td className="relative bg-[#192A66] px-4 py-2 font-semibold">
                        <div className="absolute right-0 top-0 bottom-0 my-auto h-3/5 w-px bg-[#9F3BE3]/70" />
                        {row.nrr}
                      </td>
                      <td className="relative bg-[#192A66] px-4 py-2 font-semibold">
                        <div className="absolute right-0 top-0 bottom-0 my-auto h-3/5 w-px bg-[#9F3BE3]/70" />
                        {row.for}
                      </td>
                      <td className="relative bg-[#192A66] px-4 py-2 font-semibold">
                        <div className="absolute right-0 top-0 bottom-0 my-auto h-3/5 w-px bg-[#9F3BE3]/70" />
                        {row.against}
                      </td>
                      <td className="rounded-r-full bg-[#192A66] px-4 py-2 font-semibold border-r border-[#1F43C5]">
                        {row.pts}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HomeStandingsSection;
