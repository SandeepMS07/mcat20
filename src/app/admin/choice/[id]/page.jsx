"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  addOption,
  deleteOption,
  getPoll,
  listSquadPlayers,
  pollVoters,
  updateOption,
  updatePoll,
} from "@/app/api/admin/choice";
import { CHOICE_CATEGORIES } from "@/app/choice/categories";
import PlayerPicker from "@/components/admin/PlayerPicker";
import {
  Button,
  Card,
  EmptyState,
  PageHeader,
  Pill,
  StatCard,
} from "@/components/admin/ui";

const META_BY_SLUG = new Map(
  CHOICE_CATEGORIES.map((c) => [`vc-${c.slug}`, c]),
);

export default function AdminChoiceCategoryPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [voters, setVoters] = useState(null);
  const [votersLoading, setVotersLoading] = useState(false);
  const [draft, setDraft] = useState({
    label: "",
    imageUrl: "",
    subjectType: null,
    subjectId: null,
  });

  const reload = async () => {
    const [pollRes, playersRes] = await Promise.all([
      getPoll(id),
      listSquadPlayers().catch(() => []),
    ]);
    setData(pollRes);
    setPlayers(playersRes || []);
  };

  const reloadVoters = async (pollId) => {
    setVotersLoading(true);
    try {
      const res = await pollVoters(pollId);
      setVoters(res?.voters ?? []);
    } catch {
      setVoters([]);
    } finally {
      setVotersLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [pollRes, playersRes] = await Promise.all([
          getPoll(id),
          listSquadPlayers().catch(() => []),
        ]);
        if (cancelled) return;
        setData(pollRes);
        setPlayers(playersRes || []);
        if (pollRes?.poll?.id) {
          reloadVoters(pollRes.poll.id);
        }
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

  const safe = async (fn) => {
    setActionError(null);
    try {
      await fn();
    } catch (err) {
      setActionError(err?.response?.data?.error || "Action failed. Try again.");
    }
  };

  const handleAddNominee = () =>
    safe(async () => {
      if (!draft.label.trim()) return;
      await addOption(id, {
        label: draft.label.trim(),
        imageUrl: draft.imageUrl.trim() || null,
        subjectType: draft.subjectType ?? null,
        subjectId: draft.subjectId ?? null,
        sortOrder: data?.options?.length ?? 0,
      });
      setDraft({ label: "", imageUrl: "", subjectType: null, subjectId: null });
      await reload();
    });

  const handleUpdateNominee = (optId, patch) =>
    safe(async () => {
      await updateOption(optId, patch);
      await reload();
    });

  const handleDeleteNominee = (optId) =>
    safe(async () => {
      if (!window.confirm("Remove this nominee?")) return;
      await deleteOption(optId);
      await reload();
    });

  const toggleStatus = () =>
    safe(async () => {
      setBusy(true);
      try {
        const next = data.poll.status === "active" ? "closed" : "active";
        await updatePoll(id, { status: next });
        await reload();
      } finally {
        setBusy(false);
      }
    });

  const totalVotes = useMemo(
    () => (data?.options ?? []).reduce((s, o) => s + (o.vote_count || 0), 0),
    [data],
  );
  const maxVotes = useMemo(
    () => Math.max(0, ...(data?.options ?? []).map((o) => o.vote_count || 0)),
    [data],
  );
  const leading = useMemo(() => {
    const opts = data?.options ?? [];
    if (opts.length === 0 || maxVotes === 0) return null;
    return opts.find((o) => (o.vote_count || 0) === maxVotes) || null;
  }, [data, maxVotes]);

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
        title="Category not found"
        hint="It may not be seeded yet, or the id is wrong."
        action={
          <Button as={Link} href="/admin/choice" variant="secondary">
            ← Back to Viewers' Choice
          </Button>
        }
      />
    );
  }

  const { poll, options } = data;
  const meta = META_BY_SLUG.get(poll.slug);
  const title = meta?.label || poll.question;

  return (
    <>
      <PageHeader
        eyebrow="Viewers' Choice"
        title={title}
        subtitle={
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-white/55">{poll.slug}</span>
            <span>·</span>
            <Pill tone={poll.status === "active" ? "emerald" : "default"}>
              {poll.status === "active" ? "Open" : poll.status}
            </Pill>
          </span>
        }
        actions={
          <>
            <Button onClick={toggleStatus} variant="secondary" size="sm" disabled={busy}>
              {poll.status === "active" ? "Close voting" : "Reopen voting"}
            </Button>
            <Button as={Link} href="/admin/choice" variant="ghost" size="sm">
              ← All categories
            </Button>
          </>
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
        <StatCard label="Total votes" value={totalVotes.toLocaleString("en-IN")} accent="gold" />
        <StatCard label="Nominees" value={options.length} accent="default" />
        <StatCard
          label="Leading"
          value={leading ? leading.label : "—"}
          accent="emerald"
          trend={leading ? `${leading.vote_count} votes` : "No votes yet"}
        />
      </div>

      <Card title="Nominees" action={
        <button
          type="button"
          onClick={() => reloadVoters(poll.id)}
          className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45 hover:text-white/70 transition"
        >
          ↻ Refresh voters
        </button>
      }>
        {options.length === 0 ? (
          <EmptyState
            title="No nominees yet"
            hint="Add players below — they'll appear as vote options on the public Viewers' Choice page."
          />
        ) : (
          <div className="space-y-3">
            {options.map((o) => (
              <NomineeRow
                key={o.id}
                option={o}
                players={players}
                isLeader={(o.vote_count || 0) === maxVotes && maxVotes > 0}
                totalVotes={totalVotes}
                onSave={(patch) => handleUpdateNominee(o.id, patch)}
                onDelete={() => handleDeleteNominee(o.id)}
              />
            ))}
          </div>
        )}

        <div className="mt-5 rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-3">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr,1fr,auto]">
            <input
              value={draft.label}
              onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))}
              placeholder="New nominee label"
              className="rounded-md border border-white/15 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-[#F2A23A] focus:outline-none"
            />
            <input
              value={draft.imageUrl}
              onChange={(e) => setDraft((d) => ({ ...d, imageUrl: e.target.value }))}
              placeholder="Image URL (optional)"
              className="rounded-md border border-white/15 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-[#F2A23A] focus:outline-none"
            />
            <Button type="button" onClick={handleAddNominee} size="md">
              + Add nominee
            </Button>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-white/45">
            <span>Or fill from a player:</span>
            <PlayerPicker
              players={players}
              selectedId={draft.subjectType === "player" ? draft.subjectId : null}
              onPick={(p) =>
                setDraft({
                  label: p.player_name ?? "",
                  imageUrl: p.photo_url ?? "",
                  subjectType: "player",
                  subjectId: p.sf_player_id != null ? String(p.sf_player_id) : null,
                })
              }
              onClear={() =>
                setDraft((d) => ({ ...d, subjectType: null, subjectId: null }))
              }
            />
          </div>
        </div>
      </Card>

      <div className="mt-6">
        <Card
          title={`Voters${voters ? ` · ${voters.length.toLocaleString("en-IN")}` : ""}`}
          padding="tight"
        >
          {votersLoading || voters === null ? (
            <div className="space-y-2 px-1 py-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 animate-pulse rounded-lg bg-white/[0.05]" />
              ))}
            </div>
          ) : voters.length === 0 ? (
            <EmptyState title="No votes yet" hint="Voters will appear here once people start voting." />
          ) : (
            <VotersSection voters={voters} options={options} />
          )}
        </Card>
      </div>
    </>
  );
}

