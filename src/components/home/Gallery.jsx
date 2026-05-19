"use client";

import { useEffect, useRef, useState } from "react";
import LoadingPage from "@/app/loading";
import { getVideosClient } from "@/app/api/clientApi";

const extractYoutubeId = (url = "") => {
  const fromShortUrl = url.match(/youtu\.be\/([^?&/]+)/);
  if (fromShortUrl?.[1]) return fromShortUrl[1];

  const fromWatchUrl = url.match(/[?&]v=([^?&/]+)/);
  if (fromWatchUrl?.[1]) return fromWatchUrl[1];

  const fromEmbedUrl = url.match(/embed\/([^?&/]+)/);
  if (fromEmbedUrl?.[1]) return fromEmbedUrl[1];

  const fromShortsUrl = url.match(/shorts\/([^?&/]+)/);
  if (fromShortsUrl?.[1]) return fromShortsUrl[1];

  return "";
};

const PlayIcon = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
    className={className}
  >
    <path d="M8 5v14l11-7L8 5z" />
  </svg>
);

const Gallery = () => {
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const scrollerRef = useRef(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const videoRes = await getVideosClient();
        const formatted =
          videoRes?.data
            ?.map((item) => {
              const videoId = extractYoutubeId(item.videoUrl || "");
              return {
                ...item,
                videoId,
                thumbnail: videoId
                  ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                  : "",
              };
            })
            .filter((v) => v.videoId) || [];
        setVideos(formatted);
      } catch (err) {
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) return <LoadingPage />;
  if (videos.length === 0) return null;

  const openModal = (index) => {
    setCurrentIndex(index);
    setShowModal(true);
  };

  const scrollBy = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    const delta = el.clientWidth * 0.85 * dir;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  const activeVideo = currentIndex !== null ? videos[currentIndex] : null;

  return (
    <section className="relative overflow-x-hidden bg-[#192A66] pt-6 pb-10 sm:pt-8 sm:pb-14 lg:pt-10 lg:pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-[#F2A23A]/10 blur-3xl"
      />

      <div className="section-width relative pl-6 sm:pl-4">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
          <div>
            <span className="mb-2 inline-block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F2A23A]">
              Watch
            </span>
            <h2 className="flex flex-col text-3xl font-extrabold uppercase italic leading-[0.95] text-white sm:text-4xl lg:text-6xl">
              <span
                className="text-transparent [-webkit-text-stroke:1.5px_#ffffff]"
                style={{ WebkitTextStroke: "1.5px #ffffff" }}
              >
                T20 Mumbai
              </span>
              <span>Moments</span>
            </h2>
          </div>

          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Scroll left"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 text-white transition hover:border-[#F2A23A] hover:text-[#F2A23A]"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Scroll right"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 text-white transition hover:border-[#F2A23A] hover:text-[#F2A23A]"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="scrollbar-hide -mr-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 pr-6 sm:-mr-4 sm:gap-5 sm:pr-4 lg:gap-6"
        >
          {videos.map((item, i) => (
            <button
              type="button"
              key={item.Id || item.videoId || i}
              onClick={() => openModal(i)}
              aria-label={item.title ? `Play ${item.title}` : "Play video"}
              className="group relative w-[260px] shrink-0 snap-start cursor-pointer text-left transition hover:-translate-y-0.5 sm:w-[300px] lg:w-[340px]"
            >
              <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-black ring-1 ring-white/5 transition group-hover:border-[#F2A23A]/60">
                <img
                  src={item.thumbnail}
                  alt={item.title || ""}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F2A23A] text-[#02103D] shadow-lg transition group-hover:scale-110">
                    <PlayIcon className="ml-0.5 h-5 w-5" />
                  </span>
                </div>
                <span className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm">
                  Video
                </span>
              </div>
              {item.title && (
                <p className="mt-3 line-clamp-2 text-sm font-medium leading-snug text-white/90 group-hover:text-white">
                  {item.title}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>

      {showModal && activeVideo?.videoId && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-[4vw] py-4 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative w-[92vw] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute -top-12 right-0 z-50 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white text-black"
              aria-label="Close"
            >
              ✕
            </button>

            {currentIndex > 0 && (
              <button
                type="button"
                className="absolute left-2 top-1/2 z-50 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm sm:-left-16 sm:h-14 sm:w-14 sm:bg-white/80 sm:text-black sm:backdrop-blur-none"
                onClick={() => setCurrentIndex((prev) => prev - 1)}
                aria-label="Previous"
              >
                ◀
              </button>
            )}

            {currentIndex < videos.length - 1 && (
              <button
                type="button"
                className="absolute right-2 top-1/2 z-50 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm sm:-right-16 sm:h-14 sm:w-14 sm:bg-white/80 sm:text-black sm:backdrop-blur-none"
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                aria-label="Next"
              >
                ▶
              </button>
            )}

            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
              <iframe
                key={activeVideo.videoId}
                src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1&rel=0`}
                title={activeVideo.title || "Match Moment"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
            {activeVideo.title && (
              <p className="mt-3 text-center text-sm font-medium text-white/90">
                {activeVideo.title}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
