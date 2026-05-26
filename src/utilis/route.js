const routes = {
  //  navbar links
  home: "/",
  about: "#",
  features: "#",
  pricing: "#",
  teams: "/teams",
  stats: "/stats",
  fixtures: "/fixtures",
  matchcentre: "/matchcentre",
  latestUpdates: "/news",
  aboutUs: "/aboutUs",
  media: "/media",
  gallery: "/gallery",
  liveAuction: "https://mca-auction.ken42.com/admin/team-details",
  standing: "/standings",

  // navbar buttons
  signIn: "#",
  investNow: "#",
  blog: "#",
  contact: "#",
  howToUse: "#",
  roadmap: "#",
  yourPhotos: "your-photos",
  pointsTable: "/points-table",

  videos: "/videos",
  // Fantasy is opened via the SSO hand-off in navbar.jsx (not a direct
  // navigation), so the fantasy *app* URL doesn't live here — it lives in
  // FANTASY_WEB_BASE (src/constant/index.ts) and is built with ?code= at
  // hand-off time. This entry stays as the in-site "Coming Soon" teaser.
  fantasy: "/fantasy",
  fanWall: "/fan-wall",
  fanPoll: "/fan-poll",
  choice: "/choice",

  privacyPolicy: "/privacy_policy",
  termsAndConditions: "/creators-league-tc",
  // social links
  // linkedin: "https://www.linkedin.com/company/mca-sports/",
  instagram: "https://www.instagram.com/t20mumbai/",
  twitter: "https://x.com/T20Mumbai",
  facebook: "https://www.facebook.com/T20Mumbai",
  youtube: "https://www.youtube.com/@T20MumbaiLeague",

  // ticket
  wankhedeTicket:
    "https://www.district.in/events/t20-mumbai-league-2025-bandra-blasters-vs-eagle-thane-strikers-and-triumph-knights-mne-vs-msc-maratha-royals-in-mumbai-june5-buy-tickets",
  DYPatilTicket:
    "https://www.district.in/events/t20-mumbai-league-2025-arcs-andheri-vs-aakash-tigers-mws-and-sobo-mumbai-falcons-vs-north-mumbai-panthers-buy-tickets",

  OverallTicket:
    "https://www.district.in/events/t20-mumbai-league-2025-finals-jun12-2025-buy-tickets",
};

export default routes;
