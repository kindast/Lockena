import type { VaultItemDto } from "./vault-item.dto";

export interface GetVaultItemsDto {
  items: VaultItemDto[];
  total: number;
  page: number;
  pageSize: number;
}
