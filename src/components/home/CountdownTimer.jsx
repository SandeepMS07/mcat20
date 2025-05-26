"use client";
import { useEffect, useState } from "react";

const CountdownTimer = ({ targetDate }) => {
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
      <div className="w-full flex items-start justify-center gap-2 md:gap-4 py-6 bg-[#FDFDFD12]">
        <TimeBlock label="Days" value={timeLeft.days} />
        <Separator />
        <TimeBlock label="Hours" value={timeLeft.hours} />
        <Separator />
        <TimeBlock label="Minutes" value={timeLeft.minutes} />
      </div>
      <div className="flex justify-between items-center bg-[#00000080]">
        <img
          src="/images/teams/hero/teamLogo/arcs.svg"
          alt="arcs"
          className="w-20 p-5"
        />
        <div className="flex flex-col items-center text-center">
          <p className="text-[#E07E27]">VS</p>
          <p className="text-xs">MATCH 1/20</p>
        </div>
        <div className="p-5">
          <img
            src="/images/home/team/soboSuperSonics.png"
            alt="arcs"
            className="w-20  bg-white"
          />
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
