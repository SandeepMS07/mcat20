import axios from "axios";
import { FANTASY_API_BASE } from "@/constant";

const ACCESS_TOKEN_STORAGE = "mca_access_token";

let inMemoryToken = null;
let refreshHandler = null;
let logoutHandler = null;

if (typeof window !== "undefined") {
  try {
    inMemoryToken = window.localStorage.getItem(ACCESS_TOKEN_STORAGE) || null;
  } catch {
    inMemoryToken = null;
  }
}

export const getAccessToken = () => inMemoryToken;

export const setAccessToken = (token) => {
  inMemoryToken = token || null;
  if (typeof window === "undefined") return;
  try {
    if (token) window.localStorage.setItem(ACCESS_TOKEN_STORAGE, token);
    else window.localStorage.removeItem(ACCESS_TOKEN_STORAGE);
  } catch {
    /* ignore */
  }
};

export const registerAuthHandlers = ({ onRefresh, onLogout }) => {
  refreshHandler = typeof onRefresh === "function" ? onRefresh : null;
  logoutHandler = typeof onLogout === "function" ? onLogout : null;
};

const turboverseAxios = axios.create({
  baseURL: FANTASY_API_BASE,
  timeout: 8000,
  withCredentials: true,
});

turboverseAxios.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

const isAuthRoute = (url = "") => /\/v1\/auth\//.test(url);

let refreshPromise = null;

turboverseAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error?.config;
    const status = error?.response?.status;

    if (
      status !== 401 ||
      !original ||
      original._retried ||
      isAuthRoute(original.url) ||
      !refreshHandler
    ) {
      return Promise.reject(error);
    }

    original._retried = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshHandler().finally(() => {
          refreshPromise = null;
        });
      }
      const newToken = await refreshPromise;
      if (!newToken) throw new Error("refresh_failed");
      original.headers = original.headers || {};
      original.headers.Authorization = `Bearer ${newToken}`;
      return turboverseAxios(original);
    } catch (refreshErr) {
      if (logoutHandler) logoutHandler();
      return Promise.reject(error);
    }
  }
);

export default turboverseAxios;
