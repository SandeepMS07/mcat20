"use client";
import TitleComponent from "@/components/common/TitleComponent";
import { LocalLatestUpdates } from "../data";
import UpdatesCard from "@/components/LatestUpdateComponents/UpdatesCard";
import { useEffect, useState } from "react";
import { formatTitleForURL, decodeHtml } from "@/utilis/helper";
import { useParams, useRouter } from "next/navigation";
import routes from "@/utilis/route";
import { getLatestUpdatesClient } from "@/app/api/clientApi";

const formatNewsDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const page = () => {
  const params = useParams();
  const router = useRouter();
  const [updatesData, setUpdatesData] = useState([]);
  const [bannerImage, setBannerImage] = useState("");
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the latest news from the api
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
              (local) => local.Title__c === item?.Title__c
            )
        ),
      ];

      setUpdatesData(merged);

      const slug = decodeURIComponent(params?.updates || "");
      const found = merged.find((item) => {
        const titleSlug = formatTitleForURL(item?.Title__c || item?.title || "");
        const pathSlug = (item?.path || "")
          .split("/")
          .filter(Boolean)
          .pop();
        return titleSlug === slug || pathSlug === slug;
      });

      if (found) {
        setSelectedUpdate(found);
      }
      setLoading(false);
    };

    fetchUpdates();
  }, [params?.updates]);

  const handleLatestUpdateClick = (title) => {
    router.push(`${routes.latestUpdates}/${formatTitleForURL(title)}`);
  };

  const heroImage =
    selectedUpdate?.Image_URL__c || "/images/banner/latest-updates-bg.jpg";

  return (
    <>
      <section className="relative min-h-[560px] w-full overflow-hidden">
        <img
          src={heroImage}
          alt={selectedUpdate?.Title__c || "Latest Updates"}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D236D]/92 via-[#0D236D]/65 to-[#0D236D]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B57]/55 via-transparent to-transparent" />

        <div className="relative z-10 flex min-h-[560px] items-end pb-14">
          <div className="section-width">
            <div className="max-w-4xl">
              {selectedUpdate?.Date__c && (
                <p className="mb-3 text-sm font-semibold text-white/90">
                  {"Mumbai, "}
                  {formatNewsDate(selectedUpdate.Date__c)}
                </p>
              )}
              <h1 className="mb-4 text-3xl font-extrabold leading-tight text-white md:text-4xl">
                {selectedUpdate?.Title__c || "Latest Updates"}
              </h1>
              {selectedUpdate?.Sub_Title__c && (
                <p className="text-base font-medium text-white/85 md:text-lg">
                  {selectedUpdate.Sub_Title__c}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="section-width section-padding text-black">
        <div>
          {loading ? (
            <div className="py-10 text-center text-black">Loading...</div>
          ) : selectedUpdate ? (
            <>
              <img
                src={selectedUpdate?.Image_URL__c}
                width={1000}
                height={500}
                className="w-full h-full"
                alt="img"
              />
              <div className="section-padding">
                <p
                  dangerouslySetInnerHTML={{
                    __html: decodeHtml(selectedUpdate?.Content__c || ""),
                  }}
                ></p>
              </div>
              <div>
                <TitleComponent title={"Latest Updates"} />
                <div className="w-full grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
                  {[...updatesData].slice(0, 4).map((item, index) => (
                    <UpdatesCard
                      data={item}
                      key={index}
                      onClick={() => handleLatestUpdateClick(item?.Title__c)}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="py-10 text-center text-black">
              Update not found.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default page;
