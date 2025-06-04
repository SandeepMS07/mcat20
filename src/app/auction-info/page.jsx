"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
// import { getPlayersDetails, getTeamDetails } from "@/utils/apiService";
// import {
//   formatToIndianCurrencyWords2,
//   mapHighestLevelToCategory,
// } from "@/utils/helper";
// import { playerTeamLogo } from "@/assets";
import { teamDetailsData } from "./data";
import teamDetailsDataSeason3 from "../../constant/team/teamDetailsDataSeason3.json";
import {
  formatToIndianCurrencyWords2,
  mapHighestLevelToCategory,
} from "@/utilis/helper";
import AdminTeamSection from "./components/AdminTeamSection";
import { useSearchParams } from "next/navigation";

const page = () => {
  const searchParams = useSearchParams();
  const teamId = searchParams.get("teamId");
  const setStepValue = searchParams.get("setStepValue");
  const [loading, setLoading] = useState(false);
  const [teamDetails, setTeamDetails] = useState(teamDetailsDataSeason3.data);
  const [step, setStep] = useState(setStepValue || 1);
  const [selectedTeamIndex, setSelectedTeamIndex] = useState(0);

  const [selectedTeamId, setSelectedTeamId] = useState(
    teamId || teamDetails?.[0]?.Id || null
  );

  const [isNameSortedAsc, setIsNameSortedAsc] = useState(true);
  const [sortByName, setSortByName] = useState(false);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);
  //       const teamsRes = await getTeamDetails();
  //       if (teamsRes?.data?.success) {
  //         setTeamDetails(teamsRes.data.data);
  //       }
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching team details:", error);
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, []);

  // const team = teamDetails?.[selectedTeamIndex];

  const team = teamDetails?.find((t) => t.Id === selectedTeamId);

  const players = team?.Player_Registrations__r?.records || [];

  const getCategoryCount = (level) =>
    players.filter((p) => p.Recent_Competitive_Level__c === level).length;

  const remainingFundFormatted = formatToIndianCurrencyWords2(
    team?.Fund_Remaining__c
  );
  const totalFundFormatted = formatToIndianCurrencyWords2(team?.Total_Fund__c);
  const totalPlayers = players.length;

  const sortedPlayers = [...players].sort((a, b) => {
    const aCategory = mapHighestLevelToCategory(a?.Recent_Competitive_Level__c);
    const bCategory = mapHighestLevelToCategory(b?.Recent_Competitive_Level__c);

    if (sortByName) {
      const nameA = a.Player__r?.Name || "";
      const nameB = b.Player__r?.Name || "";
      return isNameSortedAsc
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    }

    const categoryOrder = {
      "Icon Player": 1,
      "Senior Player": 2,
      "Emerging Player": 3,
      "Development Player": 4,
      Unknown: 5,
    };

    const orderDiff = categoryOrder[aCategory] - categoryOrder[bCategory];
    if (orderDiff !== 0) return orderDiff;

    // fallback alphabetical within category
    return (a.Player__r?.Name || "").localeCompare(b.Player__r?.Name || "");
  });

  if (loading) {
    return <div className="text-white text-center py-10">Loading...</div>;
  }

  return (
    <div className="p-4 md:p-6 lg:p-12 text-white">
      {step === 1 ? (
        <div className="flex justify-center mb-5 max-lg:pt-10">
          <AdminTeamSection
            teamDetails={teamDetails}
            setStep={setStep}
            setSelectedTeamId={setSelectedTeamId}
          />
        </div>
      ) : (
        <>
          <button
            className="text-white text-lg flex items-center gap-2 mb-5"
            onClick={() => setStep(1)}
          >
            Go Back
          </button>

          <div className="flex flex-wrap gap-5 overflow-x-auto pb-6">
            {[...teamDetails]
              .sort((a, b) => a.Name.localeCompare(b.Name))
              ?.map((team, i) => {
                return (
                  <div
                    key={i}
                    // onClick={() => setSelectedTeamIndex(i)}

                    onClick={() => setSelectedTeamId(team.Id)}
                    className={`flex justify-center rounded-xl  p-2 cursor-pointer  lg:flex-1 bg-[#ffffff80]   ${
                      selectedTeamId === team.Id ? "border-white border" : ""
                    }`}
                  >
                    <img
                      src={team?.Logo_URL__c || playerTeamLogo}
                      alt="Team Logo"
                      width={100}
                      height={100}
                      className="object-contain"
                    />
                  </div>
                );
              })}
          </div>

          <div className="grid  lg:grid-cols-4 md:grid-cols-2 grid-cols-1 justify-between bg-black/40 backdrop-blur  rounded-xl mb-10 ">
            <div className=" p-4  flex justify-center">
              <img
                src={team?.Logo_URL__c || "/images/logo/playerTeamLogo.png"}
                alt="logo"
                width={200}
                height={200}
                className="object-contain w-[200px] h-[200px]"
              />
            </div>

            <div className="lg:col-span-2 grid grid-cols-2 gap-4 h-fit my-auto  p-4 ">
              {[
                {
                  label: "Icon",
                  count: getCategoryCount("Indian senior team"),
                  minPlayerCount: 1,
                },
                {
                  label: "Senior",
                  count: getCategoryCount(
                    "First class, list A, BCCI Senior Men T20"
                  ),
                  minPlayerCount: 4,
                },
                {
                  label: "Emerging",
                  count: getCategoryCount(
                    "Mumbai age group team (under 23 or under 19)"
                  ),
                  minPlayerCount: 5,
                },
                {
                  label: "Development",
                  count: getCategoryCount("Local club team"),
                  minPlayerCount: 5,
                },
              ].map((level, idx) => (
                <div
                  key={idx}
                  className="p-4 border-l  border-gray-200/30 bg-gradient-to-r from-white/10 to-transparent h-fit"
                >
                  <h4 className="text-white  sm:text-lg text-sm  font-medium">
                    {/* {mapHighestLevelToCategory(level)} (
                    {getCategoryCount(level)}) */}
                    {level.label} ({level.count}/{level.minPlayerCount}){" "}
                  </h4>
                </div>
              ))}
            </div>

            <div className="basis-1/5 p-4 border-l border-gray-200/30 text-center bg-gradient-to-r from-white/10 to-transparent flex items-center flex-col justify-center my-6">
              <h3 className=" font-medium mb-2 text-gray-500">Total Players</h3>
              <h3 className="  font-bold text-white">{totalPlayers}/18</h3>
            </div>

            {/* <div className="basis-1/5 grid grid-cols-1 grid-rows-2  sm:text-left text-center   border-l border-gray-200/30 bg-gradient-to-r from-white/10 to-transparent">
              <div className="border-b border-gray-600  flex  justify-center flex-col p-4">
                <h2 className=" font-bold text-white  mb-1">
                  {totalFundFormatted}
                </h2>
                <div className="text-xs">Team purse</div>
              </div>
              <div className="   flex  first-line: justify-center flex-col p-4">
                <h2 className=" font-bold text-white  mb1">
                  {remainingFundFormatted}
                </h2>
                <div className="text-xs">Fund remaining</div>
              </div>
            </div> */}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-black/60 text-white text-sm border border-gray-700 rounded-xl">
              <thead className="bg-[#1c2c66d6]">
                <tr>
                  <th className="text-left p-5">SI.No</th>
                  <th
                    className="text-left p-5"
                    onClick={() => {
                      if (!sortByName) {
                        setSortByName(true);
                        setIsNameSortedAsc(true);
                      } else if (isNameSortedAsc) {
                        setIsNameSortedAsc(false);
                      } else {
                        setSortByName(false); // Reset to category sort
                      }
                    }}
                  >
                    Name of the player{" "}
                    <span className="text-xs">
                      {sortByName ? (isNameSortedAsc ? "▲" : "▼") : "↕"}
                    </span>
                  </th>
                  <th className="text-left p-5">Category</th>
                  <th className="text-left p-5">Role</th>
                  {/* <th className="text-left p-5">Base price</th>
                  <th className="text-left p-5">Purchased price</th> */}
                </tr>
              </thead>
              <tbody>
                {/* {[...players]
                  .sort((a, b) =>
                    (a.Player__r?.Name || "").localeCompare(
                      b.Player__r?.Name || ""
                    )
                  )
                  .map((player, index) => ( */}
                {sortedPlayers.map((player, index) => (
                  <tr
                    key={player.playerId}
                    className="border-b border-white/20"
                  >
                    <td className=" p-5">{index + 1}.</td>
                    <td className=" p-5">{player.Player__r?.Name}</td>
                    <td className=" p-5">
                      {mapHighestLevelToCategory(
                        player?.Recent_Competitive_Level__c
                      )}
                    </td>
                    <td className=" p-5">{player.Primary_Role__c}</td>
                    {/* <td className=" p-5">
                      {player?.Base_Price__c != null
                        ? `₹${player.Base_Price__c.toLocaleString("en-IN")}`
                        : "--"}
                    </td>
                    <td className=" p-5">
                      {player?.Winning_Bid__c != null
                        ? `₹${player.Winning_Bid__c.toLocaleString("en-IN")}`
                        : "--"}
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default page;
