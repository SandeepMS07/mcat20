"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import routes from "@/utilis/route";
import { useRouter } from "next/navigation";
import { PLAYER_REGISTRATION_SHARE_KEY } from "@/constant";
import { getHeroBannerClient } from "@/app/api/clientApi";
import HeroSlideContent from "./HeroSlideContent";

const REGISTRATION_PROMO_CUTOFF_TS = new Date(
  "2026-04-11T00:00:00+05:30",
).getTime();
const CREATORS_LEAGUE_BANNER_IMAGE_URL =
  "https://mca-cdn.ken42.com/Banner%20Images/creator-league.png";

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
  const heroSlidePaddingClass = "pt-8 sm:pt-10 lg:pt-14";

  const handleRegistrationRedirect = () => {
    router.push(registrationUrl);
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
    let cancelled = false;
    (async () => {
      const res = await getHeroBannerClient();
      if (cancelled) return;
      const list = Array.isArray(res?.data) ? res.data : [];
      const filtered = list.filter(
        (b) => !/for real time action/i.test(b?.Title__c || ""),
      );
      const sorted = [...filtered].sort(
        (a, b) => (a.Rank__c ?? 9999) - (b.Rank__c ?? 9999),
      );
      setBanners(sorted);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="hero-shell relative bg-[#192A66] pt-[110px] sm:pt-[110px] lg:pt-[120px] 2xl:h-[820px] xl:h-[740px] lg:h-[680px] md:h-[600px] sm:h-[520px] h-[500px]">
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

      <div
        className="pointer-events-none absolute inset-x-0 top-[110px] sm:top-[110px] lg:top-[120px] z-20 h-16 sm:h-20 lg:h-24 bg-gradient-to-b from-[#192A66] from-0% to-transparent to-100%"
        aria-hidden="true"
      />

      <Swiper
        key={`hero-${banners.length}`}
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 5000 }}
        speed={200}
        loop={banners.length > 1}
        pagination={{ clickable: true }}
        navigation
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        className="hero-swiper h-full"
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
            className={`w-full h-full bg-[url('https://storage.googleapis.com/mca-bucket-gcp/Dev%2F1778848274445-1d46orej99h-Home-(1).png')] bg-cover bg-center relative ${heroSlidePaddingClass} overflow-hidden flex justify-center items-center`}
          >
            <div className="absolute bottom-0 left-0 h-96 w-full bg-gradient-to-t from-[#192A66] from-30% to-transparent to-100%"></div>
            <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-[#192A66] from-0% via-[#192A66]/60 via-40% to-transparent to-100%"></div>
            <HeroSlideContent
              title="30 Matches Set to Light Up Wankhede Stadium from June 1-13"
              subtitle="#ChanceSoduNako"
              action={
                <div className="flex flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => router.push(routes.fixtures)}
                    className="btn-primary flex gap-4 items-center cursor-pointer justify-center py-3 px-6 rounded-lg text-md"
                  >
                    View Fixtures
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
              }
            />
          </div>
        </SwiperSlide>
        <SwiperSlide className="h-full" data-swiper-autoplay={7000}>
          <div
            className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-cover bg-center ${heroSlidePaddingClass}`}
            style={{
              backgroundImage: `url('${CREATORS_LEAGUE_BANNER_IMAGE_URL}')`,
            }}
          >
            <div className="absolute bottom-0 left-0 h-96 w-full bg-gradient-to-t from-[#192A66] from-30% to-transparent to-100%"></div>
            <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-[#192A66] from-0% via-[#192A66]/60 via-40% to-transparent to-100%"></div>
            <HeroSlideContent
              title={
                <>
                  T20 Mumbai
                  <br />
                  <span className="text-[#E07E27]">Creators League</span>
                </>
              }
              subtitle="The Games are about to begin!"
              action={
                <div className="flex flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => router.push(routes.creatorsLeague)}
                    className="btn-primary flex gap-4 items-center cursor-pointer justify-center py-3 px-6 rounded-lg text-md uppercase"
                  >
                    Participate Now
                    <span
                      aria-hidden
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#E07E27]"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-3 w-3"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </button>
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
      </Swiper>

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
      <style jsx global>{`
        .hero-shell .hero-swiper .swiper-pagination {
          bottom: 18px;
          z-index: 30;
        }
        .hero-shell .hero-swiper .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: rgba(255, 255, 255, 0.55);
          opacity: 1;
          transition: width 0.25s ease, background 0.25s ease;
          border-radius: 999px;
        }
        .hero-shell .hero-swiper .swiper-pagination-bullet-active {
          width: 26px;
          background: #f4a03b;
        }
        .hero-shell .hero-swiper .swiper-button-next,
        .hero-shell .hero-swiper .swiper-button-prev {
          width: 44px;
          height: 44px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
          color: #ffffff;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .hero-shell .hero-swiper .swiper-button-next:hover,
        .hero-shell .hero-swiper .swiper-button-prev:hover {
          background: rgba(244, 160, 59, 0.85);
          transform: scale(1.05);
        }
        .hero-shell .hero-swiper .swiper-button-next::after,
        .hero-shell .hero-swiper .swiper-button-prev::after {
          font-size: 16px;
          font-weight: 800;
        }
        @media (max-width: 640px) {
          .hero-shell .hero-swiper .swiper-button-next,
          .hero-shell .hero-swiper .swiper-button-prev {
            display: none;
          }
        }
      `}</style>

    </div>
  );
};

export default Hero;
