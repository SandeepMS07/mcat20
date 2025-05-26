import React from "react";
import Image from "next/image";

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
      <table className="w-full table-auto bg-black border-collapse text-sm">
        <thead className="text-black">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className={`py-4 px-4 text-left  ${
                  headerStyles?.className || ""
                  // headerStyles[header]?.className || "bg-[#2B0F04]"
                }`}
                style={headerStyles[header]?.style || {}}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className={`${tBodyStyles?.className|| ""} text-[#D8D8D8]`}>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className={`${rowStyles.className||""}border-b border-[#222222]`}>
              {/* {rowKeys.map((key, colIndex) => (
                  <td
                    key={colIndex}
                    className="py-2 px-4 border-r text-center border-[#222222]"
                  >
                    {customRenderers?.[key]
                      ? customRenderers[key](row[key], row)
                      : row[key]}
                  </td>
                ))} */}
              {headers.map((header, colIndex) => {
                const updatedHeader = header;

                return (
                  <td
                    key={colIndex}
                    className="p-4 border-r text-center border-[#222222]"
                  >
                    {customRenderers?.[header]
                      ? customRenderers[header](row[header], row)
                      : row[header]}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
