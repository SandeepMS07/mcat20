import { NextResponse } from "next/server";

const CDN_URL =
  "https://storage.googleapis.com/mca_images_new/standing-data/standings_s4.json";

export async function GET() {
  const res = await fetch(CDN_URL, { cache: "no-store" });
  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch standings data" },
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
