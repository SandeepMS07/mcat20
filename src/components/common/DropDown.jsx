import Image from "next/image";


export const DropDown = ({ label, options, value, onChange, bg = "white" }) => (
  <div className="flex flex-col md:flex-row md:items-center gap-2   relative">
    <label className="xl:text-sm text-xs font-semibold uppercase text-[#6A6A6A] mb-1  flex-shrink-0">
      {label}
    </label>
    <div className="relative w-full">
      <select
        value={value}
        onChange={onChange}
        className={`appearance-none bg-${bg} text-[#E07E27] px-4 py-2  border border-[#E07E27] xl:text-base text-sm rounded xl:w-40 w-32 `}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt.replace(/_/g, " ")}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <Image
          src="/images/standings/dropdown.svg"
          width={10}
          height={10}
          alt="Dropdown Icon"
        />
      </div>
    </div>
  </div>
);