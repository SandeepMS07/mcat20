const FORM_ID =
  "1FAIpQLScVnYDhL_1n1OcdylUQr_hFy93wwmjiWj-5E3HEe8IOgBbUxA";
const FORM_SRC = `https://docs.google.com/forms/d/e/${FORM_ID}/viewform?embedded=true`;

export const metadata = {
  title: "T20 Mumbai Creators League — Participate Now",
  description:
    "Your chance to win BIG. Participate in the T20 Mumbai Creators League.",
};

const Page = () => {
  return (
    <div className="w-full bg-[#1E2F7D]">
      <section className="relative overflow-hidden pb-14 pt-32 sm:pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,88,210,0.35),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(26,40,116,0.65),transparent_45%)]" />

        <div className="relative section-width">
          <div className="mb-8 flex flex-col items-center gap-3 border-b border-white/15 pb-6 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF7A1A]">
              T20 Mumbai Creators League
            </span>
            <h1 className="text-3xl font-extrabold uppercase italic leading-[0.95] text-white sm:text-4xl md:text-5xl">
              Your chance to win{" "}
              <span className="bg-gradient-to-r from-[#FFB85C] via-[#F68323] to-[#F2A23A] bg-clip-text text-transparent">
                BIG
              </span>
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
              Fill in the form below to participate in the T20 Mumbai Creators
              League.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white shadow-[0_10px_30px_rgba(2,8,30,0.35)]">
            <iframe
              src={FORM_SRC}
              title="T20 Mumbai Creators League registration"
              className="block w-full"
              style={{ minHeight: "1570px", border: 0 }}
              allow="autoplay; clipboard-write"
            >
              Loading…
            </iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
