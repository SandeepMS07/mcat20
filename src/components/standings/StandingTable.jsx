import Image from "next/image";
import React from "react";

const StandingTable = ({  data  }) => {
  return (
    <div className="w-full text-black flex flex-col gap-12">
      
        <PlayerTable />
    </div>
  );
};
 

const PlayerTable = () => {
  return (
    <div className="">
      <table className="min-w-full table-auto bg-[#0F1A2D] border-collapse text-sm">
        <thead className="text-black">
          <tr>
            <th className="py-4 px-4 text-center bg-[#E07E27] uppercase">
              Rank
            </th>
            <th className="py-4 px-4 text-left bg-[#E07E27] uppercase w-80">
              Team
            </th>
            <th className="py-4 px-4 text-center bg-[#E07E27] uppercase">MP</th>
            <th className="py-4 px-4 text-center bg-[#E07E27] uppercase">
              WON
            </th>
            <th className="py-4 px-4 text-center bg-[#E07E27] uppercase">
              Last
            </th>
            <th className="py-4 px-4 text-center bg-[#E07E27] uppercase">
              Tied
            </th>
            <th className="py-4 px-4 text-center bg-[#E07E27] uppercase">
              N/R
            </th>
            <th className="py-4 px-4 text-center bg-[#E07E27] uppercase">
              Net RR
            </th>
            <th className="py-4 px-4 text-center bg-[#E07E27] uppercase">
              pts
            </th>
          </tr>
        </thead>
        <tbody className="text-[#D8D8D8]">
          {playerData.map((player, index) => (
            <tr key={index} className="border-b border-[#222222]">
              <td className="py-5 px-4 border-r border-[#222222] text-center">
                {player.Rank}
              </td>
              <td className="py-5 px-4 border-r border-[#222222]">
                {player.Team}
              </td>
              <td className="py-5 px-4 border-r border-[#222222] text-[10px] text-center">
                {player.mat}
              </td>
              <td className="py-5 px-4 border-r border-[#222222] text-[10px] text-center">
                {player.won}
              </td>
              <td className="py-5 px-4 border-r border-[#222222] text-[10px] text-center">
                {player.tied}
              </td>
              <td className="py-5 px-4 border-r border-[#222222] text-[10px] text-center">
                {player.lost}
              </td>
              <td className="py-5 px-4 border-r border-[#222222] text-[10px] text-center">
                {player.nr}
              </td>
              <td className="py-5 px-4 border-r border-[#222222] text-[10px] text-center">
                {player.netrr}
              </td>
              <td className="py-5 px-4 border-r border-[#222222] text-[10px] text-center">
                {player.pts}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StandingTable;
