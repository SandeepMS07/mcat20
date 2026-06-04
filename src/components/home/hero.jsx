"use client";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useRouter } from "next/navigation";
import { getBannersClient } from "@/app/api/clientApi";
import HeroSlideContent from "./HeroSlideContent";

const Hero = () => {
  const router = useRouter();
  const swiperRef = useRef(null);
  const [banners, setBanners] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const heroSlidePaddingClass = "pt-8 sm:pt-10 lg:pt-14";

  const isSvgBanner = (url = "") => /\.svg(?:$|\?)/i.test(url);
  const isRasterBanner = (url = "") => /\.(jpe?g|png)(?:$|\?)/i.test(url);
  const getBannerImageUrl = (banner) => {
    if (!banner) return "";
    const mobileUrl = banner.mobile_banner_url || "";
    const useMobileBanner = isMobile && isRasterBanner(mobileUrl);
    return useMobileBanner ? mobileUrl : banner.web_banner_url || mobileUrl || "";
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    const updateIsMobile = () => setIsMobile(mediaQuery.matches);

    updateIsMobile();
    mediaQuery.addEventListener("change", updateIsMobile);

    return () => {
      mediaQuery.removeEventListener("change", updateIsMobile);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await getBannersClient();
      if (cancelled) return;
      const list = Array.isArray(res?.banners) ? res.banners : Array.isArray(res) ? res : [];
      const sorted = [...list].sort(
        (a, b) => (a.display_order ?? 9999) - (b.display_order ?? 9999),
      );
      setBanners(sorted);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="hero-shell relative bg-[#192A66] pt-[110px] sm:pt-[110px] lg:pt-[120px] 2xl:h-[820px] xl:h-[740px] lg:h-[680px] md:h-[600px] sm:h-[520px] h-[500px]">
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
        {banners.map((banner, idx) => {
          const titleLines = banner.title ? banner.title.split("\n") : [];
          const bannerImageUrl = getBannerImageUrl(banner);
          const bannerIsSvg = isSvgBanner(bannerImageUrl);
          const isExternal = !!banner.web_link && /^https?:\/\//i.test(banner.web_link);
          const handleAction = () => {
            if (!banner.web_link) return;
            if (isExternal) {
              window.open(banner.web_link, "_blank", "noopener,noreferrer");
            } else {
              router.push(banner.web_link);
            }
          };
          return (
            <SwiperSlide key={banner.id} className="h-full">
              <div
                className={`hero-banner w-full h-full relative ${heroSlidePaddingClass} overflow-hidden flex justify-center items-center ${
                  bannerIsSvg ? "hero-banner-svg" : "hero-banner-raster"
                }`}
              >
                <img
                  src={bannerImageUrl}
                  alt={banner.title || "Hero banner"}
                  className={`pointer-events-none absolute inset-0 h-full w-full ${
                    bannerIsSvg
                      ? "hero-banner-svg-image object-contain scale-[1.08] sm:scale-100"
                      : "hero-banner-raster-image object-cover object-top sm:object-center"
                  }`}
                  loading={idx === 0 ? "eager" : "lazy"}
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
                <div
                  className={`pointer-events-none absolute inset-x-0 top-0 z-[5] ${
                    bannerIsSvg ? "h-6 sm:h-16" : "h-8 sm:h-20"
                  } bg-gradient-to-b from-[#09163f]/40 via-[#192A66]/15 to-transparent sm:from-[#09163f] sm:via-[#192A66]/55`}
                  aria-hidden="true"
                />
                <div
                  className={`absolute bottom-0 left-0 w-full ${
                    bannerIsSvg ? "h-32 sm:h-80" : "h-56 sm:h-96"
                  } bg-gradient-to-t from-[#192A66]/70 from-0% to-transparent to-100% sm:from-[#192A66]`}
                />
                <div
                  className={`absolute inset-y-0 left-0 z-[6] ${
                    bannerIsSvg ? "w-[30%] sm:w-1/2" : "w-[38%] sm:w-2/3"
                  } bg-gradient-to-r from-[#192A66]/55 from-0% via-[#192A66]/15 via-30% to-transparent to-100% sm:from-[#192A66] sm:via-[#192A66]/60`}
                />
                <HeroSlideContent
                  title={
                    titleLines.length > 0
                      ? titleLines.map((line, i) => (
                          <span key={i} className="block">
                            {line}
                          </span>
                        ))
                      : null
                  }
                  subtitle={banner.subtitle}
                  action={
                    banner.button_title && banner.web_link ? (
                      <div className="flex flex-row gap-2">
                        <button
                          type="button"
                          onClick={handleAction}
                          className="btn-primary flex cursor-pointer items-center justify-center gap-3 rounded-lg px-4 py-2 text-[12px] uppercase sm:gap-4 sm:px-6 sm:py-3 sm:text-md"
                        >
                          {banner.button_title}
                          <span
                            aria-hidden
                            className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#E07E27] sm:h-6 sm:w-6"
                          >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </span>
                        </button>
                      </div>
                    ) : null
                  }
                />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <style jsx global>{`
        .hero-shell .hero-swiper .swiper-pagination {
          bottom: 18px;
          z-index: 30;
        }
        @media (max-width: 640px) {
          .hero-shell .hero-swiper {
            padding-bottom: 1rem;
            box-sizing: border-box;
          }
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
        .hero-shell .hero-banner {
          background: #192a66;
        }
        @media (max-width: 640px) {
          .hero-shell .hero-banner.hero-banner-svg {
            background: linear-gradient(180deg, #09163f 0%, #192a66 100%);
          }
          .hero-shell .hero-banner.hero-banner-raster {
            background: linear-gradient(180deg, #09163f 0%, #192a66 100%);
          }
          .hero-shell .hero-banner .hero-banner-svg-image {
            object-fit: contain;
            object-position: center center;
          }
          .hero-shell .hero-banner .hero-banner-raster-image {
            object-fit: cover;
            object-position: center center;
          }
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
