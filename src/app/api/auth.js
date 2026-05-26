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
