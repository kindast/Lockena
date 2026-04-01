import type { AuthDto } from "./api/dto/auth/auth.dto";
import type { PasswordDto } from "./api/dto/vault-item/password.dto";
import type { VaultItemDto } from "./api/dto/vault-item/vault-item.dto";

let sessionData: AuthDto | null = null;
let masterKey: Uint8Array | null = null;
let encryptedVaultItems: VaultItemDto[] = [];
let decryptedVaultItems: PasswordDto[] | null = null;

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

export const getDecryptedVaultItems = (): PasswordDto[] | null =>
  decryptedVaultItems;
export const setDecryptedVaultItems = (items: PasswordDto[] | null): void => {
  decryptedVaultItems = items;
};

export const clearAllSessionState = (): void => {
  sessionData = null;
  masterKey = null;
  encryptedVaultItems = [];
  decryptedVaultItems = null;
};
