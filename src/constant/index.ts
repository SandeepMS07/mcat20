export const BACKEND_URL = "https://mca-prod-api.ken42.com";
// export const BACKEND_URL = "https://mca-dev-api.ken42.com";
export const PHOTO_SHARE_KEY = "4342";
export const PHOTO_GALLERY_ID = "116280";
export const PLAYER_REGISTRATION_SHARE_KEY = "mca-private-2026";

// Fantasy / Fan Poll backend (separate service from the main MCA API).
// Override via NEXT_PUBLIC_API_BASE at build time.
export const FANTASY_API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

// Fantasy frontend (the web app the user lands on after clicking "Fantasy" in
// the nav). We redirect there with a one-time SSO code; never with a JWT.
// Override via NEXT_PUBLIC_FANTASY_WEB at build time.
//   prod  : https://fantasy-mvp.turboverse.co
//   local : http://localhost:3010
export const FANTASY_WEB_BASE = "http://localhost:4000";
// process.env.NEXT_PUBLIC_FANTASY_WEB || "https://fantasy-mvp.turboverse.co";
