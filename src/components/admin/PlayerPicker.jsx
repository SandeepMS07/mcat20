"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Searchable squad-player picker for poll options.
 *
 * Feeds from GET /v1/squads/players (see listSquadPlayers). Picking a player
 * lets the caller auto-fill an option's label (player_name) + image (photo_url)
 * and link it via subject_type='player' / subject_id=sf_player_id — instead of
 * typing the label and image URL by hand.
 *
 * Props:
 *   players        flat list from listSquadPlayers()
 *   selectedId     currently-linked sf_player_id (or null) — drives the chip
 *   onPick(player) called with the chosen player row
 *   onClear()      optional; called to unlink (revert to manual entry)
 */
// Approx. panel height (search box + max-h-72 list + chrome). Used to decide
// whether to flip the panel above the button when it would otherwise spill
// past the bottom of the viewport.
const PANEL_EST_HEIGHT = 360;

export default function PlayerPicker({ players = [], selectedId = null, onPick, onClear }) {
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const [search, setSearch] = useState("");
  const wrapRef = useRef(null);

  // Open below by default, but flip above when the button sits low enough that
  // a downward panel would be clipped (and there's more room overhead).
  const toggle = () => {
    if (!open && wrapRef.current) {
      const rect = wrapRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setDropUp(spaceBelow < PANEL_EST_HEIGHT && spaceAbove > spaceBelow);
    }
    setOpen((v) => !v);
  };

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selected = useMemo(
    () => players.find((p) => String(p.sf_player_id) === String(selectedId)) || null,
    [players, selectedId],
  );

  // Filter by name / team, then group by team for a scannable list.
  const groups = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = q
      ? players.filter(
          (p) =>
            (p.player_name || "").toLowerCase().includes(q) ||
            (p.team_name || "").toLowerCase().includes(q),
        )
      : players;
    const byTeam = new Map();
    for (const p of filtered) {
      const key = `${p.team_name} · ${p.category}`;
      if (!byTeam.has(key)) byTeam.set(key, []);
      byTeam.get(key).push(p);
    }
    return [...byTeam.entries()];
  }, [players, search]);

  const choose = (p) => {
    onPick?.(p);
    setOpen(false);
    setSearch("");
  };

  return (
    <div ref={wrapRef} className="relative">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggle}
          disabled={players.length === 0}
          className="flex items-center gap-1 rounded-md border border-white/15 bg-white/[0.04] px-2.5 py-1.5 text-[11px] font-semibold text-white/80 transition hover:border-[#F2A23A] hover:text-white disabled:opacity-40"
          title={players.length === 0 ? "No squads seeded" : "Pick a player"}
        >
          {selected ? "Change player" : "Pick player"}
          <span className="text-white/40">▾</span>
        </button>
        {selected ? (
          <span className="flex items-center gap-1.5 rounded-full bg-[#F2A23A]/15 px-2 py-0.5 text-[11px] font-semibold text-[#F2A23A]">
            {selected.player_name}
            {onClear ? (
              <button
                type="button"
                onClick={onClear}
                className="text-[#F2A23A]/70 hover:text-[#F2A23A]"
                title="Unlink player (manual entry)"
              >
                ✕
              </button>
            ) : null}
          </span>
        ) : null}
      </div>

      {open ? (
        <div
          className={`absolute z-30 w-80 max-w-[85vw] rounded-lg border border-white/12 bg-[#0a1438] shadow-2xl ${
            dropUp ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          <div className="border-b border-white/10 p-2">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search player or team…"
              className="w-full rounded-md border border-white/12 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-[#F2A23A] focus:outline-none"
            />
          </div>
          <div className="max-h-72 overflow-y-auto py-1">
            {groups.length === 0 ? (
              <div className="px-3 py-6 text-center text-xs text-white/45">
                No players match “{search}”.
              </div>
            ) : (
              groups.map(([team, list]) => (
                <div key={team}>
                  <div className="sticky top-0 bg-[#0a1438] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                    {team}
                  </div>
                  {list.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => choose(p)}
                      className={`flex w-full items-center gap-2.5 px-3 py-2 text-left transition hover:bg-white/[0.06] ${
                        selected && selected.id === p.id ? "bg-[#F2A23A]/10" : ""
                      }`}
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full bg-white/[0.08] text-[10px] font-bold text-white/70">
                        {p.photo_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.photo_url}
                            alt=""
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          initialsOf(p.player_name)
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-white">
                          {p.player_name}
                        </span>
                        <span className="block truncate text-[11px] text-white/45">
                          {p.role || "—"}
                          {p.is_icon ? " · Icon" : ""}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
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
