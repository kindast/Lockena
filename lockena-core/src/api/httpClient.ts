import axios, {
  type AxiosError,
  type AxiosResponse,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import type { ApiConfig } from "./types";
import { BACKEND_BASE_URL } from "../constants";

export const httpClient = axios.create({
  baseURL: BACKEND_BASE_URL,
  withCredentials: true,
});

// Единая точка конфигурации клиента извне
let apiConfig: ApiConfig | null = null;
export const setupHttpClient = (config: ApiConfig) => {
  apiConfig = config;
};

//Прикрепляем токен к запросам
httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = apiConfig?.getToken() ?? null;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

//Повтор запроса при 401
let isRefreshing = false;
let failedQueue: Array<{ resolve: () => void; reject: (err: any) => void }> =
  [];

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

httpClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh" &&
      originalRequest.url !== "/auth/logout"
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(httpClient(originalRequest)),
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      if (!apiConfig) {
        return Promise.reject(error);
      }

      try {
        const success = await apiConfig.refreshToken();
        if (success) {
          processQueue(null);
          return httpClient(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError as AxiosError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
