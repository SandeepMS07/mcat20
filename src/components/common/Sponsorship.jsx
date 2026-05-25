const SPONSORS = [
  {
    img: "/images/home/sponsorship/hell.png",
    alt: "Hell Energy",
    role: "Energy Drink Partner",
  },
  {
    img: "/images/home/sponsorship/tyka.png",
    alt: "TYKA",
    role: "Kitting Partner",
  },
];

// ───────────────── Desktop card components ─────────────────
const TitleSponsorCard = () => (
  <div className="group relative w-full max-w-[360px]">
    <div
      aria-hidden
      className="pointer-events-none absolute -inset-1 rounded-[20px] bg-gradient-to-br from-[#F68323]/30 via-transparent to-[#1C398E]/30 opacity-80 blur-[6px]"
    />
    <div className="relative flex flex-col overflow-hidden rounded-[18px] bg-gradient-to-br from-[#192A66] via-[#172476] to-[#0E005A] p-1.5 shadow-[0_18px_44px_-18px_rgba(14,0,90,0.5)] transition-all duration-300 hover:-translate-y-1">
      <div className="aspect-[1510/646] w-full overflow-hidden rounded-[14px] bg-white">
        <div className="flex h-full w-full items-center justify-center px-6">
          <img
            src="/images/home/sponsorship/nuvama.svg"
            alt="Nuvama"
            className="max-h-[78%] w-auto max-w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </div>
);

const SponsorCard = ({ img, alt, role }) => (
  <div className="group relative w-full max-w-[320px]">
    <div className="relative flex flex-col overflow-hidden rounded-[18px] bg-gradient-to-br from-[#192A66] via-[#172476] to-[#0E005A] p-1.5 shadow-[0_14px_36px_-16px_rgba(14,0,90,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_44px_-18px_rgba(14,0,90,0.55)]">
      <div className="px-4 pt-3 pb-2.5">
        <p className="text-center text-sm font-semibold text-white">{role}</p>
        <div className="mt-2 h-px w-full bg-white/15" />
      </div>
      <div className="aspect-[1510/646] w-full overflow-hidden rounded-[14px]">
        <img
          src={img}
          alt={alt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>
    </div>
  </div>
);

// ───────────────── Mobile flat row component ─────────────────
const MobileSponsorRow = ({ role, kind = "partner", children }) => {
  const isTitle = kind === "title";
  return (
    <div className="flex flex-col items-center">
      <div className="mb-2.5 flex items-center gap-2">
        {isTitle && <span className="h-[2px] w-3 rounded-full bg-[#F68323]" />}
        <span
          className={`text-[10px] font-bold uppercase ${
            isTitle
              ? "tracking-[0.32em] text-[#192A66]"
              : "tracking-[0.22em] text-[#192A66]/60"
          }`}
        >
          {role}
        </span>
        {isTitle && <span className="h-[2px] w-3 rounded-full bg-[#F68323]" />}
      </div>
      {children}
    </div>
  );
};

const Sponsorship = () => {
  return (
    <div className="relative overflow-hidden bg-[#F6F7FB]">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-[#1C398E]/8 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-[#F68323]/12 blur-3xl"
      />

      <div className="section-padding relative">
        <div className="section-width">
          {/* Heading — shared mobile + desktop */}
          <div className="mb-8 flex flex-col items-center gap-3 text-center sm:mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#1C398E]/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1C398E] ring-1 ring-[#1C398E]/10">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F68323]" />
              Partners
            </div>
            <h2 className="flex items-baseline justify-center gap-2.5 text-3xl font-extrabold uppercase italic leading-none text-[#192A66] sm:gap-4 sm:text-5xl lg:text-6xl">
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "1.5px #192A66" }}
              >
                OUR
              </span>
              <span>SPONSORS</span>
            </h2>
          </div>

          {/* ───────── Mobile layout (flat, label-above-logo) ───────── */}
          <div className="flex flex-col items-stretch gap-7 sm:hidden">
            {/* <div className="flex w-full items-center justify-center rounded-2xl bg-white px-6 py-5 shadow-[0_10px_28px_-12px_rgba(14,0,90,0.18)] ring-1 ring-[#192A66]/8">
              <img
                src="/images/home/sponsorship/nuvama.svg"
                alt="Nuvama"
                className="h-12 w-auto max-w-[200px] object-contain"
                loading="lazy"
              />
            </div> */}

            <div
              aria-hidden
              className="mx-auto h-px w-16 bg-[#192A66]/15"
            />

            <div className="grid grid-cols-2 gap-4">
              {SPONSORS.map((s) => (
                <MobileSponsorRow key={s.alt} role={s.role}>
                  <div className="flex h-20 w-full items-center justify-center overflow-hidden rounded-xl bg-white p-2 shadow-[0_8px_22px_-12px_rgba(14,0,90,0.18)] ring-1 ring-[#192A66]/8">
                    <img
                      src={s.img}
                      alt={s.alt}
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                </MobileSponsorRow>
              ))}
            </div>
          </div>

          {/* ───────── Desktop layout (cards) ───────── */}
          <div className="hidden flex-col items-center gap-10 sm:flex">
            {/* <div className="flex w-full justify-center">
              <TitleSponsorCard />
            </div> */}

            <div className="flex w-full flex-wrap items-stretch justify-center gap-8 md:gap-10">
              {SPONSORS.map((s) => (
                <SponsorCard key={s.alt} {...s} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sponsorship;
