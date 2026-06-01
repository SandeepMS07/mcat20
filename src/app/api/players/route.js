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
  const data = await res.json();
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
    },
  });
}
