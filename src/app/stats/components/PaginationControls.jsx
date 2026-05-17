import React from "react";

export default function PaginationControls({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [15, 30, 50],
}) {
  const totalPages = Math.max(1, Math.ceil(count / rowsPerPage));

  const handlePrev = () => onPageChange(Math.max(page - 1, 0));
  const handleNext = () => onPageChange(Math.min(page + 1, totalPages - 1));
  const handleRowsPerPage = (e) => {
    onRowsPerPageChange(parseInt(e.target.value, 10));
    onPageChange(0);
  };

  const start = count === 0 ? 0 : page * rowsPerPage + 1;
  const end = Math.min((page + 1) * rowsPerPage, count);

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-[#192A66] px-4 py-3 text-sm text-white md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <span className="text-white/70">Per page:</span>
        <select
          value={rowsPerPage}
          onChange={handleRowsPerPage}
          className="rounded-lg border border-white/20 bg-[#314A98] px-3 py-1 text-white outline-none"
        >
          {rowsPerPageOptions.map((opt) => (
            <option key={opt} value={opt} className="text-black">
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div className="text-white/80">
        {start} – {end} of {count}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handlePrev}
          disabled={page === 0}
          className="rounded-lg border border-white/20 px-4 py-1 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={page >= totalPages - 1}
          className="rounded-lg border border-white/20 px-4 py-1 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
