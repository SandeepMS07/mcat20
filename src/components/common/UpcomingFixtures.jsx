"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import { teamLogoBN, truncateTextSpells } from "@/utilis/helper";
import fixtures3 from "@/utilis/fixtures/fixtures3";

const UpcomingFixtures = () => {
  return (
    <div className=" ">
      <div className="flex flex-col items-center gap-8 w-full">
        <div className="block xl:hidden h-full max-w-screen-xl mx-auto w-full">
          <Swiper
            className="w-full"
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop={true}
          >
            {fixtures3.slice(0, 3).map((match, index) => (
              <SwiperSlide key={index} className="h-full w-full">
                <MatchCard {...match} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="hidden xl:grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 2xl:gap-12 w-full">
          {fixtures3.slice(0, 3).map((match, index) => {
            return <MatchCard key={index} {...match} />;
          })}
        </div>
      </div>
    </div>
  );
};

const MatchCard = ({ date, time, home_team, away_team, venue }) => {
  const teamLogo1 = teamLogoBN[home_team] || "";
  const teamLogo2 = teamLogoBN[away_team] || "";
  const isAfter5PM = (() => {
    if (!time) return false;
    const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return false;

    let [_, hours, minutes, meridiem] = match;
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);
    meridiem = meridiem.toUpperCase();

    if (meridiem === "PM" && hours < 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;

    return hours > 17 || (hours === 17 && minutes > 0);
  })();

  return (
    <div className="bg-white rounded-xl justify-between border-[rgba(194,194,194,1)] border flex flex-col h-full w-full">
      <div className="relative   w-full rounded-t-lg flex overflow-hidden bg-[#e07e27]">
        <div className="flex flex-row justify-between items-center p-4 text-white  w-full h-full   gap-1">
          <span className="text-lg font-semibold">{date}</span>
          <div className="flex items-center flex-row gap-2">
            <img
              src={
                isAfter5PM
                  ? "/images/elements/moon.svg"
                  : "/images/elements/sun.svg"
              }
              alt={isAfter5PM ? "moon" : "sun"}
              style={{ height: "15px" }}
            />

            <span className="text-sm">{time}</span>
          </div>
        </div>
      </div>
      <div className="flex  flex-row justify-center gap-10 text-center items-center p-6">
        <div className="w-[33%] flex flex-col justify-center items-center gap-2">
          <div className=" flex justify-center items-center h-20 w-20">
            <img src={teamLogo1} className="object-contain" alt={home_team} />
          </div>
          <span className="text-sm font-semibold text-black">{home_team}</span>
        </div>
        <div className="w-[33%] flex flex-col justify-center items-center gap-6">
          <span className="text-[rgba(224,126,39,1)] font-bold italic tracking-widest">
            VS
          </span>
        </div>
        <div className="w-[33%] flex flex-col justify-center items-center gap-2">
          <div className=" flex justify-center items-center h-20 w-20">
            <img
              src={teamLogo2}
              className="object-contain max-h-24 max-w-24"
              alt={away_team}
            />
          </div>
          <span className="text-sm font-semibold text-black">
            {truncateTextSpells(away_team, 18)}
          </span>
        </div>
      </div>
      <div>
        <p className="text-[#E07E27] text-sm text-center p-4 border-t border-[#C2C2C2] font-semibold">
          {venue}
        </p>
      </div>
    </div>
  );
};

export default UpcomingFixtures;
