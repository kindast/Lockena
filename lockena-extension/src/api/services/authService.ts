import { handleError, httpClient } from "../httpClient";
import type { RequestState } from "../dto/request-state.dto";
import type { MessageDto } from "../dto/message.dto";
import { clearAllSessionState, setSession } from "../../session";
import type { AuthDto } from "../dto/auth/auth.dto";

export const authService = {
  async refresh(password?: string): Promise<RequestState<AuthDto>> {
    try {
      const response = await httpClient.post<AuthDto>("/auth/refresh");

      // Сохраняем сессию напрямую в память и хранилище для текущего контекста (background)
      setSession(response.data);
      chrome.storage.local.set({ sessionData: response.data });

      // Рассылаем уведомление для UI (если открыт popup), игнорируя ошибки, если никто не слушает
      chrome.runtime
        .sendMessage({
          type: "STORE_SESSION",
          payload: response.data,
        })
        .catch(() => {});

      if (password) {
        chrome.runtime
          .sendMessage({
            type: "UNLOCK_MASTER_KEY",
            password: password,
          })
          .catch(() => {});
      }
      return { state: "success", code: response.status, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  async logout(): Promise<RequestState<MessageDto>> {
    try {
      const response = await httpClient.post<MessageDto>("/auth/logout");

      // Очищаем всё локально
      clearAllSessionState();
      chrome.storage.local.remove(["sessionData", "encryptedVaultItems"]);

      chrome.runtime.sendMessage({ type: "LOGOUT" }).catch(() => {});
      return { state: "success", code: response.status, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },
};
