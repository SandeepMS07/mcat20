import { getAxiosInstance } from "./axiosInstance";

const axios = getAxiosInstance();
const DEFAULT_TTL_MS = 5 * 60 * 1000;

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
  try {
    return await fetchWithCache("api:team-details", async () => {
      const res = await axios.get("/v1/auction/teams");
      return res.data;
    });
  } catch (err) {
    console.error("Client error fetching team details:", err);
    return null;
  }
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
