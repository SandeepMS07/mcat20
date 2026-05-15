import TitleComponent from "./TitleComponent";

const PRINCIPAL_SPONSORS = [
  { img: "/images/home/sponsorship/jpi.png", alt: "JP Infra" },
  { img: "/images/home/sponsorship/hoh.png", alt: "House of Hiranandani" },
];

const ASSOCIATE_SPONSORS = [
  { img: "/images/home/sponsorship/meil.png", alt: "Meil" },
  { img: "/images/home/sponsorship/starsports.png", alt: "Star Sports 1" },
  // { img: "/images/home/sponsorship/starsports.png", alt: "Star Sports 2" },
  { img: "/images/home/sponsorship/jkumar.png", alt: "J. Kumar" },
  { img: "/images/home/sponsorship/redfm.png", alt: "Red FM" },
];

const PARTNER_SPONSORS = [
  { img: "/images/home/sponsorship/jiohotstar.png", alt: "Jio Hotstar" },
  { img: "/images/home/sponsorship/district.png", alt: "District by Zomato" },
  { img: "/images/home/sponsorship/scrapji.png", alt: "Scrapji" },
  { img: "/images/home/sponsorship/dream11.png", alt: "Dream11" },
];

const SponsorTier = ({ items, maxHeight = "h-16" }) => (
  <div className="flex flex-wrap items-center justify-center gap-6 border-t border-white/10 bg-white px-4 py-5 first:border-t-0 sm:gap-10 sm:px-10">
    {items.map((s, i) => (
      <div key={`${s.alt}-${i}`} className="flex items-center justify-center">
        <img
          src={s.img}
          alt={s.alt}
          className={`${maxHeight} w-auto object-contain`}
        />
      </div>
    ))}
  </div>
);

const Sponsorship = () => {
  return (
    <div className="bg-white">
      <div className="section-padding">
        <div className="mb-6 text-center">
          <h2 className="section-width flex flex-col text-3xl font-extrabold uppercase italic leading-[0.95] text-[#192A66] sm:text-4xl lg:text-6xl">
            <span
              className="text-transparent [-webkit-text-stroke:1.5px_#192A66]"
              style={{ WebkitTextStroke: "1.5px #192A66" }}
            >
              OUR
            </span>
            <span>SPONSORS</span>
          </h2>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <SponsorTier items={PRINCIPAL_SPONSORS} maxHeight="h-20 sm:h-24" />
          <div className="border-y-2 border-gray-[#DAD9D9]">
            <SponsorTier
              items={ASSOCIATE_SPONSORS}
              maxHeight="h-14 lg:h-16 xl:h-24"
            />
          </div>
          <div className="border-b-2 border-gray-[#DAD9D9]">
            <SponsorTier
              items={PARTNER_SPONSORS}
              maxHeight="h-14 lg:h-16 xl:h-24"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sponsorship;
