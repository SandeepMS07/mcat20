"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "./ui";

/**
 * Add/Edit player modal — drives both create (initial=null) and edit (initial
 * populated). Used from /admin/teams.
 *
 * On submit, calls onSubmit(payload) and parent decides whether to close.
 * Errors bubble up as throws from onSubmit; we surface .response.data.error.
 *
 * Edit mode shows a "team move" select (every team in the same season) so an
 * admin can transfer a player between franchises without deleting + re-adding.
 * Create mode hides this since teamId comes from the route param.
 */

const ROLE_OPTIONS = [
  { value: "BAT",  label: "Batter" },
  { value: "AR",   label: "All-Rounder" },
  { value: "BOWL", label: "Bowler" },
  // WK is allowed by the DB CHECK constraint for backward compat but the
  // BRD 2026-06-02 collapsed WK into BAT — surface a hint in the help text.
];

const EMPTY = {
  player_name: "",
  role: "BAT",
  sf_role: "",
  mca_reg_no: "",
  feed_player_unique_id: "",
  feed_player_id: "",
  is_icon: false,
  is_u19: false,
  is_wicketkeeper: false,
  age: "",
  player_category: "",
};

export default function TeamPlayerFormModal({
  open,
  mode,         // "create" | "edit"
  team,         // { id, name, category } — for the heading + scope
  teamsForMove, // [] of teams in the same season — only used in edit mode
  initial,      // populated row in edit mode, null in create
  onSubmit,
  onClose,
}) {
  const [form, setForm] = useState(EMPTY);
  const [targetTeamId, setTargetTeamId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Hydrate form whenever the modal is re-opened with new data. EMPTY on
  // create, mapped from `initial` on edit.
  useEffect(() => {
    if (!open) return;
    setError("");
    setSubmitting(false);
    if (mode === "edit" && initial) {
      setForm({
        player_name:           initial.player_name ?? "",
        role:                  initial.role ?? "BAT",
        sf_role:               initial.sf_role ?? "",
        mca_reg_no:            initial.mca_reg_no ?? "",
        feed_player_unique_id: initial.feed_player_unique_id ?? "",
        feed_player_id:        initial.feed_player_id == null ? "" : String(initial.feed_player_id),
        is_icon:               !!initial.is_icon,
        is_u19:                !!initial.is_u19,
        is_wicketkeeper:       !!initial.is_wicketkeeper,
        age:                   initial.age == null ? "" : String(initial.age),
        player_category:       initial.player_category ?? "",
      });
      setTargetTeamId(initial.team_id ?? team?.id ?? null);
    } else {
      setForm(EMPTY);
      setTargetTeamId(team?.id ?? null);
    }
  }, [open, mode, initial, team?.id]);

  // Close on Escape — every other admin modal does this.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const otherTeams = useMemo(() => {
    if (!Array.isArray(teamsForMove) || !team) return [];
    return teamsForMove.filter(
      (t) => t.season === team.season && t.category === team.category,
    );
  }, [teamsForMove, team]);

  if (!open) return null;

  const change = (k) => (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [k]: v }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    // Build the payload — strip empties, coerce numerics, keep nulls explicit
    // so a cleared field clears in the DB.
    const payload = {
      player_name: form.player_name.trim(),
      role: form.role || null,
      sf_role: form.sf_role.trim() || null,
      mca_reg_no: form.mca_reg_no.trim() || null,
      feed_player_unique_id: form.feed_player_unique_id.trim() || null,
      feed_player_id:
        form.feed_player_id.trim() === "" ? null : Number(form.feed_player_id),
      is_icon: !!form.is_icon,
      is_u19: !!form.is_u19,
      is_wicketkeeper: !!form.is_wicketkeeper,
      age: form.age.trim() === "" ? null : Number(form.age),
      player_category: form.player_category.trim() || null,
    };
    if (
      mode === "edit" &&
      targetTeamId != null &&
      Number(targetTeamId) !== initial?.team_id
    ) {
      payload.team_id = Number(targetTeamId);
    }
    if (!payload.player_name) { setError("Player name is required."); return; }
    if (payload.feed_player_id != null && !Number.isFinite(payload.feed_player_id)) {
      setError("Feed PID must be a number.");
      return;
    }
    if (payload.age != null && (!Number.isFinite(payload.age) || payload.age < 10 || payload.age > 80)) {
      setError("Age must be between 10 and 80.");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(payload);
    } catch (err) {
      const code = err?.response?.data?.error;
      const msg =
        code === "duplicate_feed_unique_id"
          ? `Feed UID "${payload.feed_player_unique_id}" is already used by another player.`
          : code === "target_team_not_found"
          ? "Target team doesn't exist."
          : code || err?.message || "Save failed. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="player-form-title"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <form
        onSubmit={submit}
        className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/15 bg-[#0A1438] p-6 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.9)]"
      >
        <div className="mb-1 flex items-baseline justify-between gap-3">
          <h2 id="player-form-title" className="font-oswald text-xl font-extrabold uppercase italic text-white">
            {mode === "edit" ? "Edit player" : "Add player"}
          </h2>
          {team ? (
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
              {team.category} · {team.name}
            </div>
          ) : null}
        </div>
        <p className="mb-5 text-xs text-white/45">
          Changes apply to <span className="text-white/65">tournament_team_player</span> and sync to <strong className="text-white/75">unlocked upcoming match squads</strong> immediately. Past matches keep their historical roster.
        </p>

        {error ? (
          <div className="mb-4 rounded-lg border border-red-400/40 bg-red-400/10 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Player name" required className="sm:col-span-2">
            <input
              type="text"
              value={form.player_name}
              onChange={change("player_name")}
              autoFocus
              className={inputCls}
              placeholder="e.g. Suryakumar Yadav"
            />
          </FormField>

          <FormField label="Role">
            <select value={form.role || ""} onChange={change("role")} className={inputCls}>
              {ROLE_OPTIONS.map((r) => (
                <option key={r.value} value={r.value} className="bg-[#0A1438]">{r.label}</option>
              ))}
            </select>
          </FormField>

          <FormField label="SF role (vendor label)">
            <input
              type="text"
              value={form.sf_role}
              onChange={change("sf_role")}
              className={inputCls}
              placeholder="e.g. Wicketkeeper - Batsman"
            />
          </FormField>

          {mode === "edit" && otherTeams.length > 0 ? (
            <FormField
              label="Move to team"
              className="sm:col-span-2"
              hint="Same season + category only. Changes propagate to unlocked upcoming matches."
            >
              <select
                value={targetTeamId ?? ""}
                onChange={(e) => setTargetTeamId(e.target.value)}
                className={inputCls}
              >
                {otherTeams.map((t) => (
                  <option key={t.id} value={t.id} className="bg-[#0A1438]">
                    {t.name}
                  </option>
                ))}
              </select>
            </FormField>
          ) : null}

          <FormField label="MCA reg #">
            <input
              type="text"
              value={form.mca_reg_no}
              onChange={change("mca_reg_no")}
              className={inputCls}
              placeholder="e.g. M00510"
            />
          </FormField>

          <FormField label="Player category">
            <input
              type="text"
              value={form.player_category}
              onChange={change("player_category")}
              className={inputCls}
              placeholder="e.g. Icon Player / Senior / Emerging"
            />
          </FormField>

          <FormField label="Feed UID (vendor)">
            <input
              type="text"
              value={form.feed_player_unique_id}
              onChange={change("feed_player_unique_id")}
              className={inputCls}
              placeholder="e.g. M00510 or 202416b…"
            />
          </FormField>

          <FormField label="Feed PID (numeric)">
            <input
              type="number"
              value={form.feed_player_id}
              onChange={change("feed_player_id")}
              className={inputCls}
              placeholder="e.g. 5926"
            />
          </FormField>

          <FormField label="Age">
            <input
              type="number"
              value={form.age}
              onChange={change("age")}
              className={inputCls}
              placeholder="e.g. 22"
            />
          </FormField>

          <FormField label="Flags" className="sm:col-span-2">
            <div className="flex flex-wrap gap-4 pt-1">
              <Toggle label="Icon" checked={form.is_icon} onChange={change("is_icon")} tone="gold" />
              <Toggle label="U-19" checked={form.is_u19} onChange={change("is_u19")} tone="emerald" />
              <Toggle label="Wicketkeeper" checked={form.is_wicketkeeper} onChange={change("is_wicketkeeper")} tone="sky" />
            </div>
          </FormField>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/10 pt-5">
          <Button type="button" variant="secondary" size="md" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" disabled={submitting}>
            {submitting ? "Saving…" : mode === "edit" ? "Save changes" : "Add player"}
          </Button>
        </div>
      </form>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-white/15 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#F2A23A] focus:ring-2 focus:ring-[#F2A23A]/25";

function FormField({ label, required, hint, className = "", children }) {
  return (
    <label className={`block ${className}`}>
      <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">
        {label}
        {required ? <span className="ml-0.5 text-red-300">*</span> : null}
      </div>
      {children}
      {hint ? <div className="mt-1 text-[11px] text-white/40">{hint}</div> : null}
    </label>
  );
}

function Toggle({ label, checked, onChange, tone = "default" }) {
  const tones = {
    default: "peer-checked:bg-white/30",
    gold: "peer-checked:bg-[#F2A23A]",
    emerald: "peer-checked:bg-emerald-400",
    sky: "peer-checked:bg-sky-400",
  };
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-white/85">
      <input type="checkbox" checked={!!checked} onChange={onChange} className="peer sr-only" />
      <span
        className={`relative h-5 w-9 rounded-full bg-white/15 transition ${tones[tone] ?? tones.default} after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-4`}
      />
      <span>{label}</span>
    </label>
  );
}
