"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import CountdownTimer from "./CountdownTimer";
import HeroPoll from "./HeroPoll";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import routes from "@/utilis/route";
import fixtures3 from "@/utilis/fixtures/fixtures3";
import { useRouter } from "next/navigation";
import { PLAYER_REGISTRATION_SHARE_KEY } from "@/constant";
import { getHeroBannerClient } from "@/app/api/clientApi";
import HeroSlideContent from "./HeroSlideContent";

const REGISTRATION_PROMO_CUTOFF_TS = new Date(
  "2026-04-11T00:00:00+05:30",
).getTime();
const ROHIT_HOVER_PLAY_DELAY_MS = 500;
const SQUADS_BANNER_IMAGE_URL =
  "https://storage.googleapis.com/mca-bucket-gcp/Dev%2F1778740165645-a3wx2p3720c-Home.png";
const TEAM_TYPE_PARAM_KEY = "type";
const TEAM_TYPE_MEN = "men";
const TEAM_TYPE_WOMEN = "women";

const BANNER_DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const formatBannerDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  // "06 Apr 2026" -> "06 APR, 2026"
  const parts = BANNER_DATE_FORMATTER.format(d).toUpperCase().split(" ");
  return `${parts[0]} ${parts[1]}, ${parts[2]}`;
};

