import { keyService } from "../../crypto/services/keyService";
import type { MessageDto, RequestResult } from "../../dto/response";
import type { ChangePasswordDto, ProfileDto } from "../../dto/user";
import { httpClient } from "../httpClient";
import { executeRequest } from "../utils/executeRequest";

export const userService = {
  async getProfile(): Promise<RequestResult<ProfileDto>> {
    return executeRequest(httpClient.get<ProfileDto>("/users"));
  },

  async deleteAccount(password: string): Promise<RequestResult<MessageDto>> {
    return executeRequest(
      httpClient.delete<MessageDto>("/users", { data: { password } }),
    );
  },

  async changePassword(
    currentPassword: string,
    newPassword: string,
    masterKey: Uint8Array,
  ): Promise<RequestResult<MessageDto>> {
    const crypto = await keyService.create(newPassword, masterKey);
    const payload: ChangePasswordDto = {
      currentPassword,
      newPassword,
      encryptedMasterKey: crypto.protectedMasterKey.encryptedMasterKey,
      salt: crypto.protectedMasterKey.salt,
    };
    return executeRequest(
      httpClient.put<MessageDto>("/users/change-password", payload),
    );
  },
};
