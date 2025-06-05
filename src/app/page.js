import Fixtures from "@/components/home/Fixtures";
import Hero from "@/components/home/hero";
import Cards from "@/components/common/UpcomingFixtures";
import AboutT2C from "@/components/home/aboutT2C";
import Gallery from "@/components/home/Gallery.jsx";
import LatestUpdates from "@/components/home/LatestUpdates.jsx";
import HomeTeamSection from "@/components/home/HomeTeamSection";
import Socials from "@/components/home/Socials";
import News from "@/components/home/News";
import TopPlayers from "@/components/home/TopPlayers";
import Sponsorship from "@/components/home/Sponsorship";
import IconPlayers from "@/components/home/Iconplayers";
import HomeStandingsSection from "@/components/home/HomeStandingsSection";
import UpcomingFixturesSection from "@/components/home/UpcomingFixturesSection";
import { getStandings } from "./api/serverApi";

export default async function Home() {
  // const standingsData = await getStandings();

  return (
    <>
      <div>
        <Hero />
        {/* <UpcomingFixturesSection /> */}
        <HomeTeamSection />
        <LatestUpdates />
        {/* <IconPlayers /> */}
        {/* <HomeStandingsSection data={standingsData} /> */}
        {/* <TopPlayers /> */}
        <Socials />
        <Gallery />
        <Sponsorship />
        {/* <TopPlayers /> */}
        {/* <News /> */}
        {/* <Fixtures /> */}
        {/*    <AboutT2C /> */}
      </div>
    </>
  );
}
