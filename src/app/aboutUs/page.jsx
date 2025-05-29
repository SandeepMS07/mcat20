import AboutMCA from "@/components/aboutUs/aboutMCA/AboutMCA";
import AboutPS from "@/components/aboutUs/aboutPS/AboutPS";
import T20Mumbai from "@/components/aboutUs/t20Mumbai/T20Mumbai";
import Hero from "@/components/hero/Hero";
import React from "react";

const page = () => {
  return (
    <div>
      <Hero imgUrl={"/images/about/about-bg.png"} heading={"About us"} />
      <div className="flex flex-col gap-28">
        <T20Mumbai />
        <AboutMCA />
        {/* <AboutPS /> */}
      </div>
    </div>
  );
};

export default page;
