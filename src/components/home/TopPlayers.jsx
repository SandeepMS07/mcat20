import Image from "next/image";
import TitleComponent from "../common/TitleComponent";
import routes from "@/utilis/route";
import statsData from "@/constant/oldSeason/stats/statsData.json";
import "./style.css";
import { teamLogoStats } from "@/utilis/helper";

// Helper function to get team logo
const getTeamLogo = (teamName) => {
  // If teamLogoStats is a function
  if (typeof teamLogoStats === "function") {
    return teamLogoStats(teamName);
  }

  // If teamLogoStats is an object/map
  if (typeof teamLogoStats === "object" && teamLogoStats[teamName]) {
    return teamLogoStats[teamName];
  }

  // Fallback to default logo
  return "/images/teams/hero/teamLogo/default.svg";
};

// Function to get top players data from season 2
const getTopPlayersData = () => {
  const players = [];

  // Extract all players with season 2 data
  Object.entries(statsData).forEach(([playerId, playerData]) => {
    if (playerData.seasons && playerData.seasons.season_2) {
      const season2Data = playerData.seasons.season_2;
      players.push({
        id: playerId,
        name: playerData.name_full,
        teamName: season2Data.team_name,
        batting: season2Data.batting,
        bowling: season2Data.bowling,
        fielding: season2Data.fielding,
        playerOfMatch: season2Data.player_of_match_awards,
      });
    }
  });

  // Sort batsmen by runs (highest first)
  const topBatsmen = players
    .filter((player) => player.batting.matches_played > 0)
    .sort((a, b) => b.batting.runs - a.batting.runs)
    .slice(0, 5); // Top 5 batsmen

  // Sort bowlers by wickets (highest first)
  const topBowlers = players
    .filter(
      (player) =>
        player.bowling.matches_played > 0 && player.bowling.wickets > 0
    )
    .sort((a, b) => b.bowling.wickets - a.bowling.wickets)
    .slice(0, 5); // Top 5 bowlers

  // Format top batsman data
  const topBatsman = topBatsmen[0];
  const batsmanData = {
    rank: 1,
    playerImage: "/images/playerProfile/default.svg", // Dummy image
    teamLogo: getTeamLogo(topBatsman.teamName),
    playerName: topBatsman.name,
    runs: topBatsman.batting.runs,
    strikeRate: parseFloat(topBatsman.batting.strike_rate.toFixed(2)),
    matchesPlayed: topBatsman.batting.matches_played,
    fours: topBatsman.batting.fours,
    sixes: topBatsman.batting.sixes,
    leaderboard: topBatsmen.slice(1, 5).map((player) => ({
      name: player.name,
      matches: player.batting.matches_played,
      runs: player.batting.runs,
      sr: parseFloat(player.batting.strike_rate.toFixed(2)),
      fours: player.batting.fours,
      sixes: player.batting.sixes,
      logo: getTeamLogo(player.teamName),
    })),
  };

  // Format top bowler data
  const topBowler = topBowlers[0];
  const bowlerData = {
    rank: 1,
    playerImage: "/images/playerProfile/default.svg", // Dummy image
    teamLogo: getTeamLogo(topBowler.teamName),
    playerName: topBowler.name,
    wickets: topBowler.bowling.wickets,
    strikeRate:
      topBowler.bowling.strike_rate === "inf"
        ? 0
        : parseFloat(topBowler.bowling.strike_rate.toFixed(1)),
    matchesPlayed: topBowler.bowling.matches_played,
    ecoRate: parseFloat(topBowler.bowling.economy_rate.toFixed(2)),
    maidens: topBowler.bowling.maidens,
    leaderboard: topBowlers.slice(1, 5).map((player) => ({
      name: player.name,
      matches: player.bowling.matches_played,
      wickets: player.bowling.wickets,
      sr:
        player.bowling.strike_rate === "inf"
          ? 0
          : parseFloat(player.bowling.strike_rate.toFixed(1)),
      eco: parseFloat(player.bowling.economy_rate.toFixed(2)),
      maidens: player.bowling.maidens,
      logo: getTeamLogo(player.teamName),
    })),
  };

  return {
    batsman: batsmanData,
    bowler: bowlerData,
  };
};
const TopPlayers = () => {
  const topPlayersData = getTopPlayersData();

  return (
    <div className="relative">
      <img
        src="/images/elements/section-element.png"
        className="absolute right-0 top-0  md:block hidden"
        alt="element"
      />
      <img
        src="/images/elements/section-element.png"
        className="absolute left-0 bottom-0 rotate-180  md:block hidden"
        alt="element"
      />
      <div className="section-width section-padding">
        <TitleComponent title="Top Players Season 2" />
        <div className="flex flex-col lg:flex-row justify-center gap-6 sm:gap-10">
          <TopPlayerCard
            type="batsman"
            rank={topPlayersData.batsman.rank}
            playerImage={topPlayersData.batsman.playerImage}
            teamLogo={topPlayersData.batsman.teamLogo}
            playerName={topPlayersData.batsman.playerName}
            runs={topPlayersData.batsman.runs}
            strikeRate={topPlayersData.batsman.strikeRate}
            matchesPlayed={topPlayersData.batsman.matchesPlayed}
            fours={topPlayersData.batsman.fours}
            sixes={topPlayersData.batsman.sixes}
            leaderboard={topPlayersData.batsman.leaderboard}
          />
          <TopPlayerCard
            type="bowler"
            rank={topPlayersData.bowler.rank}
            playerImage={topPlayersData.bowler.playerImage}
            teamLogo={topPlayersData.bowler.teamLogo}
            playerName={topPlayersData.bowler.playerName}
            wickets={topPlayersData.bowler.wickets}
            strikeRate={topPlayersData.bowler.strikeRate}
            matchesPlayed={topPlayersData.bowler.matchesPlayed}
            ecoRate={topPlayersData.bowler.ecoRate}
            maidens={topPlayersData.bowler.maidens}
            leaderboard={topPlayersData.bowler.leaderboard}
          />
        </div>
      </div>
    </div>
  );
};

