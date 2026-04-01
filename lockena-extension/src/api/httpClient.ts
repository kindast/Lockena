import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import type { ErrorDto } from "./dto/error.dto";
import type { RequestState } from "./dto/request-state.dto";
import { authService } from "./services/authService";
import { getSession } from "../session";
import type { AuthDto } from "./dto/auth/auth.dto";

export const httpClient = axios.create({
  baseURL: "https://localhost:5000",
  withCredentials: true,
});

//Прикрепляем токен к запросам
httpClient.interceptors.request.use(async (config) => {
  let token = getSession()?.accessToken;

  if (!token) {
    const result = (await chrome.storage.local.get("sessionData")) as {
      sessionData?: AuthDto;
    };
    token = result.sessionData?.accessToken;
  }

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

//Повтор запроса при 401
httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig;

    if (
      error.response?.status === 401 &&
      originalRequest.url !== "/auth/refresh" &&
      originalRequest.url !== "/auth/logout"
    ) {
      const refreshResponse = await authService.refresh();
      if (refreshResponse.state === "success") {
        return httpClient(originalRequest);
      }
    }

    return Promise.reject(error);
  },
);

//Обработка ошибок
export function handleError<T>(error: unknown): RequestState<T> {
  const serverError = error as AxiosError<ErrorDto>;
  return {
    state: "error",
    code: serverError.response?.status || 500,
    errors: serverError.response?.data.errors || [],
  };
}
