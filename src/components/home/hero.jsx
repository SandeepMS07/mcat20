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
  const heroSlidePaddingClass = "pt-8 sm:pt-10 lg:pt-14";

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
        {banners.map((banner) => {
          const titleLines = banner.title ? banner.title.split("\n") : [];
          const isExternal =
            !!banner.web_link && /^https?:\/\//i.test(banner.web_link);
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
                className={`w-full h-full bg-cover bg-center relative ${heroSlidePaddingClass} overflow-hidden flex justify-center items-center`}
                style={{ backgroundImage: `url('${banner.web_banner_url}')` }}
              >
                <div className="absolute bottom-0 left-0 h-96 w-full bg-gradient-to-t from-[#192A66] from-30% to-transparent to-100%"></div>
                <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-[#192A66] from-0% via-[#192A66]/60 via-40% to-transparent to-100%"></div>
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
                          className="btn-primary flex gap-4 items-center cursor-pointer justify-center py-3 px-6 rounded-lg text-md uppercase"
                        >
                          {banner.button_title}
                          <span
                            aria-hidden
                            className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#E07E27]"
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
