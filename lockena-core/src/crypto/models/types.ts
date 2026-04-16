export interface EncryptedPayload {
  cipherText: Uint8Array;
  iv: Uint8Array;
}

export interface EncryptedMasterKey {
  encryptedMasterKey: string;
  salt: string;
}
