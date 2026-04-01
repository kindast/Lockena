import { createProtectedMasterKey } from "../../crypto/masterKey";
import { toBase64Url } from "../../crypto/utils";
import useAuthStore from "../../store/authStore";
import type { MessageDto } from "../dto/message.dto";
import type { RequestState } from "../dto/request-state.dto";
import type { ChangePasswordDto } from "../dto/user/change-password.dto";
import type { ProfileDto } from "../dto/user/profile.dto";
import { handleError, httpClient } from "../httpClient";

export const userService = {
  async getProfile(): Promise<RequestState<ProfileDto>> {
    try {
      const response = await httpClient.get<ProfileDto>("/users");
      return { state: "success", code: response.status, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  async deleteAccount(): Promise<RequestState<MessageDto>> {
    try {
      const response = await httpClient.delete<MessageDto>("/users", {
        data: { password: "telegram" },
      });
      return { state: "success", code: response.status, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  async changePassword(
    data: ChangePasswordDto,
  ): Promise<RequestState<MessageDto>> {
    try {
      const masterKey = useAuthStore.getState().masterKey;
      if (!masterKey) throw new Error("Master key not found");
      const crypto = await createProtectedMasterKey(
        data.newPassword,
        masterKey,
      );
      data = {
        ...data,
        encryptedMasterKey: toBase64Url(
          crypto.protectedMasterKey.encryptedMasterKey,
        ),
        salt: toBase64Url(crypto.protectedMasterKey.salt),
        masterKeyIv: toBase64Url(crypto.protectedMasterKey.iv),
      };
      const response = await httpClient.put<MessageDto>(
        "/users/change-password",
        data,
      );
      return { state: "success", code: response.status, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },
};
