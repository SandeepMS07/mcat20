import TitleComponent from "@/components/common/TitleComponent";
import Image from "next/image";
import React from "react";
import "./style.css";

// To title case for player names
const toTitleCaseWithInitials = (str) => {
  if (!str) return "";

  const words = str.toLowerCase().split(" ").filter(Boolean);
  if (words.length === 0) return "";

  const firstName = words[0].charAt(0).toUpperCase() + words[0].slice(1);

  const initials = words
    .slice(1)
    .map((word, index, arr) => {
      const initial = word.charAt(0).toUpperCase();
      // Add dot only if it's NOT the last initial
      return index === arr.length - 1 ? initial : initial + ".";
    })
    .join(" ");

  return initials ? `${firstName} ${initials}` : firstName;
};

const MeetMyTeam = ({ data }) => {
  const PlayerRecords = data?.Player_Registrations__r.records || [];

  // Group based on the role
  const groupedByRole = {};

  PlayerRecords.forEach((player) => {
    const role = player.Primary_Role__c;
    const id = player.Id;
    const name = toTitleCaseWithInitials(player.Player__r?.Name) || "Unknown";
    const rawImg = player.Player__r?.Photo_URL_1__c;
    const img =
      rawImg && rawImg.trim() !== ""
        ? rawImg
        : "";

    const playerObj = {
      id,
      name,
      img,
      role,
    };

    if (!groupedByRole[role]) {
      groupedByRole[role] = [];
    }

    groupedByRole[role].push(playerObj);
  });

  console.log(groupedByRole);

  return (
    <div className="bg-white relative ">
      <img
        src="/images/elements/section-element.png"
        className="absolute right-0 top-0 md:block hidden"
        alt="element"
      />
      <img
        src="/images/elements/section-element.png"
        className="absolute left-0 bottom-0 rotate-180 md:block hidden"
        alt="element"
      />
      <div className="bg-white  pt-14 pb-10 section-width ">
        <TitleComponent title="Meet the Team" />
        <div className="w-full flex flex-col lg:flex-row justify-between">
          <div className=" w-full lg:w-[48%] flex flex-col gap-10 mt-6">
            <Table role="batsman" PlayerData={groupedByRole["Batsman"] || []} />
            <Table role="bowlers" PlayerData={groupedByRole["Bowler"] || []} />
          </div>
          <div className=" w-full  lg:w-[48%] flex flex-col gap-10 mt-6">
            <Table
              role="All Rounder"
              PlayerData={groupedByRole["All - rounder"] || []}
            />
            <Table
              role="Wicket Keeper"
              PlayerData={groupedByRole["Wicketkeeper"] || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Table = ({ role, PlayerData }) => {
  return (
    <div className=" overflow-hidden">
      <div className="relative ">
        {/* This div goes below (behind) the pink one */}
        <div
          className="bg-[#001B31] w-full border-r-[25px] top-1  border-[#F15A22] h-10 sm:h-12 right-1 z-10 absolute"
          style={{
            clipPath: "polygon(0% 0%, 100% 0%, 97.8% 100%, 0% 100%)",
          }}
        ></div>

        {/* This is the pink/red top div */}
        <div
          className="bg-[#001B31] z-50 relative mr-2"
          style={{
            clipPath: "polygon(0% 0%, 100% 0%, 97.5% 100%, 0% 100%)",
          }}
        >
          <h5
            className="px-6 py-3 font-bold mb-3 uppercase text-transparent bg-clip-text"
            style={{
              backgroundImage:
                "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
            }}
          >
            {role}
          </h5>
        </div>
      </div>

      <div className=" text-white  space-y-3">
        {(PlayerData || []).map((player, index) => (
          <div
            key={index}
            className="flex items-center justify-between  relative "
          >
            {/* Number in separate div */}
            <div className="flex z-50 pl-2   items-center">
              <span className=" text-white">{index + 1}.</span>
            </div>
            <div
              className="w-full border-r-[50px]  border-[#F15A22] h-10 z-20 absolute"
              style={{
                // backgroundColor: "#003967",
                clipPath: "polygon(0% 0%, 100% 0%, 97.7% 100%, 0% 100%)",
                background:
                  "linear-gradient(to right, #E07E27 60%, #FFFFFF 71%, #E07E27 100%)",
              }}
            >
              {/* Yellow border in separate div */}
              <div className="custom-yellow-border"></div>

              <div className="custom-black-gradient "></div>
            </div>
            {/* All other content in one div */}

            <div
              className="flex items-center justify-between bg-[#999FA4] border  z-50 px-10 py-2  relative w-[90%] custom-border-bg"
              style={{
                // backgroundColor: "#003967",

                clipPath: "polygon(3% 0%, 100% 0%, 96% 100%, 0% 100%)",
              }}
            >
              <div className="flex items-center gap-5 xl:gap-10">
  <div className="h-11 w-11 rounded-full bg-[#c2bcbc] flex items-center justify-center overflow-hidden">
     {player.img && player.img.trim() !== "" && (
    <Image
      src={player.img}
      alt="avatar"
      width={50}
      height={50}
      className="w-full"
    />
    )}

  </div>

              </div>
              <div className=" flex items-center justify-start w-[30%]">
                <p className="text-[10px] md:text-base font-bold">
                  {player.name}
                </p>
              </div>
              <div className="w-[50%] flex items-center justify-between">
                <Image
                  src={
                    role == "batsman"
                      ? "/images/teams/meetmyteam/Layer_1 (1).svg"
                      : role == "bowlers"
                      ? "/images/teams/meetmyteam/svg8.svg"
                      : role == "All Rounder"
                      ? "/images/teams/meetmyteam/Layer_1 (3).svg"
                      : "/images/teams/meetmyteam/Layer_1 (4).svg"
                  }
                  alt="bat"
                  width={350}
                  height={350}
                  className="mr-2 w-10 h-10"
                />
                <span className="text-[10px] md:text-base font-bold ">
                  {player.role}
                </span>
                <Image
                  src="/images/teams/meetmyteam/uil_arrow.svg"
                  alt="arrow"
                  width={20}
                  height={20}
                  className="ml-2 w-7 h-7"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetMyTeam;
