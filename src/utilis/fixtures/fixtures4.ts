export type Season4MatchType = "match" | "playoff" | "reserve";
export type Season4Category = "Men" | "Women" | "";

export interface Season4Match {
  match_no: number | null;
  type: Season4MatchType;
  date: string;
  day: string;
  time: string;
  category: Season4Category;
  home_team: string;
  away_team: string;
  label?: string;
  status?: string;
}

export interface Season4Fixtures {
  season: string;
  series_name: string;
  venue: string;
  matches: Season4Match[];
}

const fixtures4: Season4Fixtures = {
  season: "Season 4",
  series_name: "T20 Mumbai, 2026",
  venue: "Wankhede Stadium, Mumbai",
  matches: [
    {
      match_no: 1,
      type: "match",
      date: "2026-06-01",
      day: "Monday",
      time: "2:00 PM",
      category: "Men",
      home_team: "Bandra Blasters",
      away_team: "Eagle Thane Strikers",
    },
    {
      match_no: 2,
      type: "match",
      date: "2026-06-01",
      day: "Monday",
      time: "7:00 PM",
      category: "Men",
      home_team: "MSC Maratha Royals",
      away_team: "Aakash Tigers MWS",
    },

    {
      match_no: 3,
      type: "match",
      date: "2026-06-02",
      day: "Tuesday",
      time: "9:30 AM",
      category: "Women",
      home_team: "Thane Sky Risers",
      away_team: "Sobo Mumbai Falcons",
    },
    {
      match_no: 4,
      type: "match",
      date: "2026-06-02",
      day: "Tuesday",
      time: "2:00 PM",
      category: "Men",
      home_team: "North Mumbai Panthers",
      away_team: "Triumph Knights MNE",
    },
    {
      match_no: 5,
      type: "match",
      date: "2026-06-02",
      day: "Tuesday",
      time: "7:00 PM",
      category: "Men",
      home_team: "Sobo Mumbai Falcons",
      away_team: "Arcs Andheri",
    },

    {
      match_no: 6,
      type: "match",
      date: "2026-06-03",
      day: "Wednesday",
      time: "9:30 AM",
      category: "Women",
      home_team: "Sobo Mumbai Falcons",
      away_team: "Aakash Tigers",
    },
    {
      match_no: 7,
      type: "match",
      date: "2026-06-03",
      day: "Wednesday",
      time: "2:00 PM",
      category: "Men",
      home_team: "North Mumbai Panthers",
      away_team: "Bandra Blasters",
    },
    {
      match_no: 8,
      type: "match",
      date: "2026-06-03",
      day: "Wednesday",
      time: "7:00 PM",
      category: "Men",
      home_team: "Aakash Tigers MWS",
      away_team: "Eagle Thane Strikers",
    },

    {
      match_no: 9,
      type: "match",
      date: "2026-06-04",
      day: "Thursday",
      time: "2:00 PM",
      category: "Men",
      home_team: "MSC Maratha Royals",
      away_team: "Sobo Mumbai Falcons",
    },
    {
      match_no: 10,
      type: "match",
      date: "2026-06-04",
      day: "Thursday",
      time: "7:00 PM",
      category: "Men",
      home_team: "Triumph Knights MNE",
      away_team: "Bandra Blasters",
    },

    {
      match_no: 11,
      type: "match",
      date: "2026-06-05",
      day: "Friday",
      time: "2:00 PM",
      category: "Men",
      home_team: "Eagle Thane Strikers",
      away_team: "Arcs Andheri",
    },
    {
      match_no: 12,
      type: "match",
      date: "2026-06-05",
      day: "Friday",
      time: "7:00 PM",
      category: "Men",
      home_team: "Aakash Tigers MWS",
      away_team: "North Mumbai Panthers",
    },

    {
      match_no: 13,
      type: "match",
      date: "2026-06-06",
      day: "Saturday",
      time: "9:30 AM",
      category: "Women",
      home_team: "Aakash Tigers",
      away_team: "Thane Sky Risers",
    },
    {
      match_no: 14,
      type: "match",
      date: "2026-06-06",
      day: "Saturday",
      time: "2:00 PM",
      category: "Men",
      home_team: "Bandra Blasters",
      away_team: "MSC Maratha Royals",
    },
    {
      match_no: 15,
      type: "match",
      date: "2026-06-06",
      day: "Saturday",
      time: "7:00 PM",
      category: "Men",
      home_team: "Triumph Knights MNE",
      away_team: "Sobo Mumbai Falcons",
    },

    {
      match_no: 16,
      type: "match",
      date: "2026-06-07",
      day: "Sunday",
      time: "9:30 AM",
      category: "Women",
      home_team: "Sobo Mumbai Falcons",
      away_team: "Aakash Tigers",
    },
    {
      match_no: 17,
      type: "match",
      date: "2026-06-07",
      day: "Sunday",
      time: "2:00 PM",
      category: "Men",
      home_team: "Arcs Andheri",
      away_team: "Aakash Tigers MWS",
    },
    {
      match_no: 18,
      type: "match",
      date: "2026-06-07",
      day: "Sunday",
      time: "7:00 PM",
      category: "Men",
      home_team: "Eagle Thane Strikers",
      away_team: "North Mumbai Panthers",
    },

    {
      match_no: 19,
      type: "match",
      date: "2026-06-08",
      day: "Monday",
      time: "2:00 PM",
      category: "Men",
      home_team: "MSC Maratha Royals",
      away_team: "Triumph Knights MNE",
    },
    {
      match_no: 20,
      type: "match",
      date: "2026-06-08",
      day: "Monday",
      time: "7:00 PM",
      category: "Men",
      home_team: "Arcs Andheri",
      away_team: "Bandra Blasters",
    },

    {
      match_no: 21,
      type: "match",
      date: "2026-06-09",
      day: "Tuesday",
      time: "9:30 AM",
      category: "Women",
      home_team: "Sobo Mumbai Falcons",
      away_team: "Thane Sky Risers",
    },
    {
      match_no: 22,
      type: "match",
      date: "2026-06-09",
      day: "Tuesday",
      time: "2:00 PM",
      category: "Men",
      home_team: "Sobo Mumbai Falcons",
      away_team: "Aakash Tigers MWS",
    },
    {
      match_no: 23,
      type: "match",
      date: "2026-06-09",
      day: "Tuesday",
      time: "7:00 PM",
      category: "Men",
      home_team: "Triumph Knights MNE",
      away_team: "MSC Maratha Royals",
    },

    {
      match_no: 24,
      type: "match",
      date: "2026-06-10",
      day: "Wednesday",
      time: "9:30 AM",
      category: "Women",
      home_team: "Thane Sky Risers",
      away_team: "Aakash Tigers",
    },
    {
      match_no: 25,
      type: "match",
      date: "2026-06-10",
      day: "Wednesday",
      time: "2:00 PM",
      category: "Men",
      home_team: "Sobo Mumbai Falcons",
      away_team: "North Mumbai Panthers",
    },
    {
      match_no: 26,
      type: "match",
      date: "2026-06-10",
      day: "Wednesday",
      time: "7:00 PM",
      category: "Men",
      home_team: "Arcs Andheri",
      away_team: "MSC Maratha Royals",
    },

    {
      match_no: null,
      type: "playoff",
      date: "2026-06-11",
      day: "Thursday",
      time: "2:00 PM",
      category: "Men",
      home_team: "TBD",
      away_team: "TBD",
      label: "Semi Final 1",
    },
    {
      match_no: null,
      type: "playoff",
      date: "2026-06-11",
      day: "Thursday",
      time: "7:00 PM",
      category: "Men",
      home_team: "TBD",
      away_team: "TBD",
      label: "Semi Final 2",
    },

    {
      match_no: null,
      type: "reserve",
      date: "2026-06-12",
      day: "Friday",
      time: "",
      category: "",
      home_team: "",
      away_team: "",
      label: "Reserve Day",
    },

    {
      match_no: null,
      type: "playoff",
      date: "2026-06-13",
      day: "Saturday",
      time: "9:30 AM",
      category: "Women",
      home_team: "TBD",
      away_team: "TBD",
      label: "Women's Final",
    },
    {
      match_no: null,
      type: "playoff",
      date: "2026-06-13",
      day: "Saturday",
      time: "7:00 PM",
      category: "Men",
      home_team: "TBD",
      away_team: "TBD",
      label: "Men's Final",
    },
  ],
};

