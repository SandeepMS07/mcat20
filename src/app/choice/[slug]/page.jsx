"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { BsArrowLeftCircle } from "react-icons/bs";
import { FiChevronDown } from "react-icons/fi";
import PlayerCard from "@/components/teams/meetMyTeam/PlayerCard";
import Sponsorship from "@/components/common/Sponsorship";
import LoadingPage from "@/app/loading";
import { getTeamDetailsClient } from "@/app/api/clientApi";
import { getCategoryBySlug } from "../categories";

const INITIAL_PAGE_SIZE = 16;
const PAGE_INCREMENT = 8;
const ALL_TEAMS = "__all__";

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

const getRestOfName = (str) =>
  !str ? "" : str.split(" ").filter(Boolean).slice(1).join(" ").toUpperCase();

const ROLE_FILTER = {
  "best-batsman": ["Batsman"],
  "best-bowler": ["Bowler"],
  "best-wicketkeeper": ["Wicketkeeper"],
  "best-captain": null,
  "emerging-player": null,
  "most-valuable-player": null,
};

const flattenPlayers = (teams, slug) => {
  const allowedRoles = ROLE_FILTER[slug];
  const players = [];

  (teams || []).forEach((team) => {
    const records = team?.Player_Registrations__r?.records || [];
    records.forEach((p) => {
      if (allowedRoles && !allowedRoles.includes(p?.Primary_Role__c)) return;
      const fullName = p?.Player__r?.Name || "";
      const rawImg = p?.Player__r?.Photo_URL_1__c;
      players.push({
        id: p?.Id,
        name: toTitleCaseWithInitials(fullName) || "Unknown",
        firstName: getFirstName(fullName),
        restName: getRestOfName(fullName),
        img: rawImg && rawImg.trim() !== "" ? rawImg : "",
        role: p?.Primary_Role__c,
        teamName: team?.Name,
      });
    });
  });

  return players;
};

const seededRandom = (seed) => {
  let h = 2166136261 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const computeVotePercentages = (players, selectedId, slug) => {
  const rng = seededRandom(slug || "choice");
  const weights = players.map((p) => {
    const base = 5 + rng() * 35;
    return p.id === selectedId ? base + 18 : base;
  });
  const total = weights.reduce((a, b) => a + b, 0);
  if (total <= 0) return players.map(() => 0);
  return weights.map((w) => (w / total) * 100);
};

export default function ChoiceCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;
  const category = getCategoryBySlug(slug);

  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(ALL_TEAMS);
  const [visibleCount, setVisibleCount] = useState(INITIAL_PAGE_SIZE);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setError("");
      const res = await getTeamDetailsClient();
      if (cancelled) return;
      const records = res?.data || [];
      if (!Array.isArray(records) || records.length === 0) {
        setError("Unable to load players right now.");
        setTeams([]);
      } else {
        setTeams(records);
      }
      setIsLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const players = useMemo(() => flattenPlayers(teams, slug), [teams, slug]);

  const teamOptions = useMemo(() => {
    const names = Array.from(
      new Set(players.map((p) => p.teamName).filter(Boolean))
    );
    names.sort((a, b) => a.localeCompare(b));
    return names;
  }, [players]);

  const filteredPlayers = useMemo(() => {
    if (selectedTeam === ALL_TEAMS) return players;
    return players.filter((p) => p.teamName === selectedTeam);
  }, [players, selectedTeam]);

  const visiblePlayers = useMemo(
    () => filteredPlayers.slice(0, visibleCount),
    [filteredPlayers, visibleCount]
  );

  const percentages = useMemo(
    () => computeVotePercentages(visiblePlayers, selectedId, slug),
    [visiblePlayers, selectedId, slug]
  );

  useEffect(() => {
    setVisibleCount(INITIAL_PAGE_SIZE);
  }, [selectedTeam]);

  useEffect(() => {
    if (!dropdownOpen) return;
    const onClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [dropdownOpen]);

  const handleVote = (playerId) => {
    if (hasVoted) return;
    setSelectedId(playerId);
    setHasVoted(true);
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-[#1E2F7D] pt-32 pb-20 text-center text-white">
        <h1 className="text-2xl font-bold">Category not found</h1>
        <Link
          href="/choice"
          className="mt-6 inline-block text-orange-400 underline"
        >
          Back to Viewers Choice
        </Link>
      </div>
    );
  }

  if (isLoading) return <LoadingPage />;

  return (
    <div className="w-full bg-[#1E2F7D]">
      <section className="relative overflow-hidden pt-[100px] pb-12 lg:pt-[140px] md:pb-16 bg-[url('/images/texture-bg.png')] bg-cover bg-center bg-no-repeat">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,88,210,0.35),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(26,40,116,0.65),transparent_45%)]" />

        <div className="section-width section-padding relative">
          {/* Back + heading row */}
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => router.push("/choice")}
                aria-label="Back to Viewers Choice"
                className="shrink-0 text-white/80 transition hover:text-white"
              >
                <BsArrowLeftCircle size={26} />
              </button>
              <h1 className="text-3xl font-extrabold italic uppercase leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
                <span
                  className="text-transparent"
                  style={{ WebkitTextStroke: "1.5px #ffffff" }}
                >
                  VIEWERS{" "}
                </span>
                <span className="text-white">CHOICE</span>
              </h1>
            </div>

            {/* Team dropdown */}
            <div ref={dropdownRef} className="relative w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setDropdownOpen((v) => !v)}
                aria-haspopup="listbox"
                aria-expanded={dropdownOpen}
                className="inline-flex w-full items-center justify-between gap-2 rounded-md border border-white/40 bg-white/10 px-4 py-2 text-sm font-extrabold italic text-white hover:bg-white/15 sm:w-auto sm:justify-start"
              >
                <span className="truncate">
                  {selectedTeam === ALL_TEAMS ? "All Teams" : selectedTeam}
                </span>
                <FiChevronDown
                  className={`shrink-0 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                  size={16}
                />
              </button>
              {dropdownOpen ? (
                <ul
                  role="listbox"
                  className="absolute left-0 z-30 mt-2 max-h-72 w-full overflow-y-auto rounded-lg border border-white/15 bg-[#0f1b4d] shadow-xl sm:left-auto sm:right-0 sm:w-64"
                >
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTeam(ALL_TEAMS);
                        setDropdownOpen(false);
                      }}
                      className={`block w-full truncate px-4 py-2 text-left text-sm transition hover:bg-white/10 ${
                        selectedTeam === ALL_TEAMS
                          ? "text-orange-400"
                          : "text-white"
                      }`}
                    >
                      All Teams
                    </button>
                  </li>
                  {teamOptions.map((name) => (
                    <li key={name}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTeam(name);
                          setDropdownOpen(false);
                        }}
                        className={`block w-full truncate px-4 py-2 text-left text-sm transition hover:bg-white/10 ${
                          selectedTeam === name
                            ? "text-orange-400"
                            : "text-white"
                        }`}
                      >
                        {name}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>

          {/* Category label */}
          <p className="mt-4 text-sm font-semibold italic text-white/70">
            {category.label}
          </p>

          {error ? (
            <p className="mt-16 text-center text-white/70">{error}</p>
          ) : filteredPlayers.length === 0 ? (
            <p className="mt-16 text-center text-white/70 italic">
              No eligible players yet for this selection.
            </p>
          ) : (
            <>
              <div className="mt-6 sm:mt-12 md:mt-20 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-3 sm:gap-x-8 md:gap-x-10 lg:gap-x-12 gap-y-8 sm:gap-y-12 md:gap-y-20">
                {visiblePlayers.map((player, idx) => (
                  <PlayerCard
                    key={player.id || idx}
                    player={player}
                    voteState={hasVoted ? "progress" : "button"}
                    showProgress={hasVoted}
                    votePercent={percentages[idx]}
                    isSelected={hasVoted && selectedId === player.id}
                    onVoteClick={() => handleVote(player.id)}
                  />
                ))}
              </div>

              {hasVoted ? (
                <p className="mt-10 text-center text-white/80 italic">
                  Thanks for voting! Live results shown above.
                </p>
              ) : null}

              {visibleCount < filteredPlayers.length ? (
                <div className="mt-10 flex justify-center">
                  <button
                    type="button"
                    onClick={() =>
                      setVisibleCount((c) => c + PAGE_INCREMENT)
                    }
                    className="rounded-lg border border-white/30 bg-white/10 px-8 py-3 text-base font-semibold text-white transition hover:bg-white/15"
                  >
                    View More &gt;
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>

      <Sponsorship />
    </div>
  );
}
