export const CHOICE_CATEGORIES = [
  {
    slug: "player-of-tournament-men",
    title: ["PLAYER OF THE", "TOURNAMENT"],
    label: "Player of The Tournament (Men)",
    glow: { color: "#ffd700", placement: "top-right", size: 132, opacity: 0.3 },
  },
  {
    slug: "best-batter-men",
    title: ["BEST BATTER", "T20 MUMBAI 2026"],
    label: "Best Batter - T20 Mumbai 2026 (Men)",
    glow: { color: "#32cd32", placement: "bottom-left", size: 88, opacity: 0.3 },
  },
  {
    slug: "best-bowler-men",
    title: ["BEST BOWLER", "T20 MUMBAI 2026"],
    label: "Best Bowler - T20 Mumbai 2026 (Men)",
    glow: { color: "#ffd700", placement: "right-mid", size: 66, opacity: 0.3 },
  },
  {
    slug: "best-emerging-player-men",
    title: ["BEST EMERGING PLAYER", "T20 MUMBAI 2026"],
    label: "Best Emerging Player - T20 Mumbai 2026 (Men)",
    glow: { color: "#ff69b4", placement: "top-right", size: 88, opacity: 0.4 },
  },
  {
    slug: "best-development-player-men",
    title: ["BEST DEVELOPMENT PLAYER", "T20 MUMBAI 2026"],
    label: "Best Development Player - T20 Mumbai 2026 (Men)",
    glow: { color: "#4FD1FF", placement: "bottom-right", size: 110, opacity: 0.25 },
  },
  {
    slug: "player-of-tournament-women",
    title: ["PLAYER OF THE", "TOURNAMENT"],
    label: "Player of The Tournament (Women)",
    glow: { color: "#ff69b4", placement: "top-left", size: 132, opacity: 0.35 },
  },
  {
    slug: "best-batter-women",
    title: ["BEST BATTER", "T20 MUMBAI 2026"],
    label: "Best Batter - T20 Mumbai 2026 (Women)",
    glow: { color: "#7CFFB2", placement: "bottom-left", size: 88, opacity: 0.3 },
  },
  {
    slug: "best-bowler-women",
    title: ["BEST BOWLER", "T20 MUMBAI 2026"],
    label: "Best Bowler - T20 Mumbai 2026 (Women)",
    glow: { color: "#ff69b4", placement: "right-mid", size: 66, opacity: 0.35 },
  },
];

export const getCategoryBySlug = (slug) =>
  CHOICE_CATEGORIES.find((c) => c.slug === slug) || null;
