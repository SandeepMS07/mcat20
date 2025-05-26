import routes from "@/utilis/route";
import Image from "next/image";
import Link from "next/link";

const TitleComponent = ({ title, orange = false, button, buttonLink }) => {
  return (
    <>
      {orange ? (
        <div className="relative h-fit px-8 py-2 bg-[#DE6927]   xl:w-[480px] lg:w-[320px] rounded-md mb-12">
          <Image
            src={"/images/elements/header-element.png"}
            width={50}
            height={50}
            className="w-auto absolute h-full top-0 -left-0 rounded-l-md"
            alt="Logo"
          />
          <h3 className="text-white capitalize">{title}</h3>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="relative h-fit px-8 py-2 bg-gradient-to-r from-black to-[#213375] xl:w-[480px] lg:w-[320px] rounded-md mb-12">
            <Image
              src={"/images/elements/header-element.png"}
              width={50}
              height={50}
              className="w-auto absolute h-full top-0 -left-0 rounded-l-md"
              alt="Logo"
            />
            <h3 className="text-white capitalize">{title}</h3>
          </div>
          <div className="md:flex hidden">
            {button && (
              <Link href={buttonLink || "#"} className="btn-blue ">
                View All
                <Image
                  src="/images/home/hero/buttonIcon.svg"
                  alt="button-icon"
                  width={24}
                  height={24}
                  className="w-5 h-5"
                />
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TitleComponent;
