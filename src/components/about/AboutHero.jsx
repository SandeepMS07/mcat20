import React from "react";
import Image from "next/image";
import "./AboutHero.css";
import Navbar from "../layout/navbar/navbar";

const AboutHero = () => {
  return (
    <div className="w-full bg-white">
      {/* Hero Banner */}
      <div className="aboutContainer w-full h-[566px] bg-no-repeat bg-center bg-cover relative">
        <div className="pt-8">
          <Navbar />
        </div>
        <h1 className="absolute top-[322px] left-[165px] font-extrabold text-[64px] leading-[85px] tracking-normal font-[Plus Jakarta Sans] w-[884px] h-[85px]">
          ABOUT US
        </h1>
      </div>

      {/* SECTION 1 */}
      <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10 px-6 lg:px-[150px] py-[60px] min-h-[600px] relative">
        {/* Text */}
        <div className="flex flex-col gap-5 w-full lg:w-1/2">
          <h2 className="text-black font-bold text-[44.22px] leading-[60px] uppercase font-[Plus Jakarta Sans]">
            WHAT IS T20 MUMBAI
          </h2>
          <p className="text-[#616161] font-semibold text-[20px] leading-[35px] font-[Plus Jakarta Sans]">
            Aimed at bringing the best local cricket talent of Mumbai under a
            common umbrella, T20 Mumbai is a league to identify, develop and
            promote cricketers at the grassroots level. T20 Mumbai will provide
            more structure to the cricket scene in the city and endeavour to
            build a platform for bringing the future superstars of the sport
            together.
          </p>
          <p className="text-[#616161] font-semibold text-[20px] leading-[35px] pt-4 font-[Plus Jakarta Sans]">
            Conceptualised by the Mumbai Cricket Association (MCA), T20 Mumbai
            will see them partner with Wizcraft International Entertainment Pvt.
            Ltd., India Infoline Ltd. (IIFL) and Probability Sports.
          </p>
        </div>

        {/* Image */}
        <div className="w-full lg:w-1/2">
          <Image
            src="/images/about/view-cricket-game-field.png"
            alt="Cricket Field"
            width={858}
            height={500}
            className="w-full h-auto object-cover "
          />
        </div>
      </div>

      {/* SECTION 2 - Black Background With Padding Frame */}
      <div className="bg-white px-6 lg:px-[150px] py-[60px]">
        <div className="bg-black flex flex-col-reverse lg:flex-row items-center justify-between gap-10 p-10 min-h-[600px] ">
          {/* Image */}
          <div className="w-full lg:w-1/2">
            <Image
              src="/images/about/mcc-image.png"
              alt="Cricket Field"
              width={758}
              height={400}
              className="w-full h-auto object-cover "
            />
          </div>
          {/* Text */}
          <div className="flex flex-col gap-5 w-full lg:w-1/2 text-white">
            <h2 className="font-bold text-[44.22px] leading-[60px] uppercase font-[Plus Jakarta Sans]">
              ABOUT PROBABILITY SPORTS
            </h2>
            <p className="text-[#D1D1D1] font-semibold text-[20px] leading-[35px] font-[Plus Jakarta Sans]">
              Established in 1930, the Mumbai Cricket Association (MCA) is the
              governing body for cricket in Mumbai, Greater Mumbai and Thane
              districts. MCA is a permanent member of the Board of Control for
              Cricket in India (BCCI), and houses its headquarters within the
              Wankhede Stadium premises.{" "}
            </p>
            <p className="text-[#D1D1D1] font-semibold text-[20px] leading-[35px] pt-4 font-[Plus Jakarta Sans]">
              MCA has developed a rich cricket heritage in Mumbai. Such has been
              their influence that Mumbai has given the country more than 60
              Test cricketers so far. There was even a time when the Indian
              playing eleven consisted of six to seven cricketers from Mumbai –
              a testament to how good they have been at the highest level.{" "}
            </p>
            <p className="text-[#D1D1D1] font-semibold text-[20px] leading-[35px] pt-4 font-[Plus Jakarta Sans]">
              MCA has taken on the onus of building new infrastructure for
              cricket. They have developed Recreation Centres at the Bandra
              Kurla Complex, and also in Kandivali where they house some of the
              best, cutting-edge sports facilities.{" "}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3 */}
      <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-20 px-6 lg:px-[150px] py-[60px] min-h-[600px]">
        {/* Text */}
        <div className="flex flex-col gap-5 w-full lg:w-1/2">
          <h2 className="text-black font-bold text-[44.22px] leading-[60px] uppercase font-[Plus Jakarta Sans]">
            ABOUT PROBABILITY SPORTS
          </h2>
          <p className="text-[#616161] font-semibold text-[20px] leading-[35px] font-[Plus Jakarta Sans]">
            Probability Sports is a Special Purpose Vehicle (SPV) between IIFL
            SEED VENTURES FUND 1 and Wizcraft, with Kadar Makani at the helm
            supported by a team of specialists.{" "}
          </p>
          <p className="text-[#616161] font-semibold text-[20px] leading-[35px] pt-4 font-[Plus Jakarta Sans]">
            Probability Sports will plan, market and execute T20 Mumbai League
            in its entirety, and ensure its grand success. With a vision to
            identify local talent in the cricket-rich city of Mumbai,
            Probability Sports will give aspiring cricketers in the city a
            platform to grow and better themselves as cricketers.{" "}
          </p>
        </div>

        {/* Image */}
        <div className="w-full lg:w-1/2">
          <Image
            src="/images/about/sports-image.png"
            alt="Cricket Field"
            width={620}
            height={209}
            className="w-[620px] h-[209px] object-cover "
          />
        </div>
      </div>
    </div>
  );
};

export default AboutHero;
