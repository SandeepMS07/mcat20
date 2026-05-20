"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { truncateTextSpells, formatTitleForURL } from "@/utilis/helper";
import { useRouter } from "next/navigation";
import routes from "@/utilis/route";
import { getLatestUpdatesClient } from "@/app/api/clientApi";
import LoadingPage from "@/app/loading";
import { LocalLatestUpdates } from "@/app/news/data";

const SEASON_LABEL = "T20 ML Season 3";

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
      const apiUpdates = data?.data || [];
      const merged = [
        ...LocalLatestUpdates,
        ...apiUpdates.filter(
          (item) =>
            !LocalLatestUpdates.some(
              (local) => local.Title__c === item?.Title__c,
            ),
        ),
      ];

      setLatestUpdates(merged);
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

  const cards = latestUpdates.slice(0, 3);

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
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#d84800] to-[#f68323] px-4 text-xs font-medium uppercase italic tracking-wide text-white shadow-[0_4px_18px_rgba(216,72,0,0.3)] transition-opacity hover:opacity-90 sm:px-6 sm:text-sm"
          >
            View More
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
                className="group relative aspect-[4/5] w-[82%] shrink-0 snap-start cursor-pointer overflow-hidden rounded-2xl bg-[#143083] shadow-[0_10px_24px_rgba(20,48,131,0.18)] transition-transform hover:-translate-y-0.5 md:w-auto md:shrink"
              >
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={item?.Title__c || ""}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#0F2A8C]" />
                )}
                <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#143083] from-30% via-[#143083]/80 via-65% to-transparent" />
                <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-3 px-5 pb-5 lg:px-6 lg:pb-6">
                  <span className="inline-flex w-fit items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#143083]">
                    {SEASON_LABEL}
                  </span>
                  <h3 className="line-clamp-2 text-base font-bold leading-snug text-white sm:text-lg">
                    {truncateTextSpells(item?.Title__c, 80)}
                  </h3>
                  <p className="text-xs font-medium text-white/80 sm:text-sm">
                    Mumbai, {formatNewsDate(item?.Date__c)}
                  </p>
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
