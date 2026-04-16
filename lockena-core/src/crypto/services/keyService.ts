import type { EncryptedMasterKey } from "../models/types";
import { aes } from "../primitives/aes";
import { argon } from "../primitives/argon";
import { genSalt, randomBytes } from "../primitives/random";
import { base64url } from "../utils/base64url";
import { packer } from "../utils/packer";
import { sodiumLoader } from "../utils/sodiumLoader";

export const keyService = {
  async create(
    password: string,
    oldMasterKey?: Uint8Array,
  ): Promise<{
    masterKey: Uint8Array;
    protectedMasterKey: EncryptedMasterKey;
  }> {
    const masterKey = oldMasterKey ?? randomBytes(32);
    const salt = await genSalt();

    const derivedKey = await argon.deriveKey(password, salt);
    try {
      const encryptedPayload = await aes.encrypt(derivedKey, masterKey);
      return {
        masterKey,
        protectedMasterKey: {
          encryptedMasterKey: packer.pack(encryptedPayload),
          salt: base64url.encode(salt),
        },
      };
    } finally {
      sodiumLoader.wipeMemory(derivedKey);
    }
  },
  async decrypt(
    password: string,
    encrypted: EncryptedMasterKey,
  ): Promise<Uint8Array> {
    const derivedKey = await argon.deriveKey(
      password,
      base64url.decode(encrypted.salt),
    );

    try {
      const encryptedPayload = packer.unpack(encrypted.encryptedMasterKey);
      const masterKey = await aes.decrypt(
        derivedKey,
        encryptedPayload.cipherText,
        encryptedPayload.iv,
      );
      return masterKey;
    } finally {
      sodiumLoader.wipeMemory(derivedKey);
    }
  },
};
