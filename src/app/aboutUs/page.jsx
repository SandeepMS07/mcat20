import AboutMCA from "@/components/aboutUs/aboutMCA/AboutMCA";
import AboutPS from "@/components/aboutUs/aboutPS/AboutPS";
import T20Mumbai from "@/components/aboutUs/t20Mumbai/T20Mumbai";
import Hero from "@/components/hero/Hero";
import React from "react";

const page = () => {
  return (
    <div>
      <Hero imgUrl={"/images/about/about-bg.png"} heading={"About us"} />
      <div className="flex flex-col gap-28 relative">
        <img
            src="/images/elements/section-element.png"
            className="absolute right-0 top-0 md:block hidden"
            alt="element"
          />
          <img
            src="/images/elements/section-element.png"
            className="absolute left-0 bottom-0 rotate-180 md:block hidden"
            alt="element"
          />
        <T20Mumbai />
        <AboutMCA />
        {/* <AboutPS /> */}
      </div>
    </div>
  );
};

export default page;
