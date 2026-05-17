import AboutMCA from "@/components/aboutUs/aboutMCA/AboutMCA";
import AboutPS from "@/components/aboutUs/aboutPS/AboutPS";
import T20Mumbai from "@/components/aboutUs/t20Mumbai/T20Mumbai";
import Hero from "@/components/hero/Hero";
import React from "react";

const page = () => {
  return (
    <div className="bg-[#101b52] overflow-x-hidden">
      <Hero imgUrl={"/images/about/about-bg.png"} heading={"About us"} />
      <div className="relative flex flex-col gap-16 md:gap-24 pb-14 md:pb-20">
        <T20Mumbai />
        <AboutMCA />
        {/* <AboutPS /> */}
      </div>
    </div>
  );
};

export default page;
