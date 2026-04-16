export interface VaultItemDto {
  id: string;
  encryptedItemKey: string;
  encryptedPayload: string;
  createdAtUtc: string;
  updatedAtUtc: string;
}
