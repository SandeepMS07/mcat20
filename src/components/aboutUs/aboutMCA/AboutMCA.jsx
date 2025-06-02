import Image from "next/image";
import React from "react";

const AboutMCA = () => {
  return (
    <div className="section-width">
      <div className="w-full bg-[#0A1342] flex flex-col lg:flex-row margin-bottom min-h-[600px]">
        <div className="lg:w-2/5  bg-cover w-full relative min-h-[300px] lg:min-h-0">
          <Image
            src="/images/aboutUs/aboutMCA/field.png"
            fill
            alt="img"
            className="object-cover"
          />
        </div>
        <div className="lg:w-3/5 flex flex-col w-full p-8 gap-6">
          <div className="w-full relative h-[100px]">
            <Image
              src="/images/elements/small-title-bg.png"
              fill
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
                ABOUT MCA
              </h2>
            </div>
          </div>
          <p className="text-white lg:leading-8">
            Established in 1930, the Mumbai Cricket Association (MCA) is the
            governing body for cricket in Mumbai, Greater Mumbai and Thane
            districts. MCA is a permanent member of the Board of Control for
            Cricket in India (BCCI), and houses its headquarters within the
            Wankhede Stadium premises.
          </p>
          <p className="text-white lg:leading-8">
            MCA has developed a rich cricket heritage in Mumbai. Such has been
            their influence that Mumbai has given the country more than 60 Test
            cricketers so far. There was even a time when the Indian playing
            eleven consisted of six to seven cricketers from Mumbai – a
            testament to how good they have been at the highest level.
          </p>
          <p className="text-white lg:leading-8">
            MCA has taken on the onus of building new infrastructure for
            cricket. They have developed Recreation Centres at the Bandra Kurla
            Complex, and also in Kandivali where they house some of the best,
            cutting-edge sports facilities.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutMCA;