import turboverseAxios from "../turboverseAxios";

// Admin-only fantasy-side wrappers — drives the endpoints in
// fantasy-backend/src/routes/admin.ts. The browser carries the admin_rt
// cookie (turboverseAxios.withCredentials = true) so every call is gated
// by the same admin session as /admin/polls.
//
// IDs here are FANTASY match ids (text), not tournament_fixture ids (numeric).
// The bridge is `tournament_fixture.widget_match_id` — call sites should fall
// back to "Awaiting widget mapping" when widget_match_id is null.

// ─── Ops dashboard ──────────────────────────────────────────────────────────
export const getAdminStats = async () => {
  const res = await turboverseAxios.get("/v1/admin/stats");
  return res.data;
};

// /v1/matches is public but returns exactly the shape the fantasy admin hub
// needs: lock_at, status, scheduled_at, playing_xi_announced_at, category,
// entries_count. We piggyback it for the admin list view; no admin-specific
// endpoint is needed.
export const listFantasyMatches = async () => {
  const res = await turboverseAxios.get("/v1/matches");
  return Array.isArray(res.data) ? res.data : res.data.matches ?? [];
};

// ─── Fantasy match detail (squad + lock + announced_at + flags) ─────────────
// Public endpoint — same shape the consumer frontend uses on the create-team
// screen. We piggyback it for the admin UI so the Playing XI picker can show
// player names + current is_playing_xi flags without a separate admin route.
export const getFantasyMatch = async (matchId) => {
  const res = await turboverseAxios.get(
    `/v1/matches/${encodeURIComponent(matchId)}`,
  );
  return res.data;
};

// ─── Playing XI publish ─────────────────────────────────────────────────────
// Flips is_playing_xi=TRUE for the 22 picks (11 per team) / FALSE for the
// rest of the squad and stamps fantasy_match.playing_xi_announced_at.
// Idempotent — re-publishing with the same 22 just refreshes the timestamp.
//
// Backend error codes the UI should map to friendly messages:
//   400 duplicate_player_ids · unknown_player · not_eleven_per_team
//   400 (Zod validation) when playerIds.length !== 22
//   404 match_not_found
export const publishPlayingXi = async (matchId, playerIds) => {
  const res = await turboverseAxios.patch(
    `/v1/admin/matches/${encodeURIComponent(matchId)}/playing-xi`,
    { playerIds },
  );
  return res.data;
};

// Wipe the announced Playing XI on a match. Clears playing_xi_announced_at +
// resets every squad row's is_playing_xi flag back to NULL. Used when the
// admin published the wrong XI or the team sheet changed last-minute.
// Response: { matchId, cleared: boolean, lateChange?: boolean, message?: string }
//   cleared: false ⇒ no XI was published (no-op).
//   lateChange:true ⇒ unpublished after lock_at — scoring may already have
//     applied the now-wiped XI; the worker re-derives on next tick.
export const unpublishPlayingXi = async (matchId) => {
  const res = await turboverseAxios.delete(
    `/v1/admin/matches/${encodeURIComponent(matchId)}/playing-xi`,
  );
  return res.data;
};

// Pull the announced XI from the widget feed (preferred BRD source). The
// widget's {matchId}-squad.js only populates after toss (~30 min pre-match);
// pre-toss the endpoint returns 200 with `xi: null` and a soft message
// rather than an error — UI should surface that as "no XI yet, try again".
//
// Backend response shape:
//   { ok: true, source: "widget", xi: string[] | null, announcedAt?: string, message?: string }
//
// Error codes the UI should handle:
//   404 match_not_found        — no fantasy_match row for this id
//   409 squad_mismatch         — widget surfaced a name we don't have in fantasy_match_player
//   502 widget_fetch_failed    — CDN unreachable / malformed JSONP
export const pullPlayingXiFromWidget = async (matchId) => {
  const res = await turboverseAxios.post(
    `/v1/admin/matches/${encodeURIComponent(matchId)}/playing-xi/pull-from-widget`,
  );
  return res.data;
};

// Preview the widget's Playing XI without writing anything to DB. Used by the
// admin UI to SHOW the vendor's suggested 22 names team-wise; the admin then
// manually ticks matching players in the picker below and clicks Publish XI
// (which is the ID-based PATCH /playing-xi path).
//
// Response shape:
//   {
//     ok: true,
//     suggested: [
//       { teamId: "1", teamLabel: "MSC", playerName: "Shreyas Gurav",
//         matchedPlayerId: "S4-M1-P5", isCaptain: bool, isWicketKeeper: bool },
//       ...
//     ],
//     unmatched: ["Monil Soni"],   // vendor names without an fmp counterpart
//     message?: string             // present when the widget feed isn't ready
//   }
//
// Error codes:
//   404 match_not_found · 409 widget_match_id_missing · 502 widget_fetch_failed
export const previewPlayingXiFromWidget = async (matchId) => {
  const res = await turboverseAxios.get(
    `/v1/admin/matches/${encodeURIComponent(matchId)}/playing-xi/preview-from-widget`,
  );
  return res.data;
};

