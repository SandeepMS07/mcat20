"use client";

import { useEffect, useState } from "react";
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

const Gallery = () => {
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

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

  const activeVideo = currentIndex !== null ? videos[currentIndex] : null;

  return (
    <section className="pt-8 pb-2 sm:pt-12 sm:pb-4 lg:pt-16">
      <div className="section-width">
        <div className="overflow-hidden rounded-3xl px-5 pt-8 pb-6 sm:px-8 sm:pt-10 sm:pb-7 lg:px-10 lg:pt-12 lg:pb-8 bg-[#071B55]">
          <h2 className="mb-5 text-2xl font-extrabold italic text-white sm:mb-6 sm:text-3xl lg:mb-7 lg:text-3xl">
            T20 Mumbai Moments
          </h2>
          <div className="scrollbar-hide -mx-1 flex gap-4 overflow-x-auto px-1 pb-1 sm:gap-5 lg:gap-6 pt-4">
            {videos.map((item, i) => (
              <button
                type="button"
                key={item.Id || item.videoId || i}
                onClick={() => openModal(i)}
                aria-label={item.title ? `Play ${item.title}` : "Play video"}
                className="group relative h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-2xl ring-[3px] ring-[#F2A23A] transition-transform hover:scale-105 sm:h-24 sm:w-24 lg:h-28 lg:w-28"
              >
                <img
                  src={item.thumbnail}
                  alt={item.title || ""}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {showModal && activeVideo?.videoId && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative w-full max-w-5xl"
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
                className="absolute -left-4 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/80 text-black sm:-left-16 sm:h-14 sm:w-14"
                onClick={() => setCurrentIndex((prev) => prev - 1)}
                aria-label="Previous"
              >
                ◀
              </button>
            )}

            {currentIndex < videos.length - 1 && (
              <button
                type="button"
                className="absolute -right-4 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/80 text-black sm:-right-16 sm:h-14 sm:w-14"
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
