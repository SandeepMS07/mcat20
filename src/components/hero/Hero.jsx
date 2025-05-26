"use client";
import Image from "next/image";

const Hero = ({ imgUrl, heading, subheading }) => {
  return (
    <div className="w-full relative flex justify-end py-14 ">
      <Image
        src={imgUrl}
        alt="background"
        fill
        className=" object-cover z-0 "
      />
      {/* <div className="w-full h-full bg-[#00000080] absolute left-0 top-0 "></div> */}
      <div className="relative z-10  pt-8 h-full  flex-col overflow-hidden justify-between text-white flex gap-24 mt-52 section-width">
        <div className="w-full flex flex-col items-start justify-between bg-transparent gap-20">
          <div className="h-full flex flex-col gap-3 ">
            <p className="text-5xl font-extrabold leading-snug uppercase">
              {heading}
            </p>

            <p className="text-xl font-bold uppercase">{subheading || " "}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
