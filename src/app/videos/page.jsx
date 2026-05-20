"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { getVideosClient } from "../api/clientApi";
import LoadingPage from "../loading";
import Sponsorship from "@/components/common/Sponsorship";

const ROHIT_INTERVIEW_VIDEO_URL =
  "https://storage.googleapis.com/mca-bucket-gcp/Dev%2F1777530746564-274btnl4nw8-bg-cover-(1).mp4";
const ROHIT_INTERVIEW_POSTER_URL = "/images/home/hero/rohit.jpeg";
const HOVER_PLAY_DELAY_MS = 300;

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
  const [isHoverVideoActive, setIsHoverVideoActive] = useState(false);
  const hoverVideoRef = useRef(null);
  const hoverDelayTimeoutRef = useRef(null);

  const clearHoverDelay = () => {
    if (!hoverDelayTimeoutRef.current) return;
    window.clearTimeout(hoverDelayTimeoutRef.current);
    hoverDelayTimeoutRef.current = null;
  };

  const startHoverPlayback = () => {
    setIsHoverVideoActive(true);
    const videoEl = hoverVideoRef.current;
    if (!videoEl) return;
    try {
      videoEl.currentTime = 0;
      const playPromise = videoEl.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
    } catch (_) {}
  };

  const handleHeroMouseEnter = () => {
    clearHoverDelay();
    hoverDelayTimeoutRef.current = window.setTimeout(() => {
      hoverDelayTimeoutRef.current = null;
      startHoverPlayback();
    }, HOVER_PLAY_DELAY_MS);
  };

  const handleHeroMouseLeave = () => {
    clearHoverDelay();
    setIsHoverVideoActive(false);
    const videoEl = hoverVideoRef.current;
    if (!videoEl) return;
    try {
      videoEl.pause();
      videoEl.currentTime = 0;
    } catch (_) {}
  };

  useEffect(() => {
    const videoEl = hoverVideoRef.current;
    if (!videoEl) return;
    try {
      videoEl.load();
    } catch (_) {}
  }, []);

  useEffect(() => {
    return () => {
      clearHoverDelay();
    };
  }, []);

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
        <div
          className="group relative flex h-[220px] w-full justify-end overflow-hidden bg-[#101b52] py-6 sm:h-[360px] sm:py-10 lg:h-[500px] lg:py-14"
          onMouseEnter={handleHeroMouseEnter}
          onMouseLeave={handleHeroMouseLeave}
          onTouchStart={handleHeroMouseEnter}
          onTouchEnd={handleHeroMouseLeave}
        >
          <img
            src={ROHIT_INTERVIEW_POSTER_URL}
            alt=""
            className="absolute inset-0 z-0 h-full w-full object-cover object-top"
          />
          <video
            ref={hoverVideoRef}
            src={ROHIT_INTERVIEW_VIDEO_URL}
            muted
            loop
            playsInline
            preload="auto"
            className={`absolute inset-0 z-[1] h-full w-full object-cover object-top transition-opacity duration-300 ease-out ${
              isHoverVideoActive ? "opacity-100" : "opacity-0"
            }`}
          />
          <div className="absolute inset-0 z-[2] bg-gradient-to-r from-[#101b52]/85 via-[#101b52]/40 to-transparent" />
          <div className="absolute inset-0 z-[2] bg-gradient-to-t from-[#101b52]/80 to-transparent" />
          <div className="section-width relative z-10 flex h-full flex-col justify-end overflow-hidden pt-8 text-white">
            <div className="flex h-full w-full flex-col items-start justify-end bg-transparent">
              <div className="flex h-full flex-col justify-end gap-3">
                <p className="text-3xl font-extrabold uppercase leading-snug sm:text-4xl lg:text-5xl">
                  Videos
                </p>
              </div>
            </div>
          </div>
        </div>
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
              {/* Mobile: compact 2-column video grid */}
              <div className="grid grid-cols-2 gap-3 sm:hidden">
                {visibleVideos.map((video, index) => (
                  <button
                    type="button"
                    key={`m-${video.Id || index}`}
                    onClick={() => setActiveVideoIndex(index)}
                    className="group overflow-hidden rounded-xl bg-[#101F54] text-left shadow-md ring-1 ring-white/10"
                  >
                    <div className="relative aspect-video w-full overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt={video.title || "Video thumbnail"}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2A23A] text-[#02103D] shadow-lg">
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="ml-0.5 h-4 w-4"
                          >
                            <path d="M8 5v14l11-7L8 5z" />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div className="px-2.5 py-2 text-white">
                      <h3 className="line-clamp-2 min-h-[2.4em] text-[11px] font-semibold leading-snug">
                        {video.title || "Untitled Video"}
                      </h3>
                      <p className="mt-1 text-[9px] text-white/55">
                        {formatVideoDate(video.date)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Tablet/Desktop: original layout */}
              <div className="hidden gap-6 sm:grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
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
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F2A23A] shadow-[0_8px_24px_rgba(242,162,58,0.45)] transition-transform duration-300 group-hover:scale-110">
                          <span className="ml-1 text-2xl text-[#02103D]">▶</span>
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
