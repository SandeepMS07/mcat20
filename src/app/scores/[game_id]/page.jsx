import { matchMap } from "@/utilis/scorecard/season_1/matchMap";
import ScoreCard from "./ScoreCard";
import fs from "fs";
import path from "path";

export async function generateStaticParams() {
  const matchIds = ["1001", "1002", "1003", "1004", "1005"];

  return matchIds.map((id) => ({
    game_id: id,
  }));
}

export default async function MatchPage({ params }) {
  const { game_id } = await params;

  // Dynamically build the file path
  // const filePath = path.resolve(
  //   process.cwd(),
  //   `/data/scorecard/season_1/${game_id}.json`
  // );


  // let json;
  // try {
  //   // Read the file from the local file system
  //   const fileContent = fs.readFileSync(filePath, "utf8");
  //   json = JSON.parse(fileContent);
  // } catch (err) {
  //   console.error("Failed to load match data:", err);
  //   return (
  //     <div className="section-width text-center py-8">
  //       <h2 className="text-lg font-semibold">Error loading match data</h2>
  //     </div>
  //   );
  // }

    try {
    if (!matchMap[game_id]) throw new Error("Invalid game_id");
    const matchData = await matchMap[game_id]();
    const match = matchData.default.match ?? matchData.default;

    return <ScoreCard match={match} />;
  } catch (err) {
    console.error(`Error loading match data for game ID ${game_id}:`, err);
    return (
      <div className="section-width text-center py-8">
        <h2 className="text-lg font-semibold">Match data not found</h2>
      </div>
    );
  }


  // const match = json.match ?? json;
  // return <ScoreCard match={match} />;
}