function initialsOf(name) {
  if (!name) return "?";
  return name
    .split(/\s+/)
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
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

function VotersSection({ voters, options }) {
  const [search, setSearch] = useState("");

  const grouped = useMemo(() => {
    const map = new Map();
    options.forEach((o) =>
      map.set(o.id, { id: o.id, label: o.label, voters: [] }),
    );
    voters.forEach((v) => {
      if (map.has(v.option_id)) {
        map.get(v.option_id).voters.push(v);
      } else {
        if (!map.has("__other__"))
          map.set("__other__", { id: "__other__", label: "Other", voters: [] });
        map.get("__other__").voters.push(v);
      }
    });
    return Array.from(map.values()).filter((g) => g.voters.length > 0);
  }, [voters, options]);

  const filtered = useMemo(() => {
    if (!search.trim()) return grouped;
    const q = search.toLowerCase();
    return grouped
      .map((g) => ({
        ...g,
        voters: g.voters.filter(
          (v) =>
            (v.name || "").toLowerCase().includes(q) ||
            (v.mobile || "").includes(q),
        ),
      }))
      .filter((g) => g.voters.length > 0);
  }, [grouped, search]);

  return (
    <div>
      {voters.length > 6 ? (
        <div className="relative px-1 py-2">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or mobile…"
            className="w-full max-w-sm rounded-md border border-white/15 bg-white/[0.04] py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/35 focus:border-[#F2A23A] focus:outline-none"
          />
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <p className="px-1 py-4 text-sm italic text-white/45">No matching voters.</p>
      ) : (
        <div className="divide-y divide-white/5">
          {filtered.map((g) => (
            <div key={g.id} className="px-1 py-4">
              <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#F2A23A]">
                {g.label}{" "}
                <span className="font-normal text-white/45">· {g.voters.length}</span>
              </h3>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {g.voters.map((v, idx) => (
                  <li
                    key={`${v.user_id}-${v.voted_at}-${idx}`}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/[0.08] text-xs font-bold text-white/80">
                      {initialsOf(v.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-white">
                        {v.name || `User #${v.user_id}`}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-white/45">
                        {v.mobile ? <span>{v.mobile}</span> : null}
                        {v.mobile && v.voted_at ? <span>·</span> : null}
                        {v.voted_at ? <span>{relativeTime(v.voted_at)}</span> : null}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NomineeRow({ option, players = [], isLeader, totalVotes, onSave, onDelete }) {
  const [label, setLabel] = useState(option.label);
  const [imageUrl, setImageUrl] = useState(option.image_url ?? "");
  const [subjectType, setSubjectType] = useState(option.subject_type ?? null);
  const [subjectId, setSubjectId] = useState(option.subject_id ?? null);
  const dirty =
    label !== option.label ||
    imageUrl !== (option.image_url ?? "") ||
    subjectType !== (option.subject_type ?? null) ||
    subjectId !== (option.subject_id ?? null);
  const pct =
    totalVotes > 0 ? Math.round(((option.vote_count || 0) / totalVotes) * 100) : 0;

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 transition">
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
            disabled={!dirty}
            onClick={() =>
              onSave({
                label: label.trim(),
                imageUrl: imageUrl.trim() || null,
                subjectType,
                subjectId,
              })
            }
            variant="secondary"
            size="sm"
          >
            Save
          </Button>
          <Button type="button" onClick={onDelete} variant="danger" size="sm">
            Remove
          </Button>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2 text-[11px] text-white/45">
        <span>Or fill from a player:</span>
        <PlayerPicker
          players={players}
          selectedId={subjectType === "player" ? subjectId : null}
          onPick={(p) => {
            setLabel(p.player_name ?? "");
            setImageUrl(p.photo_url ?? "");
            setSubjectType("player");
            setSubjectId(p.sf_player_id != null ? String(p.sf_player_id) : null);
          }}
          onClear={() => {
            setSubjectType(null);
            setSubjectId(null);
          }}
        />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-700 ease-out"
            style={{
              width: `${pct}%`,
              background: isLeader
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
