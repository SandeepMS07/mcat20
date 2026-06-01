import { NextResponse } from "next/server";

const CDN_URL =
  "https://mca-cdn.ken42.com/players-list/teamDetailsDataSeason4.json";

export async function GET() {
  const res = await fetch(CDN_URL, { next: { revalidate: 300 } });
  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch players data" },
      { status: res.status },
    );
  }
  const teamData = await res.json();
  const rows = [];
  for (const team of teamData?.data ?? []) {
    const teamName = team.Name ?? "";
    for (const reg of team.Player_Registrations__r?.records ?? []) {
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
  return NextResponse.json({ players: rows }, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" },
  });
}
