import { truncateTextSpells } from "@/utilis/helper";

const SEASON_LABEL = "T20 ML Season 4";

const formatNewsDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const UpdatesCard = ({ data, onClick }) => {
  const imageSrc =
    data?.Order__c === 14
      ? "/images/latestUpdates/update14-main.jpg"
      : data?.Image_URL__c;

  return (
    <div
      className="group relative h-[420px] w-full cursor-pointer overflow-hidden rounded-2xl bg-[#143083] shadow-[0_10px_24px_rgba(20,48,131,0.18)] transition-transform hover:-translate-y-0.5"
      onClick={onClick}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          width={1000}
          height={1000}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          alt={data?.Title__c || "update image"}
        />
      ) : (
        <div className="absolute inset-0 bg-[#0F2A8C]" />
      )}

      <div className="absolute h-60 w-full bottom-0  left-0 bg-gradient-to-t from-[#143083] to-transparent" />

      <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col gap-3 px-5 pb-5 text-white">
        {/* <span className="inline-flex w-fit items-center rounded-full bg-[#EEF2FF] px-3 py-1 text-[10px] font-semibold text-[#1F3B90]">
          {SEASON_LABEL}
        </span> */}
        <div className="text-sm font-bold leading-tight sm:text-base">
          {truncateTextSpells(data?.Title__c, 58)}
        </div>
        <p className="text-[10px] font-medium text-white/85">
          Mumbai, {formatNewsDate(data?.Date__c)}
        </p>
      </div>
    </div>
  );
};

export default UpdatesCard;
