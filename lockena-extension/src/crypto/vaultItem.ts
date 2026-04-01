import { fromBase64Url, randomBytes, toBase64Url } from "./utils";
import { decrypt, encrypt } from "./aes";
import type { CreateVaultItemDto } from "../api/dto/vault-item/create-vault-item.dto";
import type { PasswordDto } from "../api/dto/vault-item/password.dto";
import type { VaultItemDto } from "../api/dto/vault-item/vault-item.dto";
import { deriveSearchKey } from "./hkdf";
import { createBlindIndex } from "./blindIndex";

export async function encryptVaultItem(
  masterKey: Uint8Array,
  input: PasswordDto,
): Promise<CreateVaultItemDto> {
  const itemKey = randomBytes(32);

  //Сериализуем payload
  const encoder = new TextEncoder();
  const payloadBytes = encoder.encode(JSON.stringify(input));

  //Шифруем payload
  const { cipherText: encryptedPayload, iv: payloadIv } = await encrypt(
    itemKey,
    payloadBytes,
  );

  //Шифруем itemKey мастер-ключом
  const { cipherText: encryptedItemKey, iv: itemKeyIv } = await encrypt(
    masterKey,
    itemKey,
  );

  //Создаём blind index (по названию сервиса)
  const searchKey = await deriveSearchKey(masterKey);
  const blindIndex = await createBlindIndex(searchKey, input.serviceName);

  const dto: CreateVaultItemDto = {
    encryptedItemKey: toBase64Url(encryptedItemKey),
    itemKeyIv: toBase64Url(itemKeyIv),
    encryptedPayload: toBase64Url(encryptedPayload),
    payloadIv: toBase64Url(payloadIv),
    blindIndex: toBase64Url(blindIndex),
  };
  return dto;
}

export async function decryptVaultItem(
  masterKey: Uint8Array,
  apiItem: VaultItemDto,
): Promise<PasswordDto> {
  //Base64 → bytes
  const encryptedItemKey = fromBase64Url(apiItem.encryptedItemKey);
  const itemKeyIv = fromBase64Url(apiItem.itemKeyIv);
  const encryptedPayload = fromBase64Url(apiItem.encryptedPayload);
  const payloadIv = fromBase64Url(apiItem.payloadIv);

  //Расшифровываем itemKey
  const itemKey = await decrypt(masterKey, encryptedItemKey, itemKeyIv);

  //Расшифровываем payload
  const payloadBytes = await decrypt(itemKey, encryptedPayload, payloadIv);

  //JSON parse
  const decoder = new TextDecoder();
  const json = decoder.decode(payloadBytes);

  return JSON.parse(json) as PasswordDto;
}
