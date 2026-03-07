import { toArrayBuffer } from "./aes";

export async function createBlindIndex(
  searchKey: Uint8Array,
  value: string,
): Promise<Uint8Array> {
  const normalized = normalizeTitle(value);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    toArrayBuffer(searchKey),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    new TextEncoder().encode(normalized),
  );

  return new Uint8Array(signature);
}

function normalizeTitle(title: string): string {
  return title.trim().toLowerCase().normalize("NFC");
}
