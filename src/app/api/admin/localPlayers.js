const GCS_URL =
  "https://mca-cdn.ken42.com/players-list/teamDetailsDataSeason4.json";

// In-process cache so multiple callers in the same request share one fetch.
// Reset on each cold start (deploy / server restart), which is the right
// moment to pick up any JSON changes you've uploaded to GCS.
let _cache = null;

export async function getLocalSquadPlayers() {
  if (_cache) return _cache;

  const res = await fetch(GCS_URL, { next: { revalidate: 300 } });
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

// Fetch the raw JSON in the original shape (used by clientApi / serverApi /
// HomeTeamSection as a drop-in replacement for the static import).
export async function fetchTeamDetailsData() {
  const res = await fetch(GCS_URL, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Failed to fetch players JSON: ${res.status}`);
  return res.json();
}
