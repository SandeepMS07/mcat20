/**
 * Hardcoded player photo overrides per team.
 *
 * Keyed by team name (case-sensitive — match Salesforce `team.Name`),
 * then by a normalized player name. The normalizer strips diacritics,
 * lower-cases, and collapses non-alphanumerics so small naming variations
 * (extra dots, "Mr.", trailing spaces, etc.) still resolve.
 *
 * Drop the actual image files into the matching folder, then add the
 * normalized player name → file path entry below.
 */

export const normalizePlayerName = (name = "") =>
  name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const AAKASH_TIGERS_PHOTOS = {
  [normalizePlayerName("Ajit Ravindra Kumar Yadav")]:
    "/images/teams/aakash-tigers/ajit-ravindra-kumar-yadav-m00583.png",
  [normalizePlayerName("Akash Anand")]:
    "/images/teams/aakash-tigers/akash-anand-m00301.png",
  [normalizePlayerName("Akshat Kishor Jain")]:
    "/images/teams/aakash-tigers/akshat-kishor-jain-m01468.png",
  [normalizePlayerName("Ankur Singh")]:
    "/images/teams/aakash-tigers/ankur-singh-m00205.png",
  [normalizePlayerName("Arnav Ashish Dhole")]:
    "/images/teams/aakash-tigers/arnav-ashish-dhole-mcaa1731.png",
  [normalizePlayerName("Harsh Rohit Rane")]:
    "/images/teams/aakash-tigers/harsh-rohit-rane-m00734.png",
  [normalizePlayerName("Jay Gokul Bista")]:
    "/images/teams/aakash-tigers/jay-gokul-bista-m04624.png",
  [normalizePlayerName("Jay Prasad Dhatrak")]:
    "/images/teams/aakash-tigers/jay-prasad-dhatrak-m00852.png",
  [normalizePlayerName("Kruthik Shankarappa Hanagavadi")]:
    "/images/teams/aakash-tigers/kruthik-shankarappa-hanagavadi-m01374.png",
  [normalizePlayerName("Md Jamshed Alam")]:
    "/images/teams/aakash-tigers/md-jamshed-alam-mcam0467.png",
  [normalizePlayerName("Naman Pushpak")]:
    "/images/teams/aakash-tigers/naman-pushpak-m05252.png",
  [normalizePlayerName("Prince Devang Badiani")]:
    "/images/teams/aakash-tigers/prince-devang-badiani-m00081.png",
  [normalizePlayerName("Sagar Vinod Patil")]:
    "/images/teams/aakash-tigers/sagar-vinod-patil-m10478.png",
  [normalizePlayerName("Saksham Swayam Parashar")]:
    "/images/teams/aakash-tigers/saksham-swayam-parashar-m00331.png",
  [normalizePlayerName("Sarfaraz Ahmed Naushad Ahmed Khan")]:
    "/images/teams/aakash-tigers/sarfaraz-ahmed-naushad-ahmed-m00013.png",
  [normalizePlayerName("Shams Mulani")]:
    "/images/teams/aakash-tigers/shams-mulani-m00328.png",
  [normalizePlayerName("Shashank Vinayak Attarde")]:
    "/images/teams/aakash-tigers/shashank-vinayak-attarde-mcas0021.png",
  [normalizePlayerName("Sourabh Santosh Singh")]:
    "/images/teams/aakash-tigers/sourabh-santosh-singh-m00646.png",
  [normalizePlayerName("Varun Lavande")]:
    "/images/teams/aakash-tigers/varun-lavande-m01442.png",
  [normalizePlayerName("Vinayak Narayan Bhoir")]:
    "/images/teams/aakash-tigers/vinayak-narayan-bhoir-m01535.png",
};

const TEAM_PHOTO_OVERRIDES = {
  "Aakash Tigers MWS": AAKASH_TIGERS_PHOTOS,
  // Future teams can be added here.
};

const normalizeTeamKey = (name = "") =>
  name
    .replace(/\s*\(w\)\s*$/i, "")
    .trim()
    .toLowerCase();

const NORMALIZED_TEAM_OVERRIDES = Object.fromEntries(
  Object.entries(TEAM_PHOTO_OVERRIDES).map(([k, v]) => [normalizeTeamKey(k), v]),
);

export const resolvePlayerPhotoOverride = (teamName, playerName) => {
  if (!teamName || !playerName) return null;
  const teamMap = NORMALIZED_TEAM_OVERRIDES[normalizeTeamKey(teamName)];
  if (!teamMap) return null;
  return teamMap[normalizePlayerName(playerName)] || null;
};
