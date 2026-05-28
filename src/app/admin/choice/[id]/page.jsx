"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  addOption,
  deleteOption,
  getPoll,
  listSquadPlayers,
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

      <Card title="Nominees">
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
    </>
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
