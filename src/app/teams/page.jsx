"use client";
import AboutT2C from "@/components/home/aboutT2C";
import Hero from "@/components/hero/Hero";
import MeetMyTeam from "@/components/teams/meetMyTeam/MeetMyTeam";
import TeamSection from "@/components/teams/teamSec/TeamSection";
import React, { useEffect, useState } from "react";
import TeamDetailsSeason3 from "@/constant/team/teamDetailsDataSeason3.json";
import fixtures3 from "@/utilis/fixtures/fixtures3";

const Teams = () => {
  const [season, setSeason] = useState("Season 3");
  const [selectedTeamIndex, setSelectedTeamIndex] = useState(0);
  const [teamDetails, setTeamDetails] = useState(
    TeamDetailsSeason3.data[selectedTeamIndex]
  );

  const handleTeamSelect = (teamIndex) => {
    setSelectedTeamIndex(teamIndex);
    console.log("Selected team index:", teamIndex);
  };

  const teams = TeamDetailsSeason3.data;

  const LogoDetails = teams.map((team) => ({
    name: team.Name,
    logo: team.Logo_URL__c,
  }));

  // Based on the Team index get the team details of that particular team
  useEffect(() => {
    setTeamDetails(TeamDetailsSeason3.data[selectedTeamIndex]);
  }, [selectedTeamIndex]);

  return (
    <div>
      <TeamSection
        data={teams}
        fixtures={fixtures3}
        onTeamSelect={handleTeamSelect}
        LogoDetails={LogoDetails}
      />
      <MeetMyTeam data={teamDetails} />
    </div>
  );
};

export default Teams;
