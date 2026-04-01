import { randomBytes } from "./utils";

const ALGO = "AES-GCM";
const IV_LENGTH = 12;

interface EncryptedData {
  cipherText: Uint8Array;
  iv: Uint8Array;
}

export function toArrayBuffer(u8: Uint8Array): ArrayBuffer {
  return u8.buffer.slice(
    u8.byteOffset,
    u8.byteOffset + u8.byteLength,
  ) as ArrayBuffer;
}

async function importKey(rawKey: Uint8Array): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    toArrayBuffer(rawKey),
    { name: ALGO },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function encrypt(
  key: Uint8Array,
  data: Uint8Array,
): Promise<EncryptedData> {
  const iv = randomBytes(IV_LENGTH);
  const cryptoKey = await importKey(key);

  const encrypted = await crypto.subtle.encrypt(
    { name: ALGO, iv: toArrayBuffer(iv) },
    cryptoKey,
    toArrayBuffer(data),
  );

  return {
    cipherText: new Uint8Array(encrypted),
    iv,
  };
}

export async function decrypt(
  key: Uint8Array,
  cipherText: Uint8Array,
  iv: Uint8Array,
): Promise<Uint8Array> {
  const cryptoKey = await importKey(key);

  const decrypted = await crypto.subtle.decrypt(
    { name: ALGO, iv: toArrayBuffer(iv) },
    cryptoKey,
    toArrayBuffer(cipherText),
  );

  return new Uint8Array(decrypted);
}
