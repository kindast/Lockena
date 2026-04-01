import { toArrayBuffer } from "./aes";

export async function deriveSearchKey(
  masterKey: Uint8Array,
): Promise<Uint8Array> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    toArrayBuffer(masterKey),
    "HKDF",
    false,
    ["deriveBits"],
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: new Uint8Array(32),
      info: new TextEncoder().encode("vault-search-key"),
    },
    keyMaterial,
    256,
  );

  return new Uint8Array(derivedBits);
}
