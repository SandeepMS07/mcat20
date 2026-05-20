// truncateTextWords

// import shivaji from "../../public/images/logo/shivajiParkLions.png"
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
  "Thane Skyrisers": { from: "#7BE7E3", to: "#142A6E" },
  "Triumph Knights Mumbai North East": { from: "#E8C775", to: "#8B6F3C" },
};

export const teamSubtitles = {
  "Aakash Tigers MWS": { name: "Aakash Tigers MWS", subtitle: "Mumbai Western Suburbs" },
  "Arcs Andheri": { name: "Arcs Andheri", subtitle: "Andheri" },
  "Eagle Thane Strikers": { name: "Eagle Thane Strikers", subtitle: "Thane" },
  "Bandra Blasters": { name: "Bandra Blasters", subtitle: "Bandra" },
  "North Mumbai Panthers": { name: "North Mumbai Panthers", subtitle: "North Mumbai" },
  "MSC Maratha Royals": { name: "MSC Maratha Royals", subtitle: "Mumbai South Central" },
  "SoBo Mumbai Falcons": { name: "SoBo Mumbai Falcons", subtitle: "South Bombay" },
  "Thane Skyrisers": { name: "Thane Skyrisers", subtitle: "Thane" },
  "Triumph Knights Mumbai North East": { name: "Triumph Knights MNE", subtitle: "Mumbai North East" },
};
export const teamLogoBN = {
  "Aakash Tigers MWS":
    "https://turbostart.blob.core.windows.net/team-logos/Artboard%201.png",
  "Arcs Andheri":
    "https://turbostart.blob.core.windows.net/team-logos/2.%20Andheri%20Arcs.jpg",
  "Eagle Thane Strikers":
    "https://turbostart.blob.core.windows.net/team-logos/Eagle%20Thane%20Strikers%20-%20LOGO%20NEW%20-%20Final_18ver.png",
  "Bandra Blasters":
    "https://turbostart.blob.core.windows.net/team-logos/image.png",
  "North Mumbai Panthers":
    "https://turbostart.blob.core.windows.net/team-logos/Artboard%201%20(1).png",
  "MSC Maratha Royals":
    "https://turbostart.blob.core.windows.net/team-logos/Maratha%20Logo%20Final_AW-01.png",
  "SoBo Mumbai Falcons":
    "https://turbostart.blob.core.windows.net/team-logos/WhatsApp%20Image%202025-11-11%20at%2013.04.23.jpeg",
  "Triumph Knights Mumbai North East":
    "https://turbostart.blob.core.windows.net/team-logos/8.%20Triumph%20Knights%20Mumbai%20North%20East%20PNG%20v2%20(1).png",
};
export const teamLogoStats = {
  "Aakash Tigers MWS":
    "https://turbostart.blob.core.windows.net/team-logos/Artboard%201.png",
  "Shivaji Park Lions": "/images/logo/shivajiParkLions.png",
  "SoBo SuperSonics": "/images/logo/soboSuperSonics.png",
  "Aakash Tigers Mumbai Western Suburbs":
    "https://turbostart.blob.core.windows.net/turbostart/48447191083078844-aakashTigers.png",
  "ARCS Andheri":
    "https://turbostart.blob.core.windows.net/team-logos/2.%20Andheri%20Arcs.jpg",
  "Eagle Thane Strikers":
    "https://turbostart.blob.core.windows.net/team-logos/Eagle%20Thane%20Strikers%20-%20LOGO%20NEW%20-%20Final_18ver.png",
  "Bandra Blasters":
    "https://turbostart.blob.core.windows.net/team-logos/image.png",
  "NaMo Bandra Blasters":
    "https://turbostart.blob.core.windows.net/team-logos/image.png",
  "North Mumbai Panthers":
    "https://turbostart.blob.core.windows.net/team-logos/Artboard%201%20(1).png",
  "MSC Maratha Royals":
    "https://turbostart.blob.core.windows.net/team-logos/Maratha%20Logo%20Final_AW-01.png",
  "SoBo Mumbai Falcons":
    "https://turbostart.blob.core.windows.net/team-logos/WhatsApp%20Image%202025-11-11%20at%2013.04.23.jpeg",
  "Triumph Knights Mumbai North East":
    "https://turbostart.blob.core.windows.net/team-logos/image.svg",
  "SOBO Mumbai Falcons":
    "https://turbostart.blob.core.windows.net/team-logos/WhatsApp%20Image%202025-11-11%20at%2013.04.23.jpeg",
  "Triumph Knights MNE":
    "https://turbostart.blob.core.windows.net/team-logos/8.%20Triumph%20Knights%20Mumbai%20North%20East%20PNG%20v2%20(1).png",
};

