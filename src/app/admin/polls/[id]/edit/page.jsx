"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  addOption,
  deleteOption,
  deletePoll,
  getPoll,
  listMatches,
  pollVoters,
  updateOption,
  updatePoll,
} from "@/app/api/admin/polls";
import PollForm from "@/components/admin/PollForm";
import {
  Button,
  Card,
  EmptyState,
  PageHeader,
  Pill,
  PollStatusBadge,
  StatCard,
} from "@/components/admin/ui";

export default function EditPollPage() {
  const router = useRouter();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [matches, setMatches] = useState([]);
  const [voters, setVoters] = useState({
    voters: [],
    totals: { all: 0, correct: null },
  });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [optionDraft, setOptionDraft] = useState({ label: "", imageUrl: "" });
  const [voterSearch, setVoterSearch] = useState("");
  const [actionError, setActionError] = useState(null);
  // Tracks whether the component is still mounted so async handlers don't fire
  // setState after navigation away (which warns in dev and risks
  // race-condition artefacts in concurrent React).
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const reload = async () => {
    const [pollRes, matchesRes, votersRes] = await Promise.all([
      getPoll(id),
      listMatches(),
      pollVoters(id),
    ]);
    if (!mountedRef.current) return;
    setData(pollRes);
    setMatches(matchesRes.matches || []);
    setVoters(votersRes);
  };

  const safe = async (fn) => {
    try {
      await fn();
    } catch (err) {
      if (!mountedRef.current) return;
      const msg = err?.response?.data?.error || "Action failed. Try again.";
      setActionError(msg);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await reload();
      } catch {
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (patch) => {
    setSubmitting(true);
    setActionError(null);
    try {
      await updatePoll(id, patch);
      await reload();
    } catch (err) {
      if (!mountedRef.current) return;
      const msg = err?.response?.data?.error || "Failed to save changes.";
      setActionError(msg);
      throw err; // let PollForm surface the inline error too
    } finally {
      if (mountedRef.current) setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Delete this poll and all of its votes? This cannot be undone.",
      )
    )
      return;
    setActionError(null);
    try {
      await deletePoll(id);
      router.replace("/admin/polls");
    } catch (err) {
      if (!mountedRef.current) return;
      setActionError(err?.response?.data?.error || "Failed to delete poll.");
    }
  };

  const handleAddOption = () =>
    safe(async () => {
      if (!optionDraft.label.trim()) return;
      await addOption(id, {
        label: optionDraft.label.trim(),
        imageUrl: optionDraft.imageUrl.trim() || null,
        sortOrder: data?.options?.length ?? 0,
      });
      if (!mountedRef.current) return;
      setOptionDraft({ label: "", imageUrl: "" });
      await reload();
    });

  const handleUpdateOption = (optId, patch) =>
    safe(async () => {
      await updateOption(optId, patch);
      await reload();
    });

  const handleDeleteOption = (optId) =>
    safe(async () => {
      if (!window.confirm("Remove this option?")) return;
      await deleteOption(optId);
      await reload();
    });

  const handleSetCorrect = (optId) =>
    safe(async () => {
      const next = data.poll.correct_option_id === optId ? null : optId;
      await updatePoll(id, { correctOptionId: next });
      await reload();
    });

  // Honor `#voters` in the URL so the polls-list "Voters" button scrolls the
  // Voters card into view once the data has rendered. Next's router doesn't
  // wait for our async data fetch, so the native hash-jump misses the target.
  useEffect(() => {
    if (loading || !data) return;
    if (typeof window === "undefined") return;
    if (window.location.hash === "#voters") {
      const el = document.getElementById("voters");
      if (el) {
        // Wait a frame so layout has settled with the loaded data.
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    }
  }, [loading, data]);

  const filteredVoters = useMemo(() => {
    if (!voterSearch.trim()) return voters.voters;
    const q = voterSearch.toLowerCase();
    return voters.voters.filter(
      (v) =>
        (v.name || "").toLowerCase().includes(q) ||
        (v.mobile || "").includes(q) ||
        v.option_label.toLowerCase().includes(q),
    );
  }, [voterSearch, voters]);

  if (loading) {
    return (
      <div className="grid place-items-center py-24 text-sm uppercase tracking-[0.22em] text-white/55">
        Loading…
      </div>
    );
  }
  if (!data) {
    return (
      <EmptyState
        title="Poll not found"
        hint="It may have been deleted. Try going back to the polls list."
        action={
          <Button as={Link} href="/admin/polls" variant="secondary">
            ← Back to polls
          </Button>
        }
      />
    );
  }

  const { poll, options } = data;
  const correctId = poll.correct_option_id ?? null;
  const maxVotes = Math.max(0, ...options.map((o) => o.vote_count || 0));
  const totalVotes = voters.totals?.all ?? poll.vote_count ?? 0;
  const correctCount = voters.totals?.correct ?? null;

  return (
    <>
      <PageHeader
        eyebrow="Edit poll"
        title={poll.question}
        subtitle={
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-white/55">{poll.slug}</span>
            <span>·</span>
            <PollStatusBadge status={poll.status} />
            {correctId != null ? (
              <>
                <span>·</span>
                <Pill tone="emerald">Correct option set</Pill>
              </>
            ) : null}
          </span>
        }
        actions={
          <Button as={Link} href="/admin/polls" variant="ghost" size="sm">
            ← All polls
          </Button>
        }
      />

      {actionError ? (
        <div className="mb-6 flex items-center justify-between gap-3 rounded-md border border-red-400/40 bg-red-400/10 px-4 py-2.5 text-sm text-red-200">
          <span>{actionError}</span>
          <button
            type="button"
            onClick={() => setActionError(null)}
            className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-200/70 hover:text-red-200"
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        <StatCard
          label="Total votes"
          value={totalVotes.toLocaleString("en-IN")}
          accent="gold"
        />
        <StatCard
          label="Options"
          value={options.length}
          accent="default"
        />
        <StatCard
          label="Correct answers"
          value={correctCount == null ? "—" : correctCount}
          accent="emerald"
          trend={correctId == null ? "Mark the correct option below" : undefined}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card title="Poll details">
            <PollForm
              mode="edit"
              matches={matches}
              initial={poll}
              submitting={submitting}
              onSubmit={handleSubmit}
              onDelete={handleDelete}
            />
          </Card>

          <Card
            title="Options"
            action={
              correctId == null ? (
                <span className="text-[10px] text-white/50">
                  After the match, mark the correct option to enable result tracking.
                </span>
              ) : null
            }
          >
            <div className="space-y-3">
              {options.map((o) => (
                <OptionRow
                  key={o.id}
                  option={o}
                  isCorrect={correctId === o.id}
                  isLeader={(o.vote_count || 0) === maxVotes && maxVotes > 0}
                  totalVotes={totalVotes}
                  onSave={(patch) => handleUpdateOption(o.id, patch)}
                  onDelete={() => handleDeleteOption(o.id)}
                  onMarkCorrect={() => handleSetCorrect(o.id)}
                />
              ))}
            </div>
            <div className="mt-5 grid grid-cols-1 gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-3 md:grid-cols-[1fr,1fr,auto]">
              <input
                value={optionDraft.label}
                onChange={(e) =>
                  setOptionDraft((d) => ({ ...d, label: e.target.value }))
                }
                placeholder="New option label"
                className="rounded-md border border-white/15 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-[#F2A23A] focus:outline-none"
              />
              <input
                value={optionDraft.imageUrl}
                onChange={(e) =>
                  setOptionDraft((d) => ({ ...d, imageUrl: e.target.value }))
                }
                placeholder="Image URL (optional)"
                className="rounded-md border border-white/15 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-[#F2A23A] focus:outline-none"
              />
              <Button type="button" onClick={handleAddOption} size="md">
                + Add option
              </Button>
            </div>
          </Card>
        </div>

        <aside id="voters" className="scroll-mt-8">
          <Card
            title="Voters"
            action={
              <span className="text-[10px] uppercase tracking-[0.22em] text-white/55">
                {voters.totals?.all ?? voters.voters.length} total
              </span>
            }
            padding="tight"
          >
            {voters.voters.length === 0 ? (
              <EmptyState
                title="No votes yet"
                hint="Votes show up here in real time once fans start voting."
              />
            ) : (
              <>
                <div className="px-3 pb-3">
                  <input
                    value={voterSearch}
                    onChange={(e) => setVoterSearch(e.target.value)}
                    placeholder="Search name, mobile, or pick…"
                    className="w-full rounded-md border border-white/15 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-[#F2A23A] focus:outline-none"
                  />
                </div>
                {voters.totals?.legacyAnonymous > 0 ? (
                  <div className="mx-3 mb-3 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] text-white/55">
                    Plus <b className="text-white">{voters.totals.legacyAnonymous}</b>{" "}
                    legacy anonymous vote
                    {voters.totals.legacyAnonymous === 1 ? "" : "s"} (cast before
                    sign-in was required — not eligible for the winner draw).
                  </div>
                ) : null}
                <div className="max-h-[520px] overflow-y-auto">
                  <ul className="divide-y divide-white/5">
                    {filteredVoters.map((v, idx) => (
                      <li
                        key={`${v.user_id}-${v.voted_at}-${idx}`}
                        className="flex items-start gap-3 px-3 py-3"
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/[0.06] text-xs font-bold text-white/80">
                          {initialsOf(v.name, v.mobile)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate text-sm font-semibold text-white">
                              {v.name || `User #${v.user_id}`}
                            </span>
                            {correctId != null ? (
                              v.is_correct ? (
                                <Pill tone="emerald">✓</Pill>
                              ) : (
                                <Pill tone="red">✗</Pill>
                              )
                            ) : null}
                          </div>
                          <div className="mt-0.5 truncate font-mono text-[11px] text-white/55">
                            {v.mobile}
                          </div>
                          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-white/65">
                            <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-white/80">
                              {v.option_label}
                            </span>
                            <span>·</span>
                            <span>{relativeTime(v.voted_at)}</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </Card>
        </aside>
      </div>
    </>
  );
}

function OptionRow({
  option,
  isCorrect,
  isLeader,
  totalVotes,
  onSave,
  onDelete,
  onMarkCorrect,
}) {
  const [label, setLabel] = useState(option.label);
  const [imageUrl, setImageUrl] = useState(option.image_url ?? "");
  const dirty =
    label !== option.label || imageUrl !== (option.image_url ?? "");
  const pct =
    totalVotes > 0 ? Math.round(((option.vote_count || 0) / totalVotes) * 100) : 0;
  return (
    <div
      className={`rounded-xl border p-4 transition ${
        isCorrect
          ? "border-emerald-400/45 bg-emerald-400/[0.08]"
          : "border-white/10 bg-white/[0.02]"
      }`}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="flex-1 rounded-md border border-white/15 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-white focus:border-[#F2A23A] focus:outline-none"
        />
        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Image URL"
          className="flex-1 rounded-md border border-white/15 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-[#F2A23A] focus:outline-none"
        />
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            type="button"
            onClick={onMarkCorrect}
            variant={isCorrect ? "success" : "secondary"}
            size="sm"
          >
            {isCorrect ? "✓ Correct" : "Mark correct"}
          </Button>
          <Button
            type="button"
            disabled={!dirty}
            onClick={() =>
              onSave({ label: label.trim(), imageUrl: imageUrl.trim() || null })
            }
            variant="secondary"
            size="sm"
          >
            Save
          </Button>
          <Button
            type="button"
            onClick={onDelete}
            variant="danger"
            size="sm"
          >
            Remove
          </Button>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-700 ease-out"
            style={{
              width: `${pct}%`,
              background: isCorrect
                ? "linear-gradient(90deg, #34D399 0%, #6EE7B7 100%)"
                : isLeader
                ? "linear-gradient(90deg, #F68323 0%, #F2A23A 100%)"
                : "rgba(255,255,255,0.22)",
            }}
          />
        </div>
        <div className="w-24 text-right text-xs font-bold tabular-nums text-white/80">
          {option.vote_count} {option.vote_count === 1 ? "vote" : "votes"}
        </div>
        <div className="w-12 text-right text-xs font-extrabold tabular-nums text-[#F2A23A]">
          {pct}%
        </div>
      </div>
    </div>
  );
}

function initialsOf(name, mobile) {
  if (name) {
    return name
      .split(/\s+/)
      .map((s) => s[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }
  if (mobile) return mobile.slice(-2);
  return "?";
}

function relativeTime(iso) {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "";
  const diff = Date.now() - t;
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(iso).toLocaleDateString();
}
