// Server-to-CDN fetch — used by server components and API routes only.
// Client-side code must use /api/players (the Next.js proxy route) to avoid
// CORS errors, since mca-cdn.ken42.com does not allow browser origins.
const CDN_URL =
  "https://mca-cdn.ken42.com/players-list/teamDetailsDataSeason4.json";

// Internal proxy route — safe to call from the browser.
export const PLAYERS_API_PATH = "/api/players";

let _cache = null;

// Returns a flat player list. Server-side only.
export async function getLocalSquadPlayers() {
  if (_cache) return _cache;

  const res = await fetch(CDN_URL, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Failed to fetch players JSON: ${res.status}`);
  const teamData = await res.json();

  const rows = [];
  const teams = teamData?.data ?? [];

  for (const team of teams) {
    const teamName = team.Name ?? "";
    const records = team.Player_Registrations__r?.records ?? [];

    for (const reg of records) {
      const contact = reg.Player__r;
      if (!contact) continue;

      rows.push({
        id: reg.Player__c,
        sf_player_id: reg.Player__c,
        player_name: contact.Name ?? "",
        photo_url: contact.Photo_URL_1__c ?? "",
        team_name: teamName,
        category: reg.Category__c ?? reg.category ?? "",
        role: reg.Primary_Role__c ?? "",
        is_icon: false,
      });
    }
  }

  _cache = rows;
  return rows;
}

// Returns the raw JSON shape. Server-side only.
export async function fetchTeamDetailsData() {
  const res = await fetch(CDN_URL, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Failed to fetch players JSON: ${res.status}`);
  return res.json();
}
