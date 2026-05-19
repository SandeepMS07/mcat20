"use client";

// Mock images — replace with real fan submissions when available.
const MOCK_FAN_PHOTOS = [
  {
    src: "/images/home/fan-wall/1.png",
    alt: "Fan with the T20 Mumbai mascot in the stands",
    handle: "@mumbai_fan_01",
  },
  {
    src: "/images/home/fan-wall/2.png",
    alt: "Fans posing with the mascot holding a Scrapji sign",
    handle: "@scrapji_squad",
  },
  {
    src: "/images/home/fan-wall/3.png",
    alt: "Mascot on the field with a fan",
    handle: "@on_the_pitch",
  },
  {
    src: "/images/home/fan-wall/4.png",
    alt: "Trophy on display at DY Patil Stadium",
    handle: "@trophy_chase",
  },
  {
    src: "/images/home/fan-wall/5.png",
    alt: "Mascot cheering in the stadium",
    handle: "@cheer_loud",
  },
  {
    src: "/images/home/fan-wall/6.png",
    alt: "Young fan with the mascot",
    handle: "@young_blue",
  },
  {
    src: "/images/home/fan-wall/7.png",
    alt: "Fan taking a selfie with the mascot",
    handle: "@selfie_king",
  },
  {
    src: "/images/home/fan-wall/2.png",
    alt: "Fans posing with the mascot holding a Scrapji sign",
    handle: "@mumbai_mania",
  },
];

// Bento layout — each tile gets a span class. Mobile collapses to a clean 2-col.
const TILE_SPANS = [
  "md:col-span-2 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-2 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
];

const HeartIcon = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 21s-7.5-4.6-9.5-9.1C1.3 8.5 3.4 5 7 5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.6 0 5.7 3.5 4.5 6.9C19.5 16.4 12 21 12 21z" />
  </svg>
);

const FanWall = () => {
  return (
    <section className="relative overflow-hidden bg-white py-12 sm:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#1B2F7A]/5 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-[#F68323]/10 blur-3xl"
      />

      <div className="section-width relative">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#1B2F7A]/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1B2F7A]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F68323]" />
              Community
            </div>
            <h2 className="flex flex-row gap-2 text-3xl font-extrabold uppercase italic leading-[0.95] text-[#1B2F7A] sm:text-4xl lg:text-5xl">
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "1.5px #1B2F7A" }}
              >
                Fan
              </span>
              <span>Wall</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#1B2F7A]/70 sm:text-base">
              Capture your T20 Mumbai moment, post on Instagram with{" "}
              <span className="font-semibold text-[#1B2F7A]">
                #ChanceSoduNako
              </span>{" "}
              and stand a chance to win free match tickets.
            </p>
          </div>
          <a
            href="https://www.instagram.com/explore/tags/chancesodunako/"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex w-fit items-center gap-2 self-start rounded-full bg-[#1B2F7A] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(27,47,122,0.6)] transition-all hover:bg-[#F68323] hover:shadow-[0_10px_24px_-8px_rgba(246,131,35,0.6)] sm:text-base"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.3 1 .4 2.2.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .3-2.2.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.3 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.6c-3.1 0-3.5 0-4.7.1-1.1.1-1.7.2-2.1.4-.5.2-.9.5-1.3.9-.4.4-.7.8-.9 1.3-.2.4-.3 1-.4 2.1-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1.1.2 1.7.4 2.1.2.5.5.9.9 1.3.4.4.8.7 1.3.9.4.2 1 .3 2.1.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.5 1.3-.9.4-.4.7-.8.9-1.3.2-.4.3-1 .4-2.1.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.5-.9-.9-1.3-.4-.4-.8-.7-1.3-.9-.4-.2-1-.3-2.1-.4-1.2-.1-1.6-.1-4.7-.1zm0 2.7a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 9.1a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2zm5.7-9.3a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6z" />
            </svg>
            Share Your Moment
          </a>
        </div>

        <div className="grid auto-rows-[140px] grid-cols-2 gap-2 sm:auto-rows-[180px] sm:gap-3 md:grid-cols-4 md:auto-rows-[180px] lg:auto-rows-[210px]">
          {MOCK_FAN_PHOTOS.map((photo, i) => (
            <figure
              key={i}
              className={`group relative overflow-hidden rounded-2xl bg-[#1B2F7A]/5 shadow-[0_6px_18px_-10px_rgba(27,47,122,0.4)] ring-1 ring-[#1B2F7A]/8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_28px_-12px_rgba(27,47,122,0.45)] ${TILE_SPANS[i] || "md:col-span-1 md:row-span-1"}`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1640]/85 via-[#0a1640]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white/0 backdrop-blur-md transition-all duration-300 group-hover:bg-[#F68323] group-hover:text-white">
                <HeartIcon className="h-4 w-4" />
              </div>

              <figcaption className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/70">
                  #ChanceSoduNako
                </p>
                <p className="text-sm font-semibold text-white">
                  {photo.handle}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FanWall;
