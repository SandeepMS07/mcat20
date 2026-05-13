import { teamGradients } from "@/utilis/helper";
import Image from "next/image";
import { useRouter } from "next/navigation";

const normalizeTeamName = (name = "") =>
  name.replace(/\s*\(w\)\s*$/i, "").trim();

const TeamCard = ({ data }) => {
  const router = useRouter();
  const normalizedName = normalizeTeamName(data?.Name);

  const gradient =
    data?.Name === "To Be Announced"
      ? { from: "#FBC92E", to: "#262262" }
      : teamGradients[normalizedName] || { from: "#1e1e1e", to: "#444" };
  const isClickable = Boolean(data?.Id) && data?.Name !== "To Be Announced";

  // const handleClick = () => {
  //   router.push({
  //     pathname: "/auction-info",
  //     query: {
  //       teamId: data.Id,
  //       setStep: 1,
  //     },
  //   });
  // };

  const handleClick = () => {
    if (!isClickable) return;
    // router.push(`/auction-info?teamId=${data.Id}&setStepValue=2`);
    router.push(`/teams?team=${encodeURIComponent(data.Name)}`);
  };

  return (
    <div
      // bg-gradient-to-b from-[${item.gradient.from}] to-[${item.gradient.to}]
      className={`p-4 rounded-xl flex justify-center relative ${
        isClickable ? "cursor-pointer" : "cursor-default"
      }`}
      style={{
        background: `linear-gradient(to bottom, ${gradient.from}, ${gradient.to})`,
      }}
      onClick={handleClick}
    >
      <Image
        src={"/images/elements/teamCardRoundElement.png"}
        width={100}
        height={100}
        className="w-full h-full absolute top-0 left-0 rounded-xl opacity-60"
        alt="Logo"
      />
      <Image
        src={"/images/elements/teamCardElement.png"}
        width={100}
        height={100}
        className="w-full h-full absolute top-0 left-0 rounded-xl"
        alt="Logo"
      />
      <div className="relative flex min-h-[220px] w-full flex-col items-center justify-between">
        {/* <Image
          src={data.logo}
          width={100}
          height={100}
          className="w-auto xl:h-32 h-28 mx-auto"
          alt="Logo"
        /> */}
        <div className="flex h-[150px] w-full items-center justify-center">
          <img
            src={
              data?.Name === "To Be Announced"
                ? "/images/home/team/to-be-announced.png"
                : data?.Logo_URL__c || "/images/logo/playerTeamLogo.png"
            }
            alt="Team Logo"
            width={60}
            height={60}
            className={`w-auto mx-auto ${
              normalizedName === "Thane Skyrisers"
                ? "xl:h-40 h-36"
                : "xl:h-32 h-28"
            }`}
          />
        </div>
        {data.Name && (
          <p className="text-white text-center leading-snug min-h-[3.25rem] flex items-center justify-center">
            {data.Name}
          </p>
        )}
      </div>
    </div>
  );
};

export default TeamCard;
