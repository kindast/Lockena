import type { EncryptedPayload } from "../models/types";
import { base64url } from "./base64url";
import { CIPHER_VERSION } from "../../constants";

export const packer = {
  pack(payload: EncryptedPayload): string {
    return `${CIPHER_VERSION}.${base64url.encode(payload.iv)}|${base64url.encode(
      payload.cipherText,
    )}`;
  },
  unpack(packed: string): EncryptedPayload {
    const parts = packed.split("|");
    if (parts.length != 2) throw new Error("Invalid ciphertext format");
    const iv = parts[0].split(".")[1];
    const cipherText = parts[1];
    return {
      iv: base64url.decode(iv),
      cipherText: base64url.decode(cipherText),
    };
  },
};