// ─── Match lifecycle controls ───────────────────────────────────────────────
// Manually flip a match to live (lock_at clamped to now). Used when the
// iSportz feed lags or for forced toss-time locks.
export const lockMatch = async (matchId) => {
  const res = await turboverseAxios.post(
    `/v1/admin/matches/${encodeURIComponent(matchId)}/lock`,
  );
  return res.data;
};

// Rebase a match's scheduled_at and/or lock_at. Both fields optional — a
// one-sided patch (e.g. only `lockAt`) is fine, the backend keeps the
// other value as-is. Allowed on both upcoming and live matches.
//
// resetStatus: true — also flips a live match back to 'upcoming' so team
// creation reopens. Use with future scheduledAt + lockAt to prevent the
// status-cron from immediately re-completing the match.
//
// Backend error codes the UI should map:
//   404 match_not_found           — no fantasy_match row for this id
//   409 match_already_finished    — completed/abandoned, can't reschedule
//   400 lock_after_start          — lockAt > scheduledAt (invariant violation)
//
// On success the backend publishes a "schedule:updated" WS event on
// match:<id>, so any connected consumer frontends refresh automatically.
export const rescheduleMatch = async (matchId, { scheduledAt, lockAt, resetStatus }) => {
  const body = {};
  if (scheduledAt)   body.scheduledAt  = scheduledAt; // ISO string
  if (lockAt)        body.lockAt       = lockAt;
  if (resetStatus)   body.resetStatus  = true;
  const res = await turboverseAxios.patch(
    `/v1/admin/matches/${encodeURIComponent(matchId)}/schedule`,
    body,
  );
  return res.data;
};

// Force-mark a match abandoned. Pass voidEntries=true to also mark every
// entry on every contest in this match as 'voided' — voided entries stay in
// the DB (audit trail, user can see why) but drop off the public leaderboard.
//
// Response: { ok: true, voidedEntries: number }
export const abandonMatch = async (matchId, { voidEntries = false } = {}) => {
  const res = await turboverseAxios.post(
    `/v1/admin/matches/${encodeURIComponent(matchId)}/abandon`,
    { voidEntries },
  );
  return res.data;
};

// Trigger the iSportz fixtures seeder. One-shot, returns count of upserted
// fantasy_match rows.
export const seedFixtures = async () => {
  const res = await turboverseAxios.post("/v1/admin/seed-fixtures");
  return res.data;
};

// Seed a fresh demo match for client walkthroughs. Returns a new match with
// id `DEMO-<timestamp>` so the Fantasy Hub can pin it to the top and stamp
// a DEMO badge. Each click creates a fresh slate (new id, no XI announced,
// 22-player squad, one free contest).
export const seedDemoMatch = async () => {
  const res = await turboverseAxios.post("/v1/admin/fantasy/seed-demo-match");
  return res.data;
};

// Retroactive roster reconciliation across every match with a widget_match_id
// (live, upcoming, AND completed). Same routine the ingest worker now runs
// per tick — surfaced as an admin endpoint so completed matches that the
// worker has stopped polling can still be cleaned up.
//
// Use this once after deploying the resolver hardening to back out any
// ghost-player points that landed before the fix went live.
//
// Args:
//   matchIds  — optional array of fantasy_match ids to limit the sweep
//   dryRun    — boolean, counts ghosts without writing
//
// Response shape:
//   { ok, dryRun, processed, matchesWithGhosts, totalGhosts, durationMs,
//     results: Array<{
//       matchId, status, ghostCount, ghostSample: string[],
//       reconciled: boolean, error?: string
//     }>
//   }
export const reconcileRosters = async ({ matchIds, dryRun } = {}) => {
  const params = {};
  if (Array.isArray(matchIds) && matchIds.length) params.matchIds = matchIds.join(",");
  if (dryRun) params.dryRun = "1";
  // Send `{}` as the body (not `null`) — axios serializes `null` as
  // application/x-www-form-urlencoded, which Fastify's JSON-only content
  // parser rejects with 415 Unsupported Media Type. An empty JSON object
  // forces Content-Type: application/json with a valid body.
  const res = await turboverseAxios.post(
    "/v1/admin/matches/reconcile-rosters",
    {},
    { params },
  );
  return res.data;
};

// ─── Contests ───────────────────────────────────────────────────────────────
// /v1/contests?matchId=... is the public list — same shape returned, we
// reuse it for the admin contest section since there's no admin-specific
// list endpoint.
export const listContestsForMatch = async (matchId) => {
  const res = await turboverseAxios.get("/v1/contests", {
    params: { matchId },
  });
  return res.data;
};

export const createContest = async (body) => {
  // body: { matchId, name, contestType, maxEntries?, entriesPerUser?, prizePool? }
  const res = await turboverseAxios.post("/v1/admin/contests", body);
  return res.data;
};

