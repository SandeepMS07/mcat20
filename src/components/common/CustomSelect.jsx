"use client";

import { useEffect, useRef, useState } from "react";

const Chevron = ({ className = "h-3.5 w-3.5", open = false }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    className={`transition-transform ${open ? "rotate-180" : ""} ${className}`}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const CustomSelect = ({
  label,
  value,
  options,
  onChange,
  formatOption,
  className = "",
  triggerClassName = "",
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const display = formatOption ? formatOption(value) : value;

  return (
    <div className={`relative flex flex-col gap-1 ${className}`} ref={ref}>
      {label && (
        <span className="px-1 text-[9px] font-bold uppercase tracking-wider text-white/55">
          {label}
        </span>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-2 rounded-lg border bg-[#192A66] px-3 py-2 text-xs font-bold uppercase text-white outline-none transition sm:text-sm ${
          open
            ? "border-[#FFE150]/60"
            : "border-white/15 hover:border-white/30"
        } ${triggerClassName}`}
      >
        <span className="truncate">{display}</span>
        <Chevron open={open} />
      </button>
      {open && (
        <ul
          role="listbox"
          className="scrollbar-hide absolute left-0 right-0 top-full z-30 mt-1.5 max-h-56 overflow-y-auto rounded-lg border border-white/15 bg-[#0E1A47] py-1 text-xs font-bold uppercase text-white shadow-[0_12px_30px_rgba(0,0,0,0.45)] backdrop-blur-md sm:text-sm"
        >
          {options.map((opt) => {
            const optKey = typeof opt === "object" ? opt.value : opt;
            const optLabel = typeof opt === "object" ? opt.label : opt;
            const isActive = optKey === value;
            return (
              <li
                key={optKey}
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  onChange(optKey);
                  setOpen(false);
                }}
                className={`flex cursor-pointer items-center justify-between px-3 py-2 transition-colors ${
                  isActive
                    ? "bg-[#F68323]/15 text-[#FFE150]"
                    : "hover:bg-white/5"
                }`}
              >
                <span className="truncate">
                  {formatOption ? formatOption(optKey) : optLabel}
                </span>
                {isActive && (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                    className="h-3.5 w-3.5 shrink-0 text-[#FFE150]"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
