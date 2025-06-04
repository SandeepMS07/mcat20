"use client";
import TitleComponent from "@/components/common/TitleComponent";
import Hero from "@/components/hero/Hero";
import Image from "next/image";
import { CardData } from "../data";
import UpdatesCard from "@/components/LatestUpdateComponents/UpdatesCard";
import { useEffect, useState } from "react";
import { formatTitleForURL } from "@/utilis/helper";
import { useParams, useRouter } from "next/navigation";
import routes from "@/utilis/route";

const page = () => {
  const params = useParams();
  const router = useRouter();
  const [updatesData, setUpdatesData] = useState([]);
  const [bannerImage, setBannerImage] = useState("");

  useEffect(() => {
    CardData.filter((data) => {
      let findData =
        formatTitleForURL(data.title) == decodeURIComponent(params?.updates);

      if (findData) {
        setBannerImage(data?.imgUrl);
        let latestUpdatesData = [];
        latestUpdatesData.push(data);
        setUpdatesData(latestUpdatesData[0]);
      }
    });
  }, []);

  const handleLatestUpdateClick = (title) => {
    router.push(`${routes.latestUpdates}/${formatTitleForURL(title)}`);
  };
  return (
    <>
      <Hero imgUrl={"/images/banner/latest-updates-bg.jpg"} heading="Latest Updates" />
      <div className="section-width section-padding text-black">
        <div>
          <div className="mb-8">
            <p className="mb-2">{updatesData?.date}</p>
            <h2 className=" max-w-7xl  mb-4">{updatesData?.title}</h2>
            <p className="  ">{updatesData?.subTitle}</p>
          </div>

          <Image
            src={bannerImage}
            width={1000}
            height={500}
            className="w-full h-full"
            alt="img"
          />
          <div className="section-padding">
            <p
              dangerouslySetInnerHTML={{ __html: `${updatesData?.content}` }}
            ></p>
          </div>
          <div>
            <TitleComponent title={"Latest Updates"} />
            <div className="w-full grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
              {CardData.slice(0, 4).map((item, index) => (
                <UpdatesCard
                  data={item}
                  key={index}
                  onClick={() => handleLatestUpdateClick(item.title)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
