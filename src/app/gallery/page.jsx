"use client";

import Hero from "@/components/hero/Hero";
import React, { useState, useEffect } from "react";
import MediaAll from "@/components/media/MediaAll";
import TitleComponent from "@/components/common/TitleComponent";
import { getImagesClient, getVideosClient } from "../api/clientApi";
// import { images, ImageFolders } from "./images";
import { BsArrowLeftCircle } from "react-icons/bs";

const tabs = ["View Images", "View Videos"];
const PRIORITY_GALLERY_TAGS = [
  "T20 Mumbai S4 Auction 2026",
  "T20 mumbai S4 2026",
];

const Page = () => {
  const [activeTab, setActiveTab] = useState("View Images");
  const [videos, setVideos] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [ImageFolders, setImageFolders] = useState([]);
  const [loading, setLoading] = useState(false);

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
            title: item.title,
            date: item.date,
          })) || [];
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
        setLoading(true);
        const imageRes = await getImagesClient();
        const formattedImages =
          imageRes?.data?.map((item) => ({
            ...item,
            type: "image",
            img: item.Image_URL__c,
            // title: item.Title__c || "Untitled", // optional if title exists
            // date: item.Date__c || "",           // optional if date exists
          })) || [];

        const isMatchTag = (tag) => /^Match\s\d+/i.test(tag);
        const extractMatchNumber = (tag) => {
          const match = tag.match(/^Match\s(\d+)/i);
          return match ? parseInt(match[1], 10) : 0;
        };

        // Group by Tag__c
        const grouped = formattedImages.reduce((acc, item) => {
          const tag = item.Tag__c?.trim();
          if (!tag || tag === "T20Gallery") return acc; // skip if no tag or it's T20Gallery
          if (!acc[tag]) acc[tag] = [];
          acc[tag].push(item);
          return acc;
        }, {});

        const getPriorityTagIndex = (tag) =>
          PRIORITY_GALLERY_TAGS.findIndex(
            (priorityTag) => priorityTag.toLowerCase() === tag?.toLowerCase?.()
          );

        // Sort the keys as per logic
        const sortedKeys = Object.keys(grouped)
          .filter((key) => key !== "T20Gallery") // Exclude this tag
          .sort((a, b) => {
            const aPriorityIndex = getPriorityTagIndex(a);
            const bPriorityIndex = getPriorityTagIndex(b);
            const aIsPriority = aPriorityIndex !== -1;
            const bIsPriority = bPriorityIndex !== -1;

            if (aIsPriority && bIsPriority)
              return aPriorityIndex - bPriorityIndex;
            if (aIsPriority) return -1;
            if (bIsPriority) return 1;

            const aIsMatch = isMatchTag(a);
            const bIsMatch = isMatchTag(b);

            if (aIsMatch && bIsMatch) {
              return extractMatchNumber(b) - extractMatchNumber(a);
            } else if (aIsMatch) {
              return -1;
            } else if (bIsMatch) {
              return 1;
            } else {
              return b.localeCompare(a); // Z → A for others
            }
          });

        // Construct final ImageFolders object
        const imageFolders = {};
        sortedKeys.forEach((key) => {
          imageFolders[key] = grouped[key];
        });

        // console.log("Final ImageFolders:", imageFolders);
        setImageFolders(imageFolders); // Assuming you have this state
      } catch (err) {
        console.error("Error fetching images:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // console.log("the image folders are", ImageFolders);
  // const filteredItems = activeTab === "View Videos" ? videos : images;
  const filteredItems = activeTab === "View Videos" ? videos : ImageFolders;

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
          <div className="relative w-full bg-[url('/images/gallery/background.jpg')] bg-black bg-cover bg-center bg-no-repeat ">
            <div className="absolute inset-0 bg-black/60"></div>

            <div className="relative w-full flex items-center z-10">
              {activeTab === "View Images" && selectedFolder && (
                <div
                  className="text-[#E07E27] text-3xl px-2 cursor-pointer"
                  onClick={() => setSelectedFolder(null)}
                >
                  <BsArrowLeftCircle />
                </div>
              )}
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
            <div className="relative w-full flex items-center justify-center z-10">
              <MediaAll
                items={filteredItems}
                type={activeTab === "View Videos" ? "video" : "image"}
                selectedFolder={selectedFolder}
                setSelectedFolder={setSelectedFolder}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
