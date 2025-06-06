"use client";

import Hero from "@/components/hero/Hero";
import React, { useState, useEffect } from "react";
import MediaAll from "@/components/media/MediaAll";
import TitleComponent from "@/components/common/TitleComponent";
import { getImagesClient, getVideosClient } from "../api/clientApi";
import images from "./images";

const tabs = ["View Images", "View Videos"];

const Page = () => {
  const [activeTab, setActiveTab] = useState("View Images");
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videoRes = await getVideosClient();
        const formattedVideos =
          videoRes?.data?.map((item) => ({
            ...item,
            type: "video",
            img: `https://img.youtube.com/vi/${
              item.videoUrl.split("youtu.be/")[1]
            }/hqdefault.jpg`,
            title: item.Title__c,
            date: item.Date__c,
          })) || [];
        console.log("Formatted videos:", formattedVideos);
        setVideos(formattedVideos);
      } catch (err) {
        console.error("Error fetching videos:", err);
      } finally {
      }
    };

    fetchVideos();
  }, []);

  // Fetching the data from the API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const images = await getImagesClient();
        console.log(images);
      } catch (err) {
        console.log(err);
      }
    };
    fetchImages();
  }, []);

  const filteredItems = activeTab === "View Videos" ? videos : images;

  return (
    <div className="w-full ">
      <Hero
        imgUrl={
          "https://storage.googleapis.com/mca_images/website/banner_img/gallery.jpg"
        }
        heading="Gallery"
        subheading=""
      />
      {/* <p className="text-4xl py-20 font-bold mb-4 text-black uppercase  section-width ">
        GALLERY
      </p> */}
      <div className="relative">
        <img
          src="/images/elements/section-element.png"
          className="absolute right-0 top-0 md:block hidden"
          alt="element"
        />
        <img
          src="/images/elements/section-element.png"
          className="absolute left-0 bottom-0 rotate-180 md:block hidden"
          alt="element"
        />
        <div className="gap-6 section-width section-padding ">
          <TitleComponent title={"Gallery"} />
          <div className="w-full bg-black">
            <div className="w-full flex items-center">
              {tabs.map((tab, index) => (
                <div
                  key={index}
                  className={`h-full cursor-pointer ${
                    activeTab === tab
                      ? "bg-[#E07E27] text-white"
                      : "text-[#E07E27]"
                  } 
                  ${index !== 0 ? "border-l border-[#E07E27]" : ""}
                  px-6 m-2 py-1 uppercase`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </div>
              ))}
            </div>
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
