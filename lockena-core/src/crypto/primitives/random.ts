import { sodiumLoader } from "../utils/sodiumLoader";

export const randomBytes = (length: number): Uint8Array => {
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  return arr;
};

export const genSalt = async (): Promise<Uint8Array> => {
  const sodium = await sodiumLoader.getSodium();
  return sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);
};
