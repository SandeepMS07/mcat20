"use client";
import UpdatesCard from "@/components/LatestUpdateComponents/UpdatesCard";
import { useRouter } from "next/navigation";
import { formatTitleForURL } from "@/utilis/helper";
import routes from "@/utilis/route";
import TitleComponent from "@/components/common/TitleComponent";
import { getLatestUpdatesClient } from "@/app/api/clientApi";
import { useEffect, useState } from "react";
import LoadingPage from "../loading";
import Sponsorship from "@/components/common/Sponsorship";

const formatNewsDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const page = () => {
  const [latestUpdates, setLatestUpdates] = useState([]);
  const [apiUpdates, setApiUpdates] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchUpdates = async () => {
      setLoading(true);
      const data = await getLatestUpdatesClient();
      setApiUpdates(Array.isArray(data?.apiData) ? data.apiData : []);
      setLatestUpdates({ data: Array.isArray(data?.data) ? data.data : [] });
      setLoading(false);
    };
    fetchUpdates();
  }, []);

  const router = useRouter();
  const toTime = (item) => {
    const t = new Date(item?.Date__c || 0).getTime();
    return Number.isFinite(t) ? t : 0;
  };
  const sortedUpdates = [...(latestUpdates?.data || [])].sort(
    (a, b) => toTime(b) - toTime(a),
  );
  const featuredUpdate =
    [...apiUpdates].sort((a, b) => toTime(b) - toTime(a))[0] ||
    sortedUpdates[0];
  const featuredUpdatePath =
    featuredUpdate?.path ||
    `${routes.latestUpdates}/${formatTitleForURL(
      featuredUpdate?.Title__c || "",
    )}`;
  const visibleUpdates = showAll ? sortedUpdates : sortedUpdates.slice(0, 8);
  const hasMoreUpdates = sortedUpdates.length > 8;

  const handleLatestUpdateClick = (title) => {
    router.push(`${routes.latestUpdates}/${formatTitleForURL(title)}`);
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="w-full h-auto">
      <section className="relative min-h-[560px] w-full overflow-hidden">
        <img
          src={featuredUpdate?.Image_URL__c || "/images/banner/news-bg.jpg"}
          alt={featuredUpdate?.Title__c || "Latest News"}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D236D]/92 via-[#0D236D]/65 to-[#0D236D]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B57]/55 via-transparent to-transparent" />

        <div className="relative z-10 flex min-h-[560px] items-end pb-14">
          <div className="section-width">
            <div className="max-w-4xl">
              <p className="mb-3 text-sm font-semibold text-white/90">
                {formatNewsDate(featuredUpdate?.Date__c)}
              </p>
              <h1 className="mb-4 text-3xl font-extrabold leading-tight text-white md:text-4xl">
                {featuredUpdate?.Title__c || "Latest Updates"}
              </h1>
              {featuredUpdate && (
                <button
                  type="button"
                  onClick={() => router.push(featuredUpdatePath)}
                  className="rounded-full bg-[#F68323] px-6 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Read More
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
      <div className="relative bg-[#F1F2F8]">
        <div className=" text-black gap-16 section-width section-padding ">
          <div className="mb-12">
            <h2 className="flex flex-col text-3xl font-extrabold uppercase italic leading-[0.95] text-[#192A66] sm:text-4xl lg:text-6xl">
              <span
                className="text-transparent [-webkit-text-stroke:1.5px_#192A66]"
                style={{ WebkitTextStroke: "1.5px #192A66" }}
              >
                Latest
              </span>
              <span>News</span>
            </h2>
          </div>
          <div className="w-full grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
            {!isLoading && latestUpdates.length !== 0
              ? visibleUpdates.map((item, index) => (
                  <UpdatesCard
                    data={item}
                    key={index}
                    onClick={() => handleLatestUpdateClick(item.Title__c)}
                  />
                ))
              : "No data found..."}
          </div>
          {!isLoading && hasMoreUpdates && !showAll && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="rounded-full bg-gradient-to-b from-[#d84800] to-[#f68323] px-7 py-2.5 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_4px_18px_rgba(216,72,0,0.3)] transition-opacity hover:opacity-90"
              >
                View More
              </button>
            </div>
          )}
        </div>
      </div>
      <Sponsorship />
    </div>
  );
};

export default page;
