"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { truncateTextSpells, formatTitleForURL } from "@/utilis/helper";
import { useRouter } from "next/navigation";
import routes from "@/utilis/route";
import { getLatestUpdatesClient } from "@/app/api/clientApi";
import LoadingPage from "@/app/loading";
import { LocalLatestUpdates } from "@/app/latest-updates/data";

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
            className="hidden h-10 items-center justify-center rounded-full bg-gradient-to-b from-[#d84800] to-[#f68323] px-6 text-xs font-medium uppercase italic tracking-wide text-white shadow-[0_4px_18px_rgba(216,72,0,0.3)] transition-opacity hover:opacity-90 sm:inline-flex sm:text-sm"
          >
            View More
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {cards.map((item, index) => {
            const imageSrc =
              item?.Order__c === 14
                ? "/images/latestUpdates/update14-main.jpg"
                : item?.Image_URL__c;
            return (
              <article
                key={(item?.Title__c || "card") + index}
                onClick={() => handleLatestUpdateClick(item)}
                className="group cursor-pointer overflow-hidden rounded-2xl bg-[#143083] shadow-[0_10px_24px_rgba(20,48,131,0.18)] transition-transform hover:-translate-y-0.5"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={item?.Title__c || ""}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full bg-[#0F2A8C]" />
                  )}
                  <span className="absolute bottom-3 left-3 inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#143083]">
                    {SEASON_LABEL}
                  </span>
                </div>
                <div className="px-5 py-5 lg:px-6 lg:py-6">
                  <h3 className="line-clamp-2 text-base font-bold leading-snug text-white sm:text-lg">
                    {truncateTextSpells(item?.Title__c, 80)}
                  </h3>
                  <p className="mt-4 text-xs font-medium text-white/70 sm:text-sm">
                    Mumbai, {formatNewsDate(item?.Date__c)}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        <Link
          href={routes.latestUpdates || "#"}
          className="mx-auto mt-8 inline-flex h-10 w-fit items-center justify-center rounded-full bg-gradient-to-b from-[#d84800] to-[#f68323] px-6 text-xs font-medium uppercase italic tracking-wide text-white sm:hidden"
        >
          View More
        </Link>
      </div>
    </section>
  );
};

export default LatestUpdates;
