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
    title: "Latest News",
    path: `${routes.latestUpdates}`,
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
    title: "Fan Wall",
    path: `${routes.fanWall}`,
  },
  {
    title: "Fantasy",
    path: `${routes.fantasy}`,
    requiresAuth: true,
    appendToken: true,
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