const TopPlayerCard = ({
  type = "batsman",
  rank = 1,
  playerImage,
  teamLogo,
  playerName,
  runs,
  wickets,
  strikeRate,
  matchesPlayed,
  fours,
  sixes,
  ecoRate,
  maidens,
  leaderboard = [],
}) => {
  return (
    <div className="relative flex-1 ">
      <div className="w-full max-w-3xl overflow-hidden">
        {/* Hero Section */}
        <div className="relative text-white overflow-hidden rounded-t-xl">
          {/* Gradient Background Layer */}
          <div
            className="absolute inset-0 z-0"
            style={{
              background:
                "linear-gradient(227.41deg, #010F54 -28.03%, #000827 48.51%, #010F54 125.04%)",
            }}
          />

          {/* SVG Image Layer with fade-out effect */}
          <div
            className="absolute inset-0 z-10"
            style={{
              backgroundImage: "url('/images/playerProfile/bgVector.svg')",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              maskImage: "linear-gradient(to right, black 0%, transparent 90%)",
              WebkitMaskImage:
                "linear-gradient(to right, black 0%, transparent 90%)",
            }}
          />
          <div
            className="bg-[#999FA4]  w-fit mb-10 px-6 py-2 relative custom-title-border"
            style={{
              clipPath: "polygon(0% 0%, 100% 0%, 97.5% 100%, 0% 100%)",
              zIndex: 9999,
            }}
          >
            <div
              className="xl:text-3xl lg:text-2xl text-xl font-bold text-transparent bg-clip-text relative"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
              }}
            >
              {type === "batsman" ? "TOP BATSMAN" : "TOP BOWLER"}
            </div>
          </div>

          <div className="flex items-end px-3 md:px-4 lg:px-6 sm:min-h-[280px] relative">
            {/* Player Image Section */}
            {/* <div className="flex-shrink-0 w-1/3 flex justify-center items-end h-full">
              <div className="relative h-full flex items-end">
                <Image
                  width={200}
                  height={300}
                  src={playerImage}
                  alt={playerName}
                  className="object-contain object-bottom"
                />
              </div>
            </div> */}

            {/* Player Info and Stats Section */}
            {/* <div className="flex-1 pl-4 md:pl-6 lg:pl-8 pb-4 md:pb-6 lg:pb-8 relative"> */}
            <div className="flex-1  pb-4 md:pb-6 lg:pb-8 relative">
              {/* Player Name */}
              <div className="mb-3 md:mb-4 lg:mb-6 flex justify-start items-center">
                <div className="z-20 mr-2 md:mr-2.5 lg:mr-3">
                  <Image
                    width={50}
                    height={50}
                    src={teamLogo}
                    alt={`${playerName} team logo`}
                    className="opacity-90"
                  />
                </div>
                <h2
                  className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-transparent bg-clip-text uppercase tracking-wide italic"
                  style={{
                    backgroundImage:
                      "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
                  }}
                >
                  {playerName}
                </h2>
              </div>

              {/* Stats Container with Border */}
              <div className="border border-white border-opacity-30 rounded-lg p-3 md:p-4 lg:p-6 bg-black bg-opacity-20">
                {/* Stats Grid - Different layouts for batsman vs bowler */}
                {type === "batsman" ? (
                  // Batsman: 2x2 grid (4 stats)
                  <div className="grid gap-3 md:gap-4 lg:gap-6">
                    {/* Top Row: 2 columns */}
                    <div className="grid grid-cols-3 gap-3 md:gap-4 lg:gap-6">
                      {/* Runs */}
                      <div className="text-left flex justify-start items-end">
                        <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1">
                          {runs}
                        </div>
                        <div className="text-xs md:text-sm text-blue-300 pb-1 pl-1 md:pl-2 font-medium uppercase leading-3 md:leading-4 tracking-wider">
                          RUNS
                        </div>
                      </div>

                      {/* Strike Rate */}
                      <div className="text-left flex justify-start items-end">
                        <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                          {strikeRate}
                        </div>
                        <div className="text-xs md:text-sm text-blue-300 pb-1 pl-1 md:pl-2 font-medium uppercase leading-3 md:leading-4 tracking-wider">
                          STRIKE
                          <br />
                          RATE
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: 3 columns */}
                    <div className="grid grid-cols-3 gap-3 md:gap-4 lg:gap-6">
                      {/* Matches Played */}
                      <div className="text-left flex justify-start items-end">
                        <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1">
                          {matchesPlayed}
                        </div>
                        <div className="text-xs md:text-sm text-blue-300 pb-1 pl-1 md:pl-2 font-medium uppercase leading-3 md:leading-4 tracking-wider">
                          MATCHES
                          <br />
                          PLAYED
                        </div>
                      </div>

                      {/* Fours */}
                      <div className="text-left flex justify-start items-end">
                        <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1">
                          {fours}
                        </div>
                        <div className="text-xs md:text-sm text-blue-300 pb-1 pl-1 md:pl-2 font-medium uppercase leading-3 md:leading-4 tracking-wider">
                          4s
                        </div>
                      </div>

                      {/* Sixes */}
                      <div className="text-left flex justify-start items-end">
                        <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1">
                          {sixes}
                        </div>
                        <div className="text-xs md:text-sm text-blue-300 pb-1 pl-1 md:pl-2 font-medium uppercase leading-3 md:leading-4 tracking-wider">
                          6s
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Bowler: 3x2 grid (5 stats total)
                  <div className="grid gap-3 md:gap-4">
                    {/* Top row: 2 items */}
                    <div className="grid grid-cols-3 gap-3 md:gap-4">
                      {/* Wickets */}
                      <div className="text-left flex justify-start items-end">
                        <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1">
                          {wickets}
                        </div>
                        <div className="text-xs md:text-sm text-blue-300 pb-1 pl-1 md:pl-2 font-medium uppercase leading-3 md:leading-4 tracking-wider">
                          WICKETS
                        </div>
                      </div>

                      {/* Strike Rate */}
                      <div className="text-left flex justify-start items-end">
                        <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                          {strikeRate}
                        </div>
                        <div className="text-xs md:text-sm text-blue-300 pb-1 pl-1 md:pl-2 font-medium uppercase leading-3 md:leading-4 tracking-wider">
                          STRIKE
                          <br />
                          RATE
                        </div>
                      </div>
                    </div>

                    {/* Bottom row: 3 items */}
                    <div className="grid grid-cols-3 gap-3 md:gap-4">
                      {/* Matches Played */}
                      <div className="text-left flex justify-start items-end">
                        <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                          {matchesPlayed}
                        </div>
                        <div className="text-xs md:text-sm text-blue-300 pb-1 pl-1 md:pl-2 font-medium uppercase leading-3 tracking-wider">
                          MATCHES
                          <br />
                          PLAYED
                        </div>
                      </div>

                      {/* Eco Rate */}
                      <div className="text-left flex justify-start items-end">
                        <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                          {ecoRate}
                        </div>
                        <div className="text-xs md:text-sm text-blue-300 pb-1 pl-1 md:pl-2 font-medium uppercase leading-3 tracking-wider">
                          ECO
                          <br />
                          RATE
                        </div>
                      </div>

                      {/* Maiden */}
                      <div className="text-left flex justify-start items-end">
                        <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                          {maidens}
                        </div>
                        <div className="text-xs md:text-sm text-blue-300 pb-1 pl-1 md:pl-2 font-medium uppercase leading-3 tracking-wider">
                          MAIDEN
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard with new design matching HomeStandingsSection */}
        <div className="overflow-x-scroll md:overflow-x-hidden">
          <div
            className="py-4 px-3 rounded-b-xl min-w-[800px] sm:min-w-0"
            style={{
              background:
                "linear-gradient(227.41deg, #010F54 -28.03%, #000827 48.51%, #010F54 125.04%)",
            }}
          >
            {/* Column Headers */}
            <div className="relative">
              {/* Background layer */}
              <div
                className="bg-[#001B31] w-[95%] right-1 border-r-[25px] top-2 border-[#F15A22] h-10 z-10 absolute"
                style={{
                  clipPath: "polygon(0% 0%, 100% 0%, 97.8% 100%, 0% 100%)",
                }}
              ></div>

              {/* Header Row */}
              <div
                className="bg-[#999FA4] italic z-50 relative mb-4 mr-2 custom-heading-border"
                style={{
                  clipPath: "polygon(0% 0%, 100% 0%, 97% 100%, 0% 100%)",
                }}
              >
                <div className="flex items-center justify-between pl-1 pr-6 py-4">
                  <div className="w-[5%] flex items-center justify-start ml-5">
                    <span
                      className="font-bold text-transparent bg-clip-text text-xs sm:text-base"
                      style={{
                        backgroundImage:
                          "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
                      }}
                    >
                      POS
                    </span>
                  </div>
                  <div className="w-[5%] flex items-center justify-center">
                    <span
                      className="font-bold text-transparent bg-clip-text text-xs sm:text-base"
                      style={{
                        backgroundImage:
                          "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
                      }}
                    >
                      TEAM
                    </span>
                  </div>
                  <div className="w-[20%] flex items-center justify-start pl-8">
                    <span
                      className="font-bold text-transparent bg-clip-text text-xs sm:text-base"
                      style={{
                        backgroundImage:
                          "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
                      }}
                    >
                      PLAYER
                    </span>
                  </div>
                  <div className="w-[5%] flex items-center justify-center">
                    <span
                      className="font-bold text-transparent bg-clip-text text-xs sm:text-base"
                      style={{
                        backgroundImage:
                          "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
                      }}
                    >
                      MP
                    </span>
                  </div>
                  {type === "batsman" ? (
                    <>
                      <div className="w-[5%] flex items-center justify-center">
                        <span
                          className="font-bold text-transparent bg-clip-text text-xs sm:text-base"
                          style={{
                            backgroundImage:
                              "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
                          }}
                        >
                          RUNS
                        </span>
                      </div>
                      <div className="w-[5%] flex items-center justify-center">
                        <span
                          className="font-bold text-transparent bg-clip-text text-xs sm:text-base"
                          style={{
                            backgroundImage:
                              "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
                          }}
                        >
                          SR
                        </span>
                      </div>
                      <div className="w-[5%] flex items-center justify-center">
                        <span
                          className="font-bold text-transparent bg-clip-text text-xs sm:text-base"
                          style={{
                            backgroundImage:
                              "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
                          }}
                        >
                          4s
                        </span>
                      </div>
                      <div className="w-[10%] flex items-center justify-center pr-10">
                        <span
                          className="font-bold text-transparent bg-clip-text text-xs sm:text-base"
                          style={{
                            backgroundImage:
                              "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
                          }}
                        >
                          6s
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-[5%] flex items-center justify-center">
                        <span
                          className="font-bold text-transparent bg-clip-text text-xs sm:text-base"
                          style={{
                            backgroundImage:
                              "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
                          }}
                        >
                          WICKETS
                        </span>
                      </div>
                      <div className="w-[5%] flex items-center justify-center">
                        <span
                          className="font-bold text-transparent bg-clip-text text-xs sm:text-base"
                          style={{
                            backgroundImage:
                              "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
                          }}
                        >
                          SR
                        </span>
                      </div>
                      <div className="w-[5%] flex items-center justify-center">
                        <span
                          className="font-bold text-transparent bg-clip-text text-xs sm:text-base"
                          style={{
                            backgroundImage:
                              "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
                          }}
                        >
                          ECO
                        </span>
                      </div>
                      <div className="w-[10%] flex items-center justify-center pr-5">
                        <span
                          className="font-bold text-transparent bg-clip-text text-xs sm:text-base"
                          style={{
                            backgroundImage:
                              "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
                          }}
                        >
                          MAIDEN
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="text-white space-y-3">
              {leaderboard.map((player, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between relative pr-3 mx-3"
                >
                  <div className="flex z-50 pl-2 items-center">
                    <span className="text-white">{index + 2}.</span>
                  </div>
                  <div
                    className="w-[98.5%] border-r-[50px] border-[#F15A22] h-10 z-20 absolute"
                    style={{
                      clipPath: "polygon(0% 0%, 100% 0%, 97.7% 100%, 0% 100%)",
                      background:
                        "linear-gradient(to right, rgba(224, 126, 39, 0.2) 60%, rgba(255, 255, 255, 0.2) 71%, rgba(224, 126, 39, 0.2) 100% );",
                    }}
                  >
                    <div className="custom-yellow-border"></div>
                    <div className="custom-black-gradient"></div>
                  </div>
                  <div
                    className="flex items-center justify-between bg-[#999FA4] z-50 px-4 md:px-10 py-2 relative w-[94%] custom-border-bg"
                    style={{
                      clipPath: "polygon(3% 0%, 100% 0%, 96% 100%, 0% 100%)",
                    }}
                  >
                    <div className="flex items-center gap-5 xl:gap-10">
                      <div className="h-11 w-11 rounded-full flex items-center justify-center overflow-hidden">
                        <img
                          src={player.logo}
                          alt={player.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-start w-[30%] ml-2">
                      <p className="text-xs sm:text-base font-semibold">
                        {player.name}
                      </p>
                    </div>
                    <div className="w-[11%] flex items-center justify-center">
                      <span className="text-xs sm:text-base font-semibold">
                        {player.matches}
                      </span>
                    </div>
                    {type === "batsman" ? (
                      <>
                        <div className="w-[11%] flex items-center justify-center">
                          <span className="sm:text-base text-xs font-semibold">
                            {player.runs}
                          </span>
                        </div>
                        <div className="w-[11%] flex items-center justify-center">
                          <span className="sm:text-base text-xs font-semibold">
                            {player.sr}
                          </span>
                        </div>
                        <div className="w-[11%] flex items-center justify-center">
                          <span className="sm:text-base text-xs font-semibold">
                            {player.fours}
                          </span>
                        </div>
                        <div className="w-[11%] flex items-center justify-center">
                          <span className="sm:text-base text-xs font-semibold">
                            {player.sixes}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-[11%] flex items-center justify-center">
                          <span className="sm:text-base text-xs font-semibold">
                            {player.wickets}
                          </span>
                        </div>
                        <div className="w-[11%] flex items-center justify-center">
                          <span className="sm:text-base text-xs font-semibold">
                            {player.sr}
                          </span>
                        </div>
                        <div className="w-[11%] flex items-center justify-center">
                          <span className="sm:text-base text-xs font-semibold">
                            {player.eco}
                          </span>
                        </div>
                        <div className="w-[11%] flex items-center justify-center">
                          <span className="sm:text-base text-xs font-semibold">
                            {player.maidens}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopPlayers;
