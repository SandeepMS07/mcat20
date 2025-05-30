import Image from "next/image";
import TitleComponent from "../common/TitleComponent";
import CustomTable from "../common/CustomTable";
import Link from "next/link";
import routes from "@/utilis/route";
import { teamLogoStats } from "@/utilis/helper";
import "./style.css";

const headers = ["RANK", "TEAM", "MP", "NET RR", "PTS"];
const data = [
  {
    RANK: "02",
    TEAM: {
      name: "SoBo SuperSonics",
      logo: "/images/home/team/soboSuperSonics.png",
    },
    MP: 5,
    "NET RR": "+0.897",
    PTS: 8,
  },
  {
    RANK: "03",
    TEAM: {
      name: "ARCS Andheri",
      logo: "/images/home/team/arcsAndheri.png",
    },
    MP: 5,
    "NET RR": "-0.23",
    PTS: 8,
  },
  {
    RANK: "04",
    TEAM: {
      name: "North Mumbai Panthers",
      logo: "/images/home/team/bandraBlasters.png",
    },
    MP: 5,
    "NET RR": "+0.662",
    PTS: 6,
  },
  {
    RANK: "05",
    TEAM: {
      name: "Aakash Tigers MWS",
      logo: "/images/home/team/shivajiParkLions.png",
    },
    MP: 5,
    "NET RR": "+0.143",
    PTS: 6,
  },
  {
    RANK: "05",
    TEAM: {
      name: "Eagle Thane Strikers",
      logo: "/images/home/team/shivajiParkLions.png",
    },
    MP: 5,
    "NET RR": "+0.277",
    PTS: 4,
  },
  {
    RANK: "05",
    TEAM: {
      name: "Triumph Knights Mumbai North East",
      logo: "/images/home/team/shivajiParkLions.png",
    },
    MP: 5,
    "NET RR": "+0.195",
    PTS: 4,
  },
  {
    RANK: "05",
    TEAM: {
      name: "NaMo Bandra Blasters",
      logo: "/images/home/team/shivajiParkLions.png",
    },
    MP: 5,
    "NET RR": "-1.002",
    PTS: 4,
  },
  {
    RANK: "05",
    TEAM: {
      name: "Shivaji Park Lions",
      logo: "/images/home/team/shivajiParkLions.png",
    },
    MP: 5,
    "NET RR": "-1.013",
    PTS: 0,
  },
];

const headerStyles = {
  className: "bg-[#2B0F04] text-white",
};

const customRenderers = {
  TEAM: (value) => (
    <div className="flex items-center gap-3">
      <img
        src={value.logo}
        alt={value.name}
        className="w-8 h-8 object-contain"
      />
      <span className="text-white">{value.name}</span>
    </div>
  ),
};

