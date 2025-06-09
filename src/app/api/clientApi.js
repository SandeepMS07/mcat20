import { getAxiosInstance } from "./axiosInstance";

const axios = getAxiosInstance();

export const getVideosClient = async () => {
  try {
    const res = await axios.get("/v1/application/youtube/link");
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getImagesClient = async () => {
  try {
    const res = await axios.get("/v1/application/web/gallery");
    console.log(res , "api-call");
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getLatestUpdatesClient = async () => {
  try {
    const res = await axios.get("/v1/live/details/news/announcement");
    return res.data;
  } catch (err) {
    console.error("Client error fetching latest updates:", err);
    return null;
  }
};
export const getHeroBannerClient = async () => {
  try {
    const res = await axios.get("/v1/application/hero/banners");
    return res.data;
  } catch (err) {
    console.error("Client error fetching latest updates:", err);
    return null;
  }
};

export const getStandings = async () => {
  try {
    const res = await axios.get("/v1/live/season3/standings");
    return res.data;
  } catch (err) {
    console.error("Error in getVideos:", err);
    return null;
  }
};
