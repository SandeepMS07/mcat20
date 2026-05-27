// Sponsor tiers laid out per Figma — every row has its own slot list. Each
// slot becomes a card with the same dark-blue gradient chrome; the inner panel
// holds the logo (white surface by default; pass imgBg: "bg-transparent" when
// the logo is designed for dark — e.g. white wordmarks). Drop new logos into
// /public/images/home/sponsorship/ and reference them here.
const TITLE_SPONSOR = {
  role: "Title Sponsor",
  img: "https://storage.googleapis.com/mca_images_new/s4-sponsers/nuvama.svg",
  alt: "Nuvama",
  cardWidth: "w-full max-w-[200px] sm:max-w-[260px]",
};

const CO_SPONSOR = {
  role: "Co-Sponsor",
  img: "/images/home/sponsorship/threeone-labels.png",
  alt: "3-1 Labels",
  cardWidth: "w-full max-w-[200px] sm:max-w-[260px]",
  imgBg: "bg-transparent",
};

const PARTNER_ROWS = [
  [
    {
      role: "Energy Drink Partner",
      img: "https://mca-cdn.ken42.com/s4-sponsers/hell.svg",
      alt: "Hell Energy",
      imgBg: "bg-transparent",
    },
    {
      role: "Banking Partner",
      img: "/images/home/sponsorship/yes-bank.png",
      alt: "YES BANK",
      imgBg: "bg-transparent",
    },
    {
      role: "Kitting Partner",
      img: "https://storage.googleapis.com/mca_images_new/s4-sponsers/tyka.svg",
      alt: "TYKA",
      imgBg: "bg-transparent",
    },
  ],
  [
    {
      role: "League Sponsor",
      img: "https://mca-cdn.ken42.com/s4-sponsers/Agribid_Varcas.svg",
      alt: "Agribid",
      imgBg: "bg-transparent",
    },
    {
      role: "League Sponsor",
      img: "https://mca-cdn.ken42.com/s4-sponsers/Atul%20Projects.svg",
      alt: "Atul Projects",
      imgBg: "bg-transparent",
    },
    {
      role: "Radio Partner",
      img: "https://mca-cdn.ken42.com/s4-sponsers/Red%20FM.svg",
      alt: "RED FM",
      imgBg: "bg-transparent",
    },
  ],
];

const SponsorCard = ({
  role,
  img,
  alt,
  cardWidth = "w-full max-w-[220px]",
  imgBg = "bg-white",
}) => (
  <div
    className={`relative flex flex-col gap-1.5 rounded-[10px] p-1.5 sm:gap-2.5 sm:rounded-[12px] sm:p-3 ${cardWidth}`}
    style={{
      backgroundImage:
        "linear-gradient(195deg, rgba(14,0,90,0.4) 28%, rgba(28,57,142,0.4) 85%), linear-gradient(90deg, #172476 0%, #172476 100%)",
    }}
  >
    <p className="text-center text-[9px] font-bold tracking-tight text-white sm:text-[13px]">
      {role}
    </p>
    <div className="-mx-1.5 h-px bg-white/10 sm:-mx-3" />
    <div
      className={`relative mt-0.5 flex h-[44px] w-full items-center justify-center overflow-hidden rounded-md px-1.5 py-1.5 sm:h-[88px] sm:rounded-lg sm:px-3 sm:py-2 ${imgBg}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={img}
        alt={alt}
        className="h-full w-full object-contain"
        loading="lazy"
      />
    </div>
  </div>
);

const Divider = () => (
  <div aria-hidden className="my-4 h-px w-full bg-[#192A66]/10 sm:my-5" />
);

const Sponsorship = () => {
  return (
    <div className="relative bg-white">
      <div className="section-padding relative">
        <div className="section-width">
          {/* Heading */}
          <div className="mb-10 flex flex-col items-center text-center sm:mb-14">
            <h2 className="text-4xl font-extrabold italic uppercase leading-[0.95] sm:text-5xl lg:text-[56px]">
              <span
                className="block text-transparent"
                style={{ WebkitTextStroke: "1.5px #192A66" }}
              >
                OUR
              </span>
              <span className="block text-[#192A66]">SPONSORS</span>
            </h2>
          </div>

          {/* Title Sponsor */}
          <div className="flex justify-center">
            <SponsorCard {...TITLE_SPONSOR} />
          </div>

          <Divider />

          {/* Co-Sponsor */}
          <div className="flex justify-center">
            <SponsorCard {...CO_SPONSOR} />
          </div>

          <Divider />

          {/* Partner rows */}
          {PARTNER_ROWS.map((row, i) => (
            <div key={i}>
              <div className="mx-auto grid max-w-[1100px] grid-cols-3 items-stretch justify-items-center gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-8 lg:gap-10">
                {row.map((s) => (
                  <SponsorCard
                    key={s.alt}
                    {...s}
                    cardWidth="w-full max-w-[120px] sm:max-w-[220px]"
                  />
                ))}
              </div>
              {i < PARTNER_ROWS.length - 1 && <Divider />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sponsorship;
