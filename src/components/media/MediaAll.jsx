import { useState, useEffect } from "react";
import Image from "next/image";
import { FaP } from "react-icons/fa6";

const matches = {
  "Match 23": "Finals: MSC MR vs SMF",
  "Match 22": "Semi Finals 2: SMF vs BB",
  "Match 21": "Semi Finals 1: ETS vs MSC MR",
  "Match 20": "NMP vs AT MWS",
  "Match 19": "NMP vs TK MNE",
  "Match 18": "ETS vs AA",
  "Match 17": "MSC MR vs BB",
  "Match 16": "SMF vs ETS",
  "Match 15": "MSC MR vs AA",
  "Match 14": "NMP vs AT MWS",
  "Match 13": "TK MNE vs BB",
  "Match 12": "AA vs NMP",
  "Match 11": "ETS vs MSC MR",
  "Match 10": "SMF vs TK MNE",
  "Match 9": "AT MWS vs BB",
  "Match 8": "TK MNE vs MSC MR",
  "Match 7": "SMF vs NMP",
  "Match 6": "BB vs ETS",
  "Match 5": "AA vs AT MWS",
  "Match 4": "BB vs NMP",
  "Match 3": "ETS vs TK MNE",
  "Match 2": "AT MWS vs MSC MR",
  "Match 1": "AA vs SMF",
};

// Function to get the match details
const getMatchDetails = (key) => {
  // Find the key that starts with 'Match' and matches the passed key
  const matchKey = Object.keys(matches).find((matchKey) =>
    matchKey.startsWith(key)
  );

  // Return the match details or a default message if not found
  return matchKey ? matches[matchKey] : "";
};

