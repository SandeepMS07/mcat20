export const BACKEND_URL = "https://mca-prod-api.ken42.com";
// export const BACKEND_URL = "https://mca-dev-api.ken42.com";
export const PHOTO_SHARE_KEY = "4342";
export const PHOTO_GALLERY_ID = "116280";
export const PLAYER_REGISTRATION_SHARE_KEY = "mca-private-2026";

// Fantasy / Fan Poll backend (separate service from the main MCA API).
// Override via NEXT_PUBLIC_API_BASE at build time.
export const FANTASY_API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "https://fantasy-dev-api.turboverse.co";
