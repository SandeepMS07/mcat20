"use client";
import Image from "next/image";
import TitleComponent from "../common/TitleComponent";
import { SwiperSlide } from "swiper/react";
import useMediaQuery from "@/utilis/useMediaQuery";
import { Carousel } from "../Carousel";

const players = [
  {
    id: 1,
    name: "Shivam Dube",
    image: "/images/home/players/player2.png",
    teamName: "ARCS Andheri",
    teamLogo: "/images/home/team/arcsAndheri.jpg",

    gradient: {
      from: "#263C90",
      to: "#8C2B8E",
    },
  },
  {
    id: 2,
    name: "Sarfaraz Khan",
    image: "/images/home/players/player6.png",
    teamName: "Aakash Tigers Mumbai Western Suburbs",
    teamLogo: "/images/home/team/aakashTigers.jpg",
    gradient: {
      from: "#FD7E00",
      to: "#0064FF",
    },
  },
  {
    id: 3,

    name: "Ajinkya Rahane",
    image: "/images/home/players/player4.png",
    teamName: "Bandra Blasters",
    teamLogo: "/images/home/team/bandraBlasters.png",
    gradient: {
      from: "#4B1C86",
      to: "#E51C21",
    },
  },
  {
    id: 4,

    name: "Suryakumar Yadav",
    image: "/images/home/players/player1.png",
    teamName: "Triumph Knights Mumbai North East",
    teamLogo: "/images/home/team/ipTriumphKnights.jpg",
    gradient: {
      from: "#E8D273",
      to: "#9E7437",
    },
  },
  {
    id: 5,
    name: "Shreyas Iyer",
    image: "/images/home/players/player3.png",
    teamName: "SoBo Mumbai Falcons",
    teamLogo: "/images/home/team/ipmumbaifalcons.jpg",
    gradient: {
      from: "#F47B06",
      to: "#882626",
    },
  },
  {
    id: 6,

    name: "Prithvi Shaw",
    image: "/images/home/players/player5.png",
    teamName: "North Mumbai Panthers",
    teamLogo: "/images/home/team/ipNorthMumbaiPanther.jpg",
    gradient: {
      from: "#FEB713",
      to: "#5F4200",
    },
  },
  {
    id: 7,
    name: "Tushar Deshpande",
    image: "/images/home/players/player7.png",
    teamName: "Mumbai South Central Maratha Royals",
    teamLogo: "/images/home/team/ipMarathaRoyals.jpg",
    gradient: {
      from: "#1000A1",
      to: "#B84124",
    },
  },
  {
    id: 8,
    name: "Shardul Thakur",
    image: "/images/home/players/player8.png",
    teamName: "Eagle Thane Strikers",
    teamLogo: "/images/home/team/ipEagleThaneStrikers.png",
    gradient: {
      from: "#FBC92E",
      to: "#262262",
    },
  },
];

const PlayerCard = ({ data }) => {
  return (
    <div
      className="p-[4px] rounded-lg "
      style={{
        background:
          "radial-gradient(circle,rgba(236, 216, 21, 1) 38%, rgba(241, 90, 34, 1) 89%, rgba(241, 90, 34, 1) 100%)",
      }}
    >
      <div
        className="relative  h-full   rounded-lg    bg-cover bg-center bg-no-repeat flex flex-col"
        style={{
          background: `linear-gradient(to bottom, ${data?.gradient?.from} -9.69%, ${data?.gradient?.to}) 88.26%`,
        }}
      >
        <div
          className="p-[4px] rounded-full  w-fit mx-auto 2xl:-mt-12 xl:-mt-8 -mt-6 "
          style={{
            background:
              "radial-gradient(circle,rgba(236, 216, 21, 1) 38%, rgba(241, 90, 34, 1) 89%, rgba(241, 90, 34, 1) 100%)",
          }}
        >
          <div
            className="rounded-full 2xl:w-[200px] 2xl:h-[200px] xl:h-[150px] xl:w-[150px] md:h-[120px] md:w-[120px] w-[150px] h-[150px] overflow-hidden relative"
            style={{
              background: `linear-gradient(to bottom, ${data?.gradient?.from}, ${data?.gradient?.to})`,
            }}
          >
            <div className="h-full w-full absolute left-0 bottom-0 bg-[#00000050]"></div>
            {/*  <div className="w-full  absolute bottom-0 left-0 h-1/3 bg-gradient-to-t from-black to-transparent" /> */}
            <Image
              width={200}
              height={200}
              src={data?.image}
              alt={data?.name}
              className="object-cover w-full h-full rounded-full relative"
            />
          </div>
        </div>
        <div className="font-bold text-white px-2 py-6 rounded-sm xl:text-xl text-lg capitalize w-fit mx-auto text-center">
          {data?.name}
        </div>
        <div className=" w-full mt-auto">
          <div className="w-full text-white flex  gap-4  mt-auto bg-gradient-to-r from-transparent via-white/30 to-transparent min-h-[50px]">
            <div className="bg-white   flex justify-center items-center">
              <img
                src={data?.teamLogo}
                alt="Team Logo"
                className="w-[80px] h-auto mx-auto max-h-[80px]"
              />
            </div>
            <h4 className="text-white 2xl:text-lg text-base font-bold py-[6px] flex items-center justify-start uppercase   w-[calc(100%-50px)] text-start">
              {data?.teamName}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function IconPlayers() {
  return (
    <div className="relative">
        <img src="/images/elements/section-element.png" className="absolute right-0 top-0" alt="element" />
        <img src="/images/elements/section-element.png" className="absolute left-0 bottom-0 rotate-180" alt="element" />
      <div className="section-width padding-top">
        <TitleComponent title={"Icon Players"} />
        <div className="sm:grid  lg:grid-cols-4 xl:gap-x-8 xl:gap-y-16  md:grid-cols-3 gap-x-5 gap-y-10 sm:grid-cols-2 grid-cols-1 hidden  pt-8">
          {[...players]
            .sort((a, b) => a.teamName.localeCompare(b.teamName))
            .map((player) => (
              <PlayerCard data={player} key={player.id} />
            ))}
        </div>
        <div className="w-full sm:hidden block">
          <Carousel
            sectionName="clientLogo"
            sliderPerView={1}
            spaceBetween={50}
            loop={true}
          >
            {[...players]
              .sort((a, b) => a.teamName.localeCompare(b.teamName))
              .map((player, i) => (
                <SwiperSlide key={i} style={{ paddingTop: "20px" }}>
                  <PlayerCard data={player} key={i} />
                </SwiperSlide>
              ))}
          </Carousel>
          {/* {teamsDataHomePage.map((item, i) => {
                  return <TeamCard data={item} key={i} />;
                })} */}
        </div>
      </div>
    </div>
  );
}
