import { BACKEND_URL } from "@/constant";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export const getAxiosInstance = () => {
  const instance = axios.create({
    baseURL: BACKEND_URL,
    timeout: 15000,
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
