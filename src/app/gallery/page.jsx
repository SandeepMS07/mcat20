"use client";

import Hero from "@/components/hero/Hero";
import React, { useState } from "react";
import MediaAll from "@/components/media/MediaAll";
import TitleComponent from "@/components/common/TitleComponent";

const tabs = ["All", "View Videos", "View Images"];

const items = [
  {
    type: "",
    title: "Final: SS vs NMP",
    date: "27 May, 2025",
    img: "/images/gallery/new1.jpg",
    views: 1289,
  },
  {
    type: "",
    title: "T20 Mumbai Promo",
    date: "",
    img: "/images/gallery/new-2.jpg",
    views: 1500,
  },
  {
    type: "",
    title: "Match 19: NBB vs ETS",
    date: "22 May, 2025",
    img: "/images/gallery/new3.jpg",
  },
  {
    type: "",
    title: "Final: SS vs NMP",
    date: "27 May, 2025",
    img: "/images/gallery/new-1.jpeg",
    views: 1289,
  },
  {
    type: "",
    title: "T20 Mumbai Promo",
    date: "",
    img: "/images/gallery/new5.jpg",
    views: 1500,
  },
  {
    type: "",
    title: "Match 19: NBB vs ETS",
    date: "22 May, 2025",
    img: "/images/gallery/new6.jpg",
  },

  //newly updated galary
  {
    type: "",
    title: "Final: SS vs NMP",
    date: "27 May, 2025",
    img: "/images/gallery/img3.jpg",
    views: 1289,
  },
  {
    type: "",
    title: "T20 Mumbai Promo",
    date: "",
    img: "/images/gallery/img2.jpg",
    views: 1500,
  },
  {
    type: "",
    title: "Match 19: NBB vs ETS",
    date: "22 May, 2025",
    img: "/images/gallery/img11.jpg",
  },
  {
    type: "",
    title: "Dreams do come true:",
    date: "27 May, 2025",
    img: "/images/gallery/img4.jpg",
  },
  {
    type: "",
    title: "T20 Mumbai Promo",
    date: "",
    img: "/images/gallery/img12.jpg",
    views: 1500,
  },
  {
    type: "",
    title: "Match 19: NBB vs ETS",
    date: "22 May, 2025",
    img: "/images/gallery/img10.jpg",
  },
  {
    type: "",
    title: "Dreams do come true:",
    date: "27 May, 2025",
    img: "/images/gallery/img7.jpg",
  },
  {
    type: "",
    title: "Final: SS vs NMP",
    date: "27 May, 2025",
    img: "/images/gallery/img8.jpg",
    views: 1289,
  },
  {
    type: "",
    title: "T20 Mumbai Promo",
    date: "",
    img: "/images/gallery/img9.png",
    views: 1500,
  },
  {
    type: "",
    title: "Match 19: NBB vs ETS",
    date: "22 May, 2025",
    img: "/images/gallery/img10.jpg",
  },
  {
    type: "",
    title: "Dreams do come true:",
    date: "27 May, 2025",
    img: "/images/gallery/img11.jpg",
  },
];

const Page = () => {
  const [activeTab, setActiveTab] = useState("All");
  const filteredItems =
    activeTab === "All"
      ? items
      : activeTab === "View Videos"
      ? items.filter((item) => item.type === "video")
      : items.filter((item) => item.type === "image");

  return (
    <div className="w-full ">
      <Hero imgUrl={"https://storage.googleapis.com/mca_images/website/banner_img/gallery.jpg"} heading="Gallery" subheading="" />
      {/* <p className="text-4xl py-20 font-bold mb-4 text-black uppercase  section-width ">
        GALLERY
      </p> */}
      <div className="relative">
          <img src="/images/elements/section-element.png" className="absolute right-0 top-0" alt="element" />
        <img src="/images/elements/section-element.png" className="absolute left-0 bottom-0 rotate-180" alt="element" />
        <div className="gap-6 section-width section-padding ">
        <TitleComponent title={"Gallery"}/>
          <div className="w-full bg-black">
            {/* <div className="w-full flex items-center">
              {tabs.map((tab, index) => (
                <div
                  key={index}
                  className={`h-full cursor-pointer ${
                    activeTab === tab
                      ? "bg-[#E07E27] text-white"
                      : "text-[#E07E27]"
                  } border-l border-[#E07E27] px-6 m-2 py-1 uppercase`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </div>
              ))}
            </div> */}
            <div className="w-full flex items-center justify-center">
              <MediaAll items={filteredItems} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
