import turboverseAxios from "../turboverseAxios";

// Admin-only fan-poll CRUD wrappers. All routes carry the admin_rt cookie
// (turboverseAxios.withCredentials = true).

export const listPolls = async ({ matchId, status } = {}) => {
  const params = {};
  if (matchId) params.matchId = matchId;
  if (status) params.status = status;
  const res = await turboverseAxios.get("/v1/admin/polls", { params });
  return res.data;
};

export const getPoll = async (id) => {
  const res = await turboverseAxios.get(`/v1/admin/polls/${id}`);
  return res.data;
};

export const createPoll = async (body) => {
  const res = await turboverseAxios.post("/v1/admin/polls", body);
  return res.data;
};

export const updatePoll = async (id, patch) => {
  const res = await turboverseAxios.patch(`/v1/admin/polls/${id}`, patch);
  return res.data;
};

export const deletePoll = async (id) => {
  const res = await turboverseAxios.delete(`/v1/admin/polls/${id}`);
  return res.data;
};

export const addOption = async (pollId, body) => {
  const res = await turboverseAxios.post(`/v1/admin/polls/${pollId}/options`, body);
  return res.data;
};

export const updateOption = async (optionId, patch) => {
  const res = await turboverseAxios.patch(`/v1/admin/polls/options/${optionId}`, patch);
  return res.data;
};

export const deleteOption = async (optionId) => {
  const res = await turboverseAxios.delete(`/v1/admin/polls/options/${optionId}`);
  return res.data;
};

export const listMatches = async () => {
  const res = await turboverseAxios.get("/v1/admin/matches");
  return res.data;
};

// Flat squad-player list for the poll-option picker. Returns the standalone
// tournament_team_player rows (name + photo + SF contact id) so an option can
// be auto-filled from a player instead of typing label + image by hand.
// Response shape: { data: [...], message, success }.
export const listSquadPlayers = async ({ season, category, teamId } = {}) => {
  const params = {};
  if (season) params.season = season;
  if (category) params.category = category;
  if (teamId) params.teamId = teamId;
  const res = await turboverseAxios.get("/v1/squads/players", { params });
  return res.data?.data || [];
};

export const matchVoters = async (matchId) => {
  const res = await turboverseAxios.get(`/v1/admin/matches/${matchId}/voters`);
  return res.data;
};

export const pollVoters = async (pollId) => {
  const res = await turboverseAxios.get(`/v1/admin/polls/${pollId}/voters`);
  return res.data;
};

export const pickWinner = async (matchId, { requireCorrect = false } = {}) => {
  const res = await turboverseAxios.post(
    `/v1/admin/matches/${matchId}/pick-winner`,
    { requireCorrect },
  );
  return res.data;
};

export const getMatchWinner = async (matchId) => {
  const res = await turboverseAxios.get(`/v1/admin/matches/${matchId}/winner`);
  return res.data;
};

// Delete one tournament fixture row. Distinct URL space from /admin/matches/*
// because fixture ids are numeric (BIGSERIAL) whereas the legacy match endpoints
// expected the TEXT iSportz match id.
export const deleteFixture = async (id) => {
  const res = await turboverseAxios.delete(`/v1/admin/fixtures/${id}`);
  return res.data;
};
