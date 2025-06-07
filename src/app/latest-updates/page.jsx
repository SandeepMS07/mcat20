"use client";
import Hero from "@/components/hero/Hero";
import UpdatesCard from "@/components/LatestUpdateComponents/UpdatesCard";
import { CardData } from "./data";
import { useRouter } from "next/navigation";
import { formatTitleForURL } from "@/utilis/helper";
import routes from "@/utilis/route";
import TitleComponent from "@/components/common/TitleComponent";
import latestUpdatesBg from "../../../public/images/latestUpdates/latest-updates-bg.png";
import { getLatestUpdatesClient } from "@/app/api/clientApi";
import { useEffect, useState } from "react";
import LoadingPage from "../loading";

const page = () => {
  const [latestUpdates, setLatestUpdates] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUpdates = async () => {
      setLoading(true);
      const data = await getLatestUpdatesClient();
      if (data?.data?.length) {
        setLatestUpdates(data);
      }
      setLoading(false);
    };
    fetchUpdates();
  }, []);

  const router = useRouter();

  const handleLatestUpdateClick = (title) => {
    router.push(`${routes.latestUpdates}/${formatTitleForURL(title)}`);
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="w-full h-auto">
      <Hero imgUrl={latestUpdatesBg} heading="Latest Updates" />
      <div className="relative">
        <img
          src="/images/elements/section-element.png"
          className="absolute right-0 top-0"
          alt="element"
        />
        <img
          src="/images/elements/section-element.png"
          className="absolute left-0 bottom-0 rotate-180"
          alt="element"
        />
        <div className=" text-black gap-16 section-width section-padding ">
          <TitleComponent title={"Latest Updates"} />
          <div className="w-full grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
            {[...(latestUpdates?.data || [])]
              .sort((a, b) => b.Order__c - a.Order__c)
              .map((item, index) => (
                <UpdatesCard
                  data={item}
                  key={index}
                  onClick={() => handleLatestUpdateClick(item.Title__c)}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
