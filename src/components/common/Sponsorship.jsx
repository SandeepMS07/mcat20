const SPONSORS = [
  {
    img: "/images/home/sponsorship/hell.png",
    alt: "Hell Energy",
    label: "Energy Drink Partner",
  },
  {
    img: "/images/home/sponsorship/tyka.png",
    alt: "TYKA",
    label: "Kitting Partner",
  },
];

const SponsorCard = ({ img, alt, label }) => (
  <div
    className="flex w-full max-w-[180px] flex-col gap-1.5 rounded-2xl border border-white/0 px-2.5 pt-2.5 pb-2 shadow-md sm:max-w-[200px] sm:gap-2 sm:px-3 sm:pt-3"
    style={{
      backgroundImage:
        "linear-gradient(195deg, rgba(14, 0, 90, 0.4) 27.8%, rgba(28, 57, 142, 0.4) 84.9%), linear-gradient(90deg, #172476 0%, #172476 100%)",
    }}
  >
    <h3 className="text-center text-[10px] font-bold tracking-tight text-white sm:text-xs">
      {label}
    </h3>
    <div className="border-t border-white/10" />
    <div className="aspect-[1510/646] w-full overflow-hidden rounded-md">
      <img
        src={img}
        alt={alt}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </div>
  </div>
);

const Sponsorship = () => {
  return (
    <div className="bg-white">
      <div className="section-padding">
        <div className="mb-10 text-center md:mb-14">
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

        <div className="section-width grid grid-cols-2 items-center justify-items-center gap-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-8 md:gap-16 lg:gap-24">
          {SPONSORS.map((s) => (
            <SponsorCard key={s.alt} {...s} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sponsorship;
