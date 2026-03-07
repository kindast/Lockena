export interface VaultItemDto {
  id: string;
  encryptedItemKey: string;
  itemKeyIv: string;
  encryptedPayload: string;
  payloadIv: string;
  blindIndex: string;
  createdAtUtc: string;
  updatedAtUtc: string;
}