export const SEASON4_TEAM_LOGO_MAP: Record<string, string> = {
  "Aakash Tigers MWS":
    "https://storage.googleapis.com/mca-bucket-gcp/Dev%2F1778842478566-ezfc2ljp90o-akash-tigers.png",
  "Arcs Andheri":
    "https://storage.googleapis.com/mca-bucket-gcp/Dev%2F1778842569141-45uzrai3pcd-arcs-andheri.png",
  "Bandra Blasters":
    "https://storage.googleapis.com/mca-bucket-gcp/Dev%2F1778842716680-g3173uqh5ht-bandra-blasters.png",
  "Eagle Thane Strikers":
    "https://storage.googleapis.com/mca-bucket-gcp/Dev%2F1778842606667-rsb03v6i3ti-eagle-thane-strikers.png",
  "MSC Maratha Royals":
    "https://storage.googleapis.com/mca-bucket-gcp/Dev%2F1778842937458-mm7skn7fp9-maratha-royals.png",
  "North Mumbai Panthers":
    "https://storage.googleapis.com/mca-bucket-gcp/Dev%2F1778842431724-z2fgjqs7dcf-mumbai-panthers.png",
  "SoBo Mumbai Falcons":
    "https://storage.googleapis.com/mca-bucket-gcp/Dev%2F1778842647889-jnbsdkw5go9-sobo-mumbai-falcons.png",
  "Triumph Knights Mumbai North East":
    "https://storage.googleapis.com/mca-bucket-gcp/Dev%2F1778842830696-oq3rgu179n-triumph-knights.png",
  "Aakash Tigers MWS (W)":
    "https://storage.googleapis.com/mca-bucket-gcp/Dev%2F1778842478566-ezfc2ljp90o-akash-tigers.png",
  "SoBo Mumbai Falcons (W)":
    "https://storage.googleapis.com/mca-bucket-gcp/Dev%2F1778842647889-jnbsdkw5go9-sobo-mumbai-falcons.png",
  "Thane Skyrisers (W)":
    "https://storage.googleapis.com/mca-bucket-gcp/Dev%2F1778842743856-v9mzpsye2s-Thane-Skyrises.png",
};

export const SEASON4_LOGO_ALIASES: Record<string, string> = {
  "Sobo Mumbai Falcons": "SoBo Mumbai Falcons",
  "Triumph Knights MNE": "Triumph Knights Mumbai North East",
  "Maratha Royals": "MSC Maratha Royals",
};

export const SEASON4_WOMEN_NAME_TO_LOGO_KEY: Record<string, string> = {
  "Aakash Tigers": "Aakash Tigers MWS (W)",
  "Sobo Mumbai Falcons": "SoBo Mumbai Falcons (W)",
  "Thane Sky Risers": "Thane Skyrisers (W)",
};

export const resolveSeason4Logo = (
  name: string,
  category: Season4Category,
): string => {
  if (!name) return "";
  if (category === "Women" && SEASON4_WOMEN_NAME_TO_LOGO_KEY[name]) {
    return SEASON4_TEAM_LOGO_MAP[SEASON4_WOMEN_NAME_TO_LOGO_KEY[name]] || "";
  }
  return (
    SEASON4_TEAM_LOGO_MAP[name] ||
    SEASON4_TEAM_LOGO_MAP[SEASON4_LOGO_ALIASES[name]] ||
    ""
  );
};

export default fixtures4;
