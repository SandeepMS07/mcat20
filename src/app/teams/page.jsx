"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import TeamSection from "@/components/teams/teamSec/TeamSection";
import MeetMyTeam from "@/components/teams/meetMyTeam/MeetMyTeam";
import { getTeamDetailsClient } from "@/app/api/clientApi";

const MEN_TAB = "men";
const WOMEN_TAB = "women";
const TEAM_TYPE_QUERY_PARAM = "type";
const ALLOWED_TEAM_TYPES = new Set([MEN_TAB, WOMEN_TAB]);

const getTeamBucket = (teamType = "") =>
  `${teamType}`.toLowerCase().includes("women") ? WOMEN_TAB : MEN_TAB;

const getFilteredTeams = (teams, bucket) =>
  [...(teams || [])]
    .filter((team) => getTeamBucket(team?.Team_Type__c) === bucket)
    .sort((a, b) => (a?.Name || "").localeCompare(b?.Name || ""));

export default function Teams() {
  const searchParams = useSearchParams();
  const hasInitializedRef = useRef(false);
  const [allTeams, setAllTeams] = useState([]);
  const [activeTeamType, setActiveTeamType] = useState(MEN_TAB);
  const [selectedTeamIndex, setSelectedTeamIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeams = async () => {
      setIsLoading(true);
      setError("");

      const response = await getTeamDetailsClient();
      const records = response?.data || [];

      if (!Array.isArray(records) || records.length === 0) {
        setAllTeams([]);
        setError("Unable to load teams right now.");
        setIsLoading(false);
        return;
      }

      setAllTeams(records);
      setIsLoading(false);
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    if (!allTeams.length) {
      return;
    }

    if (hasInitializedRef.current) {
      return;
    }

    const queryTeam = searchParams.get("team");
    const queryType = (
      searchParams.get(TEAM_TYPE_QUERY_PARAM) || ""
    ).toLowerCase();

    if (queryTeam) {
      const decoded = decodeURIComponent(queryTeam);
      const matchedTeam = allTeams.find((team) => team?.Name === decoded);

      if (matchedTeam) {
        const nextBucket = getTeamBucket(matchedTeam?.Team_Type__c);
        const teamsForBucket = getFilteredTeams(allTeams, nextBucket);
        const index = teamsForBucket.findIndex(
          (team) => team?.Id === matchedTeam?.Id
        );

        setActiveTeamType(nextBucket);
        setSelectedTeamIndex(index >= 0 ? index : 0);
        hasInitializedRef.current = true;
        return;
      }
    }

    if (ALLOWED_TEAM_TYPES.has(queryType)) {
      setActiveTeamType(queryType);
      setSelectedTeamIndex(0);
      hasInitializedRef.current = true;
      return;
    }

    setActiveTeamType(MEN_TAB);
    setSelectedTeamIndex(0);
    hasInitializedRef.current = true;
  }, [allTeams, searchParams]);

  const teams = useMemo(
    () => getFilteredTeams(allTeams, activeTeamType),
    [allTeams, activeTeamType]
  );

  useEffect(() => {
    if (selectedTeamIndex > teams.length - 1) {
      setSelectedTeamIndex(0);
    }
  }, [teams, selectedTeamIndex]);

  const handleTeamSelect = (index) => {
    setSelectedTeamIndex(index);
  };

  const handleTeamTypeChange = (tab) => {
    if (tab === activeTeamType) {
      return;
    }
    setActiveTeamType(tab);
    setSelectedTeamIndex(0);
  };

  const teamDetails = teams[selectedTeamIndex] || null;

  if (isLoading) {
    return (
      <div className="w-full min-h-screen py-32 text-center text-white bg-[#162362]">
        Loading teams...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen py-32 text-center text-white bg-[#162362]">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-[#101b52]">
      {teamDetails ? (
        <>
          <TeamSection
            data={teams}
            onTeamSelect={handleTeamSelect}
            TeamIndex={selectedTeamIndex}
            activeTeamType={activeTeamType}
            onTeamTypeChange={handleTeamTypeChange}
            menTab={MEN_TAB}
            womenTab={WOMEN_TAB}
          />
          <MeetMyTeam data={teamDetails} />
        </>
      ) : (
        <div className="w-full py-20 text-center text-white">
          No teams found for this category.
        </div>
      )}
    </div>
  );
}
