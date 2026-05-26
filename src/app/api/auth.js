import turboverseAxios from "./turboverseAxios";

export const sendOtp = async (mobile) => {
  const res = await turboverseAxios.post("/v1/auth/send-otp", { mobile });
  return res.data;
};

export const verifyOtp = async ({ mobile, otp, name, teamName }) => {
  const body = { mobile, otp };
  if (name) body.name = name;
  if (teamName) body.teamName = teamName;
  const res = await turboverseAxios.post("/v1/auth/verify-otp", body);
  return res.data;
};

export const refreshSession = async () => {
  const res = await turboverseAxios.post("/v1/auth/refresh");
  return res.data;
};

export const logoutSession = async () => {
  const res = await turboverseAxios.post("/v1/auth/logout");
  return res.data;
};

export const getMe = async () => {
  const res = await turboverseAxios.get("/v1/me");
  return res.data;
};

// Patches the signed-in user's profile. Accepts { name?, teamName?, email? }.
// Used in the LoginModal to persist the email collected during signup —
// /v1/auth/verify-otp itself only takes name + teamName, not email.
export const updateMe = async (patch) => {
  const res = await turboverseAxios.patch("/v1/me", patch);
  return res.data;
};

// SSO hand-off to the fantasy app. Trades the current access JWT (sent by the
// axios interceptor as Bearer) for a 30-second one-time exchange code that's
// safe to put in a URL. The fantasy frontend reads ?code= and POSTs it to
// /v1/auth/sso-exchange — at which point the code is atomically consumed and
// the user lands authenticated. Never put the raw JWT into the URL: it would
// then sit in CDN access logs, browser history, and Referer headers.
export const requestSsoHandoff = async () => {
  const res = await turboverseAxios.post("/v1/auth/sso-handoff");
  return res.data;
};
