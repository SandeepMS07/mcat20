import Hero from "@/components/home/hero";
import DraftArena from "@/components/home/DraftArena";
import HomeStandingsSection from "@/components/home/HomeStandingsSection";
import LatestUpdates from "@/components/home/LatestUpdates";
import FeaturedPlayers from "@/components/home/FeaturedPlayers";
import Gallery from "@/components/home/Gallery";
import Socials from "@/components/home/Socials";
import FanPoll from "@/components/home/FanPoll";
import Sponsorship from "@/components/home/Sponsorship";

export default async function Home() {
  return (
    <div>
      <Hero />
      <DraftArena />
      <HomeStandingsSection />
      <Gallery />
      <LatestUpdates />
      <FeaturedPlayers />
      <Socials />
      <FanPoll />
      <Sponsorship />
    </div>
  );
}
