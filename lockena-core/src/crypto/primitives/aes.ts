import { AES_OPTIONS } from "../../constants";
import type { EncryptedPayload } from "../models/types";
import { toArrayBuffer } from "../utils/arrayBuffer";
import { randomBytes } from "./random";

async function importKey(rawKey: Uint8Array): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    toArrayBuffer(rawKey),
    { name: AES_OPTIONS.ALGO },
    false,
    ["encrypt", "decrypt"],
  );
}

export const aes = {
  async encrypt(key: Uint8Array, data: Uint8Array): Promise<EncryptedPayload> {
    const iv = randomBytes(AES_OPTIONS.IV_LENGTH);
    const cryptoKey = await importKey(key);

    const encrypted = await crypto.subtle.encrypt(
      { name: AES_OPTIONS.ALGO, iv: toArrayBuffer(iv) },
      cryptoKey,
      toArrayBuffer(data),
    );

    return {
      cipherText: new Uint8Array(encrypted),
      iv,
    };
  },
  async decrypt(
    key: Uint8Array,
    cipherText: Uint8Array,
    iv: Uint8Array,
  ): Promise<Uint8Array> {
    const cryptoKey = await importKey(key);

    const decrypted = await crypto.subtle.decrypt(
      { name: AES_OPTIONS.ALGO, iv: toArrayBuffer(iv) },
      cryptoKey,
      toArrayBuffer(cipherText),
    );

    return new Uint8Array(decrypted);
  },
};
