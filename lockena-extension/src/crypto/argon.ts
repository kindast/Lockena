import sodium from "libsodium-wrappers-sumo";

let sodiumInstance: typeof sodium;

async function getSodium() {
  if (!sodiumInstance) {
    await sodium.ready;
    sodiumInstance = sodium;
  }
  return sodiumInstance;
}

export const genSalt = (): Uint8Array =>
  sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);

export async function deriveKey(
  password: string,
  salt: Uint8Array,
): Promise<Uint8Array> {
  const sodium = await getSodium();

  return sodium.crypto_pwhash(
    32,
    password,
    salt,
    sodium.crypto_pwhash_OPSLIMIT_MODERATE,
    sodium.crypto_pwhash_MEMLIMIT_MODERATE,
    sodium.crypto_pwhash_ALG_ARGON2ID13,
  );
}
