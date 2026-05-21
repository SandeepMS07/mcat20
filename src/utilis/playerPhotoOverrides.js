/**
 * Hardcoded player photo overrides per team.
 *
 * Keyed by team name (case-sensitive — match Salesforce `team.Name`),
 * then by a normalized player name. The normalizer strips diacritics,
 * lower-cases, and collapses non-alphanumerics so small naming variations
 * (extra dots, "Mr.", trailing spaces, etc.) still resolve.
 *
 * Drop the actual image files into the matching folder, then add the
 * normalized player name → file path entry below.
 */

export const normalizePlayerName = (name = "") =>
  name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const TEAM_PHOTO_OVERRIDES = {
  // Future teams can be added here.
};

const normalizeTeamKey = (name = "") =>
  name
    .replace(/\s*\(w\)\s*$/i, "")
    .trim()
    .toLowerCase();

const NORMALIZED_TEAM_OVERRIDES = Object.fromEntries(
  Object.entries(TEAM_PHOTO_OVERRIDES).map(([k, v]) => [normalizeTeamKey(k), v]),
);

export const resolvePlayerPhotoOverride = (teamName, playerName) => {
  if (!teamName || !playerName) return null;
  const teamMap = NORMALIZED_TEAM_OVERRIDES[normalizeTeamKey(teamName)];
  if (!teamMap) return null;
  return teamMap[normalizePlayerName(playerName)] || null;
};
