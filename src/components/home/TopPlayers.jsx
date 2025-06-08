import Image from "next/image";
import TitleComponent from "../common/TitleComponent";
import routes from "@/utilis/route";
import statsData from "@/constant/stats/statsData.json";
import Link from "next/link";
import "./style.css";
import {
  teamLogoStats,
  truncateTextSpells,
  toTitleCase,
} from "@/utilis/helper";

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
    if (playerData.seasons && playerData.seasons.season_3) {
      const season2Data = playerData.seasons.season_3;
      players.push({
        id: playerId,
        name: playerData.name_full,
        playerImg: playerData.player_photo,
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
    playerImage: topBatsman.playerImg, // Dummy image
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
    playerImage: topBowler.playerImg, // Dummy image
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
      teamName: player.teamName,
      logo: getTeamLogo(player.teamName),
    })),
  };

  console.log(topBowlers, "topboulwlefjl");

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
        <TitleComponent
          title="Top Players Season 3"
          button={true}
          buttonLink={routes.stats}
          buttonText="View All"
          hideButtonOnMobile={true}
        />
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
            teamName={topPlayersData.bowler.teamName}
          />
        </div>

        <Link
          href={routes.stats || "#"}
          className="md:hidden flex items-center btn-primary gap-2 w-fit mx-auto mt-6"
          // style={{
          //   background: "radial-gradient(43.3% 61.24% at 50% 50%, #FFF200 0%, #FFF200 26%, #FBB040 97%)",
          //   WebkitBackgroundClip: "text",
          //   WebkitTextFillColor: "transparent",
          //   backgroundClip: "text",
          //   color: "transparent",
          // }}
        >
          View Top Players
          <img
            src="/images/home/hero/buttonIcon.svg"
            alt="button-icon"
            width={24}
            height={24}
            className="w-5 h-5"
          />
        </Link>
      </div>
    </div>
  );
};

const gradientStyle = {
  background:
    "linear-gradient(227.41deg, #010F54 -28.03%, #000827 48.51%, #010F54 125.04%)",
};

const textGradientStyle = {
  backgroundImage:
    "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
};

const StatItem = ({ value, label, className = "" }) => (
  <div className={`text-left flex justify-start items-end ${className}`}>
    <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1">
      {value}
    </div>
    <div
      className="text-xs md:text-sm text-blue-300 pb-1 pl-1 md:pl-2 font-medium uppercase leading-3 md:leading-4 tracking-wider"
      dangerouslySetInnerHTML={{ __html: label }}
    />
  </div>
);

const HeaderCell = ({ children, className = "" }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <span
      className="font-bold text-transparent bg-clip-text text-xs sm:text-base p-1"
      style={textGradientStyle}
    >
      {children}
    </span>
  </div>
);

