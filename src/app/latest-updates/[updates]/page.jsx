"use client";
import TitleComponent from "@/components/common/TitleComponent";
import Hero from "@/components/hero/Hero";
import Image from "next/image";
// import { CardData } from "../data";
import UpdatesCard from "@/components/LatestUpdateComponents/UpdatesCard";
import { useEffect, useState } from "react";
import { formatTitleForURL,decodeHtml} from "@/utilis/helper";
import { useParams, useRouter } from "next/navigation";
import routes from "@/utilis/route";
import LoadingPage from "@/app/loading";
import { getLatestUpdatesClient } from "@/app/api/clientApi";

const page = () => {
  const params = useParams();
  const router = useRouter();
  const [updatesData, setUpdatesData] = useState([]);
  const [bannerImage, setBannerImage] = useState("");
  const [selectedUpdate, setSelectedUpdate] = useState(null);

  // Fetch the latest news from the api
  useEffect(() => {
    const fetchUpdates = async () => {
      const data = await getLatestUpdatesClient();
      if (data?.data?.length) {
        setUpdatesData(data.data);

        const found = data.data.find(
          (item) =>
            formatTitleForURL(item.Title__c) ===
            decodeURIComponent(params?.updates)
        );

        if (found) {
          setSelectedUpdate(found);
        }
      }
    };

    fetchUpdates();
  }, [params?.updates]);

  const handleLatestUpdateClick = (title) => {
    router.push(`${routes.latestUpdates}/${formatTitleForURL(title)}`);
  };

  return (
    <>
      <Hero
        imgUrl={"/images/banner/latest-updates-bg.jpg"}
        heading="Latest Updates"
      />
      <div className="section-width section-padding text-black">
        <div>
          {selectedUpdate ? (
            <>
              <div className="mb-8">
                <p className="mb-2">
                  {"Mumbai, "}
                  {selectedUpdate?.Date__c
                    ? new Date(selectedUpdate.Date__c).toLocaleDateString(
                        "en-IN",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : ""}
                </p>
                <h2 className=" max-w-7xl  mb-4">{selectedUpdate?.Title__c}</h2>
                <p className="  ">{selectedUpdate?.Sub_Title__c}</p>
              </div>

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
            <LoadingPage />
          )}
        </div>
      </div>
    </>
  );
};

export default page;
