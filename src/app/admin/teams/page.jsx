"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  PageHeader,
  Pill,
} from "@/components/admin/ui";
import TeamPlayerFormModal from "@/components/admin/TeamPlayerFormModal";
import {
  createTeamPlayer,
  deleteTeamPlayer,
  getAdminTeamRoster,
  listAdminTeams,
  updateTeamPlayer,
} from "@/app/api/admin/teams";

/**
 * Teams admin — left rail lists every team (grouped by category), main pane
 * shows the selected team's roster with add/edit/delete actions.
 *
 * Mutation semantics (mirrored on the backend, see admin.ts comments):
 *   * Add/Edit → tournament_team_player + sync to UNLOCKED UPCOMING fmp.
 *   * Delete   → HARD CASCADE across all matches (past + upcoming). The
 *     confirm modal surfaces the consequence: "X past match records will
 *     also be removed."
 */

const CATEGORY_ORDER = ["Men", "Women"];

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [selectedTeamId, setSelectedTeamId] = useState(null);

  const [roster, setRoster] = useState({ team: null, players: [] });
  const [rosterLoading, setRosterLoading] = useState(false);
  const [rosterError, setRosterError] = useState("");

  // Add/edit modal state. `editing` is the player row in edit mode, null in
  // create mode (we still open the modal — `formOpen` drives visibility).
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // Delete confirm state. `pendingDelete` is the player about to be wiped;
  // null when the dialog is closed.
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Toast for one-shot success messages (player added/updated/deleted). A
  // dedicated component would be overkill for a single ephemeral string.
  const [toast, setToast] = useState("");

  const refreshTeams = useCallback(async () => {
    setTeamsLoading(true);
    try {
      const list = await listAdminTeams();
      setTeams(list || []);
      // Auto-select the first team if nothing's selected and the list isn't
      // empty. Stable selection across refreshes is important — operators
      // hate having to re-find their team after every save.
      if (list?.length && selectedTeamId == null) setSelectedTeamId(list[0].id);
    } finally {
      setTeamsLoading(false);
    }
  }, [selectedTeamId]);

  const refreshRoster = useCallback(async (teamId) => {
    if (!teamId) return;
    setRosterLoading(true);
    setRosterError("");
    try {
      const data = await getAdminTeamRoster(teamId);
      setRoster(data || { team: null, players: [] });
    } catch (e) {
      setRosterError(e?.response?.data?.error || e?.message || "Failed to load roster");
      setRoster({ team: null, players: [] });
    } finally {
      setRosterLoading(false);
    }
  }, []);

  useEffect(() => { refreshTeams(); }, [refreshTeams]);
  useEffect(() => { if (selectedTeamId) refreshRoster(selectedTeamId); }, [selectedTeamId, refreshRoster]);

  // Auto-dismiss toast after 4s — short enough to feel snappy, long enough
  // to read.
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const grouped = useMemo(() => {
    const byCat = new Map();
    for (const t of teams) {
      const k = t.category || "Other";
      if (!byCat.has(k)) byCat.set(k, []);
      byCat.get(k).push(t);
    }
    return CATEGORY_ORDER.filter((c) => byCat.has(c)).map((c) => ({
      category: c,
      teams: byCat.get(c) ?? [],
    })).concat(
      [...byCat.entries()]
        .filter(([k]) => !CATEGORY_ORDER.includes(k))
        .map(([category, teams]) => ({ category, teams })),
    );
  }, [teams]);

  const totalPastMatches = useMemo(() => {
    // Estimate (UI only): if the player has any fmp/pms rows from completed
    // matches, the backend cleanup will be larger. We don't have a precise
    // per-player count without an extra request, so the confirm dialog
    // states the cascade in qualitative terms.
    return 0;
  }, []);

  const openCreate = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (player) => { setEditing(player); setFormOpen(true); };

  const handleSubmit = async (payload) => {
    if (editing) {
      const r = await updateTeamPlayer(editing.id, payload);
      setToast(
        `Updated "${payload.player_name}" · ${r.syncedMatches} upcoming match${r.syncedMatches === 1 ? "" : "es"} synced.`,
      );
    } else {
      const r = await createTeamPlayer(selectedTeamId, payload);
      setToast(
        `Added "${payload.player_name}" · ${r.syncedMatches} upcoming match${r.syncedMatches === 1 ? "" : "es"} synced.`,
      );
    }
    setFormOpen(false);
    await refreshRoster(selectedTeamId);
    await refreshTeams();
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      const r = await deleteTeamPlayer(pendingDelete.id);
      setToast(
        `Deleted "${pendingDelete.player_name}" · ${r.fmpDeleted} squad rows, ${r.pmsDeleted} match stats, ${r.peDeleted} events, ${r.eppDeleted} entry-points removed.`,
      );
      setPendingDelete(null);
      await refreshRoster(selectedTeamId);
      await refreshTeams();
    } catch (e) {
      const code = e?.response?.data?.error;
      window.alert(`Delete failed: ${code || e?.message || "unknown error"}`);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Squad management"
        title="Teams"
        subtitle="Add, edit, or remove players in tournament_team_player. Mutations sync to unlocked upcoming matches automatically."
        actions={
          roster.team ? (
            <Button variant="primary" size="md" onClick={openCreate}>
              <Plus /> Add player
            </Button>
          ) : null
        }
      />

      <div className="grid gap-5 lg:grid-cols-[18rem_minmax(0,1fr)]">
        {/* LEFT: team list, grouped by category */}
        <aside className="space-y-5">
          {teamsLoading ? (
            <Card title="Teams"><div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded-lg bg-white/[0.04]" />
              ))}
            </div></Card>
          ) : grouped.length === 0 ? (
            <Card title="Teams"><EmptyState title="No teams seeded" hint="Run `npm run seed:squads` to populate tournament_team." /></Card>
          ) : (
            grouped.map((g) => (
              <Card key={g.category} title={g.category} padding="tight">
                <ul className="space-y-1">
                  {g.teams.map((t) => {
                    const active = t.id === selectedTeamId;
                    return (
                      <li key={t.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedTeamId(t.id)}
                          className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
                            active
                              ? "bg-gradient-to-b from-[#F68323] to-[#E07E27] text-white shadow-[0_4px_14px_-4px_rgba(246,131,35,0.6)]"
                              : "text-white/75 hover:bg-white/[0.04] hover:text-white"
                          }`}
                        >
                          <span className="truncate">{t.name}</span>
                          <span className="flex items-center gap-1.5 text-[10px] font-bold tabular-nums">
                            <span className={active ? "text-white" : "text-white/55"}>
                              {t.player_count}
                            </span>
                            {t.unstamped_count > 0 ? (
                              <span
                                title={`${t.unstamped_count} player${t.unstamped_count === 1 ? "" : "s"} missing vendor IDs`}
                                className="inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-rose-500/30 px-1 text-rose-100"
                              >
                                {t.unstamped_count}
                              </span>
                            ) : null}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            ))
          )}
        </aside>

        {/* RIGHT: roster table */}
        <section className="min-w-0">
          {rosterLoading ? (
            <Card title="Roster"><div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded-lg bg-white/[0.04]" />
              ))}
            </div></Card>
          ) : rosterError ? (
            <Card title="Roster">
              <div className="rounded-lg border border-red-400/30 bg-red-400/[0.08] px-4 py-3 text-sm text-red-200">
                {rosterError}
              </div>
            </Card>
          ) : !roster.team ? (
            <Card title="Roster"><EmptyState title="Select a team" hint="Pick a team from the list to view its roster." /></Card>
          ) : (
            <Card
              title={
                <span className="flex items-center gap-2">
                  <span>{roster.team.name}</span>
                  <Pill tone={roster.team.category === "Women" ? "violet" : "sky"}>
                    {roster.team.category}
                  </Pill>
                  <Pill tone="default">{roster.players.length} players</Pill>
                </span>
              }
            >
              {roster.players.length === 0 ? (
                <EmptyState
                  title="No players yet"
                  hint="Add the first squad member via the button above."
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                      <tr className="border-b border-white/10">
                        <th className="px-3 py-2">Player</th>
                        <th className="px-3 py-2">Role</th>
                        <th className="px-3 py-2">Flags</th>
                        <th className="px-3 py-2">MCA reg</th>
                        <th className="px-3 py-2">Feed UID</th>
                        <th className="px-3 py-2">Feed PID</th>
                        <th className="px-3 py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                      {roster.players.map((p) => (
                        <tr key={p.id} className="hover:bg-white/[0.02]">
                          <td className="px-3 py-2.5">
                            <div className="font-semibold text-white">{p.player_name}</div>
                            {p.sf_role ? (
                              <div className="text-[10.5px] text-white/45">{p.sf_role}</div>
                            ) : null}
                          </td>
                          <td className="px-3 py-2.5 text-xs uppercase tracking-wider text-white/75">
                            {p.role || "—"}
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex flex-wrap items-center gap-1">
                              {p.is_wicketkeeper ? <Pill tone="sky">WK</Pill> : null}
                              {p.is_icon ? <Pill tone="gold">Icon</Pill> : null}
                              {p.is_u19 ? <Pill tone="emerald">U-19</Pill> : null}
                            </div>
                          </td>
                          <td className="px-3 py-2.5 font-mono text-[11.5px] text-white/65">{p.mca_reg_no || "—"}</td>
                          <td className="px-3 py-2.5 font-mono text-[11.5px] text-white/65">
                            {p.feed_player_unique_id || (
                              <span className="text-rose-300/85">not stamped</span>
                            )}
                          </td>
                          <td className="px-3 py-2.5 font-mono text-[11.5px] text-white/65 tabular-nums">{p.feed_player_id ?? "—"}</td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button size="sm" variant="secondary" onClick={() => openEdit(p)}>
                                Edit
                              </Button>
                              <Button size="sm" variant="danger" onClick={() => setPendingDelete(p)}>
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}
        </section>
      </div>

      <TeamPlayerFormModal
        open={formOpen}
        mode={editing ? "edit" : "create"}
        team={roster.team}
        teamsForMove={teams}
        initial={editing}
        onSubmit={handleSubmit}
        onClose={() => setFormOpen(false)}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        title={`Delete ${pendingDelete?.player_name || "player"}?`}
        confirmLabel={deleting ? "Deleting…" : "Delete permanently"}
        confirmVariant="danger"
        message={
          <>
            This will remove the player from <strong>tournament_team_player</strong> and
            <strong> cascade across every match</strong> — past <em>and</em> upcoming — including
            fantasy_match_player, player_match_stats, player_event, and entry_player_points rows.
            <br /><br />
            Leaderboards for past matches that included this player will read lower.
            <br /><br />
            <span className="text-rose-200 font-semibold">This cannot be undone.</span>
          </>
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />

      {toast ? (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 max-w-md rounded-xl border border-emerald-400/40 bg-[#0A1438] px-4 py-3 text-sm text-emerald-100 shadow-[0_18px_44px_-16px_rgba(52,211,153,0.55)]"
        >
          {toast}
        </div>
      ) : null}
    </>
  );
}

function Plus() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
