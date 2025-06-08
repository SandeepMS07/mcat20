import routes from "@/utilis/route";
import Image from "next/image";
import Link from "next/link";
import "./style.css";

const TitleComponent = ({
  title,
  orange = false,
  button,
  buttonLink,
  buttonText = "View All",
  hideButtonOnMobile = false,
}) => {
  return (
    <div className="w-full bg-cover bg-center mb-12 ">
      <div className="relative">
        <div className=" w-full h-full justify-center">
          <Image
            src="/images/elements/small-title-bg.png"
            alt="Mobile Title"
            className="block md:hidden    w-full"
            width={200}
            height={0}
            priority
          />
          <Image
            src="/images/elements/title-bg.png"
            alt="Desktop Title"
            className="hidden md:block lg:block   w-full "
            width={700}
            height={200}
            priority
          />
        </div>
        <div className="flex items-center justify-between     z-10 absolute h-full top-0 left-0 right-0">
          <h3
            className="capitalize  md:text-lg lg:text-xl xl:text-2xl md:ml-16 ml-12 italic px-2"
            style={{
              background:
                "radial-gradient(43.3% 61.24% at 50% 50%, #FFF200 0%, #FFF200 26%, #FBB040 97%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text", // fallback
              color: "transparent", // ensure text color is transparent
            }}
          >
            {title}
          </h3>
          {button && (
            <Link
              href={buttonLink || "#"}
              className={`flex items-center gap-2 mr-12 ${
                hideButtonOnMobile ? "hidden md:flex" : "flex"
              }`}
              style={{
                background:
                  "radial-gradient(43.3% 61.24% at 50% 50%, #FFF200 0%, #FFF200 26%, #FBB040 97%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text", // fallback
                color: "transparent", // ensure text color is transparent
              }}
            >
              {buttonText}
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
    </div>
  );
};

export default TitleComponent;
