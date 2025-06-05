"use server";

import { getAxiosInstance } from "./axiosInstance";

const axios = getAxiosInstance();

export const getTeamDetails = async () => {
  try {
    const res = await axios.get("/v1/auction/teams");
    return res.data;
  } catch (err) {
    console.error("Error in getTeamDetails:", err);
    return null;
  }
};

export const getFixtureSeasonp3 = async () => {
  try {
    const res = await axios.get("/v1/live/season3/fixtures");
    return res.data;
  } catch (err) {
    console.error("Error in getFixtureSeasonp3:", err);
    return null;
  }
};

export const getLatestUpdates = async () => {
  try {
    const res = await axios.get("/v1/live/details/news/announcement");
    return res.data;
  } catch (err) {
    console.error("Error in getLatestUpdates:", err);
    return null;
  }
};

export const getVideos = async () => {
  try {
    const res = await axios.get("/v1/application/youtube/link");
    return res.data;
  } catch (err) {
    console.error("Error in getVideos:", err);
    return null;
  }
};
export const getStandings = async () => {
  try {
    const res = await axios.get("/v1/live/season3/standings");
    return res.data;
  } catch (err) {
    console.error("Error in getStandings:", err);
    return null;
  }
};
