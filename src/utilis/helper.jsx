// truncateTextWords
export const truncateTextWords = (text, wordLimit = 2) => {
  if (!text) return "";
  const words = text.split(" ");
  return words.length > wordLimit
    ? `${words.slice(0, wordLimit).join(" ")}...`
    : text;
};

//truncateTextSpells
export const truncateTextSpells = (text, charLimit = 20) => {
  if (!text) return "";
  return text.length > charLimit ? `${text.substring(0, charLimit)}...` : text;
};

export const formatTitleForURL = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading or trailing hyphens
};

// export const mapHighestLevelToCategory = (highestLevel) => {
//   if (!highestLevel) return "Unknown";

//   const level = highestLevel.toLowerCase();

//   if (level.includes("indian senior")) {
//     return "Icon Player";
//   }

//   if (
//     level.includes("first class") ||
//     level.includes("list a") ||
//     level.includes("bcc") || // catching "BCCI Senior Men T20"
//     level.includes("senior men t20")
//   ) {
//     return "Senior Player";
//   }

//   if (
//     level.includes("under 23") ||
//     level.includes("under 19") ||
//     level.includes("u-23") ||
//     level.includes("u-19") ||
//     level.includes("age group")
//   ) {
//     return "Emerging Player";
//   }

//   if (level.includes("local club") || level.includes("club team")) {
//     return "Development Player";
//   }

//   return "Unknown";
// };
export const mapHighestLevelToCategory = (highestLevel) => {
  const level = highestLevel?.toLowerCase?.() ?? "";

  if (level.includes("indian senior")) {
    return "Icon Player";
  }

  if (
    level.includes("first class") ||
    level.includes("list a") ||
    level.includes("bcc") || // catching "BCCI Senior Men T20"
    level.includes("senior men t20")
  ) {
    return "Senior Player";
  }

  if (
    level.includes("under 23") ||
    level.includes("under 19") ||
    level.includes("u-23") ||
    level.includes("u-19") ||
    level.includes("age group")
  ) {
    return "Emerging Player";
  }

  if (level.includes("local club") || level.includes("club team")) {
    return "Development Player";
  }

  return "Unknown";
};

export const formatToIndianCurrencyWords2 = (value) => {
  if (!value || value <= 0) return "-";

  const formatValue = (num) => {
    return Number.isInteger(num)
      ? num.toString()
      : num.toFixed(2).replace(/\.00$/, "");
  };

  if (value >= 1_00_00_000) {
    const croreValue = value / 1_00_00_000;
    return `₹${formatValue(croreValue)} Cr`;
  } else {
    const lakhValue = value / 1_00_000;
    return `₹${formatValue(lakhValue)} L`;
  }
};

export const formatPathToTitle = (path) => {
  const lastSegment = path.split("/").filter(Boolean).pop();
  if (!lastSegment) return "";

  return lastSegment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const teamGradients = {
  "Aakash Tigers MWS": { from: "#FD7E00", to: "#0064FF" },
  "Arcs Andheri": { from: "#263C90", to: "#8C2B8E" },
  "Eagle Thane Strikers": { from: "#FBC92E", to: "#262262" },
  "Bandra Blasters": { from: "#4B1C86", to: "#E51C21" },
  "North Mumbai Panthers": { from: "#FEB713", to: "#5F4200" },
  "MSC Maratha Royals": { from: "#1000A1", to: "#B84124" },
  "SoBo Mumbai Falcons": { from: "#fff4e9", to: "#882626" },
  "Triumph Knights Mumbai North East": { from: "#E8D273", to: "#9E7437" },
};
export const teamLogoBN = {
  "Aakash Tigers MWS":
    "https://turbostart.blob.core.windows.net/turbostart/48447191083078844-aakashTigers.png",
  "Arcs Andheri":
    "https://turbostart.blob.core.windows.net/turbostart/7423173046036597-arcsAndheri.png",
  "Eagle Thane Strikers":
    "https://t20mumbai.com/images/home/team/eagleThaneStrikers.png",
  "Bandra Blasters":
    "https://turbostart.blob.core.windows.net/turbostart/1044990513729378-LOGO - BANDRA BLASTERS copy.png",
  "North Mumbai Panthers":
    "https://turbostart.blob.core.windows.net/turbostart/7886630352212134-northMumbaiPanthers.png",
  "MSC Maratha Royals":
    "https://t20mumbai.com/images/home/team/shivajiParkLions.png",
  "SoBo Mumbai Falcons":
    "https://t20mumbai.com/images/home/team/soboSuperSonics.png",
  "Triumph Knights Mumbai North East":
    "https://mcadirectory.blob.core.windows.net/dev/007792959990218895-triumphKnights.png",
};
export const teamLogoStats = {
  "Aakash Tigers MWS":
    "https://turbostart.blob.core.windows.net/turbostart/48447191083078844-aakashTigers.png",
  "ARCS Andheri":
    "https://turbostart.blob.core.windows.net/turbostart/7423173046036597-arcsAndheri.png",
  "Eagle Thane Strikers":
    "https://t20mumbai.com/images/home/team/eagleThaneStrikers.png",
  "Bandra Blasters":
    "https://turbostart.blob.core.windows.net/turbostart/1044990513729378-LOGO - BANDRA BLASTERS copy.png",
  "NaMo Bandra Blasters":
    "https://turbostart.blob.core.windows.net/turbostart/1044990513729378-LOGO - BANDRA BLASTERS copy.png",
  "North Mumbai Panthers":
    "https://turbostart.blob.core.windows.net/turbostart/7886630352212134-northMumbaiPanthers.png",
  "Shivaji Park Lions":
    "https://t20mumbai.com/images/home/team/shivajiParkLions.png",
  "SoBo SuperSonics":
    "https://t20mumbai.com/images/home/team/soboSuperSonics.png",
  "Triumph Knights Mumbai North East":
    "https://mcadirectory.blob.core.windows.net/dev/007792959990218895-triumphKnights.png",
};
