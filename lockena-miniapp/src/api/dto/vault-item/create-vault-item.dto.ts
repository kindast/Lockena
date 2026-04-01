export interface CreateVaultItemDto {
  encryptedItemKey: string;
  itemKeyIv: string;
  encryptedPayload: string;
  payloadIv: string;
  blindIndex: string;
}
