"use client";
import Image from "next/image";
import { useState } from "react";
import CountdownTimer from "./CountdownTimer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { FaLocationDot } from "react-icons/fa6";
import routes from "@/utilis/route";

const Hero = () => {
  const [showVideo, setShowVideo] = useState(false);

  const openVideo = () => setShowVideo(true);
  const closeVideo = () => setShowVideo(false);

  return (
    <div className="xl:h-[800px] lg:h-[700px] md:h-[600px] h-[500px]">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3000 }}
        pagination={{ clickable: true }}
        speed={800}
        loop
        className="h-full"
      >
        <SwiperSlide>
          <div className="w-full h-full bg-[url('https://storage.googleapis.com/mca_images/website/banner_img/slider2.jpg')] bg-cover bg-center  relative md:pt-32 pt-14 overflow-hidden flex justify-center items-center">
            {/* <div className="h-80 w-80 absolute left-0 bottom-0 bg-red-400"></div> */}
            <div className="section-width  ">
              <div className="flex md:flex-row flex-col items-start gap-3 lg:gap-6 h-full w-full xl:pr-32 lg:pr-40">
                <div className=" flex-1 md:border-r-2 border-white md:py-8 flex">
                  <div className="ml-auto pr-10">
                    {/* <img
                      src="/images/home/hero/ticketlivetext.png"
                      className="md:w-5/6 lg:w-full h-auto "
                      alt="text"
                    /> */}
                    <h1 className="oswald-font xl:max-w-sm md:max-w-xs max-w-60 xl:text-[100px] md:text-[80px] text-[50px] tracking-[0px] leading-[90%] font-bold md:mb-4 ">
                      TICKETS
                      <span className=" xl:text-[90px] md:text-[75px] text-[48px] tracking-[-4px] text-[#fdcf53]">
                        {" "}
                        NOW LIVE
                      </span>
                    </h1>
                    <div className="flex md:flex-row flex-col gap-4">
                      <a
                        href={routes.wankhedeTicket}
                        target="_blank"
                        className="btn-primary  flex-1 gap-4 items-center text-xs md:flex hidden justify-center text-left"
                      >
                        Wankhede Tickets <br /> Click Here
                        <span>
                          <Image
                            src="/images/home/hero/buttonIcon.svg"
                            alt="button-icon"
                            width={24}
                            height={24}
                            className="w-5 h-5"
                          />
                        </span>
                      </a>
                      <a
                        href={routes.DYPatilTicket}
                        target="_blank"
                        className="btn-blue rounded-lg flex-1  gap-4 items-center text-xs md:flex hidden justify-center text-left"
                        // onClick={openVideo}
                      >
                        DY Patil Tickets <br /> Click Here
                        <span>
                          <Image
                            src="/images/home/hero/buttonIcon.svg"
                            alt="button-icon"
                            width={24}
                            height={24}
                            className="w-5 h-5"
                          />
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
                <div className=" flex-1 my-auto oswald-font">
                  <h3 className="  font-extrabold max-w-3xl  uppercase">
                    From june 4th to June 12TH
                  </h3>
                  <div className="flex items-center gap-2 md:mt-3 mt-1">
                    <FaLocationDot />
                    <a href={routes.wankhedeTicket} target="_blank">
                      <h3 className="  font-extrabold max-w-3xl  uppercase">
                        wankhede stadium, MUMBAI
                      </h3>
                    </a>
                  </div>
                  <div className="flex items-center gap-2 md:mt-3 mt-1">
                    <FaLocationDot />
                    <a href={routes.DYPatilTicket} target="_blank">
                      <h3 className="  font-extrabold max-w-3xl ">
                        DY PATIL STADIUM, NAVI MUMBAI
                      </h3>
                    </a>
                  </div>
                  <div className="flex items-center gap-4 md:mt-5 mt-3">
                    <h3 className="  font-extrabold max-w-3xl ">
                      OFFICIALLY AT
                    </h3>
                    <img
                      src="/images/home/hero/districtLogo.png"
                      className="md:h-20 h-14 w-atuo"
                      alt=""
                    />
                  </div>
                </div>
                <div className="flex md:flex-row flex-col gap-4 md:hidden ">
                  <a
                    href={routes.wankhedeTicket}
                    target="_blank"
                    className="btn-primary  flex-1 gap-4 items-center text-xs flex justify-center text-left"
                    // onClick={openVideo}
                  >
                    Wankhede Tickets Click Here
                    <span>
                      <Image
                        src="/images/home/hero/buttonIcon.svg"
                        alt="button-icon"
                        width={24}
                        height={24}
                        className="w-5 h-5"
                      />
                    </span>
                  </a>
                  <a
                    href={routes.DYPatilTicket}
                    target="_blank"
                    className="btn-blue rounded-lg flex-1  gap-4 items-center text-xs   justify-center text-left"
                    // onClick={openVideo}
                  >
                    DY Patil Tickets Click Here
                    <span>
                      <Image
                        src="/images/home/hero/buttonIcon.svg"
                        alt="button-icon"
                        width={24}
                        height={24}
                        className="w-5 h-5"
                      />
                    </span>
                  </a>
                </div>
              </div>

              <div className="absolute bottom-40 -right-0 hidden lg:block">
                <div className="w-[250px] rounded-l-xl md:rounded-l-xl border-y-2 border-l-2  border-[#E07E27] shadow-2xl overflow-hidden ">
                  <div
                    className="  w-full flex overflow-hidden items-center justify-evenly rounded-tl-lg gap-4"
                    style={{
                      background:
                        "linear-gradient(0deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.48) 1.45%, rgba(0, 0, 0, 0.70) 100%), rgba(255, 255, 255, 0.09)",
                    }}
                  >
                    <div className="flex flex-col justify-between  py-6 px-8">
                      <p className="text-[#E07E27] text-base  xl:text-lg font-semibold leading-3 uppercase">
                        Season starts in
                      </p>
                    </div>
                  </div>

                  <CountdownTimer targetDate="2025-06-04T00:00:00+05:30" />
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className="h-full">
          <div className="w-full h-full bg-[url('https://storage.googleapis.com/mca_images/website/banner_img/heroImgRohitPattern.png')] bg-cover bg-center  relative pt-32 overflow-hidden flex justify-center items-center">
            <div className="section-width ">
              <div className="flex flex-col items-center sm:items-start gap-3 lg:gap-6">
                <p className="font-bold text-sm md:text-base xl:text-xl">
                  T20 Mumbai Season 3
                </p>

                <h1 className="  font-extrabold max-w-3xl max-sm:text-center">
                  Not just back. <br /> Back to build the next icon
                </h1>
                <p className="font-bold text-lg md:text-xl xl:text-2xl">
                  #AalaReAglaStar
                </p>
                <button
                  className="btn-primary flex gap-4 items-center"
                  onClick={openVideo}
                >
                  View Details
                  <span>
                    <Image
                      src="/images/home/hero/buttonIcon.svg"
                      alt="button-icon"
                      width={24}
                      height={24}
                      className="w-5 h-5"
                    />
                  </span>
                </button>
              </div>

              <div className="absolute bottom-40 -right-0 hidden md:block">
                <div className="w-full rounded-l-xl md:rounded-l-xl border-y-2 border-l-2  border-[#E07E27] shadow-2xl overflow-hidden">
                  <div
                    className="  w-full flex overflow-hidden items-center justify-evenly rounded-tl-lg gap-4"
                    style={{
                      background:
                        "linear-gradient(0deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.48) 1.45%, rgba(0, 0, 0, 0.70) 100%), rgba(255, 255, 255, 0.09)",
                    }}
                  >
                    <div className="flex flex-col justify-between  py-6 px-12">
                      <p className="text-[#E07E27] text-base  xl:text-lg font-semibold leading-3 uppercase">
                        Season starts in
                      </p>
                    </div>
                  </div>
                  <CountdownTimer targetDate="2025-06-04T00:00:00+05:30" />
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      {showVideo && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-80">
          <div className="relative w-[90%] md:w-[70%] lg:w-[60%] aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/DFswpwcH68E?autoplay=1&rel=0"
              title="YouTube video"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
            <button
              onClick={closeVideo}
              className="absolute top-3 right-3 text-white bg-[#E07E27] rounded-full p-2 w-10 h-10 hover:bg-[#c86a1e]"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
// https://youtu.be/DFswpwcH68E?si=oS6Fp-hBzKS0ds4g
