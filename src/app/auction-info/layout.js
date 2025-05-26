import { formatPathToTitle } from "@/utilis/helper";
import routes from "@/utilis/route";
import Link from "next/link";

export default function DashboardLayout({ children }) {
  return (
    <div
      style={{
        height: "100vh",
        position: "relative",
        backgroundColor: "#0D0D0D",
      }}
      className="sm:p-[36px] p-[16px]"
    >
      <div
        style={{
          background:
            " linear-gradient(90deg, #203376 0%, #000 49.89%, #203376 101.04%), #161616",
          position: "relative",
          height: "80px",
          backgroundColor: "#161616",
          borderRadius: "12px",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <img
          src={"/images/elements/headerBadge.svg"}
          style={{
            left: 0,
            width: "fit-content",
            height: "80px",
          }}
          className="sm:block hidden"
          alt="badge"
        />
        <div
          style={{
            width: "95%",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Link href={routes.home}>
              <img
                src={"/images/home/mca-logo.png"}
                style={{ height: "50px", width: "auto" }}
                alt="logo"
              />
            </Link>
          </div>
          <div>
            <h3
              style={{
                color: "#fff",
                fontWeight: 600,
                textTransform: "uppercase",
                fontStyle: "italic",
              }}
            >
              Team Details
            </h3>
          </div>
          <div>
            <img
              src={"/images/home/mcaI20Logo.svg"}
              className="sm:h-[100px] h-[50px] w-auto"
              alt="logo"
            />
          </div>
        </div>
      </div>
      <div
        style={{
          backgroundSize: "cover",
          width: "100%",
          height: "calc(100vh - 152px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "36px",
        }}
      >
        <div
          style={{
            height: "calc(100% - 32px)",
            width: "100%",
            overflowY: "scroll",
            borderRadius: "12px",
            backgroundImage: `url('/images/teamDetails/adminTeamBg.png')`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            // overflowX: "hidden",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
