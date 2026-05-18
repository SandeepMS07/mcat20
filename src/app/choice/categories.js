export const CHOICE_CATEGORIES = [
  {
    slug: "emerging-player",
    title: ["EMERGING", "PLAYER"],
    label: "Emerging Player of the Season",
    glow: { color: "#ff69b4", placement: "top-right", size: 88, opacity: 0.4 },
  },
  {
    slug: "best-batsman",
    title: ["BEST", "BATSMAN"],
    label: "Best Batsman of the Season",
    glow: { color: "#32cd32", placement: "bottom-left", size: 88, opacity: 0.3 },
  },
  {
    slug: "best-captain",
    title: ["BEST", "CAPTAIN"],
    label: "Best Captain of the Season",
    glow: { color: "#32cd32", placement: "bottom-right", size: 110, opacity: 0.2 },
  },
  {
    slug: "best-bowler",
    title: ["BEST", "BOWLER"],
    label: "Best Bowler of the Season",
    glow: { color: "#ffd700", placement: "right-mid", size: 66, opacity: 0.3 },
  },
  {
    slug: "best-wicketkeeper",
    title: ["BEST", "WICKETKEEPER"],
    label: "Best Wicketkeeper of the Season",
    glow: { color: "#ff69b4", placement: "top-left", size: 77, opacity: 0.3 },
  },
  {
    slug: "most-valuable-player",
    title: ["MOST VALUABLE", "PLAYER"],
    label: "Most Valuable Player of the Season",
    glow: { color: "#ffd700", placement: "top-right", size: 132, opacity: 0.3 },
  },
];

export const getCategoryBySlug = (slug) =>
  CHOICE_CATEGORIES.find((c) => c.slug === slug) || null;
