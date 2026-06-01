"use server";

import http from "node:http";
import https from "node:https";
import { getAxiosInstance } from "./axiosInstance";
import teamDetailsStatic from "@/constant/team/teamDetailsDataSeason4.json";

const withInferredTeamType = (payload) => {
  const records = Array.isArray(payload?.data) ? payload.data : [];
  const data = records.map((team) => {
    if (team?.Team_Type__c) return team;
    const isWomens = /\(\s*w\s*\)\s*$/i.test(team?.Name || "");
    return { ...team, Team_Type__c: isWomens ? "Women's" : "Men's" };
  });
  return { ...payload, data };
};

const STATIC_TEAM_DETAILS = withInferredTeamType(teamDetailsStatic);

const TRANSIENT_HTTP_STATUS = new Set([429, 500, 502, 503, 504]);
const MAX_RETRIES = 2;
const TIMEOUT_MS = 15000;
const BASE_DELAY_MS = 300;
const MAX_DELAY_MS = 3000;

const parseEnvInt = (value, fallback) => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
};

const axios = getAxiosInstance({
  timeout: TIMEOUT_MS,
  httpAgent: new http.Agent({
    keepAlive: true,
    maxSockets: 100,
    maxFreeSockets: 20,
    scheduling: "lifo",
  }),
  httpsAgent: new https.Agent({
    keepAlive: true,
    maxSockets: 100,
    maxFreeSockets: 20,
    scheduling: "lifo",
  }),
});

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const parseRetryAfterToMs = (retryAfterHeader) => {
  if (!retryAfterHeader) return null;

  const asSeconds = Number.parseInt(String(retryAfterHeader), 10);
  if (Number.isFinite(asSeconds)) return asSeconds * 1000;

  const asDate = Date.parse(String(retryAfterHeader));
  if (!Number.isFinite(asDate)) return null;

  const delta = asDate - Date.now();
  return delta > 0 ? delta : null;
};

const computeBackoffDelayMs = (attempt, retryAfterHeader) => {
  const retryAfterMs = parseRetryAfterToMs(retryAfterHeader);
  if (retryAfterMs) {
    return Math.min(retryAfterMs, MAX_DELAY_MS);
  }

  const exponential = BASE_DELAY_MS * 2 ** attempt;
  const capped = Math.min(exponential, MAX_DELAY_MS);
  const jitter = Math.floor(
    Math.random() * Math.max(75, Math.floor(capped * 0.2)),
  );
  return capped + jitter;
};

const isRetryableError = (error) => {
  const status = error?.response?.status;
  if (typeof status === "number") {
    return TRANSIENT_HTTP_STATUS.has(status);
  }

  const code = error?.code;
  return (
    code === "ECONNABORTED" ||
    code === "ECONNRESET" ||
    code === "ENOTFOUND" ||
    code === "EAI_AGAIN"
  );
};

const requestWithRetry = async (requestFn, logLabel) => {
  const startMs = Date.now();

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      return await requestFn({ attempt });
    } catch (err) {
      const shouldRetry = attempt < MAX_RETRIES && isRetryableError(err);
      if (!shouldRetry) {
        console.error(
          JSON.stringify({
            level: "error",
            msg: "server_api_request_failed",
            request: logLabel,
            attempts: attempt + 1,
            maxRetries: MAX_RETRIES,
            status: err?.response?.status ?? null,
            code: err?.code ?? null,
            durationMs: Date.now() - startMs,
            url: err?.config?.url ?? null,
            method: err?.config?.method ?? null,
          }),
        );
        return null;
      }

      const delay = computeBackoffDelayMs(
        attempt,
        err?.response?.headers?.["retry-after"],
      );
      await sleep(delay);
    }
  }

  return null;
};

export const getTeamDetails = async () => STATIC_TEAM_DETAILS;

export const getFixtureSeasonp3 = async () => {
  return requestWithRetry(async () => {
    const res = await axios.get("/v1/live/season3/fixtures");
    return res.data;
  }, "getFixtureSeasonp3");
};

export const getLatestUpdates = async () => {
  return requestWithRetry(async () => {
    const res = await axios.get("/v1/live/details/news/announcement");
    return res.data;
  }, "getLatestUpdates");
};

export const getVideos = async () => {
  return requestWithRetry(async () => {
    const res = await axios.get("/v1/application/youtube/link");
    return res.data;
  }, "getVideos");
};
export const getStandings = async () => {
  return requestWithRetry(async () => {
    const res = await axios.get("/v1/live/season3/standings");
    return res.data;
  }, "getStandings");
};
