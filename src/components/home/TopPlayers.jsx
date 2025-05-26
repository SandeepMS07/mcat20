import Image from "next/image";
import TitleComponent from "../common/TitleComponent";
import routes from "@/utilis/route";

const topPlayersData = {
  batsman: {
    rank: 1,
    playerImage: "/images/playerProfile/prithvi.svg",
    teamLogo: "/images/teams/hero/teamLogo/northmumbai.svg",
    playerName: "Shreyas Iyer",
    runs: 363,
    strikeRate: 153.81,
    matchesPlayed: 6,
    fours: 29,
    sixes: 18,
    leaderboard: [
      {
        name: "Bravish Shetty",
        matches: 8,
        runs: 322,
        sr: 148.39,
        fours: 29,
        sixes: 15,
        logo: "/images/teams/hero/teamLogo/thane.svg",
      },
      {
        name: "Prithvi Shaw",
        matches: 6,
        runs: 249,
        sr: 149.1,
        fours: 25,
        sixes: 9,
        logo: "/images/teams/hero/teamLogo/sobo.svg",
      },
      {
        name: "Suryakumar Yadav",
        matches: 7,
        runs: 244,
        sr: 182.09,
        fours: 22,
        sixes: 15,
        logo: "/images/teams/hero/teamLogo/arcs.svg",
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
        eco: 9.41,
        maidens: 0,
        logo: "/images/teams/hero/teamLogo/northmumbai.svg",
      },
      {
        name: "Badre Alam",
        matches: 7,
        wickets: 12,
        sr: 12.5,
        eco: 8.2,
        maidens: 0,
        logo: "/images/teams/hero/teamLogo/northmumbai.svg",
      },
      {
        name: "Shivam Dubey",
        matches: 8,
        wickets: 12,
        sr: 13.33,
        eco: 10.01,
        maidens: 0,
        logo: "/images/teams/hero/teamLogo/arcs.svg",
      },
      {
        name: "Azhar Ansari",
        matches: 6,
        wickets: 11,
        sr: 12,
        eco: 8.5,
        maidens: 0,
        logo: "/images/teams/hero/teamLogo/sobo.svg",
      },
    ],
  },
};

const TopPlayers = () => {
  return (
    <div className="section-width section-padding">
      <TitleComponent title="Top Players" />
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
    <div className="bg-white overflow-hidden shadow-lg w-full max-w-3xl">
      <div className="bg-black text-white px-6 py-4">
        <div className="text-xl font-semibold">
          {type === "batsman" ? "TOP BATSMAN" : "TOP BOWLER"}
        </div>
      </div>

      <div
        className="relative bg-gradient-to-r from-[rgb(10,31,49)] to-[rgb(34,98,150)] bg-cover bg-center text-white px-4 sm:px-6 flex flex-col 2xl:flex-row items-center gap-4"
        style={{
          backgroundImage: `url('/images/playerProfile/bgVector.svg'), linear-gradient(to right, rgb(18,53,82), rgb(34,98,150))`,
          backgroundBlendMode: "normal",
        }}
      >
        <div className="absolute top-4 right-4 text-5xl font-bold italic">
          <Image
            width={50}
            height={50}
            src={teamLogo}
            alt={`${playerName} team logo`}
          />
        </div>

        <div className="flex-1 ">
          <div className="text-5xl font-bold italic mt-8">
            <Image
              width={50}
              height={50}
              src="/images/playerProfile/1.svg"
              alt="rank"
            />
            <div className="text-3xl font-semibold mb-8 text-center mt-7 2xl:text-start">
              {playerName}
            </div>
          </div>

          <div className="grid grid-cols-2 justify-center sm:flex sm:flex-wrap gap-6 mt-2 text-center bg-[rgb(20,59,94)] p-4 mb-4 rounded-md">
            {/* Display runs for batsman or wickets for bowler */}
            <div className="flex justify-center items-end gap-2">
              <div className="text-4xl font-bold">
                {type === "batsman" ? runs : wickets}
              </div>
              <div className="text-[10px] ">
                {type === "batsman" ? "RUNS" : "WICKETS"}
              </div>
            </div>

            <div className="flex justify-center items-end gap-2">
              <div className="text-4xl font-bold">{strikeRate}</div>
              <div className="text-[10px] ">
                STRIKE <br /> RATE
              </div>
            </div>

            <div className="flex justify-center items-end gap-2">
              <div className="text-4xl font-bold">{matchesPlayed}</div>
              <div className="text-[10px] ">
                MATCHES <br /> PLAYED
              </div>
            </div>

            {type === "batsman" ? (
              <>
                <div className="flex justify-center items-end gap-2">
                  <div className="text-4xl font-bold">{fours}</div>
                  <div className="text-[10px]">4s</div>
                </div>
                <div className="flex justify-center items-end gap-2">
                  <div className="text-4xl font-bold">{sixes}</div>
                  <div className="text-[10px]">6s</div>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-center items-end gap-2">
                  <div className="text-4xl font-bold">{ecoRate}</div>
                  <div className="text-[10px]">
                    ECO <br /> RATE
                  </div>
                </div>
                <div className="flex justify-center items-end gap-2">
                  <div className="text-4xl font-bold">{maidens}</div>
                  <div className="text-[10px]">MAIDENS</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-[rgba(11,18,32,1) overflow-x-auto">
        <table className="w-full min-w-[500px] text-[10px] text-left">
          {/* Header Section */}
          <thead className="text-white bg-[rgba(11,18,32,1)]">
            <tr className="border-b border-gray-600">
              <th className="py-2 px-6 text-left">Name</th>
              <th className="py-2 px-2 text-center">MP</th>
              {type === "batsman" ? (
                <>
                  <th className="py-2 px-2 text-center">Runs</th>
                  <th className="py-2 px-2 text-center">SR</th>
                  <th className="py-2 px-2 text-center">4s</th>
                  <th className="py-2 px-2 text-center">6s</th>
                </>
              ) : (
                <>
                  <th className="py-2 px-2 text-center">Wickets</th>
                  <th className="py-2 px-2 text-center">SR</th>
                  <th className="py-2 px-2 text-center">Eco</th>
                  <th className="py-2 px-2 text-center">Maiden</th>
                </>
              )}
            </tr>
          </thead>

          {/* Body Section */}
          <tbody className="text-white bg-[rgba(15,26,45,1)]">
            {leaderboard.map((player, index) => (
              <tr
                key={index}
                className="border-b border-gray-700 hover:bg-[rgba(20,35,60,1)]"
              >
                <td className="py-2 px-6 flex items-center gap-2">
                  <img
                    src={player.logo}
                    alt={player.name}
                    className="w-5 h-5"
                  />
                  {player.name}
                </td>
                <td className="py-2 px-2 text-center">{player.matches}</td>
                {type === "batsman" ? (
                  <>
                    <td className="py-2 px-2 text-center">{player.runs}</td>
                    <td className="py-2 px-2 text-center">{player.sr}</td>
                    <td className="py-2 px-2 text-center">{player.fours}</td>
                    <td className="py-2 px-2 text-center">{player.sixes}</td>
                  </>
                ) : (
                  <>
                    <td className="py-2 px-2 text-center">{player.wickets}</td>
                    <td className="py-2 px-2 text-center">{player.sr}</td>
                    <td className="py-2 px-2 text-center">{player.eco}</td>
                    <td className="py-2 px-2 text-center">{player.maidens}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopPlayers;
