// components/PaginationControls.jsx
import React from "react";

export default function PaginationControls({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [15, 30, 50],
}) {
  const totalPages = Math.ceil(count / rowsPerPage);

  const handlePrev = () => onPageChange(Math.max(page - 1, 0));
  const handleNext = () => onPageChange(Math.min(page + 1, totalPages - 1));
  const handleRowsPerPage = (e) => {
    onRowsPerPageChange(parseInt(e.target.value, 10));
    onPageChange(0);
  };

  const start = page * rowsPerPage + 1;
  const end = Math.min((page + 1) * rowsPerPage, count);

  return (
    <div className="relative py-4">
  
      { /* Background gradient */}
      <div
        className="bg-[#001B31] w-[99%] border-r-[50px] top-2 border-[#F15A22] h-10 z-10 absolute"
        style={{
          clipPath: "polygon(0% 0%, 100% 0%, 98% 100%, 0% 100%)",
        }}
      ></div>

      {/* Foreground content */}
      <div
        className="relative z-50 w-[99%] flex flex-col md:flex-row justify-between items-center gap-4  md:gap-2 bg-[#001B31] md:bg-[#999FA4] italic md:custom-heading-border p-4 -mt-5 md:clip-path-[polygon(0%_0%,_100%_0%,_97%_100%,_0%_100%)] "
        // style={{
        //   clipPath: "polygon(0% 0%, 100% 0%, 97% 100%, 0% 100%)",
        // }}
      >   
       <div>
        <span className="md:text-sm text-xs text-white font-normal">Per page:</span>
        <select
          value={rowsPerPage}
          onChange={handleRowsPerPage}
          className="px-2 py-1 border rounded bg-[#0B1220] md:text-sm text-xs ml-4"
        >
          {rowsPerPageOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        </div>

        {/* Page info */}
      <div className="md:text-sm text-xs text-white ">
        {start} – {end} of {count}
      </div>

      {/* Prev / Next */}
      <div className="flex items-center gap-2 md:text-sm text-xs md:mr-[3rem]">
        <button
          onClick={handlePrev}
          disabled={page === 0}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <button
          onClick={handleNext}
          disabled={page >= totalPages - 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      </div>

      
    </div>
  );
}
