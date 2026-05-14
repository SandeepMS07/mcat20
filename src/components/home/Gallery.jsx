"use client";

import { useEffect, useState } from "react";
import LoadingPage from "@/app/loading";
import { getImagesClient } from "@/app/api/clientApi";

const PRIORITY_GALLERY_TAGS = [
  "T20 Mumbai S4 Auction 2026",
  "T20 mumbai S4 2026",
];

const isMatchTag = (tag) => /^Match\s\d+/i.test(tag);
const extractMatchNumber = (tag) => {
  const match = tag.match(/^Match\s(\d+)/i);
  return match ? parseInt(match[1], 10) : 0;
};
const getPriorityTagIndex = (tag) =>
  PRIORITY_GALLERY_TAGS.findIndex(
    (priorityTag) => priorityTag.toLowerCase() === tag?.toLowerCase?.(),
  );

const Gallery = () => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

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

        const filteredImages = formattedImages.filter(
          (item) => item.Tag__c !== null && item.Tag__c !== undefined,
        );

        const sortedImages = filteredImages.sort((a, b) => {
          const aTag = a.Tag__c || "";
          const bTag = b.Tag__c || "";

          const aPriorityIndex = getPriorityTagIndex(aTag);
          const bPriorityIndex = getPriorityTagIndex(bTag);
          const aIsPriority = aPriorityIndex !== -1;
          const bIsPriority = bPriorityIndex !== -1;

          if (aIsPriority && bIsPriority)
            return aPriorityIndex - bPriorityIndex;
          if (aIsPriority) return -1;
          if (bIsPriority) return 1;

          const aIsMatch = isMatchTag(aTag);
          const bIsMatch = isMatchTag(bTag);

          if (aIsMatch && bIsMatch) {
            return extractMatchNumber(bTag) - extractMatchNumber(aTag);
          } else if (aIsMatch) {
            return -1;
          } else if (bIsMatch) {
            return 1;
          } else {
            return bTag.localeCompare(aTag);
          }
        });

        setImages(sortedImages.slice(0, 16));
      } catch (err) {
        console.error("Error fetching images:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) return <LoadingPage />;
  if (images.length === 0) return null;

  const openModal = (index) => {
    setCurrentIndex(index);
    setShowModal(true);
  };

  return (
    <section className="bg-[#192a66] pt-6 pb-2 sm:pt-10 sm:pb-4">
      <div className="section-width">
        <div className="overflow-hidden rounded-3xl bg-[#143083] px-5 py-6 sm:px-8 sm:py-7 lg:px-10 lg:py-8">
          <h2 className="mb-5 text-2xl font-extrabold italic text-white sm:mb-6 sm:text-3xl lg:mb-7 lg:text-4xl">
            Match Moments
          </h2>
          <div className="scrollbar-hide -mx-1 flex gap-4 overflow-x-auto px-1 pb-1 sm:gap-5 lg:gap-6">
            {images.map((item, i) => (
              <button
                type="button"
                key={item.Id || i}
                onClick={() => openModal(i)}
                aria-label="Open match moment"
                className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-[3px] ring-[#F2A23A] transition-transform hover:scale-105 sm:h-24 sm:w-24 lg:h-28 lg:w-28"
              >
                <img
                  src={item.Image_URL__c}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {showModal && currentIndex !== null && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute -top-12 right-0 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black"
              aria-label="Close"
            >
              ✕
            </button>

            {currentIndex > 0 && (
              <button
                type="button"
                className="absolute -left-4 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-black sm:-left-16 sm:h-14 sm:w-14"
                onClick={() => setCurrentIndex((prev) => prev - 1)}
                aria-label="Previous"
              >
                ◀
              </button>
            )}

            {currentIndex < images.length - 1 && (
              <button
                type="button"
                className="absolute -right-4 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-black sm:-right-16 sm:h-14 sm:w-14"
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                aria-label="Next"
              >
                ▶
              </button>
            )}

            <img
              src={images[currentIndex]?.img}
              alt=""
              className="h-auto max-h-[85vh] w-full rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