export const updateContest = async (id, patch) => {
  const res = await turboverseAxios.patch(`/v1/admin/contests/${id}`, patch);
  return res.data;
};

// ─── Ingest health / match-day ops ─────────────────────────────────────────
// All four endpoints below are admin-only and live in routes/admin.ts. They
// power the "Ingest health" card on the fantasy match detail page.

// GET ingest health snapshot — widget id, last tick timestamp, staleness,
// recent event count. UI auto-refreshes this every ~5s during a live match.
export const getIngestStatus = async (matchId) => {
  const res = await turboverseAxios.get(
    `/v1/admin/matches/${encodeURIComponent(matchId)}/ingest-status`,
  );
  return res.data;
};

// Set or clear fantasy_match.widget_match_id. Pass null/"" to clear. The
// vendor id pattern is enforced server-side ([A-Za-z0-9_-]{1,64}).
// Errors: 400 invalid_widget_match_id · 409 widget_match_id_in_use
export const updateWidgetMatchId = async (matchId, widgetMatchId) => {
  const res = await turboverseAxios.patch(
    `/v1/admin/matches/${encodeURIComponent(matchId)}/widget-id`,
    { widgetMatchId: widgetMatchId || null },
  );
  return res.data;
};

// Trigger one ingest tick manually. Backend runs the exact same code path
// the worker uses (lib/ingest-tick.ts), idempotent against any concurrent
// worker tick. Errors: 409 no_widget_match_id (set the id first).
export const forceIngestTick = async (matchId) => {
  const res = await turboverseAxios.post(
    `/v1/admin/matches/${encodeURIComponent(matchId)}/force-tick`,
  );
  return res.data;
};

// Re-run scoring from existing player_match_stats. Use after a scoring
// formula fix to retro-apply. Idempotent. Returns { ok, players }.
export const forceRescore = async (matchId) => {
  const res = await turboverseAxios.post(
    `/v1/admin/matches/${encodeURIComponent(matchId)}/rescore`,
  );
  return res.data;
};

// DESTRUCTIVE — wipe and rebuild scoring for one match from scratch.
//
// Use ONLY when player_event has wrong attributions baked in (i.e. the
// audit log itself was written before the canonical-id resolver was
// hardened, and now points to wrong player_ids). Force rescore can't
// help here because it rebuilds entry_player_points FROM the corrupted
// player_match_stats / player_event.
//
// What it does, atomically server-side:
//   1. DELETE player_event for this match
//   2. DELETE player_match_stats for this match
//   3. DELETE entry_player_points + zero entry.total_points for every
//      entry in this match's contests
//   4. Flush widget:idmap, widget:snap, lb:contest:* keys
//   5. Run one ingest tick → rebuilds everything from the vendor feed
//      through the now-hardened resolver
//
// Idempotent on a clean match — running twice yields the same totals
// the second time. Backend errors:
//   404 match_not_found       — no fantasy_match row for this id
//   409 no_widget_match_id    — can't rebuild without a vendor feed
// Returns:
//   { ok, matchId, eventsDeleted, statsDeleted, eppDeleted, entries,
//     contestIds, tick, durationMs }
export const rebuildMatchScoring = async (matchId) => {
  const res = await turboverseAxios.post(
    `/v1/admin/matches/${encodeURIComponent(matchId)}/rebuild-scoring`,
    {},
  );
  return res.data;
};

// Wipe every Redis cache scoped to one match (response caches, the live
// ingest resolver caches widget:idmap / widget:snap, and the per-contest
// leaderboard ZSETs). Does NOT touch Postgres rows — combine with a force
// tick (or rescore) when stats also need to recompute. Use after fixing a
// player-mapping / feed-mapping / widget id mid-match so the next tick
// resolves against fresh DB state instead of a 24h-stale cache.
// Returns { ok, matchId, widgetMatchId, contestsCleared }.
export const clearMatchCache = async (matchId) => {
  const res = await turboverseAxios.post(
    `/v1/admin/matches/${encodeURIComponent(matchId)}/clear-cache`,
  );
  return res.data;
};

// GET per-contest entry counts (active vs voided) + top-10 board for admin
// QA. Shows voided entries too so admin can see what was hidden from the
// public leaderboard.
export const getContestPreview = async (contestId) => {
  const res = await turboverseAxios.get(
    `/v1/admin/contests/${encodeURIComponent(contestId)}/preview`,
  );
  return res.data;
};

// Flat list of every entry across every contest for this match, with
// total_points + rank-within-contest. Powers the "Live entries" admin
// card so operators can see who's playing and their current score at a
// glance without expanding each contest. Voided entries appear at the
// bottom with rank=null and status="voided".
// Response: Array<{
//   entry_id, contest_id, contest_name, contest_type,
//   user_id, user_name, user_team_name, template_name,
//   total_points, rank, status
// }>
export const listMatchEntries = async (matchId) => {
  const res = await turboverseAxios.get(
    `/v1/admin/matches/${encodeURIComponent(matchId)}/entries`,
  );
  return res.data;
};
