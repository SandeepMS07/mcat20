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
    <div className="flex items-center justify-between px-4 py-4 bg-[#0B1220]">
      {/* Rows-per-page selector */}
      <div className="flex items-center gap-2">
        <span className="md:text-sm text-xs text-white font-normal">Per page:</span>
        <select
          value={rowsPerPage}
          onChange={handleRowsPerPage}
          className="px-2 py-1 border rounded bg-[#0B1220] md:text-sm text-xs"
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
      <div className="flex items-center gap-2 md:text-sm text-xs">
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
  );
}
