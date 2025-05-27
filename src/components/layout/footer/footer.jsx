"use client";
import Image from "next/image";
import Link from "next/link";
import "./style.css";
import { usePathname } from "next/navigation";
import routes from "@/utilis/route";

const Footer = () => {
  const pathName = usePathname();

  if (pathName === "/auction-info") return;
  return (
    <div className=" w-full bg-black h-auto  flex justify-center items-center gap-[20px]">
      <div className=" flex justify-between items-center section-width flex-col md:flex-row gap-[60px] py-8   ">
        <div className="footer-col-1 md:w-[20%] h-full flex justify-center  items-start flex-col   gap-[30px]  ">
          <div className="footer-logo">
            <Image
              src="/images/footer/t20logo.svg"
              alt="T20 Mumbai"
              className="h-32 w-auto"
              width={203}
              height={100}
            />
          </div>
          {/* <div className="text-[#999999] font-plusjakarta font-medium  text-[19.47px] leading-[34.07px] tracking-normal">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac
            neque sit amet sem varius feugiat eget at quam.{" "}
          </div> */}
        </div>
        <div className="footer-col-2 w-[80%] h-full">
          {/* <div className=" w-full grid lg:grid-cols-5 md:grid-cols-3 grid-cols-1 gap-5 ">
            <div>
              <h4 className="text-[#E07E27] mb-2 font-inter font-normal text-[20px] leading-[22.5px] tracking-[-0.045em] align-middle uppercase">
                LATEST UPDATES
              </h4>
              <ul className="text-white  text-opacity-90 space-y-2 font-inter font-light text-[11px] leading-[16.5px] tracking-normal align-middle">
                <li>Standings</li>
                <li>Fixtures</li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#E07E27] mb-2 font-inter font-normal text-[20px] leading-[22.5px] tracking-[-0.045em] align-middle uppercase">
                TEAMS
              </h4>
              <ul className="text-white text-opacity-90 space-y-2 font-inter font-light text-[11px] leading-[16.5px] tracking-normal align-middle">
                <li>Aakash Tigers MWS</li>
                <li>Arcs Andheri</li>
                <li>Eagle Thane Strikers</li>
                <li>Bandra Blasters</li>
                <li>Sobo Supersonics</li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#E07E27]  mb-2 font-inter font-normal text-[20px] leading-[22.5px] tracking-[-0.045em] align-middle uppercase">
                POINTS TABLE
              </h4>
              <ul className="text-white text-opacity-90 space-y-2 font-inter font-light text-[11px] leading-[16.5px] tracking-normal align-middle">
                <li>Points Table</li>
                <li>Play Off</li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#E07E27]  mb-2 font-inter font-normal text-[20px] leading-[22.5px] tracking-[-0.045em] align-middle uppercase">
                STATISTICS
              </h4>
              <ul className="text-white text-opacity-90 space-y-2 font-inter font-light text-[11px] leading-[16.5px] tracking-normal align-middle">
                <li>Game Stats</li>
                <li>Player Stats</li>
                <li>Overall Statistics</li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#E07E27]  mb-2 font-inter font-normal text-[20px] leading-[22.5px] tracking-[-0.045em] align-middle uppercase">
                ABOUT US
              </h4>
              <ul className="text-white text-opacity-90 space-y-2 font-inter font-light text-[11px] leading-[16.5px] tracking-normal align-middle">
                <li>About</li>
                <li>What We Stand For</li>
                <li>Code of Conduct</li>
              </ul>
            </div>
             <div>
              <div className="footer-image flex justify-center flex-col gap-[20px] ">
                <Image
                  src="/images/footer/Appstore.svg"
                  alt="Google"
                  width={150}
                  height={100}
                />
                <Image
                  src="/images/footer/Googleplaystore.svg"
                  alt="Appstore"
                  width={150}
                  height={100}
                />
              </div>
            </div> 
          </div> */}
          <div className="flex-wrap w-full  flex justify-between items-center flex-row gap-[20px] pt-[50px]">
            <div className="flex   gap-1">
              <a
                href="#"
                className="hover:text-white font-inter font-bold text-[12px] leading-[18px] tracking-normal align-middle"
              >
                Terms and Conditions
              </a>
              <span>|</span>
              <a
                href="#"
                className="hover:text-white font-inter font-bold text-[12px] leading-[18px] tracking-normal align-middle"
              >
                Privacy Policy
              </a>
              <span>|</span>
              <a
                href="#"
                className="hover:text-white font-inter font-bold text-[12px] leading-[18px] tracking-normal align-middle"
              >
                Contact Us
              </a>
            </div>
            <div className="flex  gap-1 ">
              <div className="flex   gap-5">
                <div className="font-inter font-bold text-[12px] leading-[18px] tracking-normal align-middle">
                  Connect with us:
                </div>
                <div className="flex gap-4">
                  <a
                    target="_blank"
                    href={routes.instagram}
                  >
                    <Image
                      src="/images/footer/insta.svg"
                      alt="Google"
                      width={24}
                      height={24}
                    />
                  </a>
                  <a
                    target="_blank"
                    href={routes.twitter}
                  >
                    <Image
                      src="/images/footer/twitter.svg"
                      alt="Google"
                      width={24}
                      height={24}
                    />
                  </a>
                  <a
                    target="_blank"
                    href={routes.youtube}
                  >
                    <Image
                      src="/images/footer/youtube.svg"
                      alt="Google"
                      width={24}
                      height={24}
                    />
                  </a>
                  <a
                    target="_blank"
                    href={routes.facebook}
                  >
                    <Image
                      src="/images/footer/facebook.svg"
                      alt="Google"
                      width={24}
                      height={24}
                    />
                  </a>
                </div>
              </div>
            </div>
            <div className="font-inter font-bold text-[12px] leading-[18px] tracking-normal align-middle">
              © Copyright 2025 T20 Mumbai 2025{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
