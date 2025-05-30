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
          ${bg === "[#E07E27]" ? "" : "appearance-none"}
           bg-${bg} text-[white] px-4 py-2  border border-[#E07E27] xl:text-base text-sm rounded xl:w-40 mr-2 w-full`}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt.replace(/_/g, " ")}
          </option>
        ))}
      </select>
      {/* <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center ">
        <Image
          src="/images/standings/dropdown.svg"
          width={10}
          height={10}
          alt="Dropdown Icon"
        />
      </div> */}
    </div>
  </div>
);