const MediaAll = ({ items, type, selectedFolder, setSelectedFolder }) => {
  const isImageType = type === "image";
  const isVideoType = type === "video";

  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  // const [selectedFolder, setSelectedFolder] = useState(null);
  const [layoutConfig, setLayoutConfig] = useState([]);

  const folderKeys =
    isImageType && items && typeof items === "object" ? Object.keys(items) : [];

  const validItems = isVideoType
    ? Array.isArray(items) && items.length > 0
      ? items
      : []
    : selectedFolder
    ? items?.[selectedFolder] ?? []
    : [];

  const generateDesktopLayout = (items) => {
    const unitsPerRow = 7;
    const layout = [];
    const remaining = [...items];

    const getRandomUnit = () => Math.floor(Math.random() * 3) + 1;

    while (remaining.length > 0) {
      let row = [];
      let total = 0;
      const tempRow = [];

      let i = 0;
      while (i < remaining.length && total < unitsPerRow) {
        const unit = getRandomUnit();

        if (total + unit <= unitsPerRow) {
          tempRow.push(unit);
          total += unit;
        }

        i++;

        if (total === unitsPerRow) {
          row = [...tempRow];
          layout.push(row);
          remaining.splice(0, tempRow.length);
          break;
        }
      }

      // If we failed to build a full row and have more than 1 item left, retry
      if (total < unitsPerRow) {
        if (remaining.length > tempRow.length) {
          // More items are available but couldn't form a valid row; try again
          continue;
        }

        // Final leftover row logic
        const left = remaining.length;

        if (left === 1 && layout.length > 0) {
          layout[layout.length - 1].push(2); // Add 1 image to previous row
          remaining.splice(0, 1);
        } else {
          const partialRow = new Array(left).fill(2); // Last row as partial
          layout.push(partialRow);
          remaining.splice(0, left);
        }

        break;
      }
    }

    return layout;
  };

  const generateTabletLayout = (items) => {
    const layout = [];
    const rowsNeeded = Math.ceil(items.length / 2);
    for (let i = 0; i < rowsNeeded; i++) {
      layout.push(i % 2 === 0 ? [4, 3] : [3, 4]);
    }
    return layout;
  };

  const generateMobileLayout = (items) => {
    return Array(items.length).fill([7]);
  };

  // Dynamic layout calculation for images
  const updateLayout = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) {
        setLayoutConfig(generateMobileLayout(validItems));
      } else if (window.innerWidth < 1024) {
        setLayoutConfig(generateTabletLayout(validItems));
      } else {
        if (isVideoType) {
          setLayoutConfig(generateVideoLayout(validItems)); // <== guaranteed all render for videos
        } else {
          setLayoutConfig(generateDesktopLayout(validItems)); // <== can remain dynamic for images
        }
      }
    }
  };

  // Video Layout
  const generateVideoLayout = (items) => {
    const patterns = [
      [3, 2, 2],
      [2, 3, 2],
      [2, 2, 3],
    ];

    const layout = [];
    let i = 0;
    let patternIndex = 0;

    while (i < items.length) {
      const pattern = patterns[patternIndex % patterns.length];
      const remaining = items.length - i;

      // Trim pattern if not enough items left
      const row = pattern.slice(0, remaining);
      layout.push(row);

      i += row.length;
      patternIndex++;
    }

    return layout;
  };

  // Reset selected folder when type changes
  useEffect(() => {
    if (type === "image") {
      setSelectedFolder(null);
    }
  }, [type]);

  // Set up resize listener
  useEffect(() => {
    updateLayout();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", updateLayout);
      return () => window.removeEventListener("resize", updateLayout);
    }
  }, [selectedFolder, items]);

  if (isVideoType && validItems.length === 0) {
    return <div className="w-full p-3">No media items available</div>;
  }

  let renderedIndex = 0;

  return (
    <div className="w-full flex flex-col gap-3 p-3">
      {/* Folder structure for images */}
      {isImageType && !selectedFolder && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {folderKeys.map((key) => {
            const images = items[key];
            const firstImage =
              images?.[0]?.Tag__c == "Event"
                ? "/images/gallery/auction.png"
                : images?.[0]?.Image_URL__c;

            const matchName = getMatchDetails(key);
            return (
              <div
                key={key}
                className="relative cursor-pointer bg-[#1A2447]/40 rounded-md shadow overflow-hidden border border-[#3A4878] "
                onClick={() => setSelectedFolder(key)}
              >
                <div className="absolute top-0 right-0 text-md text-[#E07E27]  bg-[#1A2447] px-2 py-1 rounded-bl-md rounded-tr-md  font-semibold z-20">
                  {images?.length}
                </div>
                {firstImage && (
                  <div className="relative w-full h-60">
                    <img
                      src={firstImage}
                      alt={images?.[0]?.title || "Folder Preview"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-3 text-center font-semibold text-white">
                  {key === "Match 23" ||
                  key === "Match 22" ||
                  key === "Match 21"
                    ? ""
                    : `${key} :`}{" "}
                  {matchName !== "" && `${matchName}`}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Grid layout (images after folder selected OR videos) */}
      {(isVideoType || (isImageType && selectedFolder)) &&
        layoutConfig.map((row, rowIndex) => {
          if (renderedIndex >= validItems.length) {
            return null;
          }

          return (
            <div key={rowIndex} className="h-[250px] w-full">
              <div className="grid w-full h-full grid-cols-7 gap-2 md:gap-3 lg:gap-4">
                {row.map((span, colIndex) => {
                  if (renderedIndex >= validItems.length) return null;
                  const item = validItems[renderedIndex];
                  const indexForModal = renderedIndex++;
                  if (isImageType && !item?.Image_URL__c) return null;
                  if (isVideoType && !item?.img) return null;

                  return (
                    <div
                      key={colIndex}
                      className={`relative col-span-${span} overflow-hidden bg-white/30`}
                      onClick={() => {
                        setCurrentIndex(indexForModal);
                        setShowModal(true);
                      }}
                    >
                      <img
                        src={item.img || ""}
                        alt={item.title || "Gallery image"}
                        className="w-full h-full object-cover"
                        sizes="(max-width: 640px) 95vw, (max-width: 1024px) 45vw, 33vw"
                      />

                      {item.type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <img
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
                          <img
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

      {/* Tailwind-safe classes for dynamic col-span */}
      <div className="hidden col-span-1 col-span-2 col-span-3 col-span-4 col-span-5 col-span-6 col-span-7" />
      {/* Modal preview */}
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

            {validItems[currentIndex]?.type === "video" ? (
              <iframe
                width="100%"
                height="500"
                src={`https://www.youtube.com/embed/${
                  validItems[currentIndex]?.videoUrl?.split("youtu.be/")[1]
                }`}
                title={validItems[currentIndex]?.title || "Video Preview"}
                allowFullScreen
                className="rounded w-full max-h-[80vh]"
              />
            ) : (
              <img
                src={validItems[currentIndex]?.img}
                alt="popup"
                width={1000}
                height={800}
                className="w-full h-auto object-contain rounded"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaAll;
