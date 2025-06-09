import Image from "next/image";
import TitleComponent from "../common/TitleComponent";

const Sponsorship = () => {
  const sponsorData = [
    {
      img: "/images/home/sponsorship/meil.png",
      title: "Powered By",
    },
    {
      img: "/images/home/sponsorship/jpi.png",
      title: "League Sponsor",
    },
    {
      img: "/images/home/sponsorship/hoh.png",
      title: "League Sponsor",
    },
    {
      img: "/images/home/sponsorship/jkumar.png",
      title: "Umpire Sponsor",
    },
    {
      img: "/images/home/sponsorship/district.png",
      title: "Ticketing Partner",
    },
    {
      img: "/images/home/sponsorship/dream11.png",
      title: "Fantasy Partner",
    },

    {
      img: "/images/home/sponsorship/jiohotstar.png",
      title: "Streaming Partner",
    },

    {
      img: "/images/home/sponsorship/redfm.png",
      title: "Radio Partner",
    },
    {
      img: "/images/home/sponsorship/starsports.png",
      title: "Official Broadcaster",
    },
    {
      img: "/images/home/sponsorship/scrapji.png",
      title: "Recycling Partner",
    },
  ];

  return (
    <div className="bg-cover bg-center bg-no-repeat relative">
      <img
        src="/images/elements/section-element.png"
        className="absolute right-0 top-0 md:block hidden"
        alt="element"
      />
      <img
        src="/images/elements/section-element.png"
        className="absolute left-0 bottom-0 rotate-180 md:block hidden "
        alt="element"
      />
      <div className="section-width section-padding">
        <TitleComponent title={"Sponsors"} />

        <div className="flex flex-wrap gap-8 bg-[#000B3D] p-4 rounded-xl w-full justify-center">
          {sponsorData.map((item, index) => {
            return (
              <div
                key={index}
                className={`w-full md:w-[18.2%]  rounded-xl relative text-white p-4 border border-[#4c5271] `}
                style={{
                  background:
                    "linear-gradient(180.69deg, rgba(255, 255, 255, 0.15) -61.51%, rgba(0, 0, 0, 0.15) 91.86%)",
                }}
              >
                <div className="w-full h-24 flex items-center mb-4">
                  <div className="max-h-24 w-full flex justify-start">
                    <img
                      src={item.img}
                      alt="Sponsor"
                      className="object-contain h-20 max-w-full"
                    />
                  </div>
                </div>

                <div className="w-full flex flex-row">
                  <div
                    className="w-[20px]"
                    style={{
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderImageSource:
                        "linear-gradient(90deg, #E07E27 -22.62%, #E93301 100%)",
                      borderImageSlice: 1,
                    }}
                  ></div>
                  <div className="flex-1 border-b-[1px] border-gray-800"></div>
                </div>

                <p className="text-lg font-medium z-20 relative mt-4 break-words whitespace-normal">
                  {item.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sponsorship;
