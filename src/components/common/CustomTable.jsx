"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";
import "./style.css";

const CustomTable = ({
  headers,
  data,
  rowKeys,
  customRenderers,
  headerStyles = {},
  rowStyles = {},
  tBodyStyles = {},
  isHomeTable = false,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  // Header mapping for home table
  const homeTableHeaders = {
    0: "R",      // Rank
    1: "Teams",  // Team name
    2: "M",      // Matches
    3: "W",      // Wins
    4: "L",      // Losses
    5: "NRR",      // Points
    // Add more mappings as needed
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredHeaders = headers.filter((_, index) => {
    if (isHomeTable && isMobile && (index === 5 || index === 6)) return false;
    return true;
  });

  // Function to get display header name - UPDATED TO CHECK FOR MOBILE
  const getDisplayHeader = (header, index) => {
    if (isHomeTable && isMobile && homeTableHeaders[index]) {
      return homeTableHeaders[index];
    }
    return header;
  };

  return (
    <div className="w-full overflow-auto">
      <table className={`w-full table-auto  border-collapse text-sm relative min-w-[450px]
         ${isHomeTable && isMobile ?  "  min-w-[450px]":" min-w-[800px]" }`
      }>
        <div
          className={`bg-[#001B31]   border-r-[50px]  top-3 md:top-3 border-[#F15A22] h-10   z-10 absolute
                                ${isHomeTable && isMobile ?  " w-full":"w-[99.8%]" }
`}
          style={{
            clipPath: "polygon(0% 0%, 100% 0%, 97.8% 100%, 0% 100%)",
          }}
        ></div>
        <div
          className={`bg-[#999FA4] m-1 italic z-50 relative mb-4 mr-2 custom-heading-border
                                            ${isHomeTable && isMobile ?  " w-[98%]":"w-[99.4%]"}`

          }
          style={{
            clipPath: "polygon(0% 0%, 100% 0%, 97% 100%, 0% 100%)",
            overflow: "hidden", // Ensure clipping
          }}
        >
          <div className="w-full relative">
            <tr
              className={`grid w-full
                  ${isHomeTable && isMobile ?  " pr-0":"pr-[2rem]"}
                `}
              style={{
                gridTemplateColumns: isMobile
                  ? `repeat(${filteredHeaders.length}, .3fr)`
                  : `1fr 2fr repeat(${filteredHeaders.length - 2}, 1fr)`,
              }}
            >
              {filteredHeaders.map((header, index) => (
                <th
                  key={index}
                  className={`
                     ${isHomeTable && isMobile ?  "text-center ":"text-left pl-[2rem]" }
      ${(!isHomeTable && !isMobile && index === 1 || !isHomeTable) ? "pr-[2rem] " : ""}
      ${index === filteredHeaders.length - 1 ? "pr-[13px]" : ""}
      py-4  font-bold text-transparent bg-clip-text
    `}
                  style={{
                    backgroundImage:
                      "linear-gradient(180deg, #666666 20.89%, #FFFFFF 48.4%, #666666 80.91%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {getDisplayHeader(header, index)}
                </th>
              ))}
            </tr>
          </div>
        </div>

        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="relative pr-[2rem]">
              <td colSpan={filteredHeaders.length} className="relative p-0">
                {/* Decorative layer */}
                <div
                  className={`absolute  xl:w-[99%] h-10 z-10 mt-4 border-r-[60px] border-[#F15A22] 
                    ${isHomeTable && isMobile ?  " w-full":"w-[100%]" }`}
                  style={{
                    clipPath: "polygon(0% 0%, 100% 0%, 97% 100%, 0% 100%)",
                    background:
                      "linear-gradient(to right, rgba(224, 126, 39, 0.2) 60%, rgba(255, 255, 255, 0.2) 71%, rgba(224, 126, 39, 0.2) 100%)",
                  }}
                >
                  <div className="flex z-50 pl-2 items-center relative h-full">
                    <span className="text-white font-medium ">
                      {customRenderers?.[headers[0]]
                        ? customRenderers[headers[0]](row[headers[0]], row)
                        : row[headers[0]]}
                    </span>
                  </div>
                  <div className="custom-yellow-border"></div>
                  <div className="custom-black-gradient"></div>
                </div>

                {/* Main background container */}
                <div
                  className={`relative z-20 bg-[#999FA4] px-4 md:px-10  custom-border-bg left-6 mt-2 
                     ${isHomeTable && isMobile ?  " w-[94%]":"w-[97%]" }
                    `}
                  style={{
                    clipPath: "polygon(3% 0%, 100% 0%, 96% 100%, 0% 100%)",
                  }}
                >
                  <div
                    className="grid"
                    style={{
                      gridTemplateColumns:
                        isMobile && isHomeTable
                          ? `repeat(${filteredHeaders.length - 1}, .3fr)`
                          : `2fr repeat(${filteredHeaders.length - 2}, 1fr)`,
                    }}
                  >
                    {filteredHeaders.slice(1).map((header, colIndex) => (
                      <div
                        key={colIndex}
                        className={`p-4 text-center whitespace-nowrap border-[#222222] ${
                          colIndex !== headers.length - 2 ? "border-r" : ""
                        }`}
                      >
                        {customRenderers?.[header]
                          ? customRenderers[header](row[header], row)
                          : row[header]}
                      </div>
                    ))}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;