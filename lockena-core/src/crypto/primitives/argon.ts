import { sodiumLoader } from "../utils/sodiumLoader";

export const argon = {
  async deriveKey(password: string, salt: Uint8Array): Promise<Uint8Array> {
    const sodium = await sodiumLoader.getSodium();

    return sodium.crypto_pwhash(
      32,
      password,
      salt,
      sodium.crypto_pwhash_OPSLIMIT_MODERATE,
      sodium.crypto_pwhash_MEMLIMIT_MODERATE,
      sodium.crypto_pwhash_ALG_ARGON2ID13,
    );
  },
};
