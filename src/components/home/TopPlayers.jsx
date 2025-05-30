import Image from "next/image";
import TitleComponent from "../common/TitleComponent";
import routes from "@/utilis/route";

const topPlayersData = {
  batsman: {
    rank: 1,
    playerImage: "/images/playerProfile/prithvi.svg",
    teamLogo: "/images/teams/hero/teamLogo/northmumbai.svg",
    playerName: "Prithvi Shaw",
    runs: 249,
    strikeRate: 149.1,
    matchesPlayed: 6,
    fours: 25,
    sixes: 9,
    leaderboard: [
      {
        name: "Aditya Tare",
        matches: 5,
        runs: 244,
        sr: 138.64,
        fours: 31,
        sixes: 3,
        logo: "/images/teams/hero/teamLogo/thane.svg",
      },
      {
        name: "Jay Bista",
        matches: 7,
        runs: 242,
        sr: 132.97,
        fours: 27,
        sixes: 5,
        logo: "/images/teams/hero/teamLogo/sobo.svg",
      },
      {
        name: "Akhil Herwadkar",
        matches: 6,
        runs: 231,
        sr: 129.78,
        fours: 20,
        sixes: 8,
        logo: "/images/teams/hero/teamLogo/arcs.svg",
      },
      {
        name: "Parag Khanapurkar",
        matches: 6,
        runs: 229,
        sr: 133.92,
        fours: 19,
        sixes: 8,
        logo: "/images/teams/hero/teamLogo/sobo.svg",
      },
    ],
  },
  bowler: {
    rank: 1,
    playerImage: "/images/playerProfile/dhurmil.svg",
    teamLogo: "/images/teams/hero/teamLogo/sobo.svg",
    playerName: "Dhrumil Matkar",
    wickets: 15,
    strikeRate: 10.8,
    matchesPlayed: 7,
    ecoRate: 6.67,
    maidens: 1,
    leaderboard: [
      {
        name: "Atif Attarwala",
        matches: 7,
        wickets: 12,
        sr: 13.5,
        eco: 8.04,
        maidens: 0,
        logo: "/images/teams/hero/teamLogo/northmumbai.svg",
      },
      {
        name: "Royston Dias",
        matches: 5,
        wickets: 10,
        sr: 10.8,
        eco: 7.94,
        maidens: 0,
        logo: "/images/teams/hero/teamLogo/triumph.svg",
      },
      {
        name: "Prathamesh Dake",
        matches: 6,
        wickets: 10,
        sr: 14.4,
        eco: 7.5,
        maidens: 0,
        logo: "/images/teams/hero/teamLogo/northmumbai.svg",
      },
      {
        name: "Deepak Shetty",
        matches: 7,
        wickets: 10,
        sr: 12.2,
        eco: 7.57,
        maidens: 0,
        logo: "/images/teams/hero/teamLogo/sobo.svg",
      },
    ],
  },
};

