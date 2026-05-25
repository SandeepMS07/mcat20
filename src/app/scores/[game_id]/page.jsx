import { matchMap } from "@/utilis/scorecard/season_1/matchMap";
import ScoreCard from "./ScoreCard";
import Season3ScoreCard from "./Season3ScoreCard";
import { isSeason3MatchId, loadSeason3Match } from "./season3Loader";

export async function generateStaticParams() {
  const matchIds = ["1001", "1002", "1003", "1004", "1005"];

  return matchIds.map((id) => ({
    game_id: id,
  }));
}

const NotFound = () => (
  <div className="section-width text-center py-8">
    <h2 className="text-lg font-semibold">Match data not found</h2>
  </div>
);

export default async function MatchPage({ params }) {
  const { game_id } = await params;

  if (isSeason3MatchId(game_id)) {
    try {
      const { match, innings1, innings2 } = await loadSeason3Match(game_id);
      return (
        <Season3ScoreCard
          match={match}
          innings1={innings1}
          innings2={innings2}
        />
      );
    } catch (err) {
      console.error(`Season 3 load failed for ${game_id}:`, err);
      return <NotFound />;
    }
  }

  try {
    if (!matchMap[game_id]) throw new Error("Invalid game_id");
    const matchData = await matchMap[game_id]();
    const match = matchData.default.match ?? matchData.default;

    return <ScoreCard match={match} />;
  } catch (err) {
    console.error(`Error loading match data for game ID ${game_id}:`, err);
    return <NotFound />;
  }
}
