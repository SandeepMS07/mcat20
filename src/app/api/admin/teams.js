import turboverseAxios from "../turboverseAxios";

/**
 * Admin team-squad management wrappers — drives the /admin/teams page.
 * Auth piggybacks on the admin_rt cookie (same as polls/matches admin).
 *
 * Backend mutation semantics (see fantasy-backend/src/routes/admin.ts):
 *   * CREATE / UPDATE: tournament_team_player is the source of truth.
 *     Mirrors to UNLOCKED UPCOMING fantasy_match_player rows so the picker
 *     reflects the change immediately; past matches keep their historical
 *     fmp snapshot intact.
 *   * DELETE: HARD CASCADE — wipes fmp + player_match_stats + player_event
 *     + entry_player_points across every match (past + upcoming). Past
 *     leaderboard rows that summed this player's points will read lower
 *     after the delete; the UI surfaces this in a strong warning modal.
 *
 * Error codes the UI should map to friendly messages:
 *   400 invalid_team_id | invalid_player_id | nothing_to_update | target_team_not_found
 *   404 team_not_found | player_not_found
 *   409 duplicate_feed_unique_id
 */

export const listAdminTeams = async ({ season, category } = {}) => {
  const params = {};
  if (season) params.season = season;
  if (category) params.category = category;
  const res = await turboverseAxios.get("/v1/admin/teams", { params });
  return Array.isArray(res.data) ? res.data : res.data?.teams ?? [];
};

export const getAdminTeamRoster = async (teamId) => {
  const res = await turboverseAxios.get(
    `/v1/admin/teams/${encodeURIComponent(teamId)}/players`,
  );
  return res.data;
};

export const createTeamPlayer = async (teamId, body) => {
  const res = await turboverseAxios.post(
    `/v1/admin/teams/${encodeURIComponent(teamId)}/players`,
    body,
  );
  return res.data;
};

export const updateTeamPlayer = async (playerId, body) => {
  const res = await turboverseAxios.patch(
    `/v1/admin/teams/players/${encodeURIComponent(playerId)}`,
    body,
  );
  return res.data;
};

export const deleteTeamPlayer = async (playerId) => {
  const res = await turboverseAxios.delete(
    `/v1/admin/teams/players/${encodeURIComponent(playerId)}`,
  );
  return res.data;
};
