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
    title: "Viewers' Choice",
    path: `${routes.choice}`,
  },
  {
    title: "Buy Tickets",
    path: "https://link.district.in/DSTRKT/t20mumbailandingpagesocials",
  },
  {
    title: "Fantasy",
    path: "#",
    requiresAuth: true,
    ssoHandoff: true,
    // Each child triggers the same SSO hand-off as the parent, but lands
    // on a specific fantasy-app page. The fantasy app's SsoBootstrap
    // preserves the pathname while stripping ?code=, so the user ends
    // up on the deep-linked page after auth exchange.
    children: [
      { title: "Dashboard",   path: "#", destPath: "/",            requiresAuth: true, ssoHandoff: true },
      { title: "Matches",     path: "#", destPath: "/matches",     requiresAuth: true, ssoHandoff: true },
      { title: "Leaderboard", path: "#", destPath: "/leaderboard", requiresAuth: true, ssoHandoff: true },
    ],
  },
  // {
  //   title: "Fan Zone",
  //   path: `${routes.fanPoll}`,
  //   children: [
  //     { title: "Fan Poll", path: `${routes.fanPoll}` },
  //     { title: "Viewers' Choice", path: `${routes.choice}` },
  //   ],
  // },
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
