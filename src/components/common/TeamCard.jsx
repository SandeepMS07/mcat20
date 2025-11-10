import { teamGradients } from "@/utilis/helper";
import Image from "next/image";
import { useRouter } from "next/navigation";

const TeamCard = ({ data }) => {
  const router = useRouter();

  const gradient = teamGradients[data?.Name] || { from: "#1e1e1e", to: "#444" };

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
    // router.push(`/auction-info?teamId=${data.Id}&setStepValue=2`);
    router.push(`/teams?team=${encodeURIComponent(data.Name)}`);
  };

  return (
    <div
      // bg-gradient-to-b from-[${item.gradient.from}] to-[${item.gradient.to}]
      className={`p-4 rounded-xl flex justify-center relative `}
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
      <div className="relative">
        {/* <Image
          src={data.logo}
          width={100}
          height={100}
          className="w-auto xl:h-32 h-28 mx-auto"
          alt="Logo"
        /> */}
        <img
          src={
            data?.Name === "Aakash Tigers MWS"
              ? "https://turbostart.blob.core.windows.net/team-logos/Artboard%201.png"
              : data?.Name === "MSC Maratha Royals"
              ? "https://mcadirectory.blob.core.windows.net/dev/4441894866960012-shivajiParkLions.png"
              : data?.Name === "Triumph Knights Mumbai North East"
              ? "https://mcadirectory.blob.core.windows.net/dev/007792959990218895-triumphKnights.png"
              :data?.Name === "Arcs Andheri" ? "https://turbostart.blob.core.windows.net/team-logos/2. Andheri Arcs.jpg"
              :data?.Name === "SoBo Mumbai Falcons" ? "https://turbostart.blob.core.windows.net/team-logos/Artboard%201%20(2).png"
              :data?.Name === "North Mumbai Panthers" ? "https://turbostart.blob.core.windows.net/team-logos/Artboard%201%20(1).png"
              :data?.Name === "Eagle Thane Strikers" ? "https://turbostart.blob.core.windows.net/team-logos/Eagle%20Thane%20Strikers%20-%20LOGO%20NEW%20-%20Final_18ver.png"
              :data?.Name === "Bandra Blasters" ? "https://turbostart.blob.core.windows.net/team-logos/image.png"
              : data?.Logo_URL__c || "/images/logo/playerTeamLogo.png"
          }
          alt="Team Logo"
          width={60}
          height={60}
          className="w-auto xl:h-32 h-28 mx-auto"
        />
        {data.Name && (
          <p className="text-white text-center mt-10">{data.Name}</p>
        )}
      </div>
    </div>
  );
};

export default TeamCard;
