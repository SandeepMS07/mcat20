import routes from "@/utilis/route.js";

export const navLinks = [
  {
    title: "Home",
    path: `${routes.home}`,
  },
  {
    title: "Fixtures",
    path: `${routes.fixtures}`,
  },
  {
    title: "Points Table",
    path: `${routes.pointsTable}`,
  },
  {
    title: "Gallery",
    path: `${routes.gallery}`,
    children: [
      { title: "Images", path: `${routes.gallery}` },
      { title: "Videos", path: `${routes.videos}` },
    ],
  },
  {
    title: "Teams",
    path: `${routes.teams}`,
  },
  {
    title: "Stats",
    path: `${routes.stats}`,
  },
  {
    title: "Buy Tickets",
    path: "https://link.district.in/DSTRKT/t20mumbailandingpagesocials",
  },
  {
    // SSO hand-off into the fantasy app. The navbar trades the user's
    // access JWT for a 30-second one-time code via /v1/auth/sso-handoff,
    // then redirects to FANTASY_WEB_BASE/?code=<code>. path is unused for
    // this entry (kept for shape parity with the other nav items).
    title: "Fantasy",
    path: "#",
    requiresAuth: true,
    ssoHandoff: true,
  },
  {
    title: "Fan Zone",
    path: `${routes.fanPoll}`,
    children: [
      { title: "Fan Poll", path: `${routes.fanPoll}` },
      { title: "Viewers' Choice", path: `${routes.choice}` },
    ],
  },
  // {
  //   title: "About Us",
  //   path: `${routes.aboutUs}`,
  // },

  // {
  //   title: "Gallery",
  //   path: `${routes.gallery}`,
  // },
  // {
  //   title: "Standings",
  //   path: `${routes.standing}`,
  // },
  // {
  //   title: "Your Photos",
  //   path: `${routes.yourPhotos}`,
  // },
  // {
  //   title: "Match Centre",
  //   path: `${routes.fixtures}`,
  // },
  // {
  //   title: "Stats",
  //   path: `${routes.stats}`,
  // },
  // {
  //   title: "About Us",
  //   path: `${routes.aboutUs}`,
  // },
];
export const NavButtons = [];