const TopPlayers = () => {
  return (
    <div className="relative">
       <img src="/images/elements/section-element.png" className="absolute right-0 top-0" alt="element" />
        <img src="/images/elements/section-element.png" className="absolute left-0 bottom-0 rotate-180" alt="element" />
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
    <div className="relative flex-1">
      <div className="w-full max-w-3xl overflow-hidden  ">
        {/* Updated Hero Section to match Figma */}

        <div
          className="relative  text-white overflow-hidden rounded-t-xl"
          style={{
            backgroundImage: `url('/images/playerProfile/bgVector.svg'), linear-gradient(227.41deg, #010F54 -28.03%, #000827 48.51%, #010F54 125.04%)`,
            backgroundBlendMode: "overlay",
            backgroundSize: "cover",
            backgroundPosition: "center",
            // background: "linear-gradient(227.41deg, #010F54 -28.03%, #000827 48.51%, #010F54 125.04%)"
          }}
        >
          <div
            className=" border-b border-white border-opacity-30  w-fit  mb-10 px-6 py-2"
            style={{
              clipPath: "polygon(0% 0%, 100% 0%, 97.5% 100%, 0% 100%)",
              background:
                "linear-gradient(90deg, #000000 -27.21%, #001B31 20.62%, #001527 102.01%)",
            }}
          >
            <div
              className="xl:text-3xl lg:text-2xl text-xl font-bold text-transparent bg-clip-text  "
              style={{
                backgroundImage:
                  "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
              }}
            >
              {type === "batsman" ? "TOP BATSMAN" : "TOP BOWLER"}
            </div>
          </div>

        <div className="flex items-end px-3 md:px-4 lg:px-6 sm:min-h-[280px]">
          {/* Player Image Section - Touching bottom */}
          <div className="flex-shrink-0 w-1/3 flex justify-center items-end h-full">
            <div className="relative h-full flex items-end">
              <Image
                width={200}
                height={300}
                src={playerImage}
                alt={playerName}
                className="object-contain object-bottom"
              />
            </div>
          </div>
          <div className="flex items-end px-6  min-h-[280px]">
            {/* Player Image Section - Touching bottom */}
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
          <div className="flex-1 pl-4 md:pl-6 lg:pl-8 pb-4 md:pb-6 lg:pb-8">
            {/* Player Name - Top Right */}
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
              <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-transparent bg-clip-text uppercase tracking-wide italic"
              style={{
              backgroundImage:
                "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
            }}>
                {playerName}
              </h2>
            </div>
            {/* Player Info and Stats Section */}
            <div className="flex-1  pb-8">
              {/* Player Name - Top Right */}
              <div className="mb-6 flex justify-start items-center">
                <div className="z-20 mr-3">
                  <Image
                    width={50}
                    height={50}
                    src={teamLogo}
                    alt={`${playerName} team logo`}
                    className="opacity-90"
                  />
                </div>
                <h2
                  className="xl:text-3xl lg:text-xl text-lg font-bold text-transparent bg-clip-text uppercase tracking-wide italic"
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
              {/* Stats Container with Border */}
              <div className="border border-white border-opacity-30 rounded-lg p-6 bg-black bg-opacity-20">
                {/* Stats Grid - Different layouts for batsman vs bowler */}
                {type === "batsman" ? (
                  // Batsman: 2x2 grid (4 stats)
                  <div className="grid gap-6">
                    {/* Top Row: 2 columns */}
                    <div className="grid grid-cols-3 gap-6">
                      {/* Runs */}
                      <div className="text-left flex justify-start items-end">
                        <div className="text-4xl font-bold text-white mb-1">
                          {runs}
                        </div>
                        <div className="text-sm text-blue-300 pb-1 pl-2 font-medium uppercase leading-4 tracking-wider">
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
                      {/* Strike Rate */}
                      <div className="text-left flex justify-start items-end">
                        <div className="text-4xl font-bold text-white">
                          {strikeRate}
                        </div>
                        <div className="text-sm text-blue-300 pb-1 pl-2 font-medium uppercase leading-4 tracking-wider">
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
                    {/* Bottom Row: 3 columns */}
                    <div className="grid grid-cols-3 gap-6">
                      {/* Matches Played */}
                      <div className="text-left flex justify-start items-end">
                        <div className="text-4xl font-bold text-white mb-1">
                          {matchesPlayed}
                        </div>
                        <div className="text-sm text-blue-300 pb-1 pl-2 font-medium uppercase leading-4 tracking-wider">
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
                      {/* Fours */}
                      <div className="text-left flex justify-start items-end">
                        <div className="text-4xl font-bold text-white mb-1">
                          {fours}
                        </div>
                        <div className="text-sm text-blue-300 pb-1 pl-2 font-medium uppercase leading-4 tracking-wider">
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
                // Bowler: 3x2 grid (5 stats total - wickets spans 2 columns)
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
                      {/* Sixes */}
                      <div className="text-left flex justify-start items-end">
                        <div className="text-4xl font-bold text-white mb-1">
                          {sixes}
                        </div>
                        <div className="text-sm text-blue-300 pb-1 pl-2 font-medium uppercase leading-4 tracking-wider">
                          6s
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Bowler: 3x2 grid (5 stats total - wickets spans 2 columns)
                  <div className="grid gap-4">
                    {/* Top row: 2 items */}
                    <div className="grid grid-cols-3 gap-4">
                      {/* Wickets */}
                      <div className="text-left flex justify-start items-end">
                        <div className="text-4xl font-bold text-white mb-1">
                          {wickets}
                        </div>
                        <div className="text-sm text-blue-300 pb-1 pl-2 font-medium uppercase leading-4 tracking-wider">
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
                      {/* Strike Rate */}
                      <div className="text-left flex justify-start items-end">
                        <div className="text-4xl font-bold text-white">
                          {strikeRate}
                        </div>
                        <div className="text-sm text-blue-300 pb-1 pl-2 font-medium uppercase leading-4 tracking-wider">
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
                    {/* Bottom row: 3 items */}
                    <div className="grid grid-cols-3 gap-4">
                      {/* Matches Played */}
                      <div className="text-left flex justify-start items-end">
                        <div className="text-4xl font-bold text-white">
                          {matchesPlayed}
                        </div>
                        <div className="text-xs text-blue-300 pb-1 pl-2 font-medium uppercase leading-3 tracking-wider">
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
                      {/* Eco Rate */}
                      <div className="text-left flex justify-start items-end">
                        <div className="text-4xl font-bold text-white">
                          {ecoRate}
                        </div>
                        <div className="text-xs text-blue-300 pb-1 pl-2 font-medium uppercase leading-3 tracking-wider">
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
                      {/* Maiden */}
                      <div className="text-left flex justify-start items-end">
                        <div className="text-4xl font-bold text-white">
                          {maidens}
                        </div>
                        <div className="text-xs text-blue-300 pb-1 pl-2 font-medium uppercase leading-3 tracking-wider">
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
        <div
          className="w-full overflow-hidden py-4 px-3 rounded-b-xl"
          style={{
            background:
              "linear-gradient(227.41deg, #010F54 -28.03%, #000827 48.51%, #010F54 125.04%)",
          }}
        >
          {/* Column Headers */}
          <div className="relative">
            {/* Background layer */}
            <div
              className="bg-[#001B31] w-[95%] right-1 border-r-[25px] top-2 border-[#F15A22] h-10  z-10 absolute"
              style={{
                clipPath: "polygon(0% 0%, 100% 0%, 98% 100%, 0% 100%)",
              }}
            ></div>

            {/* Header Row */}
            <div
              className="bg-[#001B31] italic z-50 relative mb-4 mr-2  border-white border-[0.5px] border-opacity-10"
              style={{
                clipPath: "polygon(0% 0%, 100% 0%, 97.5% 100%, 0% 100%)",
              }}
            >
              <div className="flex items-center justify-between pl-1 pr-6 py-4">
                <div className="w-[5%] flex items-center justify-start">
                  <span
                    className="font-bold text-transparent bg-clip-text text-base"
                    style={{
                      backgroundImage:
                        "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
                    }}
                  >
                    POS
                  </span>
                </div>
                <div className="w-[10%] flex items-center justify-center">
                  <span
                    className="font-bold text-transparent bg-clip-text text-base"
                    style={{
                      backgroundImage:
                        "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
                    }}
                  >
                    TEAM
                  </span>
                </div>
                <div className="w-[30%] flex items-center justify-start pl-8">
                  <span
                    className="font-bold text-transparent bg-clip-text text-base"
                    style={{
                      backgroundImage:
                        "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
                    }}
                  >
                    PLAYER
                  </span>
                </div>
                <div className="w-[11%] flex items-center justify-center">
                  <span
                    className="font-bold text-transparent bg-clip-text text-base"
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
                    <div className="w-[11%] flex items-center justify-center ">
                      <span
                        className="font-bold text-transparent bg-clip-text text-base"
                        style={{
                          backgroundImage:
                            "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
                        }}
                      >
                        RUNS
                      </span>
                    </div>
                    <div className="w-[11%] flex items-center justify-center">
                      <span
                        className="font-bold text-transparent bg-clip-text text-base"
                        style={{
                          backgroundImage:
                            "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
                        }}
                      >
                        SR
                      </span>
                    </div>
                    <div className="w-[11%] flex items-center justify-center">
                      <span
                        className="font-bold text-transparent bg-clip-text text-base"
                        style={{
                          backgroundImage:
                            "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
                        }}
                      >
                        4s
                      </span>
                    </div>
                    <div className="w-[11%] flex items-center justify-center">
                      <span
                        className="font-bold text-transparent bg-clip-text text-base"
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
                    <div className="w-[11%] flex items-center justify-center">
                      <span
                        className="font-bold text-transparent bg-clip-text text-base"
                        style={{
                          backgroundImage:
                            "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
                        }}
                      >
                        WICKETS
                      </span>
                    </div>
                    <div className="w-[11%] flex items-center justify-center">
                      <span
                        className="font-bold text-transparent bg-clip-text text-base"
                        style={{
                          backgroundImage:
                            "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
                        }}
                      >
                        SR
                      </span>
                    </div>
                    <div className="w-[11%] flex items-center justify-center">
                      <span
                        className="font-bold text-transparent bg-clip-text text-base"
                        style={{
                          backgroundImage:
                            "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
                        }}
                      >
                        ECO
                      </span>
                    </div>
                    <div className="w-[11%] flex items-center justify-center">
                      <span
                        className="font-bold text-transparent bg-clip-text text-base"
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

          <div className="text-white space-y-3 ">
            {leaderboard.map((player, index) => (
              <div
                key={index}
                className="flex items-center justify-between relative pr-3 mx-3 "
              >
                <div className="flex z-50 pl-2 items-center">
                  <span className="text-white">{index + 1}.</span>
                </div>
                <div
                  className="bg-[#001B31] w-[100%]  right-1 border-r-[25px] border-t-[0.42px] border-l-[0.42px] border-b-[0.42px] border-gray-800   border-r-[#F15A22] h-8 mr-2 z-10 absolute"
                  style={{
                    clipPath: "polygon(0% 0%, 100% 0%, 99% 100%, 0% 100%)",
                  }}
                ></div>
                <div
                  className="flex items-center justify-between bg-[rgba(15,26,45,1)] border-white border-[0.5px] border-opacity-10 z-50 px-10 py-1 flex-1 ml-3"
                  style={{
                    clipPath: "polygon(3% 0%, 100% 0%, 98% 100%, 0% 100%)",
                  }}
                >
                  <div className="flex items-center gap-5 xl:gap-10">
                    <div className="h-11 w-11 rounded-full bg-[#242424] flex items-center justify-center overflow-hidden">
                      <img
                        src={player.logo}
                        alt={player.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-start w-[30%]">
                    <p className="text-base font-semibold">{player.name}</p>
                  </div>
                  <div className="w-[11%] flex items-center justify-center">
                    <span className="text-base font-semibold">
                      {player.matches}
                    </span>
                  </div>
                  {type === "batsman" ? (
                    <>
                      <div className="w-[11%] flex items-center justify-center">
                        <span className="text-base font-semibold">
                          {player.runs}
                        </span>
                      </div>
                      <div className="w-[11%] flex items-center justify-center">
                        <span className="text-base font-semibold">
                          {player.sr}
                        </span>
                      </div>
                      <div className="w-[11%] flex items-center justify-center">
                        <span className="text-base font-semibold">
                          {player.fours}
                        </span>
                      </div>
                      <div className="w-[11%] flex items-center justify-center">
                        <span className="text-base font-semibold">
                          {player.sixes}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-[11%] flex items-center justify-center">
                        <span className="text-base font-semibold">
                          {player.wickets}
                        </span>
                      </div>
                      <div className="w-[11%] flex items-center justify-center">
                        <span className="text-base font-semibold">
                          {player.sr}
                        </span>
                      </div>
                      <div className="w-[11%] flex items-center justify-center">
                        <span className="text-base font-semibold">
                          {player.eco}
                        </span>
                      </div>
                      <div className="w-[11%] flex items-center justify-center">
                        <span className="text-base font-semibold">
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
  );
};

export default TopPlayers;
