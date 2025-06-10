"use client";
import { useEffect, useState } from "react";

export const teamsLogoSeason3 = [
  {
    id: 1,
    team: "Aakash Tigers MWS",
    teamLogo: "/images/teams/hero/teamLogo/aakash.svg",
    carouselLogo: "/images/teams/hero/carousel/aakash.svg",
  },
  {
    id: 2,
    team: "Arcs Andheri",
    teamLogo: "/images/teams/hero/teamLogo/arcs.svg",
    carouselLogo: "/images/teams/hero/carousel/arcs.svg",
  },
  {
    id: 3,
    team: "Eagle Thane Strikers",
    teamLogo: "/images/teams/hero/teamLogo/thane.svg",
    carouselLogo: "/images/teams/hero/carousel/thane.svg",
  },
  {
    id: 4,
    team: "Bandra Blasters",
    teamLogo:
      "https://turbostart.blob.core.windows.net/turbostart/1044990513729378-LOGO - BANDRA BLASTERS copy.png",
    carouselLogo: "/images/teams/hero/carousel/bandra.svg",
  },
  {
    id: 5,
    team: "North Mumbai Panthers",
    teamLogo: "/images/teams/hero/teamLogo/northmumbai.svg",
    carouselLogo: "/images/teams/hero/carousel/northMumbai.svg",
  },
  {
    id: 6,
    team: "MSC Maratha Royals",
    teamLogo: "/images/teams/hero/teamLogo/shivaji.png",
    carouselLogo: "/images/teams/hero/carousel/shivaji.png",
  },
  {
    id: 7,
    team: "SoBo Mumbai Falcons",
    teamLogo: "/images/teams/hero/teamLogo/soboMumbaiFalcons.svg",
    carouselLogo: "/images/teams/hero/carousel/sobo.png",
  },
  {
    id: 8,
    team: "Triumph Knights Mumbai North East",
    teamLogo: "/images/teams/hero/teamLogo/triumph.png",
    carouselLogo: "/images/teams/hero/carousel/triumph.png",
  },
];

const CountdownTimer = ({
  targetDate,
  homeTeam,
  awayTeam,
  match_no,
  total_matches,
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
  });

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const distance = new Date(targetDate) - now;

      if (distance <= 0) {
        setTimeLeft({ days: "00", hours: "00", minutes: "00" });
        return;
      }

      const days = String(
        Math.floor(distance / (1000 * 60 * 60 * 24))
      ).padStart(2, "0");
      const hours = String(
        Math.floor((distance / (1000 * 60 * 60)) % 24)
      ).padStart(2, "0");
      const minutes = String(
        Math.floor((distance / (1000 * 60)) % 60)
      ).padStart(2, "0");

      setTimeLeft({ days, hours, minutes });
    };

    const intervalId = setInterval(updateTimer, 1000);
    return () => clearInterval(intervalId);
  }, [targetDate]);

  return (
    <div>
      <div className="w-full flex items-start justify-center gap-2 md:gap-3  bg-[#FDFDFD12]">
        <TimeBlock label="Days" value={timeLeft.days} />
        <Separator />
        <TimeBlock label="Hours" value={timeLeft.hours} />
        <Separator />
        <TimeBlock label="Minutes" value={timeLeft.minutes} />
      </div>
      <div className="flex justify-between items-center bg-[#00000080]">
        <div className="p-4 text-center flex flex-col  items-center">
           <div className="h-14 w-14 flex justify-center items-center"> 
          <img
            src={
              teamsLogoSeason3.find((team) => team.team === homeTeam)?.teamLogo
            }
            alt={homeTeam}
            className={`w-20  ${
              homeTeam === "SoBo Mumbai Falcons" ? "bg-white" : ""
            }`}
          />
        </div>
          <span className="w-20 break-words my-2 text-xs">{homeTeam}</span>
        </div>

        <div className="flex flex-col items-center text-center">
          <p className="text-[#E07E27]">VS</p>
          <p className="text-xs">
            MATCH <br /> {match_no}/{total_matches}
          </p>
        </div>
        <div className="p-4 text-center flex flex-col items-center">
          <div className="h-14 w-14">
            <img
              src={
                teamsLogoSeason3.find((team) => team.team === awayTeam)?.teamLogo
              }
              alt={awayTeam}
              className={`w-20 p-1 ${
                awayTeam === "SoBo Mumbai Falcons" ? "bg-white" : ""
              }`}
            />
          </div>
          <span className="w-20 break-words my-2 text-xs">{awayTeam}</span>
        </div>
      </div>
    </div>
  );
};

const TimeBlock = ({ label, value }) => (
  <div className="text-center">
    <p className="font-bold text-xl xl:text-2xl text-[#E07E27]">{value}</p>
    <p className="text-white text-sm">{label}</p>
  </div>
);

const Separator = () => (
  <p className="font-bold text-xl xl:text-2xl text-white">:</p>
);

export default CountdownTimer;
