import Socials from "@/components/home/Socials";
import Sponsorship from "@/components/common/Sponsorship";

export const metadata = {
  title: "Fan Wall | T20 Mumbai",
};

export default function FanWallPage() {
  return (
    <div>
      <div className="relative bg-gradient-to-bl from-[#1C398E] to-[#0E005A] pt-[100px] lg:pt-[140px]">
        <Socials hideHeader title="FAN WALL" hashtag="#ChanceSoduNako" />
      </div>
      <Sponsorship />
    </div>
  );
}
