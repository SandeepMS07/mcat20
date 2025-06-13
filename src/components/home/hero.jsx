"use client";
import Image from "next/image";
import { useState, useMemo } from "react";
import CountdownTimer from "./CountdownTimer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { FaLocationDot } from "react-icons/fa6";
import routes from "@/utilis/route";
import fixtures3 from "@/utilis/fixtures/fixtures3";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();
  const [showVideo, setShowVideo] = useState(false);

  const openVideo = () => setShowVideo(true);
  const closeVideo = () => setShowVideo(false);

  // Get the next match using the date and time from json

  // const nextTicketInfo = useMemo(() => {
  //   const now = new Date();

  //   // Get all ticket dates sorted chronologically
  //   const sortedDates = Object.keys(ticketLinks).sort(
  //     (a, b) => new Date(a).getTime() - new Date(b).getTime()
  //   );

  //   // Find the first date after today
  //   for (const date of sortedDates) {
  //     const matchDate = new Date(date + "T00:00:00");
  //     if (matchDate > now) {
  //       return {
  //         date,
  //         wankhedeUrl: ticketLinks[date]["Wankhede Tickets"],
  //         dyPatilUrl: ticketLinks[date]["DY Patil Tickets"],
  //       };
  //     }
  //   }

  //   return null;
  // }, []);

  // if (!nextMatch) return <p>No upcoming matches</p>;

  const handleNavigateToFixture = () => {
    router.push(
      `${routes.matchcentre}?type=scorecard&mId=1666&cId=63&dId=1&sId=113`
    );
  };

  return (
    <div className="xl:h-[800px] lg:h-[700px] md:h-[600px] h-[500px]">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 5000 }}
        pagination={{ clickable: true }}
        speed={200}
        loop
        className="h-full"
      >
        <SwiperSlide className="h-full">
          <div className="w-full h-full bg-[url('https://mca-cdn.ken42.com/season3/latest_updates/slider7.jpg')] bg-cover bg-center  relative pt-20  overflow-hidden flex justify-center items-center ">
            <div className="section-width  py-2">
             <div className="flex flex-col items-center sm:items-start gap-3 lg:gap-6">
                <p className="font-bold text-sm uppercase md:text-base bg-[#182769] px-3 py-2 xl:text-xl">
                  T20 Mumbai Season 3
                </p>
                <h1 className="  font-extrabold max-w-3xl max-sm:text-center">
                 CHAMPIONS <br /> MSC Maratha Royals
                </h1>
                <p className="font-bold text-lg md:text-xl xl:text-2xl">
                  #AalaReAglaStar
                </p>
                <div className="flex flex-row gap-2">
                
                  <a
                    className="btn-primary flex gap-4 items-center cursor-pointer justify-center py-3 px-6 rounded-lg text-md"
                    onClick={() => {
                      router.push(
                        "/latest-updates"
                      );
                    }}
                  >
                    Read More{" "}
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

              {/* <div className="absolute bottom-40 -right-0 hidden md:block">
                <CountdownTimer />
              </div> */}
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className="h-full">
          <div className="w-full h-full bg-[url('/images/banner/slider3.jpg')] bg-cover bg-center  relative pt-32 overflow-hidden flex justify-center items-center">
            <div className="section-width ">
              <div className="flex flex-col items-center sm:items-start gap-3 lg:gap-6">
                <p className="font-bold text-sm md:text-base xl:text-xl">
                  T20 Mumbai Season 3
                </p>
                <h1 className="  font-extrabold max-w-3xl max-sm:text-center">
                  Mumbai’s Homegrown <br /> Talent Hits the Field
                </h1>
                <p className="font-bold text-lg md:text-xl xl:text-2xl">
                  #Kaun Banega Agla Star?{" "}
                </p>
                <div className="flex flex-row gap-2">
                  <a
                    href={routes.OverallTicket}
                    target="_blank"
                    className="btn-primary flex gap-4 items-center justify-center py-3 px-6 rounded-lg text-md"
                  >
                    Buy Tickets
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
                    className="btn-blue flex gap-4 items-center cursor-pointer justify-center py-3 px-6 rounded-lg text-md"
                    onClick={() => {
                      router.push(
                        "latest-updates/sairaj-steals-spotlight-after-sky-show-on-t20-mumbai-league-2025-opening-day"
                      );
                    }}
                  >
                    Read More{" "}
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

              {/* <div className="absolute bottom-40 -right-0 hidden md:block">
                <CountdownTimer />
              </div> */}
            </div>
          </div>
        </SwiperSlide>
        {/* <SwiperSlide>
          <div className="w-full h-full bg-[url('https://storage.googleapis.com/mca_images/website/banner_img/slider2.jpg')] bg-cover bg-center  relative md:pt-32 pt-14 overflow-hidden flex justify-center items-center">
            
            <div className="section-width  ">
              <div className="flex md:flex-row flex-col items-start gap-3 lg:gap-6 h-full w-full xl:pr-32 lg:pr-40">
                <div className=" flex-1 md:border-r-2 border-white md:py-8 flex">
                  <div className="ml-auto pr-10">
                  
                    <h1 className="oswald-font xl:max-w-sm md:max-w-xs max-w-60 xl:text-[100px] md:text-[80px] text-[50px] tracking-[0px] leading-[90%] font-bold md:mb-4 ">
                      TICKETS
                      <span className=" xl:text-[90px] md:text-[75px] text-[48px] tracking-[-4px] text-[#fdcf53]">
                        {" "}
                        NOW LIVE
                      </span>
                    </h1>
                    <div className="flex mt-4 sm:mt-0 flex-col gap-2 sm:flex-row items-start sm:items-center">
                      <a
                        href={routes.OverallTicket}
                        target="_blank"
                        className="btn-primary inline-flex gap-4 items-center justify-center py-3 px-6 rounded-lg text-md"
                      >
                        Buy Tickets
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
                        className="btn-blue inline-flex gap-4 cursor-pointer items-center justify-center py-3 px-6 rounded-lg text-md"
                        onClick={() => {
                          router.push(
                            "latest-updates/mca-reschedules-t20-mumbai-league-2025-wankhede-stadium-and-dy-patil-stadium-to-host-23-exciting-matches-from-june-4-to-12"
                          );
                        }}
                      >
                        Read More
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
                      className="md:h-20 h-14 w-auto"
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

              <div className="absolute bottom-40 right-0 hidden lg:block">
                <div
                  className="w-full rounded-l-xl md:rounded-l-xl border-y-2 border-l-2 border-[#E07E27] shadow-2xl overflow-hidden cursor-pointer"
                  onClick={handleNavigateToFixture}
                >
                  <div
                    className="w-full flex overflow-hidden items-center justify-evenly rounded-tl-lg gap-4"
                    style={{
                      background:
                        "linear-gradient(0deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.48) 1.45%, rgba(0, 0, 0, 0.70) 100%), rgba(255, 255, 255, 0.09)",
                    }}
                  >
                    <div className="flex flex-col justify-between py-6 px-12">
                      <p className="text-[#E07E27] text-base xl:text-lg font-semibold leading-3 uppercase">
                        Match starts in
                      </p>
                    </div>
                  </div>
                  <CountdownTimer
                    targetDate={nextMatch.targetDate}
                    homeTeam={nextMatch.home_team}
                    awayTeam={nextMatch.away_team}
                    match_no={nextMatch.match_no}
                    total_matches={nextMatch.total_matches}
                  />
                </div>
              </div>

              <div className="absolute bottom-40 -right-0 hidden md:block">
                <div
                  className="w-full rounded-l-xl md:rounded-l-xl border-y-2 border-l-2  border-[#E07E27] shadow-2xl overflow-hidden cursor-pointer"
                  onClick={handleNavigateToFixture}
                >
                  <div
                    className="  w-full flex overflow-hidden items-center justify-evenly rounded-tl-lg gap-4"
                    style={{
                      background:
                        "linear-gradient(0deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.48) 1.45%, rgba(0, 0, 0, 0.70) 100%), rgba(255, 255, 255, 0.09)",
                    }}
                  >
                    <div className="flex flex-col justify-between  py-6 px-12">
                      <p className="text-[#E07E27] text-base  xl:text-lg font-semibold leading-3 uppercase">
                        Match starts in
                      </p>
                    </div>
                  </div>
                  <CountdownTimer
                    targetDate={nextMatch.targetDate}
                    homeTeam={nextMatch.home_team}
                    awayTeam={nextMatch.away_team}
                    match_no={nextMatch.match_no}
                    total_matches={nextMatch.total_matches}
                  />
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide> */}
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
                <div className="flex gap-2">
                  <button
                    className="btn-primary flex gap-4 items-center"
                    // onClick={openVideo}
                    onClick={() => {
                      window.open(
                        "https://www.instagram.com/reel/DKovUKKhr7F/",
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
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
                  {/* <a
                    className="btn-blue inline-flex gap-4 cursor-pointer items-center justify-center py-3 px-6 rounded-lg text-md"
                    onClick={() => {
                      router.push(
                        "latest-updates/mca-adds-star-power-to-t20-mumbai-league-unveils-rohit-sharma-as-face-of-season-3"
                      );
                    }}
                  >
                    Read More
                    <span>
                      <Image
                        src="/images/home/hero/buttonIcon.svg"
                        alt="button-icon"
                        width={24}
                        height={24}
                        className="w-5 h-5"
                      />
                    </span>
                  </a> */}
                </div>
              </div>

              {/* <div className="absolute bottom-40 -right-0 hidden md:block">
                <CountdownTimer />
              </div> */}
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className="h-full">
          <div className="w-full h-full bg-[url('/images/banner/banner4.png')] bg-cover bg-center  relative pt-32 overflow-hidden flex justify-center items-center">
            <div className="section-width ">
              <div className="flex flex-col items-center sm:items-start gap-3 lg:gap-6">
                <p className="font-bold text-sm md:text-base xl:text-xl">
                  T20 MUMBAI SEASON 3
                </p>

                <h1 className="  font-extrabold max-w-3xl max-sm:text-center">
                  For Real Time Action and <br /> Behind the Scenes
                </h1>
                <p className="font-bold text-lg md:text-xl xl:text-2xl">
                  #Follow Us on Socials
                </p>
                <div className="flex gap-6">
                  <a target="_blank" href={routes.instagram}>
                    <Image
                      src="/images/footer/insta.svg"
                      alt="Google"
                      width={40}
                      height={40}
                    />
                  </a>

                  <a target="_blank" href={routes.twitter}>
                    <Image
                      src="/images/footer/twitter.svg"
                      alt="Google"
                      width={40}
                      height={40}
                    />
                  </a>

                  <a target="_blank" href={routes.youtube}>
                    <Image
                      src="/images/footer/youtube.svg"
                      alt="Google"
                      width={40}
                      height={40}
                    />
                  </a>
                  <a target="_blank" href={routes.facebook}>
                    <Image
                      src="/images/footer/facebook.svg"
                      alt="Google"
                      width={40}
                      height={40}
                    />
                  </a>
                </div>
              </div>

              {/* <div className="absolute bottom-40 -right-0 hidden md:block">
                <CountdownTimer />
              </div> */}
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