const HomeStandingsSection = () => {
  return (
    <div className="bg-[url('/images/home/latestUpdateBg.png')] bg-cover bg-center bg-no-repeat py-20">
      <div className="section-width padding-bottom pt-5">
        <TitleComponent
          hideButtonOnMobile
          title="standings Season 2"
          button
          buttonLink={routes.standing}
        />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full overflow-hidden">
            {/* <div className="mb-6">
              <h2
                className="text-2xl font-bold  text-transparent bg-clip-text italic text-center"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
                }}
              >
                GROUP A
              </h2>
            </div> */}

            <div className="relative">
             <div
              className="bg-[#001B31] w-[99.5%] border-r-[50px] top-2 border-[#F15A22] h-10 z-10 absolute"
              style={{
                clipPath: "polygon(0% 0%, 100% 0%, 97.8% 100%, 0% 100%)",
              }}
            ></div>

            {/* Header Row */}
            <div
              className="bg-[#999FA4] italic z-50 relative mb-4 mr-2 custom-heading-border"
              style={{
                clipPath: "polygon(0% 0%, 100% 0%, 97% 100%, 0% 100%)",
              }}
            >
                <div className="flex items-center justify-between px-6 py-4">
                  <div className="w-[5%] flex items-center justify-start">
                    <span
                      className="font-bold text-transparent bg-clip-text"
                      style={{
                        backgroundImage:
                       "linear-gradient(to bottom, #333333 10%, #FFFFFF 50%, #333333 90%)"
                      }}
                    >
                      SI.NO
                    </span>
                  </div>
                  <div className="w-[35%] flex items-center justify-start pl-8">
                    <span
                      className="font-bold text-transparent bg-clip-text"
                      style={{
                        backgroundImage:
                          "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
                      }}
                    >
                      TEAMS
                    </span>
                  </div>
                  <div className="w-[15%] flex items-center justify-center">
                    <span
                      className="font-bold text-transparent bg-clip-text"
                      style={{
                        backgroundImage:
                          "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
                      }}
                    >
                      MP
                    </span>
                  </div>
                  <div className="w-[20%] flex items-center justify-center">
                    <span
                      className="font-bold text-transparent bg-clip-text"
                      style={{
                        backgroundImage:
                          "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
                      }}
                    >
                      NET RR
                    </span>
                  </div>
                  <div className="w-[15%] flex items-center justify-center">
                    <span
                      className="font-bold text-transparent bg-clip-text"
                      style={{
                        backgroundImage:
                          "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
                      }}
                    >
                      PTS
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-white space-y-3">
              {data.map((team, index) => {
                const teamLogo = teamLogoStats[team.TEAM.name] || "";
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between relative pr-3"
                  >
                    <div className="flex z-50 pl-2 items-center">
                      <span className="text-white">{index + 1}.</span>
                    </div>
                    <div
                      className="w-[99%] border-r-[50px]  border-[#F15A22] h-10 z-20 absolute"
                      style={{
                        clipPath: "polygon(0% 0%, 100% 0%, 97.5% 100%, 0% 100%)",
                       background: "linear-gradient(to right, rgba(224, 126, 39, 0.2) 60%, rgba(255, 255, 255, 0.2) 71%, rgba(224, 126, 39, 0.2) 100% );"
                      }}
                    >

                    {/* Yellow border and black gradient for the backside carrd */}
                    <div className="custom-yellow-border"></div>
                    <div className="custom-black-gradient "></div>

                  </div>
                  <div
                    className="flex items-center justify-between bg-[#999FA4]  z-50 px-4 md:px-10 py-2  relative w-[94%] custom-border-bg"
                    style={{
                      // backgroundColor: "#003967",
                      clipPath: "polygon(3% 0%, 100% 0%, 96% 100%, 0% 100%)",
                    }}
                  >     
                      <div className="flex items-center gap-5 xl:gap-10">
                        <div className="h-11 w-11 rounded-full  flex items-center justify-center overflow-hidden p-0.5">
                          <img
                            src={teamLogo}
                            alt={team.TEAM.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-start w-[30%]">
                        <p className="text-base font-semibold">
                          {team.TEAM.name}
                        </p>
                      </div>
                      <div className="w-[15%] flex items-center justify-center">
                        <span className="text-base font-semibold">
                          {team.MP}
                        </span>
                      </div>
                      <div className="w-[20%] flex items-center justify-center">
                        <span className="text-base font-semibold">
                          {team["NET RR"]}
                        </span>
                      </div>
                      <div className="w-[15%] flex items-center justify-center">
                        <span className="text-base font-semibold">
                          {team.PTS}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* <div className="w-full overflow-hidden">
            <div className="mb-6">
              <h2
                className="text-2xl font-bold  text-transparent bg-clip-text italic text-center"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
                }}
              >
                GROUP B
              </h2>
            </div>

            <div className="relative">
              <div
                className="bg-[#001B31] w-[95%] right-1 border-r-[25px] top-2 border-[#F15A22] h-10  z-10 absolute"
                style={{
                  clipPath: "polygon(0% 0%, 100% 0%, 98% 100%, 0% 100%)",
                }}
              ></div>

              <div
                className="bg-[#001B31] z-50 relative mb-4 mr-2  border-white border-[0.5px] border-opacity-20"
                style={{
                  clipPath: "polygon(0% 0%, 100% 0%, 97.5% 100%, 0% 100%)",
                }}
              >
                <div className="flex items-center italic justify-between pl-2 pr-5 py-4">
                  <div className="w-[5%] flex items-center justify-start">
                    <span
                      className="font-bold text-transparent bg-clip-text"
                      style={{
                        backgroundImage:
                          "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
                      }}
                    >
                      SI.NO
                    </span>
                  </div>
                  <div className="w-[40%] flex items-center justify-start pl-8">
                    <span
                      className="font-bold text-transparent bg-clip-text"
                      style={{
                        backgroundImage:
                          "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
                      }}
                    >
                      TEAMS
                    </span>
                  </div>
                  <div className="w-[15%] flex items-center justify-center">
                    <span
                      className="font-bold text-transparent bg-clip-text"
                      style={{
                        backgroundImage:
                          "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
                      }}
                    >
                      MP
                    </span>
                  </div>
                  <div className="w-[20%] flex items-center justify-center">
                    <span
                      className="font-bold text-transparent bg-clip-text"
                      style={{
                        backgroundImage:
                          "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
                      }}
                    >
                      NET RR
                    </span>
                  </div>
                  <div className="w-[15%] flex items-center justify-center">
                    <span
                      className="font-bold text-transparent bg-clip-text"
                      style={{
                        backgroundImage:
                          "linear-gradient(180deg, #666666 14.89%, #FFFFFF 48.4%, #666666 81.91%)",
                      }}
                    >
                      PTS
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-white space-y-3">
              {data.map((team, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between relative pr-3"
                >
                  <div className="flex z-50 pl-2 items-center">
                    <span className="text-white">{index + 1}.</span>
                  </div>
                  <div
                    className="bg-[#001B31] w-[100%]  right-1 border-r-[25px] border-t-[0.42px] border-l-[0.42px] border-b-[0.42px] border-gray-800   border-r-[#F15A22] h-8 mr-2 z-10 absolute"
                    style={{
                      clipPath: "polygon(0% 0%, 100% 0%, 99% 100%, 0% 100%)",
                    }}
                  ></div>
                  <div
                    className="flex items-center justify-between bg-[rgba(15,26,45,1)]  border-white border-[0.5px] border-opacity-20 z-50 px-10 py-1 flex-1 ml-3"
                    style={{
                      clipPath: "polygon(3% 0%, 100% 0%, 98% 100%, 0% 100%)",
                    }}
                  >
                    <div className="flex items-center gap-5 xl:gap-10">
                      <div className="h-11 w-11 rounded-full bg-[#242424] flex items-center justify-center overflow-hidden">
                        <img
                          src={team.TEAM.logo}
                          alt={team.TEAM.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-start w-[30%]">
                      <p className="text-base font-semibold">
                        {team.TEAM.name}
                      </p>
                    </div>
                    <div className="w-[15%] flex items-center justify-center">
                      <span className="text-base font-semibold">{team.MP}</span>
                    </div>
                    <div className="w-[20%] flex items-center justify-center">
                      <span className="text-base font-semibold">
                        {team["NET RR"]}
                      </span>
                    </div>
                    <div className="w-[15%] flex items-center justify-center">
                      <span className="text-base font-semibold">
                        {team.PTS}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default HomeStandingsSection;
