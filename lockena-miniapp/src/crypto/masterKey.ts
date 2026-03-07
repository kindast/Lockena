import { randomBytes } from "./utils";
import { encrypt, decrypt } from "./aes";
import { deriveKey, genSalt } from "./argon";

interface ProtectedMasterKey {
  encryptedMasterKey: Uint8Array;
  iv: Uint8Array;
  salt: Uint8Array;
}

export async function createProtectedMasterKey(
  password: string,
  oldMasterKey?: Uint8Array,
): Promise<{
  masterKey: Uint8Array;
  protectedMasterKey: ProtectedMasterKey;
}> {
  const masterKey = oldMasterKey ?? randomBytes(32);
  const salt = genSalt();

  const derivedKey = await deriveKey(password, salt);
  const { cipherText, iv } = await encrypt(derivedKey, masterKey);

  return {
    masterKey,
    protectedMasterKey: {
      encryptedMasterKey: cipherText,
      iv,
      salt,
    },
  };
}

export async function unlockMasterKey(
  password: string,
  encryptedMasterKey: Uint8Array,
  iv: Uint8Array,
  salt: Uint8Array,
): Promise<Uint8Array> {
  const derivedKey = await deriveKey(password, salt);

  const masterKey = await decrypt(derivedKey, encryptedMasterKey, iv);

  return masterKey;
}
