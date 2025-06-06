"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import TitleComponent from "../common/TitleComponent";
import Link from "next/link";
import routes from "@/utilis/route";
import images from "../../app/gallery/images";

const Gallery = () => {
  const validItems = Array.isArray(images) && images.length > 0 ?images.slice(0, 8): [];

  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);

  const [layoutConfig, setLayoutConfig] = useState([
    [2, 2, 2, 1],
    [1, 2, 2,2],
  ]);

  // Function to determine layout based on screen size
  const updateLayout = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) {
        // Mobile layout - single column with all 11 images
        setLayoutConfig([[7], [7], [7]]);
      } else if (window.innerWidth < 1024) {
        // Tablet layout - simplified grid with all 11 images
        setLayoutConfig([
          [3, 4], // 2 images
          [4, 3], // 2 images
          [3, 4], // 2 images
        ]);
      } else {
        // Desktop layout - original complex grid
        setLayoutConfig([
          [1, 2, 2,2],
          [1, 2, 1,3],
        ]);
      }
    }
  };

  // Set up resize listener with SSR safety check
  useEffect(() => {
    updateLayout();

    // Add resize listener only on client side
    if (typeof window !== "undefined") {
      window.addEventListener("resize", updateLayout);
      return () => window.removeEventListener("resize", updateLayout);
    }
  }, []);

  // If no valid items, return early
  if (validItems.length === 0) {
    return <div className="w-full p-3">No media items available</div>;
  }

  let renderedIndex = 0;

  const renderMediaGrid = (items) => {
    // If no valid items, return early
    const validItems = Array.isArray(items) && items.length > 0 ? items : [];

    if (validItems.length === 0) {
      return <div className="w-full p-3">No media items available</div>;
    }

    let renderedIndex = 0;

    return (
      <div className="w-full flex flex-col gap-3 p-3">
        {layoutConfig.map((row, rowIndex) => {
          // Stop rendering if we've shown all items
          if (renderedIndex >= validItems.length) {
            return null;
          }

          return (
            <div key={rowIndex} className="h-[300px] w-full">
              <div className="grid w-full h-full grid-cols-7 gap-2 md:gap-3 lg:gap-4">
                {row.map((span, colIndex) => {
                  // Stop rendering if we've shown all items
                  if (renderedIndex >= validItems.length) return null;
                  const item = validItems[renderedIndex];
                  const indexForModal = renderedIndex++;
                  if (!item?.img) return null;

                  return (
                    <div
                      key={colIndex}
                      className={`relative col-span-${span} overflow-hidden bg-white/30`}
                      onClick={() => {
                        setCurrentIndex(indexForModal);
                        setShowModal(true);
                      }}
                    >
                      <Image
                        src={item.img}
                        alt={item.title || "Gallery image"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 95vw, (max-width: 1024px) 45vw, 33vw"
                      />

                      {item.type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Image
                            src="/images/home/whyT2C/vidLogo.svg"
                            width={100}
                            height={100}
                            className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16"
                            alt="Video"
                          />
                        </div>
                      )}

                      {item.views && item.type === "image" && (
                        <div className="absolute top-2 right-2">
                          <Image
                            src="/images/home/whyT2C/imgIcon.svg"
                            width={100}
                            height={100}
                            alt="Image"
                            className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8"
                          />
                        </div>
                      )}

                      {item.type === "coming-soon" && (
                        <div className="absolute top-2 left-2 bg-white text-black text-xs px-2 py-1 rounded font-semibold">
                          COMING SOON
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-[url('/images/home/latestUpdateBg.png')] bg-cover bg-center bg-no-repeat py-20">
      <div className="section-width">
        <TitleComponent
          orange
          title={"Gallery"}
          button
          buttonLink={routes.gallery}
          buttonText="View Gallery"
          hideButtonOnMobile={true}
        />
      </div>

      <div className="flex flex-col gap-6 section-width">
        <div className="w-full bg-black">
          <div className="w-full flex flex-col gap-3 p-3">
            {layoutConfig.map((row, rowIndex) => {
              // Stop rendering if we've shown all items
              if (renderedIndex >= validItems.length) {
                return null;
              }

              return (
                <div key={rowIndex} className="h-[250px] w-full">
                  <div className="grid w-full h-full grid-cols-7 gap-2 md:gap-3 lg:gap-4">
                    {row.map((span, colIndex) => {
                      // Stop rendering if we've shown all items
                      if (renderedIndex >= validItems.length) return null;
                      const item = validItems[renderedIndex];
                      const indexForModal = renderedIndex++;
                      if (!item?.img) return null;

                      return (
                        <div
                          key={colIndex}
                          className={`relative col-span-${span} overflow-hidden bg-white/30`}
                          onClick={() => {
                            setCurrentIndex(indexForModal);
                            setShowModal(true);
                          }}
                        >
                          <Image
                            src={item.img}
                            alt={item.title || "Gallery image"}
                            fill
                            className="object-cover "
                            sizes="(max-width: 640px) 95vw, (max-width: 1024px) 45vw, 33vw"
                          />

                          {item.type === "video" && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Image
                                src="/images/home/whyT2C/vidLogo.svg"
                                width={100}
                                height={100}
                                className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16"
                                alt="Video"
                              />
                            </div>
                          )}

                          {item.views && item.type === "image" && (
                            <div className="absolute top-2 right-2">
                              <Image
                                src="/images/home/whyT2C/imgIcon.svg"
                                width={100}
                                height={100}
                                alt="Image"
                                className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8"
                              />
                            </div>
                          )}

                          {item.type === "coming-soon" && (
                            <div className="absolute top-2 left-2 bg-white text-black text-xs px-2 py-1 rounded font-semibold">
                              COMING SOON
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {showModal && (
              <div
                className="fixed inset-0 z-[9999] bg-black bg-opacity-80 flex items-center justify-center p-4"
                onClick={() => setShowModal(false)}
              >
                <div
                  className="relative max-w-4xl w-full max-h-[90vh]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setShowModal(false)}
                    className="absolute -top-5 -right-5 bg-white text-black p-3 py-2 rounded-full text-sm z-50 font-bold"
                  >
                    ✕
                  </button>

                  {currentIndex > 0 && (
                    <button
                      className="absolute -left-20 top-1/2 transform -translate-y-1/2 bg-[#ffffff80] hover:bg-white text-black flex justify-center items-center rounded-full z-50 w-14 h-14"
                      onClick={() => setCurrentIndex((prev) => prev - 1)}
                    >
                      ◀
                    </button>
                  )}

                  {currentIndex < validItems.length - 1 && (
                    <button
                      className="absolute -right-20 top-1/2 transform -translate-y-1/2 bg-[#ffffff80] hover:bg-white text-black flex justify-center items-center rounded-full z-50 w-14 h-14"
                      onClick={() => setCurrentIndex((prev) => prev + 1)}
                    >
                      ▶
                    </button>
                  )}

                  <Image
                    src={validItems[currentIndex]?.img}
                    alt="popup"
                    width={1000}
                    height={800}
                    className="w-full h-auto object-contain rounded"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile button - show only on mobile, hide on larger screens */}
        <Link
          href={routes.gallery || "#"}
          className="md:hidden flex items-center btn-primary gap-2 w-fit mx-auto mt-6"
          // style={{
          //   background: "radial-gradient(43.3% 61.24% at 50% 50%, #FFF200 0%, #FFF200 26%, #FBB040 97%)",
          //   WebkitBackgroundClip: "text",
          //   WebkitTextFillColor: "transparent",
          //   backgroundClip: "text",
          //   color: "transparent",
          // }}
        >
          View Gallery
          <Image
            src="/images/home/hero/buttonIcon.svg"
            alt="button-icon"
            width={24}
            height={24}
            className="w-5 h-5"
          />
        </Link>
      </div>
    </div>
  );
};

export default Gallery;
