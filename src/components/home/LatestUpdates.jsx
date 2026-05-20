"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { truncateTextSpells, formatTitleForURL } from "@/utilis/helper";
import { useRouter } from "next/navigation";
import routes from "@/utilis/route";
import { getLatestUpdatesClient } from "@/app/api/clientApi";
import LoadingPage from "@/app/loading";

const SEASON_LABEL = "T20 Mumbai League 2026";

const formatNewsDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const LatestUpdates = () => {
  const router = useRouter();
  const [latestUpdates, setLatestUpdates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUpdates = async () => {
      setLoading(true);
      const data = await getLatestUpdatesClient();
      setLatestUpdates(Array.isArray(data?.data) ? data.data : []);
      setLoading(false);
    };

    fetchUpdates();
  }, []);

  if (loading) return <LoadingPage />;
  if (latestUpdates.length < 1) return null;

  const handleLatestUpdateClick = (item) => {
    const targetPath =
      item?.path ||
      `${routes.latestUpdates}/${formatTitleForURL(
        item?.Title__c || item?.title || "",
      )}`;
    if (targetPath) router.push(targetPath);
  };

  const toTime = (item) => {
    const t = new Date(item?.Date__c || 0).getTime();
    return Number.isFinite(t) ? t : 0;
  };
  const cards = [...latestUpdates]
    .sort((a, b) => toTime(b) - toTime(a))
    .slice(0, 3);

  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="section-width">
        <div className="mb-8 flex items-center justify-between gap-3 sm:mb-10">
          <h2 className="flex flex-col text-3xl font-extrabold uppercase italic leading-[0.95] text-[#192A66] sm:text-4xl lg:text-6xl">
            <span
              className="text-transparent [-webkit-text-stroke:1.5px_#192A66]"
              style={{ WebkitTextStroke: "1.5px #192A66" }}
            >
              Latest
            </span>
            <span>News</span>
          </h2>
          <Link
            href={routes.latestUpdates || "#"}
            className="group inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-gradient-to-b from-[#d84800] to-[#f68323] px-4 text-xs font-bold uppercase italic tracking-wide text-white shadow-[0_4px_18px_rgba(216,72,0,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(216,72,0,0.45)] sm:px-6 sm:text-sm"
          >
            View More
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
        </div>

        <div className="-mr-4 flex snap-x snap-mandatory gap-5 overflow-x-auto pl-1 pr-4 pb-4 md:mr-0 md:grid md:grid-cols-2 md:overflow-visible md:pl-0 md:pr-0 md:pb-0 lg:grid-cols-3 lg:gap-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {cards.map((item, index) => {
            const imageSrc =
              item?.Order__c === 14
                ? "/images/latestUpdates/update14-main.jpg"
                : item?.Image_URL__c;
            return (
              <article
                key={(item?.Title__c || "card") + index}
                onClick={() => handleLatestUpdateClick(item)}
                className="group relative aspect-[4/5] w-[82%] shrink-0 cursor-pointer snap-start overflow-hidden rounded-2xl bg-[#143083] shadow-[0_10px_28px_-8px_rgba(20,48,131,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_-10px_rgba(20,48,131,0.5)] md:w-auto md:shrink"
              >
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={item?.Title__c || ""}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#0F2A8C]" />
                )}

                {/* Subtle top tint so chip reads on bright images */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/35 to-transparent"
                />

                {/* Strong bottom gradient for content legibility */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#0B1F66] from-10% via-[#0B1F66]/85 via-55% to-transparent"
                />

                {/* Category chip — top left */}
                <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#192A66] shadow-sm backdrop-blur-sm sm:text-[11px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#f68323]" />
                  {SEASON_LABEL}
                </span>

                {/* Bottom content */}
                <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-3 p-5 lg:p-6">
                  <h3 className="line-clamp-3 text-base font-extrabold leading-snug text-white sm:text-lg lg:text-xl">
                    {truncateTextSpells(item?.Title__c, 90)}
                  </h3>

                  <div className="flex items-center justify-between gap-2 border-t border-white/15 pt-3">
                    <p className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white/80 sm:text-xs">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3.5 w-3.5 text-[#f68323]"
                        aria-hidden
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                      </svg>
                      {formatNewsDate(item?.Date__c)}
                    </p>
                    <span
                      aria-hidden
                      className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-[#FFB37A] transition-transform group-hover:translate-x-0.5 sm:text-xs"
                    >
                      Read
                      <span>→</span>
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LatestUpdates;
