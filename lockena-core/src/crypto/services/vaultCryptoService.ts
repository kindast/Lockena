import type { CreateVaultItemDto } from "../../dto/vault-item/create-vault-item.dto";
import type { VaultItemDto } from "../../dto/vault-item/vault-item.dto";
import type { VaultItem } from "../../models";
import { aes } from "../primitives/aes";
import { randomBytes } from "../primitives/random";
import { packer } from "../utils/packer";
import { sodiumLoader } from "../utils/sodiumLoader";

export const vaultCryptoService = {
  async encrypt(
    masterKey: Uint8Array,
    plaintextVaultItem: VaultItem,
  ): Promise<CreateVaultItemDto> {
    const itemKey = randomBytes(32);

    let payloadBytes: Uint8Array = new Uint8Array(0);
    try {
      //Сериализуем payload
      const encoder = new TextEncoder();
      payloadBytes = encoder.encode(JSON.stringify(plaintextVaultItem));

      //Шифруем payload
      const encryptedPayload = await aes.encrypt(itemKey, payloadBytes);

      //Шифруем itemKey мастер-ключом
      const encryptedItemKey = await aes.encrypt(masterKey, itemKey);

      return {
        encryptedItemKey: packer.pack(encryptedItemKey),
        encryptedPayload: packer.pack(encryptedPayload),
      };
    } finally {
      sodiumLoader.wipeMemory(itemKey);
      if (payloadBytes.length > 0) sodiumLoader.wipeMemory(payloadBytes);
    }
  },
  async decrypt(
    masterKey: Uint8Array,
    encryptedItem: VaultItemDto,
  ): Promise<VaultItem> {
    //Base64 → bytes
    const encryptedItemKey = packer.unpack(encryptedItem.encryptedItemKey);
    const encryptedPayload = packer.unpack(encryptedItem.encryptedPayload);

    let itemKey: Uint8Array = new Uint8Array(0);
    let payloadBytes: Uint8Array = new Uint8Array(0);
    try {
      //Расшифровываем itemKey
      itemKey = await aes.decrypt(
        masterKey,
        encryptedItemKey.cipherText,
        encryptedItemKey.iv,
      );

      //Расшифровываем payload
      payloadBytes = await aes.decrypt(
        itemKey,
        encryptedPayload.cipherText,
        encryptedPayload.iv,
      );

      //JSON parse
      const decoder = new TextDecoder();
      const json = decoder.decode(payloadBytes);
      return JSON.parse(json) as VaultItem;
    } finally {
      if (itemKey.length > 0) sodiumLoader.wipeMemory(itemKey);
      if (payloadBytes.length > 0) sodiumLoader.wipeMemory(payloadBytes);
    }
  },
};
