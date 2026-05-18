"use client";
import React, { useEffect, useMemo, useState } from "react";
import TeamCard from "../common/TeamCard";
import TitleComponent from "../common/TitleComponent";
import { SwiperSlide } from "swiper/react";
import { Carousel } from "../Carousel";
import routes from "@/utilis/route";
import teamDetailsDataSeason3 from "../../constant/team/teamDetailsDataSeason3.json";
import { getTeamDetailsClient } from "@/app/api/clientApi";
// import CountdownTimer from "./CountdownTimer";

const MEN_TAB = "men";
const WOMEN_TAB = "women";
const FALLBACK_TEAMS = teamDetailsDataSeason3?.data || [];
const WOMENS_TEAM_FALLBACK_NAMES = ["Aakash Tigers MWS", "SoBo Mumbai Falcons"];

const getTeamBucket = (teamType = "") =>
  `${teamType}`.toLowerCase().includes("women") ? WOMEN_TAB : MEN_TAB;

const getFilteredTeams = (teams, bucket) =>
  [...(teams || [])]
    .filter((team) => getTeamBucket(team?.Team_Type__c) === bucket)
    .sort((a, b) => (a?.Name || "").localeCompare(b?.Name || ""));

const normalizeWomenName = (name = "") =>
  name.replace(/\s*\(w\)\s*$/i, "").trim().toLowerCase();

const HomeTeamSection = () => {
  const [allTeams, setAllTeams] = useState(FALLBACK_TEAMS);

  useEffect(() => {
    const fetchTeams = async () => {
      const response = await getTeamDetailsClient();
      const records = response?.data || [];

      if (!Array.isArray(records) || records.length === 0) {
        return;
      }

      setAllTeams(records);
    };

    fetchTeams();
  }, []);

  const mensTeams = useMemo(
    () => getFilteredTeams(allTeams, MEN_TAB),
    [allTeams]
  );

  const womensTeams = useMemo(() => {
    const apiWomensTeams = getFilteredTeams(allTeams, WOMEN_TAB);
    const fallbackWomensTeams = WOMENS_TEAM_FALLBACK_NAMES.map((teamName) =>
      allTeams.find(
        (team) => normalizeWomenName(team?.Name) === normalizeWomenName(teamName)
      )
    ).filter(Boolean);

    const baseWomensTeams =
      apiWomensTeams.length > 0 ? apiWomensTeams : fallbackWomensTeams;

    // Handle variants like "Thane Skyrisers" and "Thane Skyrisers (W)" as one team.
    const dedupedByName = new Map();
    for (const team of baseWomensTeams) {
      const key = normalizeWomenName(team?.Name);
      if (!dedupedByName.has(key)) {
        dedupedByName.set(key, team);
      }
    }

    return [...dedupedByName.values()].sort((a, b) =>
      (a?.Name || "").localeCompare(b?.Name || "")
    );
  }, [allTeams]);

  return (
    <>
      {/* <div className="pl-5 mt-8 md:hidden block"><CountdownTimer/></div> */}
      <div className="relative">
        <img
          src="/images/elements/section-element.png"
          className="absolute left-0 bottom-0 rotate-180 md:block hidden"
          alt="element"
        />

        <div className="section-width padding-top padding-bottom">
          <TitleComponent
            title={"Men's Teams"}
            button={false}
            buttonLink={routes.teams}
          />
          <div className="w-full flex flex-col gap-7 relative">
            <div className="w-full overflow-x-auto  scrollbar-hide">
              <div className="sm:grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 2xl:gap-8 gap-5 hidden">
                {mensTeams?.map((item, i) => {
                  return <TeamCard data={item} key={i} />;
                })}
              </div>
              <div className="w-full sm:hidden block">
                <Carousel
                  sectionName="clientLogo"
                  sliderPerView={1}
                  spaceBetween={50}
                  loop={true}
                >
                  {mensTeams.map((item, i) => (
                    <SwiperSlide key={i}>
                      <TeamCard data={item} key={i} />
                    </SwiperSlide>
                  ))}
                </Carousel>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <TitleComponent title={"Women's Teams"} button={false} />
            <div className="w-full flex flex-col gap-7 relative mt-8">
              <div className="w-full overflow-x-auto scrollbar-hide">
                <div className="sm:grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 2xl:gap-8 gap-5 hidden">
                  {womensTeams.map((item, i) => (
                    <TeamCard data={item} key={i} />
                  ))}
                </div>
                <div className="w-full sm:hidden block">
                  <Carousel
                    sectionName="womensTeam"
                    sliderPerView={1}
                    spaceBetween={50}
                    loop={true}
                  >
                    {womensTeams.map((item, i) => (
                      <SwiperSlide key={i}>
                        <TeamCard data={item} key={i} />
                      </SwiperSlide>
                    ))}
                  </Carousel>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeTeamSection;
