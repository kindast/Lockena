import useAuthStore from "../../store/authStore";
import { handleError, httpClient } from "../httpClient";
import type { AuthDto, SignInDto, SignUpDto } from "../dto/auth";
import type { RequestState } from "../dto/request-state.dto";
import type { MessageDto } from "../dto/message.dto";
import { createProtectedMasterKey } from "../../crypto/masterKey";
import { toBase64Url } from "../../crypto/utils";

export const authService = {
  async signUp(
    initData: string,
    password: string,
  ): Promise<RequestState<AuthDto>> {
    try {
      const crypto = await createProtectedMasterKey(password);
      const data: SignUpDto = {
        initData: initData,
        encryptedMasterKey: toBase64Url(
          crypto.protectedMasterKey.encryptedMasterKey,
        ),
        salt: toBase64Url(crypto.protectedMasterKey.salt),
        masterKeyIv: toBase64Url(crypto.protectedMasterKey.iv),
      };
      const response = await httpClient.post<AuthDto>(
        "/auth/telegram-signup",
        data,
      );
      useAuthStore.getState().setAuth(response.data.accessToken);
      useAuthStore.getState().setMasterKey(crypto.masterKey);
      return { state: "success", code: response.status, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  async signIn(data: SignInDto): Promise<RequestState<AuthDto>> {
    try {
      const response = await httpClient.post<AuthDto>(
        "/auth/telegram-signin",
        data,
      );
      useAuthStore.getState().setAuth(response.data.accessToken);
      return { state: "success", code: response.status, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  async refresh(): Promise<RequestState<AuthDto>> {
    try {
      const response = await httpClient.post<AuthDto>("/auth/refresh");
      useAuthStore.getState().setAuth(response.data.accessToken);
      return { state: "success", code: response.status, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  async logout(): Promise<RequestState<MessageDto>> {
    try {
      const response = await httpClient.post<MessageDto>("/auth/logout");
      useAuthStore.getState().clearAuth();
      return { state: "success", code: response.status, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },
};
