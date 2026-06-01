import turboverseAxios from "./turboverseAxios";

// Admin auth talks to /v1/admin/auth/* on the fantasy backend. The browser
// session is the admin_rt HttpOnly cookie set by the backend; turboverseAxios
// is already created with withCredentials:true so the cookie rides along on
// every admin request from the same browser.

export const adminLogin = async ({ username, password }) => {
  const res = await turboverseAxios.post("/v1/admin/auth/login", { username, password });
  return res.data;
};

export const adminLogout = async () => {
  const res = await turboverseAxios.post("/v1/admin/auth/logout");
  return res.data;
};

export const adminMe = async () => {
  const res = await turboverseAxios.get("/v1/admin/me");
  return res.data;
};
