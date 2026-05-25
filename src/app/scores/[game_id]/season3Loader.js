const FEED_BASE = "https://d3ml9nicy4vh6j.cloudfront.net/feeds";

const stripJsonp = (text) => {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON payload in JSONP response");
  return JSON.parse(match[0]);
};

const fetchFeed = async (path) => {
  const url = `${FEED_BASE}/${path}?v=${Date.now()}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Feed ${path} returned ${res.status}`);
  return stripJsonp(await res.text());
};

export const isSeason3MatchId = (id) => /^\d+$/.test(String(id));

export async function loadSeason3Match(matchId) {
  const [summary, inn1, inn2] = await Promise.all([
    fetchFeed(`${matchId}-matchsummary.js`),
    fetchFeed(`${matchId}-Innings1.js`).catch(() => null),
    fetchFeed(`${matchId}-Innings2.js`).catch(() => null),
  ]);

  const match = summary?.MatchSummary?.[0];
  if (!match) throw new Error("Missing MatchSummary");

  return {
    match,
    innings1: inn1?.Innings1 || null,
    innings2: inn2?.Innings2 || null,
  };
}
