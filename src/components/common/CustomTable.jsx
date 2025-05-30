import React from "react";
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
}) => {
  return (
    <div className="w-full overflow-auto">
      <table className="w-full table-auto  border-collapse text-sm relative min-w-[1450px]">
        <div
          className="bg-[#001B31] w-[100%] border-r-[50px] top-2 border-[#F15A22] h-10 z-10 absolute"
          style={{
            clipPath: "polygon(0% 0%, 100% 0%, 97.8% 100%, 0% 100%)",
          }}
        ></div>
        <thead
          className="bg-[#999FA4] m-1 italic z-50 relative mb-4 mr-2 custom-heading-border"
          style={{
            clipPath: "polygon(0% 0%, 100% 0%, 97% 100%, 0% 100%)",
          }}
        >
          <tr
            className="grid pr-[2rem]"
            style={{
              gridTemplateColumns: `1fr 2fr repeat(${headers.length - 2}, 1fr)`,
            }}
          >
            {headers.map((header, index) => (
              <th
                key={index}
                className={`
          ${index === 1 ? "pr-[2rem]" : ""}
          ${index === headers.length - 1 ? "pr-[13px]" : ""}
          py-4 pl-[2rem] text-left font-bold text-transparent bg-clip-text`}
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, #666666 20.89%, #FFFFFF 48.4%, #666666 80.91%)",
                  WebkitBackgroundClip: "text", // explicitly set for cross-browser support
                  WebkitTextFillColor: "transparent", // required for Safari
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="relative">
              <td colSpan={headers.length} className="relative p-0">
                {/* Decorative layer */}
                <div
                  className="absolute w-[99.8%] h-10 z-10 mt-4 border-r-[50px] border-[#F15A22]"
                  style={{
                    clipPath: "polygon(0% 0%, 100% 0%, 98.2% 100%, 0% 100%)",
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
                  className="relative z-20 bg-[#999FA4] px-4 md:px-10 w-[98%] custom-border-bg left-6 mt-2"
                  style={{
                    clipPath: "polygon(3% 0%, 100% 0%, 97.5% 100%, 0% 100%)",
                  }}
                >
                  <div
                    className="grid"
                    style={{
                      gridTemplateColumns: `2fr repeat(${
                        headers.length - 2
                      }, 1fr)`, // 2fr for the second column, 1fr for others
                    }}
                  >
                    {headers.slice(1).map((header, colIndex) => (
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
