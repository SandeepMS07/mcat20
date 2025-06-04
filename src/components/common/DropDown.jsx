import Image from "next/image";

export const DropDown = ({
  label,
  options,
  value,
  onChange,
  bg = "white",
  labelVisible = true,
}) => (
  <div className="flex flex-col md:flex-row items-center gap-2  relative w-full mr-2">
    <label
      className={`xl:text-sm text-xs font-semibold uppercase text-white mb-1  flex-shrink-0 ${
        labelVisible ? "" : "hidden"
      }`}
    >
      {label}
    </label>
    <div className="relative w-[90%]">
      <select
        value={value}
        onChange={onChange}
        className={`
          appearance-none
           bg-${bg} text-[white] px-4 py-2  border border-[#E07E27] xl:text-base text-sm rounded xl:w-40 mr-2 w-full`}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt.replace(/_/g, " ")}
          </option>
        ))}
      </select>

      {/* Custom Down Arrow SVG */}
      <div
        className={`pointer-events-none absolute top-1/2 right-6 transform -translate-y-1/2 text-white ${
          bg === "[#E07E27]" ? "" : "text-[#E07E27]"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  </div>
);
