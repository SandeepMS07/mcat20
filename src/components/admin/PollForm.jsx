"use client";

import { useEffect, useState } from "react";
import PlayerPicker from "./PlayerPicker";

const STATUSES = ["draft", "active", "closed"];

function toDateTimeLocal(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

function fromDateTimeLocal(v) {
  if (!v) return null;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

// Build a URL-friendly slug from the question. Matches the backend's
// /^[a-z0-9-]+$/ constraint: lowercase, non-alphanumerics → hyphens, trimmed.
function slugify(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// Auto slug = slugified question, suffixed with the fixture id when attached so
// the same question across different matches stays unique.
function autoSlug(question, matchId) {
  const base = slugify(question);
  if (!base) return "";
  return matchId ? `${base}-${matchId}` : base;
}

export default function PollForm({
  mode, // 'create' | 'edit'
  initial = null,
  matches = [],
  players = [],
  submitting = false,
  onSubmit,
  onDelete,
}) {
  const [matchId, setMatchId] = useState(initial?.match_id ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  // Tracks whether the admin hand-edited the slug. While false (create mode),
  // the slug auto-follows the question so they never have to type it.
  const [slugEdited, setSlugEdited] = useState(Boolean(initial?.slug));
  const [question, setQuestion] = useState(initial?.question ?? "");
  const [status, setStatus] = useState(initial?.status ?? "draft");
  const [startsAt, setStartsAt] = useState(toDateTimeLocal(initial?.starts_at));
  const [endsAt, setEndsAt] = useState(toDateTimeLocal(initial?.ends_at));
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0);
  const [options, setOptions] = useState(
    initial?.options?.map((o) => ({
      label: o.label,
      imageUrl: o.image_url ?? "",
      subjectType: o.subject_type ?? null,
      subjectId: o.subject_id ?? null,
      sortOrder: o.sort_order ?? 0,
    })) ?? [
      { label: "", imageUrl: "", subjectType: null, subjectId: null, sortOrder: 0, correct: false },
      { label: "", imageUrl: "", subjectType: null, subjectId: null, sortOrder: 1, correct: false },
    ],
  );
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!initial) return;
    setMatchId(initial.match_id ?? "");
    setSlug(initial.slug ?? "");
    setQuestion(initial.question ?? "");
    setStatus(initial.status ?? "draft");
    setStartsAt(toDateTimeLocal(initial.starts_at));
    setEndsAt(toDateTimeLocal(initial.ends_at));
    setSortOrder(initial.sort_order ?? 0);
    setSlugEdited(Boolean(initial.slug));
  }, [initial]);

  // Keep the slug in sync with the question/match until the admin overrides it.
  useEffect(() => {
    if (mode !== "create" || slugEdited) return;
    setSlug(autoSlug(question, matchId));
  }, [question, matchId, slugEdited, mode]);

  const addOption = () =>
    setOptions((arr) => [
      ...arr,
      { label: "", imageUrl: "", subjectType: null, subjectId: null, sortOrder: arr.length, correct: false },
    ]);

  // At most one option can be the correct answer: toggling one clears the rest.
  const toggleCorrect = (i) =>
    setOptions((arr) =>
      arr.map((o, idx) => ({ ...o, correct: idx === i ? !o.correct : false })),
    );

  // Auto-fill an option from a squad player: label = name, image = photo, and
  // link it via subject_type='player' / subject_id=sf_player_id.
  const pickPlayer = (i, p) =>
    setOption(i, {
      label: p.player_name ?? "",
      imageUrl: p.photo_url ?? "",
      subjectType: "player",
      subjectId: p.sf_player_id != null ? String(p.sf_player_id) : null,
    });
  const clearPlayer = (i) => setOption(i, { subjectType: null, subjectId: null });
  const removeOption = (i) => setOptions((arr) => arr.filter((_, idx) => idx !== i));
  const moveOption = (i, dir) =>
    setOptions((arr) => {
      const next = [...arr];
      const j = i + dir;
      if (j < 0 || j >= next.length) return arr;
      [next[i], next[j]] = [next[j], next[i]];
      return next.map((o, idx) => ({ ...o, sortOrder: idx }));
    });
  const setOption = (i, patch) =>
    setOptions((arr) => arr.map((o, idx) => (idx === i ? { ...o, ...patch } : o)));

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!question.trim()) return setError("Question is required.");
    if (!endsAt) return setError("Closes at is required.");
    if (mode === "create") {
      if (!slug.trim()) return setError("Slug is required.");
      // Filter first so the correct-answer index matches the options array we
      // actually send (empty rows are dropped and could shift the index).
      const filled = options.filter((o) => o.label.trim());
      if (filled.length < 2) return setError("Add at least 2 options.");
      const cleanOptions = filled.map((o, idx) => ({
        label: o.label.trim(),
        imageUrl: o.imageUrl?.trim() || null,
        subjectType: o.subjectType ?? null,
        subjectId: o.subjectId ?? null,
        sortOrder: idx,
      }));
      const correctOptionIndex = filled.findIndex((o) => o.correct);
      try {
        await onSubmit({
          matchId: matchId || null,
          slug: slug.trim(),
          question: question.trim(),
          status,
          startsAt: fromDateTimeLocal(startsAt),
          endsAt: fromDateTimeLocal(endsAt),
          sortOrder: Number(sortOrder) || 0,
          options: cleanOptions,
          // Optional — omit when no option was marked correct.
          ...(correctOptionIndex >= 0 ? { correctOptionIndex } : {}),
        });
      } catch (err) {
        setError(err?.response?.data?.error || "Failed to save.");
      }
      return;
    }

    // edit mode — submit only poll metadata; option editing happens via the
    // dedicated option rows on the edit page itself.
    if (!endsAt) return setError("Closes at is required.");
    try {
      await onSubmit({
        matchId: matchId || null,
        question: question.trim(),
        status,
        startsAt: fromDateTimeLocal(startsAt),
        endsAt: fromDateTimeLocal(endsAt),
        sortOrder: Number(sortOrder) || 0,
      });
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to save.");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Match">
          <select
            value={matchId || ""}
            onChange={(e) => setMatchId(e.target.value)}
            className="input"
          >
            <option value="">— No match (legacy / season-wide) —</option>
            {matches
              // Reserve days have no teams and aren't pollable — drop them
              // from the dropdown so the picker stays clean.
              .filter((m) => m.match_type !== "reserve")
              .map((m) => (
                <option key={m.id} value={m.id}>
                  {formatMatchOption(m)}
                </option>
              ))}
          </select>
        </Field>
        <Field label="Status">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="input">
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        {mode === "create" ? (
          <Field label="Slug (auto-generated — editable)">
            <input
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugEdited(true);
              }}
              className="input"
              required
              placeholder="e.g. mom-2026-06-05"
            />
            <span className="mt-1 block text-[11px] text-white/40">
              {slugEdited ? (
                <>
                  Custom slug.{" "}
                  <button
                    type="button"
                    onClick={() => setSlugEdited(false)}
                    className="font-semibold text-[#F2A23A] hover:underline"
                  >
                    Reset to auto
                  </button>
                </>
              ) : (
                "Created from your question. Edit to override."
              )}
            </span>
          </Field>
        ) : (
          <Field label="Slug">
            <input value={initial?.slug ?? ""} disabled className="input opacity-60" />
          </Field>
        )}
        <Field label="Opens at (optional)">
          <input
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Closes at *">
          <input
            type="datetime-local"
            value={endsAt}
            onChange={(e) => setEndsAt(e.target.value)}
            className="input"
            required
          />
        </Field>
      </div>
      <Field label="Question">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="input min-h-[80px]"
          required
        />
      </Field>

      {mode === "create" ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white/70">
              Options
            </h3>
            <button
              type="button"
              onClick={addOption}
              className="text-xs font-semibold text-[#F2A23A] hover:underline"
            >
              + Add option
            </button>
          </div>
          <p className="text-[11px] text-white/45">
            Optionally mark the correct answer now — you can also set or change it
            later from the edit page.
          </p>
          {options.map((o, i) => (
            <div
              key={i}
              className={`rounded-md border p-3 transition ${
                o.correct
                  ? "border-emerald-400/45 bg-emerald-400/[0.08]"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <div className="grid grid-cols-[auto,1fr,1fr,auto] items-center gap-3">
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => moveOption(i, -1)}
                    className="text-xs text-white/50 hover:text-white"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveOption(i, +1)}
                    className="text-xs text-white/50 hover:text-white"
                  >
                    ↓
                  </button>
                </div>
                <input
                  value={o.label}
                  onChange={(e) => setOption(i, { label: e.target.value })}
                  placeholder={`Option ${i + 1} label`}
                  className="input"
                />
                <input
                  value={o.imageUrl}
                  onChange={(e) => setOption(i, { imageUrl: e.target.value })}
                  placeholder="Image URL (optional)"
                  className="input"
                />
                <button
                  type="button"
                  onClick={() => removeOption(i)}
                  className="text-xs font-semibold text-red-300 hover:text-red-200"
                >
                  Remove
                </button>
              </div>
              {/* Pick a squad player to auto-fill label + image instead of
                  typing them. Manual entry still works for non-player options. */}
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 pl-9 text-[11px] text-white/45">
                <div className="flex items-center gap-2">
                  <span>Or fill from a player:</span>
                  <PlayerPicker
                    players={players}
                    selectedId={o.subjectType === "player" ? o.subjectId : null}
                    onPick={(p) => pickPlayer(i, p)}
                    onClear={() => clearPlayer(i)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => toggleCorrect(i)}
                  className={`rounded-md border px-2.5 py-1 text-[11px] font-semibold transition ${
                    o.correct
                      ? "border-emerald-400/50 bg-emerald-400/15 text-emerald-300"
                      : "border-white/15 bg-white/[0.04] text-white/70 hover:border-emerald-400/40 hover:text-emerald-200"
                  }`}
                  title="Mark this option as the correct answer"
                >
                  {o.correct ? "✓ Correct answer" : "Mark correct"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-md border border-red-400/40 bg-red-400/10 px-3 py-2 text-sm font-medium text-red-200">
          {error}
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        {mode === "edit" && onDelete ? (
          <button
            type="button"
            onClick={onDelete}
            className="rounded-md border border-red-400/40 px-4 py-2 text-xs font-bold uppercase tracking-wide text-red-200 hover:bg-red-400/10"
          >
            Delete poll
          </button>
        ) : (
          <span />
        )}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-gradient-to-b from-[#F68323] to-[#E07E27] px-5 py-2 text-sm font-bold uppercase tracking-wide text-white shadow-[0_6px_18px_-6px_rgba(246,131,35,0.7)] transition hover:brightness-110 hover:shadow-[0_8px_22px_-6px_rgba(246,131,35,0.85)] disabled:opacity-60 disabled:shadow-none"
        >
          {submitting ? "Saving…" : mode === "create" ? "Create poll" : "Save changes"}
        </button>
      </div>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: white;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 13px;
          outline: none;
          transition: border-color 0.15s ease;
        }
        :global(.input:focus) {
          border-color: #f2a23a;
        }
        :global(.input::placeholder) {
          color: rgba(255, 255, 255, 0.35);
        }
        :global(.input[type="datetime-local"]) {
          color-scheme: dark;
        }
        :global(select.input) {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff80' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'/%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 10px center;
          background-size: 14px;
          padding-right: 32px;
        }
        :global(select.input option) {
          background: #0a1438;
        }
      `}</style>
    </form>
  );
}

// Build a human-readable label for a fixture row in the match dropdown.
// Tournament_fixture rows can have:
//   - both teams set (group games)               → "ABC vs XYZ — date"
//   - both teams literally "TBD" (playoffs)      → "Semi Final 1 (TBD vs TBD) — date"
//   - no teams set (reserve days — filtered out upstream, but be safe) → "Reserve Day — date"
// We prefer `label` when present so playoff rows are distinguishable rather
// than collapsing to two identical "TBD vs TBD" options.
function formatMatchOption(m) {
  const date = m.scheduled_at ? new Date(m.scheduled_at).toLocaleDateString() : "";
  const teamA = m.team_a_short || m.team_a_name;
  const teamB = m.team_b_short || m.team_b_name;
  const pair = teamA && teamB ? `${teamA} vs ${teamB}` : null;
  let head;
  if (m.label && pair && pair !== "TBD vs TBD") {
    head = `${m.label} — ${pair}`;
  } else if (m.label) {
    head = pair ? `${m.label} (${pair})` : m.label;
  } else if (pair) {
    head = pair;
  } else {
    head = "Match";
  }
  return date ? `${head} — ${date}` : head;
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-white/60">
        {label}
      </span>
      <span className="mt-1 block">{children}</span>
    </label>
  );
}
