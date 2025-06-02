"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import TeamSection from "@/components/teams/teamSec/TeamSection";
import MeetMyTeam from "@/components/teams/meetMyTeam/MeetMyTeam";
import TeamDetailsSeason3 from "@/constant/team/teamDetailsDataSeason3.json";
import fixtures3 from "@/utilis/fixtures/fixtures3";

export default function Teams() {
  const searchParams = useSearchParams(); 

  const teams = useMemo(() => {
    return [...TeamDetailsSeason3.data].sort((a, b) => a.Name.localeCompare(b.Name));
  }, []);

  const [selectedTeamIndex, setSelectedTeamIndex] = useState(0);
  const [teamDetails, setTeamDetails] = useState(null);

  useEffect(() => {
    const queryTeam = searchParams.get("team"); 
    
    if (queryTeam) {
      const decoded = decodeURIComponent(queryTeam);
      const index = teams.findIndex((t) => t.Name === decoded);
      const safeIndex = index >= 0 ? index : 0;
      setSelectedTeamIndex(safeIndex);
      setTeamDetails(teams[safeIndex]);
    } else {
      setSelectedTeamIndex(0);
      setTeamDetails(teams[0]);
    }
  }, [searchParams, teams]);

  useEffect(() => {
    if (teams[selectedTeamIndex]) {
      setTeamDetails(teams[selectedTeamIndex]);
    }
  }, [selectedTeamIndex, teams]);

  const handleTeamSelect = (index) => {
    setSelectedTeamIndex(index);
  };

  const LogoDetails = useMemo(
    () => teams.map((team) => ({ name: team.Name, logo: team.Logo_URL__c })),
    [teams]
  );

  if (!teamDetails) return null;

  return (
    <div>
      <TeamSection
        data={teams}
        fixtures={fixtures3}
        onTeamSelect={handleTeamSelect}
        LogoDetails={LogoDetails}
        TeamIndex={selectedTeamIndex}
      />
      <MeetMyTeam data={teamDetails} />
    </div>
  );
}
