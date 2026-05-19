"use client";

// Mock images — replace with real fan submissions when available.
const MOCK_FAN_PHOTOS = [
  {
    src: "/images/home/fan-wall/1.png",
    alt: "Fan with the T20 Mumbai mascot in the stands",
  },
  {
    src: "/images/home/fan-wall/2.png",
    alt: "Fans posing with the mascot holding a Scrapji sign",
  },
  { src: "/images/home/fan-wall/3.png", alt: "Mascot on the field with a fan" },
  {
    src: "/images/home/fan-wall/4.png",
    alt: "Trophy on display at DY Patil Stadium",
  },
  { src: "/images/home/fan-wall/5.png", alt: "Mascot cheering in the stadium" },
  { src: "/images/home/fan-wall/6.png", alt: "Young fan with the mascot" },
  {
    src: "/images/home/fan-wall/7.png",
    alt: "Fan taking a selfie with the mascot",
  },
  {
    src: "/images/home/fan-wall/2.png",
    alt: "Fans posing with the mascot holding a Scrapji sign",
  },
];

const FanWall = () => {
  return (
    <section className="bg-[#192A66] py-12 sm:py-16">
      <div className="section-width">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="flex flex-row gap-2 text-3xl font-extrabold uppercase italic leading-[0.95] text-white sm:text-4xl lg:text-5xl">
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "1.5px #ffffff" }}
              >
                Fan
              </span>
              <span>Wall</span>
            </h2>
            <p className="mt-2 text-xs italic text-white/60 sm:text-sm">
              * Mock images shown for preview — real fan submissions will appear
              here.
            </p>
          </div>
          <span className="inline-flex w-fit items-center rounded-full border border-white/40 px-5 py-2 text-sm font-semibold italic text-white sm:text-base">
            #ChanceSoduNako
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 sm:gap-1.5 md:grid-cols-4">
          {MOCK_FAN_PHOTOS.map((photo, i) => (
            <div
              key={i}
              className="group relative aspect-square overflow-hidden bg-white/5"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FanWall;
