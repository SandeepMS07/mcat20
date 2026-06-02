import { getAxiosInstance } from "./axiosInstance";
import { PLAYERS_API_PATH } from "./admin/localPlayers";
import { FANTASY_API_BASE } from "@/constant";

const axios = getAxiosInstance();
const fantasyAxios = getAxiosInstance({ baseURL: FANTASY_API_BASE });
const DEFAULT_TTL_MS = 5 * 60 * 1000;

const withInferredTeamType = (payload) => {
  const records = Array.isArray(payload?.data) ? payload.data : [];
  const data = records.map((team) => {
    if (team?.Team_Type__c) return team;
    const isWomens = /\(\s*w\s*\)\s*$/i.test(team?.Name || "");
    return { ...team, Team_Type__c: isWomens ? "Women's" : "Men's" };
  });
  return { ...payload, data };
};

const memoryCache = new Map();

const getCacheFromStorage = (key) => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch (err) {
    console.error("Cache read failed:", err);
    return null;
  }
};

const setCacheToStorage = (key, value) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("Cache write failed:", err);
  }
};

const getCachedData = (key, ttlMs) => {
  const now = Date.now();
  const memValue = memoryCache.get(key);

  if (memValue && now - memValue.ts < ttlMs) {
    return memValue.data;
  }

  const storageValue = getCacheFromStorage(key);
  if (storageValue && now - storageValue.ts < ttlMs) {
    memoryCache.set(key, storageValue);
    return storageValue.data;
  }

  return null;
};

const setCachedData = (key, data) => {
  const payload = { data, ts: Date.now() };
  memoryCache.set(key, payload);
  setCacheToStorage(key, payload);
};

const fetchWithCache = async (key, requestFn, ttlMs = DEFAULT_TTL_MS) => {
  const cachedData = getCachedData(key, ttlMs);
  if (cachedData) return cachedData;

  const freshData = await requestFn();
  if (freshData) setCachedData(key, freshData);
  return freshData;
};

export const getTeamDetailsClient = async () => {
  const res = await fetch(PLAYERS_API_PATH);
  if (!res.ok) throw new Error(`Failed to fetch players: ${res.status}`);
  return withInferredTeamType(await res.json());
};

export const getVideosClient = async () => {
  try {
    return await fetchWithCache("api:videos", async () => {
      const res = await axios.get("/v1/application/youtube/link");
      return res.data;
    });
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getImagesClient = async () => {
  try {
    return await fetchWithCache("api:images", async () => {
      const res = await axios.get("/v1/application/web/gallery");
      return res.data;
    });
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getLatestUpdatesClient = async () => {
  try {
    return await fetchWithCache("api:latest-updates", async () => {
      const res = await axios.get("/v1/live/details/news/announcement");
      const { LocalLatestUpdates } = await import("@/app/news/data");
      const apiItems = Array.isArray(res?.data?.data) ? res.data.data : [];
      const merged = [
        ...LocalLatestUpdates,
        ...apiItems.filter(
          (item) =>
            !LocalLatestUpdates.some(
              (local) => local.Title__c === item?.Title__c,
            ),
        ),
      ];
      return { ...(res.data || {}), data: merged, apiData: apiItems };
    });
  } catch (err) {
    console.error("Client error fetching latest updates:", err);
    const { LocalLatestUpdates } = await import("@/app/news/data");
    return { data: LocalLatestUpdates, apiData: [] };
  }
};
export const getHeroBannerClient = async () => {
  try {
    return await fetchWithCache("api:hero-banners", async () => {
      const res = await axios.get("/v1/application/hero/banners");
      return res.data;
    });
  } catch (err) {
    console.error("Client error fetching latest updates:", err);
    return null;
  }
};

export const getBannersClient = async () => {
  try {
    return await fetchWithCache("api:banners", async () => {
      const res = await axios.get("/v1/banners");
      return res.data;
    }, DEFAULT_TTL_MS);
  } catch (err) {
    console.error("Client error fetching banners:", err);
    return null;
  }
};

export const getStandings = async () => {
  try {
    return await fetchWithCache("api:standings", async () => {
      const res = await axios.get("/v1/live/season3/standings");
      return res.data;
    });
  } catch (err) {
    console.error("Error in getVideos:", err);
    return null;
  }
};

export const getStandingsV2Client = async (category = "", forceFresh = false) => {
  const cacheKey = `api:standings-v2${category ? `:${category.toLowerCase()}` : ""}`;
  try {
    if (forceFresh) {
      const url = category ? `/v1/standings?category=${category}` : "/v1/standings";
      const res = await fantasyAxios.get(url);
      return res.data;
    }
    return await fetchWithCache(cacheKey, async () => {
      const url = category ? `/v1/standings?category=${category}` : "/v1/standings";
      const res = await fantasyAxios.get(url);
      return res.data;
    });
  } catch (err) {
    console.error("Client error fetching standings v2:", err);
    return null;
  }
};
