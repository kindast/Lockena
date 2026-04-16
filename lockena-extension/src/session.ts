import type { AuthDto, PasswordItem, VaultItemDto } from "lockena-core";

let sessionData: AuthDto | null = null;
let masterKey: Uint8Array | null = null;
let encryptedVaultItems: VaultItemDto[] = [];
let decryptedVaultItems: PasswordItem[] | null = null;

export const getSession = (): AuthDto | null => sessionData;
export const setSession = (data: AuthDto | null): void => {
  sessionData = data;
};

export const getMasterKey = (): Uint8Array | null => masterKey;
export const setMasterKey = (key: Uint8Array | null): void => {
  masterKey = key;
};

export const getEncryptedVaultItems = (): VaultItemDto[] => encryptedVaultItems;
export const setEncryptedVaultItems = (items: VaultItemDto[]): void => {
  encryptedVaultItems = items;
};

export const getDecryptedVaultItems = (): PasswordItem[] | null =>
  decryptedVaultItems;
export const setDecryptedVaultItems = (items: PasswordItem[] | null): void => {
  decryptedVaultItems = items;
};

export const clearAllSessionState = (): void => {
  sessionData = null;
  masterKey = null;
  encryptedVaultItems = [];
  decryptedVaultItems = null;
};
