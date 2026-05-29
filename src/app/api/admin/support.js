import turboverseAxios from "../turboverseAxios";

// Admin-only support tools — endpoints in fantasy-backend/src/routes/admin.ts
// that operators use to unstick real users (OTP rate-limit clears, etc.).
// The browser carries the admin_rt cookie so every call is gated by the
// same admin session as the rest of /admin/*.

// Clears the four Redis keys behind the OTP throttle for a single mobile:
//   otp:rate:mobile:<m>   — 3/10min send cap
//   otp:day:mobile:<m>    — 10/day send cap
//   otp:attempts:<m>      — verify-attempts counter
//   otp:<m>               — the cached OTP itself
// Per-IP counters are NOT touched. The backend audits every clear.
//
// Backend validates the mobile as exactly 10 digits and returns 400
// invalid_mobile otherwise — caller should pre-validate to avoid a round-trip.
export const clearOtpRate = async (mobile) => {
  const res = await turboverseAxios.delete(
    `/v1/admin/otp-rate/${encodeURIComponent(mobile)}`,
  );
  return res.data; // { ok, mobile, keys_cleared }
};
