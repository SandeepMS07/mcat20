"use client";

import { useMemo, useState, useEffect } from "react";
import Hero from "@/components/hero/Hero";
import { getVideosClient } from "../api/clientApi";
import LoadingPage from "../loading";
import Sponsorship from "@/components/common/Sponsorship";

const INITIAL_VISIBLE_COUNT = 6;

const formatVideoDate = (dateString) => {
  if (!dateString) return "";

  const parsedDate = new Date(dateString);
  if (Number.isNaN(parsedDate.getTime())) return dateString;

  return parsedDate.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const extractYoutubeId = (url = "") => {
  const fromShortUrl = url.match(/youtu\.be\/([^?&/]+)/);
  if (fromShortUrl?.[1]) return fromShortUrl[1];

  const fromWatchUrl = url.match(/[?&]v=([^?&/]+)/);
  if (fromWatchUrl?.[1]) return fromWatchUrl[1];

  const fromEmbedUrl = url.match(/embed\/([^?&/]+)/);
  if (fromEmbedUrl?.[1]) return fromEmbedUrl[1];

  return "";
};

const VideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [activeVideoIndex, setActiveVideoIndex] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const videoRes = await getVideosClient();
        const formattedVideos =
          videoRes?.data?.map((item) => {
            const videoId = extractYoutubeId(item.videoUrl);
            return {
              ...item,
              videoId,
              thumbnail: videoId
                ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                : "/images/banner/news-bg.jpg",
            };
          }) || [];
        setVideos(formattedVideos);
      } catch (err) {
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const visibleVideos = useMemo(
    () => videos.slice(0, visibleCount),
    [videos, visibleCount],
  );
  const hasMore = visibleCount < videos.length;
  const activeVideo =
    activeVideoIndex !== null ? visibleVideos[activeVideoIndex] : null;

  if (loading) return <LoadingPage />;

  return (
    <>
      <div className="min-h-screen w-full bg-[#ECEEF3] pb-16">
        <Hero
          imgUrl={
            "https://storage.googleapis.com/mca_images/website/banner_img/gallery.jpg"
          }
          heading="Videos"
          subheading=""
        />
        <div className="section-width pt-10 md:pt-14">
          <h1 className="mb-10 flex flex-col text-5xl font-extrabold uppercase italic leading-[0.92] text-[#1B2F7A] sm:text-6xl lg:text-7xl">
            <span
              className="text-transparent [-webkit-text-stroke:2px_#1B2F7A]"
              style={{ WebkitTextStroke: "2px #1B2F7A" }}
            >
              Latest
            </span>
            <span>Videos</span>
          </h1>

          {videos.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center text-[#1B2F7A]">
              No videos available.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {visibleVideos.map((video, index) => (
                  <article
                    key={video.Id || `${video.title}-${index}`}
                    className="overflow-hidden rounded-3xl bg-[#101F54] shadow-[0_10px_28px_rgba(13,30,80,0.18)]"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveVideoIndex(index)}
                      className="group relative block h-64 w-full overflow-hidden"
                    >
                      <img
                        src={video.thumbnail}
                        alt={video.title || "Video thumbnail"}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/35" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/28 backdrop-blur-sm">
                          <span className="ml-1 text-4xl text-white">▶</span>
                        </div>
                      </div>
                    </button>

                    <div className="flex items-start justify-between gap-3 p-5 text-white">
                      <div>
                        <h3 className="mb-4 line-clamp-2 text-lg font-medium leading-snug">
                          {video.title || "Untitled Video"}
                        </h3>
                        <p className="text-sm text-white/60">
                          {formatVideoDate(video.date)}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="mt-1 shrink-0 text-white/70 transition-colors hover:text-white"
                        aria-label="Share video"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="18" cy="5" r="3" />
                          <circle cx="6" cy="12" r="3" />
                          <circle cx="18" cy="19" r="3" />
                          <path d="M8.59 13.51 15.42 17.49" />
                          <path d="M15.41 6.51 8.59 10.49" />
                        </svg>
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              {hasMore && (
                <div className="mt-12 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                    className="rounded-full bg-[#F68323] px-8 py-3 text-sm font-bold uppercase tracking-wide text-white transition-opacity hover:opacity-90"
                  >
                    View More
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {activeVideo?.videoId && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4"
            onClick={() => setActiveVideoIndex(null)}
          >
            <div
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveVideoIndex(null)}
                className="absolute -right-2 -top-12 rounded-full bg-white px-3 py-1 text-sm font-bold text-black"
              >
                ✕
              </button>
              <iframe
                width="100%"
                height="560"
                src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1&rel=0`}
                title={activeVideo.title || "Video Preview"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full rounded-xl"
              />
            </div>
          </div>
        )}
      </div>
      <Sponsorship />
    </>
  );
};

export default VideosPage;
