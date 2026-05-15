"use client";

const Hero = ({ imgUrl, heading, subheading }) => {
  return (
    <div
      className={`w-full relative flex justify-end py-14 bg-gray-500 h-[500px]`}
    >
      <img
        src={imgUrl}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover z-0 bg-center"
      />
      <div className="relative z-10  pt-8 h-full  flex-col overflow-hidden justify-between text-white flex gap-24 section-width">
        <div className="w-full flex flex-col items-start justify-end bg-transparent gap-20 h-full">
          <div className="h-full flex flex-col gap-3 justify-end">
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
