import Image from "next/image";
import TitleComponent from "../common/TitleComponent";
import CustomTable from "../common/CustomTable";
import Link from "next/link";
import routes from "@/utilis/route";
import {
  season3TeamLogo,
  teamLogoBN,
  teamLogoStats,
  teamShortName,
} from "@/utilis/helper";
import "./style.css";

const headers = [
  "RANK",
  "TEAM",
  "MP",
  "WON",
  "LOST",
  "TIED",
  "N/R",
  "NET RR",
  "PTS",
];

const headerStyles = {
  className: "bg-[#E07E27] text-black text-center",
};
const tBodyStyles = {
  className: "bg-[#0F1A2D] text-white text-left",
};
const rowStyles = {
  className: "p-5",
};

const HomeStandingsSection = ({ data }) => {
  console.log(data, "F;kdsl;");
  const season3 = Array.isArray(data?.data?.season_3?.points)
    ? data.data.season_3?.points
    : [];
  const tableData =
    season3.map((team, index) => {
      const teamLogo = season3TeamLogo[team?.team_name || team.TeamName] || "";
      const teamName = teamShortName[team?.team_name || team.TeamName] || "";

      return {
        RANK: index + 1,
        TEAM: (
          <div className="flex items-center gap-2 min-w-40 text-left">
            <div className="w-6 h-6 flex justify-center items-center mr-2">
              <img
                src={team?.TeamLogo}
                alt="logo"
                className="object-contain w-full h-full"
              />
            </div>
            {team?.TeamName}
          </div>
        ),
        MP: parseInt(team?.Matches || "0"),
        WON: parseInt(team?.Wins || "0"),
        LOST: parseInt(team?.Loss || "0"),
        TIED: parseInt(team?.Tied || "0"),
        "N/R": parseInt(team?.NoResult || "0"),
        "NET RR": parseFloat(team?.NetRunRate || "0").toFixed(3),
        PTS: parseInt(team?.Points || "0"),
      };
    }) || [];

  return (
    <div className="pt-20 relative">
      <img
        src="/images/elements/section-element.png"
        className="absolute right-0 top-0 md:block hidden"
        alt="element"
      />
      <img
        src="/images/elements/section-element.png"
        className="absolute left-0 bottom-0 rotate-180  md:block hidden "
        alt="element"
      />
      <div className="section-width padding-bottom pt-5">
        <TitleComponent
          hideButtonOnMobile
          title="standings Season 3"
          button
          buttonLink={routes.standing}
        />

        <div>
          {tableData?.length > 0 ? (
            <CustomTable
              headers={headers}
              data={tableData}
              customRenderers={{}}
              headerStyles={headerStyles}
              tBodyStyles={tBodyStyles}
              rowStyles={rowStyles}
            />
          ) : (
            <div className="text-center py-10 text-gray-400">
              No data available for this team in the selected season.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeStandingsSection;
