import Hero from "@/components/home/hero";
// import DraftArena from "@/components/home/DraftArena";
import AnthemBanner from "@/components/home/AnthemBanner";
import HomeStandingsSection from "@/components/home/HomeStandingsSection";
import LatestUpdates from "@/components/home/LatestUpdates";
import Socials from "@/components/home/Socials";
import FanPoll from "@/components/home/FanPoll";
import FanPollPopupAutoMount from "@/components/home/FanPollPopupAutoMount";
import Sponsorship from "@/components/common/Sponsorship";
import Gallery from "@/components/home/Gallery";

export default async function Home() {
  return (
    <div>
      <Hero />
      <AnthemBanner />
      {/* <HomeStandingsSection /> */}
      <Gallery />
      <LatestUpdates />
      {/* <FeaturedPlayers /> */}
      <div className="relative bg-gradient-to-bl from-[#1C398E] to-[#0E005A]">
        <Socials />
        <FanPoll />
      </div>

      <Sponsorship />
      <FanPollPopupAutoMount />
    </div>
  );
}
