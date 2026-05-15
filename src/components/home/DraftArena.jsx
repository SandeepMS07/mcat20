"use client";
import Image from "next/image";
import Link from "next/link";

const DRAFT_ROUTE = "#";

const DraftArena = () => {
  return (
    <div className="bg-[#192A66] lg:block hidden">
      <div className="section-width py-6 sm:py-10">
        <div className="relative overflow-hidden">
          <Image
            src="/images/home/arena-bg.png"
            alt=""
            width={1856}
            height={288}
            priority
            className="block h-auto w-full"
            aria-hidden
          />
          <div className="absolute inset-0 z-10 flex flex-col items-start justify-center gap-2 px-5 py-4 sm:gap-3 sm:px-8 sm:py-6 lg:px-12 lg:py-8">
            <div className="flex max-w-xl flex-col gap-1">
              <h2 className="bg-gradient-to-b from-[#ff8000] via-[#e17100] to-[#ffae5c] bg-clip-text text-2xl font-extrabold uppercase italic leading-none tracking-wide text-transparent sm:text-3xl xl:text-[40px]">
                Enter The Draft Arena
              </h2>
              <p className="text-sm font-bold text-white/90 sm:text-base xl:text-xl">
                Build your Dream XI. Share with friends. See who wins.
              </p>
            </div>
            <Link
              href={DRAFT_ROUTE}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-b from-[#d84800] to-[#f68323] px-6 py-2.5 text-xs font-medium uppercase italic tracking-wide text-white shadow-[0_4px_18px_rgba(216,72,0,0.4)] transition-opacity hover:opacity-90 sm:text-xs xl:text-sm"
            >
              Start your draft
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraftArena;
