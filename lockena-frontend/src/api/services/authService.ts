import useAuthStore from "../../store/authStore";
import { handleError, httpClient } from "../httpClient";
import type { SignInDto, SignUpDto, AuthDto } from "../dto/auth";
import type { RequestState } from "../dto/request-state.dto";
import type { MessageDto } from "../dto/message.dto";
import { fromBase64Url, toBase64Url } from "../../crypto/utils";
import {
  createProtectedMasterKey,
  unlockMasterKey,
} from "../../crypto/masterKey";

export const authService = {
  async signUp(
    email: string,
    password: string,
  ): Promise<RequestState<AuthDto>> {
    try {
      const crypto = await createProtectedMasterKey(password);
      const data: SignUpDto = {
        email: email,
        password: password,
        encryptedMasterKey: toBase64Url(
          crypto.protectedMasterKey.encryptedMasterKey,
        ),
        salt: toBase64Url(crypto.protectedMasterKey.salt),
        masterKeyIv: toBase64Url(crypto.protectedMasterKey.iv),
      };
      const response = await httpClient.post<AuthDto>("/auth/signup", data);
      useAuthStore
        .getState()
        .setAuth(response.data.accessToken, response.data.email);
      useAuthStore.getState().setMasterKey(crypto.masterKey);
      return { state: "success", code: response.status, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  async signIn(data: SignInDto): Promise<RequestState<AuthDto>> {
    try {
      const response = await httpClient.post<AuthDto>("/auth/signin", data);
      const masterKey = await unlockMasterKey(
        data.password,
        fromBase64Url(response.data.encryptedMasterKey),
        fromBase64Url(response.data.masterKeyIv),
        fromBase64Url(response.data.salt),
      );
      useAuthStore
        .getState()
        .setAuth(response.data.accessToken, response.data.email);
      useAuthStore.getState().setMasterKey(masterKey);
      return { state: "success", code: response.status, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  async refresh(password?: string): Promise<RequestState<AuthDto>> {
    try {
      const response = await httpClient.post<AuthDto>("/auth/refresh");

      useAuthStore
        .getState()
        .setAuth(response.data.accessToken, response.data.email);
      if (password) {
        const masterKey = await unlockMasterKey(
          password,
          fromBase64Url(response.data.encryptedMasterKey),
          fromBase64Url(response.data.masterKeyIv),
          fromBase64Url(response.data.salt),
        );
        useAuthStore.getState().setMasterKey(masterKey);
      }
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
