"use client";
import { useEffect } from "react";
import TitleComponent from "../common/TitleComponent";

const Socials = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="relative">
      <img
        src="/images/elements/section-element.png"
        className="absolute right-0 top-0 md:block hidden"
        alt="element"
      />
      {/* <img
        src="/images/elements/section-element.png"
        className="absolute left-0 bottom-0 rotate-180  md:block hidden "
        alt="element"
      /> */}
      <div className="section-width section-padding">
        <TitleComponent title={"Socials"} />
        {/* <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8 max-sm:w-fit mx-auto"> */}
        <div>
          <div
            className="elfsight-app-699da6b2-483b-4520-a7cd-82f1db1898af"
            data-elfsight-app-lazy
          />

          {/* <script
          src="https://static.elfsight.com/platform/platform.js"
          async
        ></script>
        <div
          class="elfsight-app-699da6b2-483b-4520-a7cd-82f1db1898af"
          data-elfsight-app-lazy
        ></div> */}
          {/* <Image
          src={"/images/home/social1.png"}
          width={400}
          height={400}
          alt="social img"
        />
        <Image
          src={"/images/home/social2.png"}
          width={400}
          height={400}
          alt="social img"
        />
        <Image
          src={"/images/home/social3.png"}
          width={400}
          height={400}
          alt="social img"
        /> */}
          {/* <div className="">
          <div className="bg-[#E07E27] px-5 py-5 rounded-t-xl">
            <p>@t20mumbai</p>
          </div>
        </div> */}
        </div>
      </div>
    </div>
  );
};

export default Socials;
