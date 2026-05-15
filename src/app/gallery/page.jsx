"use client";

import React, { useState, useEffect } from "react";
import MediaAll from "@/components/media/MediaAll";
import Hero from "@/components/hero/Hero";
import { getImagesClient } from "../api/clientApi";
import { BsArrowLeftCircle } from "react-icons/bs";

const PRIORITY_GALLERY_TAGS = [
  "T20 Mumbai S4 Auction 2026",
  "T20 mumbai S4 2026",
];

const GalleryPage = () => {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [imageFolders, setImageFolders] = useState([]);
  const [loading, setLoading] = useState(false);

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
          })) || [];

        const isMatchTag = (tag) => /^Match\s\d+/i.test(tag);
        const extractMatchNumber = (tag) => {
          const match = tag.match(/^Match\s(\d+)/i);
          return match ? parseInt(match[1], 10) : 0;
        };

        const grouped = formattedImages.reduce((acc, item) => {
          const tag = item.Tag__c?.trim();
          if (!tag || tag === "T20Gallery") return acc;
          if (!acc[tag]) acc[tag] = [];
          acc[tag].push(item);
          return acc;
        }, {});

        const getPriorityTagIndex = (tag) =>
          PRIORITY_GALLERY_TAGS.findIndex(
            (priorityTag) => priorityTag.toLowerCase() === tag?.toLowerCase?.(),
          );

        const sortedKeys = Object.keys(grouped)
          .filter((key) => key !== "T20Gallery")
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

            if (aIsMatch && bIsMatch)
              return extractMatchNumber(b) - extractMatchNumber(a);
            if (aIsMatch) return -1;
            if (bIsMatch) return 1;
            return b.localeCompare(a);
          });

        const folders = {};
        sortedKeys.forEach((key) => {
          folders[key] = grouped[key];
        });

        setImageFolders(folders);
      } catch (err) {
        console.error("Error fetching images:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#ECEEF3] pb-16">
      <Hero
        imgUrl={
          "https://storage.googleapis.com/mca_images/website/banner_img/gallery.jpg"
        }
        heading="Gallery"
        subheading=""
      />
      <div className="section-width pt-10 md:pt-14">
        <h1 className="mb-8 flex flex-col text-5xl font-extrabold uppercase italic leading-[0.92] text-[#1B2F7A] sm:text-6xl lg:text-7xl">
          <span
            className="text-transparent [-webkit-text-stroke:2px_#1B2F7A]"
            style={{ WebkitTextStroke: "2px #1B2F7A" }}
          >
            Latest
          </span>
          <span>Gallery</span>
        </h1>

        <div>
          <div className="mb-3 flex items-center text-[#1B2F7A]">
            {selectedFolder && (
              <button
                type="button"
                className="mr-2 text-3xl text-[#F68323]"
                onClick={() => setSelectedFolder(null)}
                aria-label="Go back"
              >
                <BsArrowLeftCircle />
              </button>
            )}
            <p className="text-sm font-semibold uppercase tracking-wide text-[#1B2F7A]">
              {selectedFolder ? selectedFolder : "Select a folder"}
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl bg-white p-8 text-center text-[#1B2F7A]">
              Loading gallery...
            </div>
          ) : (
            <MediaAll
              items={imageFolders}
              type="image"
              selectedFolder={selectedFolder}
              setSelectedFolder={setSelectedFolder}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
