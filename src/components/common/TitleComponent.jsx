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
      <div className="relative w-full">
      <Image
      src="/images/elements/small-title-bg.png"
      alt="Mobile Title"
      className="block md:hidden lg:hidden absolute z-0  w-full responsive-top"
      width={200}
      height={0}
      priority
      // style={{
      //   @media (min-width: 400px) {
      //       top: "3.5vw";
      //   }
      // }}
    />

    {/* Show on screens ≥ 1024px (laptop and up) */}
    <Image
      src="/images/elements/title-bg.png"
      alt="Desktop Title"
      className="hidden md:block lg:block absolute z-0  w-full "
      width={700}
      height={200}
      priority
    />

</div>
      <div className="flex items-center justify-between  px-8 py-6 relative z-10">
        <h3
          className="capitalize text-xl xl:text-3xl ml-20 italic"
          style={{
            background: "radial-gradient(43.3% 61.24% at 50% 50%, #FFF200 0%, #FFF200 26%, #FBB040 97%)",
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
              background: "radial-gradient(43.3% 61.24% at 50% 50%, #FFF200 0%, #FFF200 26%, #FBB040 97%)",
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
  );
};

export default TitleComponent;