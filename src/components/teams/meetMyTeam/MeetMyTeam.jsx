import TitleComponent from "@/components/common/TitleComponent";
import Image from "next/image";
import React from "react";

const batsmen = [
  { id: "01", name: "Ajay Pandey", role: "Batsman" },
  { id: "02", name: "Kunalbhai Parmar", role: "Batsman" },
  { id: "03", name: "TP Patel", role: "Batsman" },
  { id: "04", name: "Devkumar S", role: "Batsman" },
  { id: "05", name: "Suryadevi Shinde", role: "Batsman" },
];

const bowlers = [
  { id: "06", name: "Dhawal Kulkarni", role: "Bowler" },
  { id: "07", name: "Bohara Lalit", role: "Bowler" },
  { id: "08", name: "Anjibhai Lal", role: "Bowler" },
  { id: "09", name: "Het Patel", role: "Bowler" },
  { id: "10", name: "Syedwar Osman", role: "Bowler" },
];

const allRounders = [
  { id: "11", name: "Arjun Tendulkar", role: "All Rounder" },
  { id: "12", name: "Sanjana Khan", role: "All Rounder" },
  { id: "13", name: "Mehul Lakhanbhai", role: "All Rounder" },
  { id: "14", name: "Siddarth Akre", role: "All Rounder" },
  { id: "15", name: "Akash Rohit Sonaw", role: "All Rounder" },
  { id: "16", name: "Bhavesh Thakkar", role: "All Rounder" },
  { id: "17", name: "Tushar N Patel", role: "All Rounder" },
  { id: "18", name: "Tushar N Patel", role: "All Rounder" },
];

const wicketKeepers = [
  { id: "19", name: "Prakock S S", role: "Wicket Keeper" },
  { id: "20", name: "Ankit Anand", role: "Wicket Keeper" },
];

const MeetMyTeam = () => {
  return (
    <div className="bg-white  pt-4 pb-10 section-width">
      <TitleComponent title="Meet the Team" />
      <div className="w-full flex flex-col md:flex-row justify-between">
        <div className=" w-full md:w-[48%] lg:w-[48%] flex flex-col gap-10 mt-6">
          <Table role="batsman" PlayerData={batsmen} />
          <Table role="bowlers" PlayerData={bowlers} />
        </div>
        <div className=" w-full md:w-[48%] lg:w-[48%] flex flex-col gap-10 mt-6">
          <Table role="all rounders" PlayerData={allRounders} />
          <Table role="Wicket Keeper" PlayerData={wicketKeepers} />
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
          className="bg-[#001B31] w-full border-r-[25px] top-1  border-[#F15A22] h-12 right-1 z-10 absolute"
          style={{
            clipPath: "polygon(0% 0%, 100% 0%, 98% 100%, 0% 100%)",
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
        {PlayerData.map((player, index) => (
          <div
            key={index}
            className="flex items-center justify-between  relative   "
          >
            {/* Number in separate div */}
            <div className="flex z-50 pl-2   items-center">
              <span className=" text-white">{player.id}</span>
            </div>
            <div
              className="bg-[#001b31] w-full border-r-[20px]  border-[#F15A22] h-10 z-20 absolute"
              style={{
                // backgroundColor: "#003967",
                clipPath: "polygon(0% 0%, 100% 0%, 99% 100%, 0% 100%)",
              }}
            ></div>
            {/* All other content in one div */}
            <div
              className="flex items-center justify-between bg-[rgba(15,26,45,1)] border  z-50 px-10 py-2   flex-1  ml-3"
              style={{
                // backgroundColor: "#003967",
                clipPath: "polygon(3% 0%, 100% 0%, 98% 100%, 0% 100%)",
              }}
            >
              <div className="flex items-center gap-5 xl:gap-10">
                <div className="h-11 w-11 rounded-full bg-[#242424]  flex items-center justify-center overflow-hidden">
                  <Image
                    src="/images/teams/meetmyteam/image 117.svg"
                    alt="avatar"
                    width={50}
                    height={50}
                    className="w-full h-full"
                  />
                </div>
              </div>
              <div className=" flex items-center justify-start w-[30%]">
                <p className="text-base font-bold">{player.name}</p>
              </div>
              <div className="w-[40%] flex items-center justify-between">
                <Image
                  src={
                    role == "batsman"
                      ? "/images/teams/meetmyteam/Layer_1 (1).svg"
                      : role == "bowlers"
                      ? "/images/teams/meetmyteam/svg8.svg"
                      : role == "all rounders"
                      ? "/images/teams/meetmyteam/Layer_1 (3).svg"
                      : "/images/teams/meetmyteam/Layer_1 (4).svg"
                  }
                  alt="bat"
                  width={350}
                  height={350}
                  className="mr-2 w-10 h-10"
                />
                <span className="text-base font-bold">{player.role}</span>
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
