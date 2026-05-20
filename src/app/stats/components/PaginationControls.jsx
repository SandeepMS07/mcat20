import React from "react";

const ChevronLeft = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRight = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

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
    <div className="flex items-center justify-between gap-2 rounded-full border border-white/10 bg-[#0E1A47]/70 px-2 py-1.5 text-white backdrop-blur-sm">
      {/* Per page select — compact pill */}
      <div className="relative">
        <select
          value={rowsPerPage}
          onChange={handleRowsPerPage}
          aria-label="Rows per page"
          className="appearance-none rounded-full bg-[#192A66] py-1.5 pl-3 pr-7 text-[11px] font-bold text-white outline-none transition focus:bg-[#1F3895] sm:text-xs"
        >
          {rowsPerPageOptions.map((opt) => (
            <option key={opt} value={opt} className="text-black">
              {opt} / page
            </option>
          ))}
        </select>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-white/70"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {/* Range info */}
      <div className="flex items-baseline gap-1.5 text-[11px] sm:text-xs">
        <span className="font-bold text-white">{start}</span>
        <span className="text-white/55">–</span>
        <span className="font-bold text-white">{end}</span>
        <span className="text-white/55">of</span>
        <span className="font-bold text-[#FFE150]">{count}</span>
      </div>

      {/* Prev / page / Next — joined pill */}
      <div className="flex items-center gap-0.5 rounded-full bg-[#192A66] p-0.5">
        <button
          type="button"
          onClick={handlePrev}
          disabled={page === 0}
          aria-label="Previous page"
          className="flex h-7 w-7 items-center justify-center rounded-full text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <span className="min-w-[42px] px-1 text-center text-[11px] font-bold tabular-nums text-white sm:text-xs">
          {page + 1}
          <span className="text-white/40">/{totalPages}</span>
        </span>
        <button
          type="button"
          onClick={handleNext}
          disabled={page >= totalPages - 1}
          aria-label="Next page"
          className="flex h-7 w-7 items-center justify-center rounded-full text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
