import Hero from "@/components/home/hero";
import DraftArena from "@/components/home/DraftArena";
import LatestUpdates from "@/components/home/LatestUpdates";
import Socials from "@/components/home/Socials";
import FanPoll from "@/components/home/FanPoll";
import Sponsorship from "@/components/common/Sponsorship";

export default async function Home() {
  return (
    <div>
      <Hero />
      <DraftArena />
      {/* <HomeStandingsSection />  */}
      {/* <Gallery /> */}
      <LatestUpdates />
      {/* <FeaturedPlayers /> */}
      <div className="relative bg-gradient-to-bl from-[#1C398E] to-[#0E005A]">
        <Socials />
        <FanPoll />
      </div>

      <Sponsorship />
    </div>
  );
}