const stripHtml = (html) => {
  if (!html) return "";
  return html
    .replace(/<br\s*\/?>(?!$)/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/﻿/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const titleToLines = (title) => {
  if (!title) return [];
  return title
    .replace(/<br\s*\/?>/gi, "\n")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
};

const Hero = () => {
  const router = useRouter();
  const [showVideo, setShowVideo] = useState(false);
  const [isRohitHoverVideoActive, setIsRohitHoverVideoActive] = useState(false);
  const rohitHoverVideoRef = useRef(null);
  const rohitHoverDelayTimeoutRef = useRef(null);
  const swiperRef = useRef(null);
  const [showRegistrationPromo, setShowRegistrationPromo] = useState(
    () => Date.now() < REGISTRATION_PROMO_CUTOFF_TS,
  );
  const [banners, setBanners] = useState([]);
  const registrationUrl = `/player-registration/${PLAYER_REGISTRATION_SHARE_KEY}`;
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

  const clearRohitHoverDelay = () => {
    if (!rohitHoverDelayTimeoutRef.current) return;
    window.clearTimeout(rohitHoverDelayTimeoutRef.current);
    rohitHoverDelayTimeoutRef.current = null;
  };

  const startRohitHoverPlayback = () => {
    const swiper = swiperRef.current;
    if (swiper?.autoplay?.running) swiper.autoplay.stop();

    setIsRohitHoverVideoActive(true);

    const videoEl = rohitHoverVideoRef.current;
    if (!videoEl) return;

    try {
      videoEl.currentTime = 0;
      const playPromise = videoEl.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
    } catch (_) {}
  };

  const handleRohitHeroMouseEnter = () => {
    clearRohitHoverDelay();
    setIsRohitHoverVideoActive(false);

    rohitHoverDelayTimeoutRef.current = window.setTimeout(() => {
      rohitHoverDelayTimeoutRef.current = null;
      startRohitHoverPlayback();
    }, ROHIT_HOVER_PLAY_DELAY_MS);
  };

  const handleRohitHeroMouseLeave = () => {
    clearRohitHoverDelay();
    setIsRohitHoverVideoActive(false);

    const videoEl = rohitHoverVideoRef.current;
    if (!videoEl) return;

    try {
      videoEl.pause();
      videoEl.currentTime = 0;
    } catch (_) {}

    const swiper = swiperRef.current;
    if (swiper?.autoplay && !swiper.autoplay.running) swiper.autoplay.start();
  };
  const handleRegistrationRedirect = () => {
    router.push(registrationUrl);
  };
  const handleAppDownloadRedirect = () => {
    const userAgent = navigator.userAgent || navigator.vendor;
    const isAndroid = /android/i.test(userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);

    if (isIOS) {
      window.location.href = "https://t20mumbai.com/link";
      return;
    }

    if (isAndroid) {
      const fallbackUrl = "https://t20mumbai.com/link";
      window.location.href = `intent://links#Intent;scheme=t20mumbai;package=com.mca.t20mumbai;S.browser_fallback_url=${encodeURIComponent(
        fallbackUrl,
      )};end`;
      return;
    }

    window.open(
      "https://play.google.com/store/apps/details?id=com.mca.t20mumbai",
      "_blank",
    );
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

  useEffect(() => {
    const videoEl = rohitHoverVideoRef.current;
    if (!videoEl) return;

    // Warm the cache on page load so hover playback starts instantly.
    try {
      videoEl.load();
    } catch (_) {}
  }, []);

  useEffect(() => {
    return () => {
      clearRohitHoverDelay();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await getHeroBannerClient();
      if (cancelled) return;
      const list = Array.isArray(res?.data) ? res.data : [];
      const sorted = [...list].sort(
        (a, b) => (a.Rank__c ?? 9999) - (b.Rank__c ?? 9999),
      );
      setBanners(sorted);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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
      `${routes.matchcentre}?type=scorecard&mId=1666&cId=63&dId=1&sId=113`,
    );
  };
  const handleSquadsRedirect = (teamType) => {
    router.push(
      `${routes.teams}?${TEAM_TYPE_PARAM_KEY}=${encodeURIComponent(teamType)}`,
    );
  };

  return (
    <div className="relative 2xl:h-[720px] xl:h-[640px] lg:h-[560px] md:h-[500px] sm:h-[440px] h-[400px]">
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
              ),
            )}
          </div>
        </div>
      )}

      <Swiper
        key={`hero-${banners.length}`}
        modules={[Autoplay]}
        autoplay={{ delay: 5000 }}
        speed={200}
        loop={banners.length > 1}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        className="h-full"
      >
        {banners.map((banner) => {
          const titleLines = titleToLines(banner.Title__c);
          const subtitle = stripHtml(banner.Description__c);
          const dateLabel = formatBannerDate(banner.CreatedDate);
          const actionLink = banner.Action_Link__c;
          const isExternalAction =
            !!actionLink && /^https?:\/\//i.test(actionLink);
          const handleAction = () => {
            if (!actionLink) return;
            if (isExternalAction) {
              window.open(actionLink, "_blank", "noopener,noreferrer");
            } else {
              router.push(actionLink);
            }
          };
          return (
            <SwiperSlide key={banner.Id} className="h-full">
              <div
                className={`w-full h-full bg-cover bg-center relative ${heroSlidePaddingClass} overflow-hidden flex justify-center items-center`}
                style={{
                  backgroundImage: `url('${banner.Image_URL__c}')`,
                }}
              >
                <div className="absolute bottom-0 left-0 h-96 w-full bg-gradient-to-t from-[#192A66] from-30% to-transparent to-100%"></div>
                <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-[#192A66] from-0% via-[#192A66]/60 via-40% to-transparent to-100%"></div>
                <HeroSlideContent
                  eyebrow={dateLabel}
                  title={
                    titleLines.length > 0
                      ? titleLines.map((line, i) => (
                          <span key={i} className="block">
                            {line}
                          </span>
                        ))
                      : null
                  }
                  subtitle={subtitle}
                  action={
                    actionLink && (
                      <div className="flex flex-row gap-2">
                        <button
                          type="button"
                          onClick={handleAction}
                          className="btn-primary flex gap-4 items-center cursor-pointer justify-center py-3 px-6 rounded-lg text-md"
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
                        </button>
                      </div>
                    )
                  }
                />
              </div>
            </SwiperSlide>
          );
        })}
        <SwiperSlide className="h-full">
          <div
            className={`group w-full h-full bg-[url('/images/home/hero/rohit.jpeg')] bg-cover bg-right md:bg-top relative ${heroSlidePaddingClass} overflow-hidden flex justify-center items-center cursor-pointer`}
            onMouseEnter={handleRohitHeroMouseEnter}
            onMouseLeave={handleRohitHeroMouseLeave}
            onTouchStart={handleRohitHeroMouseEnter}
            onTouchEnd={handleRohitHeroMouseLeave}
            onClick={handleAppDownloadRedirect}
          >
            <video
              ref={rohitHoverVideoRef}
              className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-300 ease-out ${
                isRohitHoverVideoActive ? "opacity-100" : "opacity-0"
              }`}
              src="https://storage.googleapis.com/mca-bucket-gcp/Dev%2F1777530746564-274btnl4nw8-bg-cover-(1).mp4"
              muted
              playsInline
              loop
              preload="auto"
            />
            <div className="absolute bottom-0 left-0 h-96 w-full bg-gradient-to-t from-[#192A66] from-30% to-transparent to-100%"></div>
            <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-[#192A66] from-0% via-[#192A66]/60 via-40% to-transparent to-100%"></div>
            <HeroSlideContent
              eyebrow="T20 Mumbai Season 4"
              title={
                <>
                  An Exclusive Conversation <br /> with Rohit Sharma
                </>
              }
              subtitle={
                <>
                  Only on the{" "}
                  <span className="bg-gradient-to-r from-[#F29C1D] via-[#EFBC19] to-[#EDCA17] bg-clip-text text-transparent">
                    T20 Mumbai App
                  </span>
                </>
              }
              action={
                <div className="flex flex-row gap-2">
                  <a
                    className="btn-primary flex gap-4 items-center cursor-pointer justify-center py-3 px-6 rounded-lg text-md"
                    onClick={() => {
                      handleAppDownloadRedirect();
                    }}
                  >
                    Watch now
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
              }
            />
          </div>
        </SwiperSlide>
        <SwiperSlide className="h-full">
          <div
            className={`w-full h-full bg-[url('/images/home/hero/power2.jpeg')] bg-cover bg-center relative ${heroSlidePaddingClass} overflow-hidden flex justify-center items-center`}
          >
            <div className="absolute bottom-0 left-0 h-96 w-full bg-gradient-to-t from-[#192A66] from-30% to-transparent to-100%"></div>
            <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-[#192A66] from-0% via-[#192A66]/60 via-40% to-transparent to-100%"></div>
            <HeroSlideContent
              eyebrow="T20 Mumbai Season 4"
              title={
                <>
                  A Power-Packed Lineup <br /> Sets the Stage for Season 4
                  League
                </>
              }
              subtitle="#ChanceSoduNako"
              action={
                <div className="flex flex-row gap-2">
                  <a
                    className="btn-primary flex gap-4 items-center cursor-pointer justify-center py-3 px-6 rounded-lg text-md"
                    onClick={() => {
                      router.push(
                        "/latest-updates/suryakumar-yadav-shreyas-iyer-shivam-dube-headline-star-studded-line-up-as-mca-announces-retained-players-for-t20-mumbai-league-2026",
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
              }
            />
          </div>
        </SwiperSlide>
        {showRegistrationPromo && (
          <SwiperSlide className="h-full" data-swiper-autoplay={7000}>
            <div
              className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-[url('/images/home/hero/Home.png')] bg-cover bg-center ${heroSlidePaddingClass}`}
            >
              <div className="absolute bottom-0 left-0 h-96 w-full bg-gradient-to-t from-[#192A66] from-30% to-transparent to-100%"></div>
              <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-[#192A66] from-0% via-[#192A66]/60 via-40% to-transparent to-100%"></div>
              <HeroSlideContent
                eyebrow="T20 Mumbai League 2026"
                title={
                  <>
                    Registrations Open <br />
                    For Men &amp; Women
                  </>
                }
                titleClassName="uppercase leading-tight"
                action={
                  <div className="flex flex-row gap-2">
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
                }
              >
                <div className="flex flex-col items-center gap-1 text-[#f9ae2d] sm:items-start">
                  <p className="text-lg font-bold uppercase md:text-xl xl:text-2xl">
                    Closes On
                  </p>
                  <h2 className="font-extrabold uppercase text-[#f9ae2d]">
                    {registrationCloseDate}
                  </h2>
                </div>
              </HeroSlideContent>
            </div>
          </SwiperSlide>
        )}
        <SwiperSlide className="h-full" data-swiper-autoplay={7000}>
          <div
            className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-cover bg-center ${heroSlidePaddingClass}`}
            style={{
              backgroundImage: `url('${SQUADS_BANNER_IMAGE_URL}')`,
            }}
          >
            <div className="absolute bottom-0 left-0 h-96 w-full bg-gradient-to-t from-[#192A66] from-30% to-transparent to-100%"></div>
            <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-[#192A66] from-0% via-[#192A66]/60 via-40% to-transparent to-100%"></div>
            <HeroSlideContent
              eyebrow="T20 Mumbai Season 4"
              title="Squads for the T20 Mumbai League are set"
              subtitle="#ChanceSoduNako"
              action={
                <div className="flex flex-row flex-wrap items-center gap-2 sm:gap-3 sm:items-start">
                  <button
                    type="button"
                    className="btn-primary inline-flex items-center justify-center text-xs sm:text-sm font-bold uppercase"
                    onClick={() => handleSquadsRedirect(TEAM_TYPE_MEN)}
                    aria-label="View men's squads"
                  >
                    Men&apos;s Squads
                  </button>
                  <button
                    type="button"
                    className="btn-primary inline-flex items-center justify-center text-xs sm:text-sm font-bold uppercase"
                    onClick={() => handleSquadsRedirect(TEAM_TYPE_WOMEN)}
                    aria-label="View women's squads"
                  >
                    Women&apos;s Squads
                  </button>
                </div>
              }
            />
          </div>
        </SwiperSlide>
        <SwiperSlide className="h-full">
          <div
            className={`w-full h-full bg-[url('/images/home/hero/new-hero2.jpg')] bg-cover bg-center relative ${heroSlidePaddingClass} overflow-hidden flex justify-center items-center`}
          >
            <div className="absolute bottom-0 left-0 h-96 w-full bg-gradient-to-t from-[#192A66] from-30% to-transparent to-100%"></div>
            <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-[#192A66] from-0% via-[#192A66]/60 via-40% to-transparent to-100%"></div>
            <HeroSlideContent
              eyebrow="T20 Mumbai Season 4"
              title={
                <>
                  MCA announces Season 4 <br /> &amp; Inaugural Women&apos;s
                  League
                </>
              }
              subtitle="#ChanceSoduNako"
              action={
                <div className="flex flex-row gap-2">
                  <a
                    className="btn-primary flex gap-4 items-center cursor-pointer justify-center py-3 px-6 rounded-lg text-md"
                    onClick={() => {
                      router.push(
                        "/latest-updates/mca-announces-t20-mumbai-league-season-4-and-launches-inaugural-womens-league",
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
              }
            />
          </div>
        </SwiperSlide>
        <SwiperSlide className="h-full">
          <div
            className={`w-full h-full bg-[url('/images/banner/banner4.png')] bg-cover bg-center relative ${heroSlidePaddingClass} overflow-hidden flex justify-center items-center`}
          >
            <div className="absolute bottom-0 left-0 h-96 w-full bg-gradient-to-t from-[#192A66] from-30% to-transparent to-100%"></div>
            <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-[#192A66] from-0% via-[#192A66]/60 via-40% to-transparent to-100%"></div>
            <HeroSlideContent
              eyebrow="T20 Mumbai Season 4"
              title={
                <>
                  For Real Time Action and <br /> Behind the Scenes
                </>
              }
              subtitle="Follow Us on Socials"
              action={
                <div className="flex gap-6">
                  <a target="_blank" href={routes.instagram}>
                    <Image
                      src="/images/footer/insta.svg"
                      alt="Instagram"
                      width={40}
                      height={40}
                    />
                  </a>
                  <a target="_blank" href={routes.twitter}>
                    <Image
                      src="/images/footer/twitter.svg"
                      alt="Twitter"
                      width={40}
                      height={40}
                    />
                  </a>
                  <a target="_blank" href={routes.youtube}>
                    <Image
                      src="/images/footer/youtube.svg"
                      alt="YouTube"
                      width={40}
                      height={40}
                    />
                  </a>
                  <a target="_blank" href={routes.facebook}>
                    <Image
                      src="/images/footer/facebook.svg"
                      alt="Facebook"
                      width={40}
                      height={40}
                    />
                  </a>
                </div>
              }
            />
          </div>
        </SwiperSlide>
      </Swiper>

      {/* <div className="pointer-events-none absolute inset-x-0 bottom-6 z-30 flex justify-center px-3 sm:bottom-8 sm:right-6 sm:left-auto sm:justify-end sm:px-0 lg:bottom-12 lg:right-12">
        <HeroPoll />
      </div> */}

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
