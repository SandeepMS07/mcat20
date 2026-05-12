import { BACKEND_URL } from "@/constant";
import axios from "axios";

export const getAxiosInstance = (overrides = {}) => {
  const instance = axios.create({
    baseURL: BACKEND_URL,
    timeout: 15000,
    ...overrides,
  });

  instance.interceptors.request.use((req) => {
    req.headers = req.headers || {};
    return req;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
  );

  return instance;
};
