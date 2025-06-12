"use client";
import routes from "@/utilis/route";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GoDotFill } from "react-icons/go";



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
  const router = useRouter();
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


  const handleNavigateToFixture = ()=>{
    router.push(`${routes.matchcentre}?type=scorecard&mId=1666&cId=63&dId=1&sId=113`);
  }

  return (
      <div className="w-full rounded-l-xl md:rounded-l-xl border-y-2 border-l-2  border-[#E07E27] shadow-2xl overflow-hidden cursor-pointer"
        onClick={handleNavigateToFixture}
      >
        <div
          className="  w-full flex overflow-hidden items-center justify-evenly rounded-tl-lg gap-4"
          style={{
            background:
              "linear-gradient(0deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.48) 1.45%, rgba(0, 0, 0, 0.70) 100%), rgba(255, 255, 255, 0.09)",
          }}
        >
          <div className="flex flex-col justify-between  py-6 px-12">
            <p className="text-white text-base  xl:text-lg font-semibold leading-3 uppercase justify-center flex items-center gap-1 "><GoDotFill className="text-green-500" />
              Match is Live
            </p>
          </div>
        </div>
      <div>
      {/* <div className="w-full flex items-start justify-center gap-2 md:gap-3  bg-[#FDFDFD12]">
        <TimeBlock label="Days" value={timeLeft.days} />
        <Separator />
        <TimeBlock label="Hours" value={timeLeft.hours} />
        <Separator />
        <TimeBlock label="Minutes" value={timeLeft.minutes} />
      </div> */}
      <div className="flex justify-between items-center bg-[#00000080]">
        <div className="p-4 text-center flex flex-col  items-center">
           <div className="h-14 w-14 flex justify-center items-center"> 
          <img
            src={"/images/teams/hero/teamLogo/soboMumbaiFalcons.svg"}
            alt={"MSC Maratha Royals"}
            className={`w-20  ${
              homeTeam === "SoBo Mumbai Falcons" ? "bg-white" : ""
            }`}
          />
        </div>
          <span className="w-20 break-words my-2 text-xs">SoBo Mumbai Falcons</span>
        </div>

        <div className="flex flex-col items-center text-center">
          <p className="text-[#E07E27]">VS</p>
          <p className="text-xs">
            FINALS
             {/* <br /> {match_no}/{total_matches} */}
          </p>
        </div>
        <div className="p-4 text-center flex flex-col items-center">
          <div className="h-14 w-14">
            <img
              src={"/images/teams/hero/teamLogo/shivaji.png"}
              alt={"MSC Maratha Royals"}
              className={`w-20 p-1 ${
                awayTeam === "SoBo Mumbai Falcons" ? "bg-white" : ""
              }`}
            />
          </div>
          <span className="w-20 break-words my-2 text-xs">MSC Maratha Royals</span>
        </div>
      </div >
        {/* <div className="bg-[#00000080] text-center justify-center flex items-center gap-1 pb-2"><GoDotFill className="text-green-500" />
          Match is Live
        </div> */}
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
