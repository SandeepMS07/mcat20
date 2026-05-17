import Image from "next/image";
import React from "react";

const AboutMCA = () => {
  return (
    <section className="section-width">
      <div className="w-full rounded-2xl border border-white/10 bg-[linear-gradient(180deg,#243fb0_0%,#1a2f92_55%,#162a85_100%)] shadow-[0_16px_30px_rgba(0,0,0,0.3)] flex flex-col lg:flex-row overflow-hidden">
        <div className="lg:w-2/5 w-full relative min-h-[260px] sm:min-h-[320px] lg:min-h-[560px]">
          <Image
            src="/images/aboutUs/aboutMCA/field.png"
            fill
            alt="MCA Cricket Ground"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1f6e]/55 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#0e1f6e]/45" />
        </div>
        <div className="lg:w-3/5 flex flex-col w-full p-4 sm:p-6 lg:p-10 gap-5 lg:gap-6">
          <div className="inline-flex w-fit rounded-full border border-[#f7b347]/35 bg-[#f7b347]/10 px-4 py-2">
            <h2 className="text-sm sm:text-base md:text-lg font-extrabold uppercase italic tracking-wide text-[#ffd76a]">
              About MCA
            </h2>
          </div>
          <p className="text-white/90 leading-relaxed sm:leading-8">
            Established in 1930, the Mumbai Cricket Association (MCA) is the
            governing body for cricket in Mumbai, Greater Mumbai and Thane
            districts. MCA is a permanent member of the Board of Control for
            Cricket in India (BCCI), and houses its headquarters within the
            Wankhede Stadium premises.
          </p>
          <p className="text-white/90 leading-relaxed sm:leading-8">
            MCA has developed a rich cricket heritage in Mumbai. Such has been
            their influence that Mumbai has given the country more than 60 Test
            cricketers so far. There was even a time when the Indian playing
            eleven consisted of six to seven cricketers from Mumbai – a
            testament to how good they have been at the highest level.
          </p>
          <p className="text-white/90 leading-relaxed sm:leading-8">
            MCA has taken on the onus of building new infrastructure for
            cricket. They have developed Recreation Centres at the Bandra Kurla
            Complex, and also in Kandivali where they house some of the best,
            cutting-edge sports facilities.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutMCA;
