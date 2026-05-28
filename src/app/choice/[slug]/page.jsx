"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { BsArrowLeftCircle } from "react-icons/bs";
import PlayerCard from "@/components/teams/meetMyTeam/PlayerCard";
import Sponsorship from "@/components/common/Sponsorship";
import LoadingPage from "@/app/loading";
import { useAuth } from "@/components/auth/AuthContext";
import { getChoicePoll, voteChoice } from "@/app/api/polls";
import { getCategoryBySlug } from "../categories";

// "RANESH KUMAR SHARMA" -> "Ranesh K. S." for the card's display name.
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

export default function ChoiceCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;
  const category = getCategoryBySlug(slug);
  const { isAuthed, openLogin } = useAuth();

  const [poll, setPoll] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [voteError, setVoteError] = useState("");
  const [pendingId, setPendingId] = useState(null);

  // Load the category's poll (slug `vc-<category-slug>`). A 404 just means the
  // category hasn't been seeded yet — show the "coming soon" empty state.
  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await getChoicePoll(slug);
        if (!cancelled) setPoll(data);
      } catch (err) {
        if (!cancelled) {
          setPoll(null);
          setError(
            err?.response?.status === 404
              ? ""
              : "Unable to load this category right now.",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const options = poll?.options ?? [];
  const totalVotes = poll?.total_votes ?? 0;
  const selectedId = poll?.my_selection ?? null;
  const hasVoted = selectedId != null;
  const isClosed = poll != null && poll.status !== "active";
  // Show real results (bars + %) once the user has voted or voting has closed.
  const showResults = hasVoted || isClosed;

  const players = useMemo(
    () =>
      options.map((opt) => ({
        optionId: opt.id,
        name: toTitleCaseWithInitials(opt.label),
        firstName: getFirstName(opt.label),
        restName: getRestOfName(opt.label),
        img: opt.image_url || "",
        votes: opt.votes || 0,
      })),
    [options],
  );

  // Optimistic vote, mirroring components/home/FanPoll.jsx, then reconcile with
  // the fresh tallies the backend returns.
  const submitVote = async (optionId) => {
    if (!poll) return;
    const prev = poll;
    const optimistic = {
      ...poll,
      my_selection: optionId,
      total_votes: (poll.total_votes || 0) + (selectedId == null ? 1 : 0),
      options: poll.options.map((opt) => {
        if (opt.id === optionId) return { ...opt, votes: (opt.votes || 0) + 1 };
        if (opt.id === selectedId && selectedId != null)
          return { ...opt, votes: Math.max(0, (opt.votes || 0) - 1) };
        return opt;
      }),
    };

    setVoteError("");
    setPendingId(optionId);
    setPoll(optimistic);

    try {
      const res = await voteChoice(slug, optionId);
      if (res && res.poll) setPoll(res.poll);
    } catch (err) {
      setPoll(prev);
      const status = err?.response?.status;
      const code = err?.response?.data?.error;
      if (status === 429 || code === "rate_limited")
        setVoteError("Too many votes. Please slow down and try again in a minute.");
      else if (code === "poll_closed")
        setVoteError("Voting for this category has closed.");
      else if (code === "invalid_option")
        setVoteError("That nominee is no longer available.");
      else setVoteError("Something went wrong. Please try again.");
    } finally {
      setPendingId(null);
    }
  };

  const handleVote = (optionId) => {
    if (pendingId !== null || isClosed) return;
    if (optionId === selectedId) return;
    if (!isAuthed) {
      openLogin(() => submitVote(optionId), { variant: "viewersChoice" });
      return;
    }
    submitVote(optionId);
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

          {/* Category label */}
          <p className="mt-4 text-sm font-semibold italic text-white/70">
            {category.label}
          </p>

          {error ? (
            <p className="mt-16 text-center text-white/70">{error}</p>
          ) : players.length === 0 ? (
            <p className="mt-16 text-center italic text-white/70">
              Nominees coming soon for this category.
            </p>
          ) : (
            <>
              {isClosed ? (
                <p className="mt-6 text-center text-sm font-semibold italic text-white/70">
                  Voting has closed — final results below.
                </p>
              ) : null}
              {voteError ? (
                <p className="mt-6 text-center text-sm font-semibold text-red-300">
                  {voteError}
                </p>
              ) : null}

              <div className="mt-6 sm:mt-12 md:mt-20 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-3 sm:gap-x-8 md:gap-x-10 lg:gap-x-12 gap-y-8 sm:gap-y-12 md:gap-y-20">
                {players.map((player) => (
                  <PlayerCard
                    key={player.optionId}
                    player={player}
                    voteState={showResults ? "progress" : "button"}
                    showProgress={showResults}
                    votePercent={
                      totalVotes > 0 ? (player.votes / totalVotes) * 100 : 0
                    }
                    isSelected={selectedId === player.optionId}
                    onVoteClick={() => handleVote(player.optionId)}
                  />
                ))}
              </div>

              {hasVoted && !isClosed ? (
                <p className="mt-10 text-center text-white/80 italic">
                  Thanks for voting! Live results shown above.
                </p>
              ) : null}
            </>
          )}
        </div>
      </section>

      <Sponsorship />
    </div>
  );
}
