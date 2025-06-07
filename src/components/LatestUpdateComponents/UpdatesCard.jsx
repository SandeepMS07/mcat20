import Image from "next/image";
import { truncateTextSpells } from "@/utilis/helper";

const UpdatesCard = ({ data, onClick }) => {
  return (
    <div
      className="w-full h-[370px] rounded-md relative overflow-hidden"
      onClick={onClick}
    >
      {/* Image */}
      <Image
        src={
          data.Order__c === 14
            ? "/images/latestUpdates/update14-main.jpg"
            : data?.Image_URL__c
        }
        width={1000}
        height={1000}
        className="w-full h-full object-cover absolute z-0 rounded-md"
        alt="img"
      />

      <div className="absolute inset-0 bg-black opacity-30 z-10 rounded-md" />

      {/* Content */}
      <div className="w-full h-full flex items-end p-5 z-20 text-white justify-between relative">
        <div className="w- flex flex-col justify-between">
          <p className="font-bold xl:text-xl lg:text-lg text-base">
            {truncateTextSpells(data?.Title__c, 50)}
          </p>
          {/* <p className="text-[#F6F9FF] text-base">
            {truncateTextSpells(data?.subTitle, 30)}
          </p> */}
        </div>
        {/* <div className="w-10 h-10 lg:w-12 lg:h-12 md:w-11 md:h-11 bg-[#D25F28E5] rounded-full flex items-center justify-center">
          <Image
            src={"/images/latestUpdates/arrow.svg"}
            width={10}
            height={10}
            className="w-3 h-3 lg:w-5 lg:h-5 md:h-4 md:w-4 sm:h-3 sm:w-3"
            alt="arrow"
          />
        </div> */}
      </div>
    </div>
  );
};

export default UpdatesCard;