export const teamShortName = {
  "Aakash Tigers MWS": "AT",
  "Arcs Andheri": "AA",
  "ARCS Andheri": "AA",
  "Eagle Thane Strikers": "ETS",
  "Bandra Blasters": "NBB",
  "NaMo Bandra Blasters": "NBB",
  "North Mumbai Panthers": "NMP",
  "Shivaji Park Lions": "SPL",
  "MSC Maratha Royals": "MR",
  "SoBo SuperSonics": "SSS",
  "SoBo Mumbai Falcons": "SMF",
  "SOBO Mumbai Falcons": "SMF",
  "Triumph Knights Mumbai North East": "TKM",
  "Triumph Knights MNE": "TKM",
};

export const season3TeamLogo = {
  "Aakash Tigers MWS":
    "https://turbostart.blob.core.windows.net/team-logos/Artboard%201.png",
  "Aakash Tigers Mumbai Western Suburbs":
    "https://turbostart.blob.core.windows.net/turbostart/48447191083078844-aakashTigers.png",
  "ARCS Andheri":
    "https://turbostart.blob.core.windows.net/team-logos/2.%20Andheri%20Arcs.jpg",
  "Arcs Andheri":
    "https://turbostart.blob.core.windows.net/team-logos/2.%20Andheri%20Arcs.jpg",
  "Eagle Thane Strikers":
    "https://turbostart.blob.core.windows.net/team-logos/Eagle%20Thane%20Strikers%20-%20LOGO%20NEW%20-%20Final_18ver.png",
  "Bandra Blasters":
    "https://turbostart.blob.core.windows.net/team-logos/image.png",
  "NaMo Bandra Blasters":
    "https://turbostart.blob.core.windows.net/team-logos/image.png",
  "North Mumbai Panthers":
    "https://turbostart.blob.core.windows.net/team-logos/Artboard%201%20(1).png",
  "Shivaji Park Lions": "/images/logo/shivajiParkLions.png",
  "MSC Maratha Royals":
    "https://turbostart.blob.core.windows.net/team-logos/Maratha%20Logo%20Final_AW-01.png",
  "SoBo SuperSonics":
    "https://turbostart.blob.core.windows.net/team-logos/Frame%202095587121%20(3).svg",
  "SoBo Mumbai Falcons":
    "https://turbostart.blob.core.windows.net/team-logos/WhatsApp%20Image%202025-11-11%20at%2013.04.23.jpeg",
  "Triumph Knights Mumbai North East":
    "https://turbostart.blob.core.windows.net/team-logos/image.svg",
  "SOBO Mumbai Falcons":
    "https://turbostart.blob.core.windows.net/team-logos/WhatsApp%20Image%202025-11-11%20at%2013.04.23.jpeg",
  "Triumph Knights MNE":
    "https://turbostart.blob.core.windows.net/team-logos/8.%20Triumph%20Knights%20Mumbai%20North%20East%20PNG%20v2%20(1).png",
  // "Triumph Knights MNE":
  //   "https://turbostart.blob.core.windows.net/team-logos/image.svg",
};

export const decodeHtml = (html) => {
  if (!html) return "";

  const textarea = document.createElement("textarea");
  textarea.innerHTML = html;
  let decoded = textarea.value;

  decoded = decoded.replace(/<\/img>/gi, "");
  decoded = decoded.replace(/<img([^>]*?)(?<!\/)>/gi, "<img$1 />");

  decoded = decoded.replace(/<span[^>]*>/gi, "").replace(/<\/span>/gi, "");

  return decoded;
};

export const toTitleCase = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
