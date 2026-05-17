import Image from "next/image";
import React from "react";

const T20Mumbai = () => {
  return (
    <section className="section-width mt-10 md:mt-16">
      <div className="rounded-2xl border border-white/10 bg-[linear-gradient(180deg,#243fb0_0%,#1a2f92_55%,#162a85_100%)] p-4 sm:p-6 lg:p-8 shadow-[0_16px_30px_rgba(0,0,0,0.3)]">
        <div className="h-full lg:flex items-start gap-8 lg:gap-10">
          <div className="h-full w-full lg:w-[45%] flex flex-col gap-5">
            <div className="inline-flex w-fit rounded-full border border-[#f7b347]/35 bg-[#f7b347]/10 px-4 py-2">
              <h2 className="text-sm sm:text-base md:text-lg font-extrabold uppercase italic tracking-wide text-[#ffd76a]">
                What Is T20 Mumbai
              </h2>
            </div>
            <p className="text-white/90 leading-relaxed sm:leading-8">
              Aimed at bringing the best local cricket talent of Mumbai under a
              common umbrella, T20 Mumbai is a league to identify, develop and
              promote cricketers at the grassroots level. T20 Mumbai will provide
              more structure to the cricket scene in the city and endeavour to build
              a platform for bringing the future superstars of the sport together.
            </p>
          </div>
          <div className="w-full lg:w-[55%] pt-6 lg:pt-0">
            <Image
              src={"/images/about/view-cricket-game-field.png"}
              width={1000}
              height={500}
              className="object-cover h-[230px] sm:h-[300px] lg:h-[340px] w-full rounded-xl border border-white/15"
              alt="T20 Mumbai Cricket"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default T20Mumbai;
