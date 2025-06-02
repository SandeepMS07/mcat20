import routes from "@/utilis/route";
import TitleComponent from "../common/TitleComponent";
import UpcomingFixtures from "../common/UpcomingFixtures";
import Link from "next/link";
import Image from "next/image";

const UpcomingFixturesSection = () => {
  return (
    <div className="relative">
      <img
        src="/images/elements/section-element.png"
        className="absolute right-0 top-0 md:block hidden"
        alt="element"
      />
      <div className="section-width  padding-top">
        <div className="relative w-full   pt-3 pb-2">
          <TitleComponent
            title={"Upcoming Matches"}
            button
            buttonLink={routes.fixtures}
            buttonText="View All"
            hideButtonOnMobile={true}
          />
          <UpcomingFixtures />
          <Link
            href={routes.teams || "#"}
            className="md:hidden flex items-center gap-2 w-fit mx-auto mt-6 btn-primary"
          >
            View All
            <Image
              src="/images/home/hero/buttonIcon.svg"
              alt="button-icon"
              width={24}
              height={24}
              className="w-5 h-5"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UpcomingFixturesSection;
