"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import CountdownTimer from "./CountdownTimer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { FaLocationDot } from "react-icons/fa6";
import routes from "@/utilis/route";
import fixtures3 from "@/utilis/fixtures/fixtures3";
import { useRouter } from "next/navigation";

const REGISTRATION_PROMO_CUTOFF_TS = new Date(
  "2026-04-11T00:00:00+05:30"
).getTime();

const Hero = () => {
  const router = useRouter();
  const [showVideo, setShowVideo] = useState(false);
  const [showRegistrationPromo, setShowRegistrationPromo] = useState(
    () => Date.now() < REGISTRATION_PROMO_CUTOFF_TS
  );
  const registrationUrl = "/player-registration";
  const registrationsBlogPath =
    "/latest-updates/t20-mumbai-league-player-registrations-close-with-over-2400-entries";
  const registrationCloseDate = "10TH APRIL";
  const registrationTickerItems = [
    "PLAYER REGISTRATION OPEN NOW",
    "T20 MUMBAI SEASON 4 (MEN)",
    "INAUGURAL WOMEN'S SEASON",
    "PLAYER REGISTRATION LIVE NOW!",
  ];
  const registrationTickerText = registrationTickerItems.join(" • ");
  const tickerLoopCopies = 4;
  const heroTickerOffsetClass = "top-0";
  const heroSlidePaddingClass = "pt-[160px] sm:pt-[176px] lg:pt-[192px]";

  const openVideo = () => setShowVideo(true);
  const closeVideo = () => setShowVideo(false);
  const handleRegistrationRedirect = () => {
    router.push(registrationUrl);
  };
  const handleRegistrationsBlogRedirect = () => {
    router.push(registrationsBlogPath);
  };

  useEffect(() => {
    if (!showRegistrationPromo) return;

    const msUntilCutoff = REGISTRATION_PROMO_CUTOFF_TS - Date.now();
    if (msUntilCutoff <= 0) {
      setShowRegistrationPromo(false);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setShowRegistrationPromo(false);
    }, msUntilCutoff);

    return () => window.clearTimeout(timeoutId);
  }, [showRegistrationPromo]);

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
    <div className="relative xl:h-[800px] lg:h-[700px] md:h-[600px] h-[500px]">
      {showRegistrationPromo && (
        <div
          className={`hero-ticker absolute inset-x-0 ${heroTickerOffsetClass} z-20 overflow-hidden border-y border-[#f4a03b] bg-[#f4a03b] text-[#04184d]`}
        >
          <div
            className="hero-ticker-track flex w-max items-center"
            style={{ "--ticker-loop-copies": tickerLoopCopies }}
          >
            {Array.from({ length: tickerLoopCopies }).map(
              (_, duplicateIndex) => (
                <div
                  key={duplicateIndex}
                  className="flex shrink-0 items-center gap-4 px-1.5 py-1 md:gap-6 md:px-3"
                >
                  <span className="shrink-0 text-[8px] font-extrabold uppercase tracking-[0.05em] text-[#000] md:text-[10px] lg:text-[12px]">
                    {registrationTickerText}
                  </span>
                  <button
                    type="button"
                    onClick={handleRegistrationRedirect}
                    className="shrink-0 rounded-[8px] px-3 py-1 text-[8px] font-bold text-white md:px-5 md:text-[10px] lg:text-[12px]"
                    style={{
                      background:
                        "var(--Style, linear-gradient(90deg, #000 0%, #000 21.84%, #203376 101.04%))",
                    }}
                  >
                    Register Now
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      )}

      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 5000 }}
        pagination={{ clickable: true }}
        speed={200}
        loop
        className="h-full"
      >
        <SwiperSlide className="h-full" data-swiper-autoplay={7000}>
          <div
            className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-[url('/images/banner/banner-bg.png')] bg-cover bg-center ${heroSlidePaddingClass} pt-0 sm:pt-0 lg:pt-0`}
          >
            <div className="section-width relative z-10 flex h-full items-center">
              <div className="flex w-full flex-col items-center justify-between gap-8 lg:flex-row lg:gap-12">
                <div className="flex max-w-2xl flex-col items-center gap-4 text-center sm:items-start sm:text-left">
                  <p className="inline-flex rounded bg-[#1e2f7a]/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-white sm:text-xs lg:text-sm">
                    T20 Mumbai League 2026
                  </p>
                  <h1 className="text-[26px] font-extrabold uppercase leading-tight sm:text-[34px] lg:text-[44px]">
                    Registrations Open
                    <br />
                    For Support Staff
                  </h1>
                  <p className="text-[16px] font-bold uppercase text-[#f9ae2d] sm:text-lg lg:text-xl">
                    Open Till 16th April
                  </p>
                  <a
                    href="https://www.mumbaicricket.com/news/2026/19968"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center gap-3 px-5 py-3 text-sm font-bold uppercase"
                  >
                    Register Now
                    <Image
                      src="/images/home/hero/buttonIcon.svg"
                      alt="button-icon"
                      width={24}
                      height={24}
                      className="h-5 w-5"
                    />
                  </a>
                </div>
                <div className="flex w-full max-w-md flex-col gap-3 sm:max-w-lg">
                  {[
                    "Coach & Assistant Coach",
                    "Strength & Conditioning Coach",
                    "Physiotherapist",
                    "Masseur",
                    "Performance Analyst",
                  ].map((role) => (
                    <div
                      key={role}
                      className="w-full bg-[#f2b312] px-4 py-2 text-center text-sm font-extrabold uppercase tracking-wide text-[#0a1a66] sm:text-base lg:text-lg"
                    >
                      {role}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
        {showRegistrationPromo && (
          <SwiperSlide className="h-full" data-swiper-autoplay={7000}>
            <div
              className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-[url('/images/home/hero/Home.png')] bg-cover bg-center ${heroSlidePaddingClass}`}
            >
              <div className="section-width relative z-10 flex h-full items-center py-8">
                <div className="flex w-full justify-center pt-10 text-center sm:justify-start sm:pt-14 sm:text-left">
                  <div className="flex max-w-3xl flex-col items-center gap-4 sm:items-start lg:gap-6">
                    <p className="text-lg font-bold uppercase md:text-xl xl:text-2xl">
                      T20 Mumbai League 2026
                    </p>
                    <h1 className="max-w-3xl font-extrabold uppercase leading-tight">
                      Registrations Open <br />
                      For Men &amp; Women
                    </h1>
                    <div className="flex flex-col items-center gap-1 text-[#f9ae2d] sm:items-start">
                      <p className="text-lg font-bold uppercase md:text-xl xl:text-2xl">
                        Closes On
                      </p>
                      <h2 className="font-extrabold uppercase text-[#f9ae2d]">
                        {registrationCloseDate}
                      </h2>
                    </div>
                    <div className="flex flex-row justify-center gap-2 pt-2 sm:justify-start">
                      <button
                        type="button"
                        className="btn-primary flex gap-4 items-center cursor-pointer justify-center py-3 px-6 rounded-lg text-md uppercase"
                        onClick={handleRegistrationRedirect}
                      >
                        Register Now
                        <span>
                          <Image
                            src="/images/home/hero/buttonIcon.svg"
                            alt="button-icon"
                            width={24}
                            height={24}
                            className="h-5 w-5"
                          />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        )}
        <SwiperSlide className="h-full" data-swiper-autoplay={7000}>
          <div
            className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-[url('/images/home/hero/Home.png')] bg-cover bg-center ${heroSlidePaddingClass}`}
          >
          
            <div className="section-width relative z-10 flex h-full items-center py-6">
              <div className="w-full max-w-3xl text-center sm:text-left">
                <p className="text-sm font-bold uppercase tracking-wide sm:text-base lg:text-[24px]">
                  T20 Mumbai League 2026
                </p>
                <h1 className="mt-2 text-[46px] font-extrabold leading-none lg:text-[96px]">
                  2411
                </h1>
                <h2 className="text-[28px] font-extrabold uppercase leading-[1.05] lg:text-[48px]">
                  Players Registered
                </h2>

                <div className="mt-4 flex items-center justify-center gap-4 sm:mt-6 sm:justify-start sm:gap-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#F9AE2D] sm:text-sm lg:text-[20px]">
                      Men
                    </p>
                    <p className="text-[20px] font-extrabold leading-none text-[#F9AE2D] lg:text-[36px]">
                      2048
                    </p>
                  </div>
                  <div className="h-12 w-px bg-[#F9AE2D]/70 sm:h-16 lg:h-20"></div>
                  <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-[#F9AE2D] sm:text-sm lg:text-[20px]">
                      Women
                    </p>
                    <p className="text-[20px] font-extrabold leading-none text-[#F9AE2D] lg:text-[36px]">
                      363
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-primary mt-5 inline-flex items-center gap-3 px-6 py-3 text-sm font-bold uppercase sm:mt-8"
                  onClick={handleRegistrationsBlogRedirect}
                >
                  Read More
                  <Image
                    src="/images/home/hero/buttonIcon.svg"
                    alt="button-icon"
                    width={24}
                    height={24}
                    className="h-5 w-5"
                  />
                </button>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className="h-full">
          <div
            className={`w-full h-full bg-[url('/images/home/hero/new-hero2.jpg')] bg-cover bg-center relative ${heroSlidePaddingClass} overflow-hidden flex justify-center items-center`}
          >
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="section-width py-2 relative z-10">
              <div className="flex flex-col items-center sm:items-start gap-3 lg:gap-6">
                <p className="font-bold text-sm uppercase md:text-base bg-[#182769] px-3 py-2 xl:text-xl">
                  T20 Mumbai Season 4
                </p>
                <h1 className="font-extrabold max-w-3xl max-sm:text-center">
                  MCA announces Season 4 <br /> &amp; Inaugural Women&apos;s
                  League
                </h1>
                <p className="font-bold text-lg md:text-xl xl:text-2xl">
                  #ChanceSoduNako
                </p>
                <div className="flex flex-row gap-2">
                  <a
                    className="btn-primary flex gap-4 items-center cursor-pointer justify-center py-3 px-6 rounded-lg text-md"
                    onClick={() => {
                      router.push(
                        "/latest-updates/mca-announces-t20-mumbai-league-season-4-and-launches-inaugural-womens-league"
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
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className="h-full">
          <div
            className={`w-full h-full bg-[url('https://mca-cdn.ken42.com/season3/latest_updates/slider7.jpg')] bg-cover bg-center relative ${heroSlidePaddingClass} overflow-hidden flex justify-center items-center`}
          >
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
        {/* <SwiperSlide className="h-full">
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

              <div className="absolute bottom-40 -right-0 hidden md:block">
                <CountdownTimer />
              </div>
            </div>
          </div>
        </SwiperSlide> */}
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
        {/* <SwiperSlide className="h-full">
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
                  <a
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
                  </a>
                </div>
              </div>

              <div className="absolute bottom-40 -right-0 hidden md:block">
                <CountdownTimer />
              </div>
            </div>
          </div>
        </SwiperSlide> */}
        <SwiperSlide className="h-full">
          <div
            className={`w-full h-full bg-[url('/images/banner/banner4.png')] bg-cover bg-center relative ${heroSlidePaddingClass} overflow-hidden flex justify-center items-center`}
          >
            <div className="section-width ">
              <div className="flex flex-col items-center sm:items-start gap-3 lg:gap-6">
                <p className="font-bold text-sm md:text-base xl:text-xl">
                  T20 MUMBAI SEASON 4
                </p>

                <h1 className="  font-extrabold max-w-3xl max-sm:text-center">
                  For Real Time Action and <br /> Behind the Scenes
                </h1>
                <p className="font-bold text-lg md:text-xl xl:text-2xl">
                  Follow Us on Socials
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

      <style jsx>{`
        .hero-ticker-track {
          animation: heroTicker 28s linear infinite;
          will-change: transform;
        }

        .hero-ticker:hover .hero-ticker-track {
          animation-play-state: paused;
        }

        @keyframes heroTicker {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(
              calc(-100% / var(--ticker-loop-copies)),
              0,
              0
            );
          }
        }
      `}</style>
    </div>
  );
};

export default Hero;
