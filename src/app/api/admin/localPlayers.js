import teamData from "@/constant/team/teamDetailsDataSeason4.json";

// Transforms the local teamDetailsDataSeason4.json into the same flat shape
// that the /v1/squads/players API returns, so PlayerPicker works without
// hitting the network.
//
// Returned shape per player:
//   { id, sf_player_id, player_name, photo_url, team_name, category, role, is_icon }
let _cache = null;

export function getLocalSquadPlayers() {
  if (_cache) return _cache;

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
