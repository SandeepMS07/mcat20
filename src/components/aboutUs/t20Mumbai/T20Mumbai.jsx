import Image from "next/image";
import React from "react";

const T20Mumbai = () => {
  return (
    <div className="h-full lg:flex items-start text-black p-10 section-width mt-20 gap-12">
      <div className="h-full w-full lg:w-[45%] flex flex-col gap-6">
        <div className="w-full mb-6 relative h-[100px]">
          <Image
            src="/images/elements/small-title-bg.png"
            fill
            className="object-contain"
            alt="Background"
          />
          <div className="relative z-10 px-8 py-6 h-full flex items-center">
            <h2
              className="capitalize text-xl xl:text-3xl ml-20 italic"
              style={{
                background:
                  "radial-gradient(43.3% 61.24% at 50% 50%, #FFF200 0%, #FFF200 26%, #FBB040 97%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              WHAT IS T20 MUMBAI
            </h2>
          </div>
        </div>
        <p className="text-[#616161] leading-relaxed">
          Aimed at bringing the best local cricket talent of Mumbai under a
          common umbrella, T20 Mumbai is a league to identify, develop and
          promote cricketers at the grassroots level. T20 Mumbai will provide
          more structure to the cricket scene in the city and endeavour to build
          a platform for bringing the future superstars of the sport together.
        </p>
      </div>
      <div className="w-full lg:w-[55%] pt-14 lg:pt-0">
        <Image
          src={"/images/about/view-cricket-game-field.png"}
          width={1000}
          height={500}
          className="object-cover h-[319px] w-full rounded-lg"
          alt="T20 Mumbai Cricket"
        />
      </div>
    </div>
  );
};

export default T20Mumbai;
