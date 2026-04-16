import { keyService } from "../../crypto/services/keyService";
import type { AuthDto, SignUpDto } from "../../dto/auth";
import type { MessageDto, RequestResult } from "../../dto/response";
import { httpClient } from "../httpClient";
import { executeRequest } from "../utils/executeRequest";

export const authService = {
  async signUp(
    email: string,
    password: string,
  ): Promise<RequestResult<AuthDto>> {
    const crypto = await keyService.create(password);
    const data: SignUpDto = {
      email,
      password,
      encryptedMasterKey: crypto.protectedMasterKey.encryptedMasterKey,
      salt: crypto.protectedMasterKey.salt,
    };
    return executeRequest(httpClient.post<AuthDto>("/auth/signup", data));
  },

  async signIn(
    email: string,
    password: string,
  ): Promise<RequestResult<AuthDto>> {
    return executeRequest(
      httpClient.post<AuthDto>("/auth/signin", { email, password }),
    );
  },

  async signUpWithTelegram(
    initData: string,
    password: string,
  ): Promise<RequestResult<AuthDto>> {
    const crypto = await keyService.create(password);
    const data = {
      initData,
      password,
      encryptedMasterKey: crypto.protectedMasterKey.encryptedMasterKey,
      salt: crypto.protectedMasterKey.salt,
    };
    return executeRequest(
      httpClient.post<AuthDto>("/auth/telegram-signup", data),
    );
  },

  async signInWithTelegram(initData: string): Promise<RequestResult<AuthDto>> {
    return executeRequest(
      httpClient.post<AuthDto>("/auth/telegram-signin", { initData }),
    );
  },

  async refresh(): Promise<RequestResult<AuthDto>> {
    return executeRequest(httpClient.post<AuthDto>("/auth/refresh"));
  },

  async logout(): Promise<RequestResult<MessageDto>> {
    return executeRequest(httpClient.post<MessageDto>("/auth/logout"));
  },

  async sendEmailConfirmation(
    credentials: string,
  ): Promise<RequestResult<MessageDto>> {
    return executeRequest(
      httpClient.post<MessageDto>("/auth/send-email-confirmation", {
        credentials,
      }),
    );
  },

  async verifyEmail(token: string): Promise<RequestResult<MessageDto>> {
    return executeRequest(
      httpClient.post<MessageDto>("/auth/confirm-email", { token }),
    );
  },

  async linkEmail(email: string): Promise<RequestResult<MessageDto>> {
    return executeRequest(
      httpClient.post<MessageDto>("/auth/telegram-link-email", { email }),
    );
  },
};