const TopPlayerCard = ({
  type = "batsman",
  rank = 1,
  playerImage,
  teamLogo,
  playerName,
  teamName,
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
  const isBatsman = type === "batsman";
  console.log(leaderboard, "leaderboard");
  console.log(teamName, "team anem");
  const statsConfig = isBatsman
    ? [
        { value: runs, label: "RUNS" },
        { value: strikeRate, label: "STRIKE<br/>RATE" },
        { value: matchesPlayed, label: "MATCHES<br/>PLAYED" },
        { value: fours, label: "4s" },
        { value: sixes, label: "6s" },
      ]
    : [
        { value: wickets, label: "WICKETS" },
        { value: strikeRate, label: "STRIKE<br/>RATE" },
        { value: matchesPlayed, label: "MATCHES<br/>PLAYED" },
        { value: ecoRate, label: "ECO<br/>RATE" },
        { value: maidens, label: "MAIDEN" },
      ];

  const headerConfig = isBatsman
    ? ["POS", "TM", "PLAYER", "MP", "R", "SR", "4s", "6s"]
    : ["POS", "TM", "PLAYER", "MP", "W", "SR", "ECO", "MN"];

  const getPlayerValue = (player, field) =>
    isBatsman ? player[field] : player[field];

  return (
    <div className="relative flex-1">
      <div className="w-full max-w-3xl overflow-hidden">
        {/* Hero Section */}
        <div className="relative text-white overflow-hidden rounded-t-xl">
          <div className="absolute inset-0 z-0" style={gradientStyle} />
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
            className="bg-[#999FA4] w-fit mb-10 px-6 py-2 relative custom-title-border"
            style={{
              clipPath: "polygon(0% 0%, 100% 0%, 97.5% 100%, 0% 100%)",
              zIndex: 9999,
            }}
          >
            <div
              className="text-xl font-bold text-transparent bg-clip-text relative"
              style={textGradientStyle}
            >
              {isBatsman ? "TOP BATSMAN" : "TOP BOWLER"}
            </div>
          </div>

          <div className="flex items-end px-3 md:px-4 lg:px-6 sm:min-h-[280px] relative z-20">
            <div className="flex-1 flex flex-col xl:flex-row relative gap-6 justify-center items-center xl:items-end xl:justify-end">
              <div className="flex justify-center w-[80%] xl:w-[50%] rounded-lg overflow-hidden">
                <img
                  src={playerImage}
                  className="w-full h-[250px] md:h-[300px] sm:object-contain  lg:object-cover rounded-lg"
                  alt={playerName}
                />
              </div>

              <div>
                <div className="mb-3 md:mb-4 lg:mb-6 flex justify-start items-center">
                  <div className="z-20 mr-2 md:mr-2.5 lg:mr-3">
                    <img
                      width={50}
                      height={50}
                      src={teamLogo}
                      alt={`${playerName} team logo`}
                      className="opacity-90"
                    />
                  </div>
                  <h2
                    className="text-xl md:text-2xl  font-bold text-transparent bg-clip-text uppercase tracking-wide italic"
                    style={textGradientStyle}
                  >
                    {playerName}
                  </h2>
                </div>

                <div className="border border-white border-opacity-30 rounded-lg p-3 md:p-4 lg:p-6 bg-black bg-opacity-20 mb-4">
                  <div className="grid gap-3 md:gap-4 lg:gap-6">
                    <div className="grid grid-cols-3 gap-3 md:gap-4 lg:gap-6">
                      {statsConfig
                        .slice(0, isBatsman ? 2 : 2)
                        .map((stat, idx) => (
                          <StatItem
                            key={idx}
                            value={stat.value}
                            label={stat.label}
                          />
                        ))}
                    </div>
                    <div className="grid grid-cols-3 gap-3 md:gap-4 lg:gap-6">
                      {statsConfig.slice(2).map((stat, idx) => (
                        <StatItem
                          key={idx}
                          value={stat.value}
                          label={stat.label}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        {/* Leaderboard */}
        <div className="overflow-x-scroll md:overflow-x-hidden">
          <div
            className="py-4 px-3 rounded-b-xl min-w-[550px] sm:min-w-0"
            style={gradientStyle}
          >
            <div className="relative">
              <div
                className="bg-[#001B31] w-[95%] right-1 border-r-[27px] top-3 border-[#F15A22] h-7 z-10 absolute"
                style={{
                  clipPath: "polygon(0% 0%, 100% 0%, 97.9% 100%, 0% 100%)",
                }}
              />

              <div
                className="bg-[#999FA4] italic z-50 relative mb-4 mr-2 custom-heading-border"
                style={{
                  clipPath: "polygon(0% 0%, 100% 0%, 97% 100%, 0% 100%)",
                }}
              >
                <div
                  className="grid items-center pl-1 pr-6 py-4"
                  style={{
                    gridTemplateColumns: (() => {
                      const totalCols = headerConfig.length;
                      const percent = (80 / (totalCols - 1)).toFixed(4); // All except name column (index 2 (name))
                      return Array.from({ length: totalCols }, (_, i) =>
                        i === 2 ? "20%" : `${percent}%`
                      ).join(" ");
                    })(),
                  }}
                >
                  {headerConfig.map((label, idx) => (
                    <HeaderCell key={idx}>{label}</HeaderCell>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-white space-y-3">
              <div className="text-white space-y-3">
                {leaderboard.map((player, index) => {
                  const stats = isBatsman
                    ? [player.runs, player.sr, player.fours, player.sixes]
                    : [player.wickets, player.sr, player.eco, player.maidens];

                  const totalCols = 3 + stats.length; // logo + name + matches + stats
                  const percent = (80 / (totalCols - 1)).toFixed(4); // only 'name' gets 20%

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between relative pr-3"
                    >
                      <div className="flex z-50 pl-2 items-center">
                        <span className="text-white text-sm">{index + 2}.</span>
                      </div>

                      <div
                        className="w-[98.5%] border-r-[50px] border-[#F15A22] h-7 z-20 absolute"
                        style={{
                          clipPath:
                            "polygon(0% 0%, 100% 0%, 97.5% 100%, 0% 100%)",
                          background:
                            "linear-gradient(to right, rgba(224, 126, 39, 0.2) 60%, rgba(255, 255, 255, 0.2) 71%, rgba(224, 126, 39, 0.2) 100%)",
                        }}
                      >
                        <div className="custom-yellow-border" />
                        <div className="custom-black-gradient" />
                      </div>

                      <div
                        className="bg-[#999FA4] z-50 px-2 py-2 relative w-[94%] custom-border-bg grid items-center"
                        style={{
                          clipPath:
                            "polygon(3% 0%, 100% 0%, 96% 100%, 0% 100%)",
                          gridTemplateColumns: `${percent}% 20% ${percent}% repeat(${stats.length}, ${percent}%)`,
                        }}
                      >
                        {/* Logo */}
                        <div className="flex items-center justify-center">
                          <div className="h-6 w-6 rounded-full flex items-center justify-center overflow-hidden">
                            <img
                              src={player.logo}
                              alt={player.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>

                        {/* Name */}
                        <div className="flex items-center justify-start">
                          <p className="text-xs sm:text-base">
                            {toTitleCase(truncateTextSpells(player.name, 12))}
                          </p>
                        </div>

                        {/* Matches */}
                        <div className="flex items-center justify-center">
                          <span className="text-xs sm:text-base">
                            {player.matches}
                          </span>
                        </div>

                        {/* Stats */}
                        {stats.map((val, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-center"
                          >
                            <span className="text-xs sm:text-base">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopPlayers;

// import Image from "next/image";
// import TitleComponent from "../common/TitleComponent";
// import routes from "@/utilis/route";
// import statsData from "@/constant/stats/statsData.json";
// import "./style.css";
// import {
//   teamLogoStats,
//   truncateTextSpells,
//   toTitleCase,
//   season3TeamLogo,
// } from "@/utilis/helper";

// const getTeamLogo = (teamName) => {
//   if (typeof season3TeamLogo === "function") {
//     return season3TeamLogo(teamName);
//   }

//   if (typeof season3TeamLogo === "object" && season3TeamLogo[teamName]) {
//     return season3TeamLogo[teamName];
//   }

//   // Fallback to default logo
//   return "/images/teams/hero/teamLogo/default.svg";
// };

// // Function to get top players data from season 2
// const getTopPlayersData = () => {
//   const players = [];

//   // Extract all players with season 2 data
//   Object.entries(statsData).forEach(([playerId, playerData]) => {
//     if (playerData.seasons && playerData.seasons.season_3) {
//       const season2Data = playerData.seasons.season_3;
//       players.push({
//         id: playerId,
//         name: playerData.name_full,
//         teamName: season2Data.team_name,
//         batting: season2Data.batting,
//         bowling: season2Data.bowling,
//         fielding: season2Data.fielding,
//         playerOfMatch: season2Data.player_of_match_awards,
//       });
//     }
//   });

//   // Sort batsmen by runs (highest first)
//   const topBatsmen = players
//     .filter((player) => player.batting.matches_played > 0)
//     .sort((a, b) => b.batting.runs - a.batting.runs)
//     .slice(0, 5); // Top 5 batsmen

//   // Sort bowlers by wickets (highest first)
//   const topBowlers = players
//     .filter(
//       (player) =>
//         player.bowling.matches_played > 0 && player.bowling.wickets > 0
//     )
//     .sort((a, b) => b.bowling.wickets - a.bowling.wickets)
//     .slice(0, 5); // Top 5 bowlers

//   // Format top batsman data
//   const topBatsman = topBatsmen[0];
//   console.log(topBatsman,"top batsman")

//   const batsmanData = {
//     rank: 1,
//     playerImage: "/images/playerProfile/default.svg",
//     teamLogo: getTeamLogo(topBatsman.teamName),
//     teamName: topBatsman.teamName,
//     playerName: topBatsman.name,
//     runs: topBatsman.batting.runs,
//     strikeRate: parseFloat(topBatsman.batting.strike_rate.toFixed(2)),
//     matchesPlayed: topBatsman.batting.matches_played,
//     fours: topBatsman.batting.fours,
//     sixes: topBatsman.batting.sixes,
//     leaderboard: topBatsmen.slice(1, 5).map((player) => ({
//       name: player.name,
//       matches: player.batting.matches_played,
//       runs: player.batting.runs,
//       sr: parseFloat(player.batting.strike_rate.toFixed(2)),
//       fours: player.batting.fours,
//       sixes: player.batting.sixes,
//       logo: getTeamLogo(player.teamName),
//     })),
//   };

//   // Format top bowler data
//   const topBowler = topBowlers[0];
//   console.log(topBowler,"top Bowler")
//   const bowlerData = {
//     rank: 1,
//     playerImage: "/images/playerProfile/default.svg",
//     teamLogo: getTeamLogo(topBowler.teamName),
//     playerName: topBowler.name,
//     wickets: topBowler.bowling.wickets,
//     strikeRate:
//       topBowler.bowling.strike_rate === "inf"
//         ? 0
//         : parseFloat(topBowler.bowling.strike_rate.toFixed(1)),
//     matchesPlayed: topBowler.bowling.matches_played,
//     ecoRate: parseFloat(topBowler.bowling.economy_rate.toFixed(2)),
//     maidens: topBowler.bowling.maidens,
//     leaderboard: topBowlers.slice(1, 5).map((player) => ({
//       name: player.name,
//       matches: player.bowling.matches_played,
//       wickets: player.bowling.wickets,
//       sr:
//         player.bowling.strike_rate === "inf"
//           ? 0
//           : parseFloat(player.bowling.strike_rate.toFixed(1)),
//       eco: parseFloat(player.bowling.economy_rate.toFixed(2)),
//       maidens: player.bowling.maidens,
//       logo: getTeamLogo(player.teamName),
//     })),
//   };

//   return {
//     batsman: batsmanData,
//     bowler: bowlerData,
//   };
// };
// const TopPlayers = () => {
//   const topPlayersData = getTopPlayersData();

//   return (
//     <div className="relative">
//       <img
//         src="/images/elements/section-element.png"
//         className="absolute right-0 top-0  md:block hidden"
//         alt="element"
//       />
//       <img
//         src="/images/elements/section-element.png"
//         className="absolute left-0 bottom-0 rotate-180  md:block hidden"
//         alt="element"
//       />
//       <div className="section-width section-padding">
//         <TitleComponent
//           title="Top Players Season 3"
//           button={true}
//           buttonLink={routes.stats}
//         />
//         <div className="flex flex-col lg:flex-row justify-center gap-6 sm:gap-10">
//           <TopPlayerCard
//             type="batsman"
//             rank={topPlayersData.batsman.rank}
//             playerImage={topPlayersData.batsman.playerImage}
//             teamLogo={topPlayersData.batsman.teamLogo}
//             playerName={topPlayersData.batsman.playerName}
//             teamName={topPlayersData.batsman.teamName}
//             runs={topPlayersData.batsman.runs}
//             strikeRate={topPlayersData.batsman.strikeRate}
//             matchesPlayed={topPlayersData.batsman.matchesPlayed}
//             fours={topPlayersData.batsman.fours}
//             sixes={topPlayersData.batsman.sixes}
//             leaderboard={topPlayersData.batsman.leaderboard}
//           />
//           <TopPlayerCard
//             type="bowler"
//             rank={topPlayersData.bowler.rank}
//             playerImage={topPlayersData.bowler.playerImage}
//             teamLogo={topPlayersData.bowler.teamLogo}
//             playerName={topPlayersData.bowler.playerName}
//             wickets={topPlayersData.bowler.wickets}
//             strikeRate={topPlayersData.bowler.strikeRate}
//             matchesPlayed={topPlayersData.bowler.matchesPlayed}
//             ecoRate={topPlayersData.bowler.ecoRate}
//             maidens={topPlayersData.bowler.maidens}
//             leaderboard={topPlayersData.bowler.leaderboard}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// const gradientStyle = {
//   background:
//     "linear-gradient(227.41deg, #010F54 -28.03%, #000827 48.51%, #010F54 125.04%)",
// };

// const textGradientStyle = {
//   backgroundImage:
//     "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
// };

// const StatItem = ({ value, label, className = "" }) => (
//   <div className={`text-left flex justify-start items-end ${className}`}>
//     <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1">
//       {value}
//     </div>
//     <div
//       className="text-xs md:text-sm text-blue-300 pb-1 pl-1 md:pl-2 font-medium uppercase leading-3 md:leading-4 tracking-wider"
//       dangerouslySetInnerHTML={{ __html: label }}
//     />
//   </div>
// );

// const HeaderCell = ({ children, className = "" }) => (
//   <div className={`flex items-center justify-center ${className}`}>
//     <span
//       className="font-bold text-transparent bg-clip-text text-xs sm:text-base p-1"
//       style={textGradientStyle}
//     >
//       {children}
//     </span>
//   </div>
// );

// const TopPlayerCard = ({
//   type = "batsman",
//   rank = 1,
//   playerImage,
//   teamName,
//   teamLogo,
//   playerName,
//   runs,
//   wickets,
//   strikeRate,
//   matchesPlayed,
//   fours,
//   sixes,
//   ecoRate,
//   maidens,
//   leaderboard = [],
// }) => {
//   const isBatsman = type === "batsman";
//   const statsConfig = isBatsman
//     ? [
//         { value: runs, label: "RUNS" },
//         { value: strikeRate, label: "STRIKE<br/>RATE" },
//         { value: matchesPlayed, label: "MATCHES<br/>PLAYED" },
//         { value: fours, label: "4s" },
//         { value: sixes, label: "6s" },
//       ]
//     : [
//         { value: wickets, label: "WICKETS" },
//         { value: strikeRate, label: "STRIKE<br/>RATE" },
//         { value: matchesPlayed, label: "MATCHES<br/>PLAYED" },
//         { value: ecoRate, label: "ECO<br/>RATE" },
//         { value: maidens, label: "MAIDEN" },
//       ];

//   const headerConfig = isBatsman
//     ? ["POS", "TM", "PLAYER", "MP", "R", "SR", "4s", "6s"]
//     : ["POS", "TM", "PLAYER", "MP", "W", "SR", "ECO", "MN"];

//   const getPlayerValue = (player, field) =>
//     isBatsman ? player[field] : player[field];

//   console.log(teamName, "lsfjslkdfjlsdjlgksd sdjvfksdl");

//   return (
//     <div className="relative flex-1">
//       <div className="w-full max-w-3xl overflow-hidden">
//         {/* Hero Section */}
//         <div className="relative text-white overflow-hidden rounded-t-xl">
//           <div className="absolute inset-0 z-0" style={gradientStyle} />
//           <div
//             className="absolute inset-0 z-10"
//             style={{
//               backgroundImage: "url('/images/playerProfile/bgVector.svg')",
//               backgroundRepeat: "no-repeat",
//               backgroundSize: "cover",
//               backgroundPosition: "center",
//               maskImage: "linear-gradient(to right, black 0%, transparent 90%)",
//               WebkitMaskImage:
//                 "linear-gradient(to right, black 0%, transparent 90%)",
//             }}
//           />

//           <div
//             className="bg-[#999FA4] w-fit mb-10 px-6 py-2 relative custom-title-border"
//             style={{
//               clipPath: "polygon(0% 0%, 100% 0%, 97.5% 100%, 0% 100%)",
//               zIndex: 9999,
//             }}
//           >
//             <div
//               className="text-xl font-bold text-transparent bg-clip-text relative"
//               style={textGradientStyle}
//             >
//               {isBatsman ? "TOP BATSMAN" : "TOP BOWLER"}
//             </div>
//           </div>

//           <div className="flex items-end px-3 md:px-4 lg:px-6 sm:min-h-[280px] relative">
//             <div className="flex-1 pb-4 md:pb-6 lg:pb-8 relative">
//               <div className="mb-3 md:mb-4 lg:mb-6 flex justify-start items-center">
//                 <div className="z-20 mr-2 md:mr-2.5 lg:mr-3">
//                   <Image
//                     width={50}
//                     height={50}
//                     src={teamLogo}
//                     alt={`${playerName} team logo`}
//                     className="opacity-90"
//                   />
//                 </div>
//                 <h2
//                   className="text-xl md:text-2xl  font-bold text-transparent bg-clip-text uppercase tracking-wide italic"
//                   style={textGradientStyle}
//                 >
//                   {playerName}
//                 </h2>
//               </div>

//               <div className="border border-white border-opacity-30 rounded-lg p-3 md:p-4 lg:p-6 bg-black bg-opacity-20">
//                 <div className="grid gap-3 md:gap-4 lg:gap-6">
//                   <div className="grid grid-cols-3 gap-3 md:gap-4 lg:gap-6">
//                     {statsConfig
//                       .slice(0, isBatsman ? 2 : 2)
//                       .map((stat, idx) => (
//                         <StatItem
//                           key={idx}
//                           value={stat.value}
//                           label={stat.label}
//                         />
//                       ))}
//                   </div>
//                   <div className="grid grid-cols-3 gap-3 md:gap-4 lg:gap-6">
//                     {statsConfig.slice(2).map((stat, idx) => (
//                       <StatItem
//                         key={idx}
//                         value={stat.value}
//                         label={stat.label}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Leaderboard */}
//         {/* Leaderboard */}
//         <div className="overflow-x-scroll md:overflow-x-hidden">
//           <div
//             className="py-4 px-3 rounded-b-xl min-w-[550px] sm:min-w-0"
//             style={gradientStyle}
//           >
//             <div className="relative">
//               <div
//                 className="bg-[#001B31] w-[95%] right-1 border-r-[27px] top-3 border-[#F15A22] h-7 z-10 absolute"
//                 style={{
//                   clipPath: "polygon(0% 0%, 100% 0%, 97.9% 100%, 0% 100%)",
//                 }}
//               />

//               <div
//                 className="bg-[#999FA4] italic z-50 relative mb-4 mr-2 custom-heading-border"
//                 style={{
//                   clipPath: "polygon(0% 0%, 100% 0%, 97% 100%, 0% 100%)",
//                 }}
//               >
//                 <div
//                   className="grid items-center pl-1 pr-6 py-4"
//                   style={{
//                     gridTemplateColumns: (() => {
//                       const totalCols = headerConfig.length;
//                       const percent = (80 / (totalCols - 1)).toFixed(4); // All except name column (index 2 (name))
//                       return Array.from({ length: totalCols }, (_, i) =>
//                         i === 2 ? "20%" : `${percent}%`
//                       ).join(" ");
//                     })(),
//                   }}
//                 >
//                   {headerConfig.map((label, idx) => (
//                     <HeaderCell key={idx}>{label}</HeaderCell>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="text-white space-y-3">
//               <div className="text-white space-y-3">
//                 {leaderboard.map((player, index) => {
//                   const stats = isBatsman
//                     ? [player.runs, player.sr, player.fours, player.sixes]
//                     : [player.wickets, player.sr, player.eco, player.maidens];

//                   const totalCols = 3 + stats.length; // logo + name + matches + stats
//                   const percent = (80 / (totalCols - 1)).toFixed(4); // only 'name' gets 20%

//                   return (
//                     <div
//                       key={index}
//                       className="flex items-center justify-between relative pr-3"
//                     >
//                       <div className="flex z-50 pl-2 items-center">
//                         <span className="text-white text-sm">{index + 2}.</span>
//                       </div>

//                       <div
//                         className="w-[98.5%] border-r-[50px] border-[#F15A22] h-7 z-20 absolute"
//                         style={{
//                           clipPath:
//                             "polygon(0% 0%, 100% 0%, 97.5% 100%, 0% 100%)",
//                           background:
//                             "linear-gradient(to right, rgba(224, 126, 39, 0.2) 60%, rgba(255, 255, 255, 0.2) 71%, rgba(224, 126, 39, 0.2) 100%)",
//                         }}
//                       >
//                         <div className="custom-yellow-border" />
//                         <div className="custom-black-gradient" />
//                       </div>

//                       <div
//                         className="bg-[#999FA4] z-50 px-2 py-2 relative w-[94%] custom-border-bg grid items-center"
//                         style={{
//                           clipPath:
//                             "polygon(3% 0%, 100% 0%, 96% 100%, 0% 100%)",
//                           gridTemplateColumns: `${percent}% 20% ${percent}% repeat(${stats.length}, ${percent}%)`,
//                         }}
//                       >
//                         {/* Logo */}
//                         <div className="flex items-center justify-center">
//                           <div className="h-6 w-6 rounded-full flex items-center justify-center overflow-hidden">
//                             <img
//                               src={player.logo}
//                               alt={player.name}
//                               className="w-full h-full object-contain"
//                             />
//                           </div>
//                         </div>

//                         {/* Name */}
//                         <div className="flex items-center justify-start">
//                           <p className="text-xs sm:text-base">
//                             {toTitleCase(truncateTextSpells(player.name, 12))}
//                           </p>
//                         </div>

//                         {/* Matches */}
//                         <div className="flex items-center justify-center">
//                           <span className="text-xs sm:text-base">
//                             {player.matches}
//                           </span>
//                         </div>

//                         {/* Stats */}
//                         {stats.map((val, i) => (
//                           <div
//                             key={i}
//                             className="flex items-center justify-center"
//                           >
//                             <span className="text-xs sm:text-base">{val}</span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TopPlayers;
