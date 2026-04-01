import type { MessageDto } from "../dto/message.dto";
import type { RequestState } from "../dto/request-state.dto";
import type { CreateVaultItemDto } from "../dto/vault-item/create-vault-item.dto";
import type { GetVaultItemsParamsDto } from "../dto/vault-item/get-vault-items-params.dto";
import type { GetVaultItemsDto } from "../dto/vault-item/get-vault-items.dto";
import type { VaultItemDto } from "../dto/vault-item/vault-item.dto";
import { handleError, httpClient } from "../httpClient";

export const vaultService = {
  async getVaultItem(id: string): Promise<RequestState<VaultItemDto>> {
    try {
      const response = await httpClient.get<VaultItemDto>("/vault-items/" + id);
      return { state: "success", code: response.status, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },
  async getVaultItems(
    params?: GetVaultItemsParamsDto,
  ): Promise<RequestState<GetVaultItemsDto<VaultItemDto>>> {
    try {
      const response = await httpClient.get<GetVaultItemsDto<VaultItemDto>>(
        "/vault-items/",
        {
          params,
        },
      );

      return {
        state: "success",
        code: response.status,
        data: {
          page: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total,
          items: response.data.items,
        },
      };
    } catch (error) {
      return handleError(error);
    }
  },
  async createVaultItem(
    data: CreateVaultItemDto,
  ): Promise<RequestState<VaultItemDto>> {
    try {
      const response = await httpClient.post<VaultItemDto>(
        "/vault-items/",
        data,
      );
      return { state: "success", code: response.status, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },
  async updateVaultItem(
    id: string,
    data: CreateVaultItemDto,
  ): Promise<RequestState<VaultItemDto>> {
    try {
      const response = await httpClient.put<VaultItemDto>(
        "/vault-items/" + id,
        data,
      );
      return { state: "success", code: response.status, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },
  async deleteVaultItem(id: string): Promise<RequestState<MessageDto>> {
    try {
      const response = await httpClient.delete<MessageDto>(
        "/vault-items/" + id,
      );
      return { state: "success", code: response.status, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },
};
