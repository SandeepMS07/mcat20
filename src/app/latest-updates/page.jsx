"use client";
import Hero from "@/components/hero/Hero";
import UpdatesCard from "@/components/LatestUpdateComponents/UpdatesCard";
import { CardData } from "./data";
import { useRouter } from "next/navigation";
import { formatTitleForURL } from "@/utilis/helper";
import routes from "@/utilis/route";
import TitleComponent from "@/components/common/TitleComponent";

const page = () => {
  const router = useRouter();

  const handleLatestUpdateClick = (title) => {
    router.push(`${routes.latestUpdates}/${formatTitleForURL(title)}`);
  };
  return (
    <div className="w-full h-auto">
      <Hero imgUrl={"https://storage.googleapis.com/mca_images/website/banner_img/latestUpdates.jpg"} heading="Latest Updates" />
      <div className="relative">
          <img src="/images/elements/section-element.png" className="absolute right-0 top-0" alt="element" />
        <img src="/images/elements/section-element.png" className="absolute left-0 bottom-0 rotate-180" alt="element" />
        <div className=" text-black gap-16 section-width section-padding ">
          <TitleComponent title={"Latest Updates"} />
          <div className="w-full grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
            {[...CardData]
              .sort((a, b) => {
                const dateA = new Date(a.date.replace(/^.*?,\s*/, ""));
                const dateB = new Date(b.date.replace(/^.*?,\s*/, ""));
                return dateB - dateA;
              })
              .map((item, index) => (
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
  );
};

export default page;
