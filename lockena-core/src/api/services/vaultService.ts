import type { MessageDto, RequestResult } from "../../dto/response";
import type {
  CreateVaultItemDto,
  GetVaultItemsDto,
  VaultItemDto,
} from "../../dto/vault-item";
import { httpClient } from "../httpClient";
import { executeRequest } from "../utils/executeRequest";

export const vaultService = {
  async getVaultItem(id: string): Promise<RequestResult<VaultItemDto>> {
    return executeRequest(httpClient.get<VaultItemDto>(`/vault-items/${id}`));
  },
  async getVaultItems(): Promise<RequestResult<GetVaultItemsDto>> {
    return executeRequest(httpClient.get<GetVaultItemsDto>("/vault-items"));
  },
  async createVaultItem(
    encryptedVaultItem: CreateVaultItemDto,
  ): Promise<RequestResult<VaultItemDto>> {
    return executeRequest(
      httpClient.post<VaultItemDto>("/vault-items", encryptedVaultItem),
    );
  },
  async updateVaultItem(
    id: string,
    encryptedVaultItem: CreateVaultItemDto,
  ): Promise<RequestResult<VaultItemDto>> {
    return executeRequest(
      httpClient.put<VaultItemDto>(`/vault-items/${id}`, encryptedVaultItem),
    );
  },
  async deleteVaultItem(id: string): Promise<RequestResult<MessageDto>> {
    return executeRequest(httpClient.delete<MessageDto>(`/vault-items/${id}`));
  },
};
