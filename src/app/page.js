import Hero from "@/components/home/hero";
import DraftArena from "@/components/home/DraftArena";
import LatestUpdates from "@/components/home/LatestUpdates";
import Socials from "@/components/home/Socials";
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
      <Socials />

      <Sponsorship />
    </div>
  );
}
