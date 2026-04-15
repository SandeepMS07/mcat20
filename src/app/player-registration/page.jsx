import Link from "next/link";

export default function PlayerRegistrationPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 text-white">
      <div className="max-w-xl rounded-2xl border border-white/10 bg-white/5 px-8 py-10 text-center shadow-2xl backdrop-blur">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#f9ae2d]">
          Registration Update
        </p>
        <h1 className="mt-4 text-3xl font-extrabold uppercase tracking-wide sm:text-4xl">
          Registrations Closed
        </h1>
        <p className="mt-4 text-sm leading-6 text-white/75 sm:text-base">
          Player registrations are now closed.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-[#f9ae2d] px-5 py-3 text-sm font-bold uppercase text-black"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
