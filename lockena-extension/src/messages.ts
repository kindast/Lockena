import type { AuthDto, PasswordItem, VaultItemDto } from "lockena-core";

export type Message =
  | {
      type: "LOCKENA_EXTENSION_LOGIN";
      payload: AuthDto;
    }
  | {
      type: "STORE_SESSION";
      payload: AuthDto;
    }
  | { type: "AUTH_STATE_CHANGED"; authenticated: boolean }
  | { type: "GET_SESSION" }
  | { type: "LOGOUT" }
  | {
      type: "UNLOCK_MASTER_KEY";
      password: string;
    }
  | { type: "GET_MASTER_KEY" }
  | { type: "REFRESH" }
  | { type: "SET_ENCRYPTED_VAULT_ITEMS"; payload: VaultItemDto[] }
  | { type: "SET_DECRYPTED_VAULT_ITEMS"; payload: PasswordItem[] }
  | { type: "GET_ENCRYPTED_VAULT_ITEMS" }
  | { type: "GET_DECRYPTED_VAULT_ITEMS" }
  | { type: "CLEAR_VAULT_ITEMS" }
  | { type: "SYNC_VAULT_ITEMS" }
  | { type: "GET_LOGO"; serviceName: string }
  | { type: "LOCK_VAULT" }
  | { type: "SAVE_VAULT_ITEM"; payload: PasswordItem; id?: string }
  | { type: "DELETE_VAULT_ITEM"; id: string }
  | {
      type: "AUTOFILL_CREDENTIALS";
      payload: { login: string; password: string };
    }
  | {
      type: "CHANGE_MASTER_PASSWORD";
      payload: { oldPassword: string; newPassword: string };
    }
  | { type: "DELETE_ACCOUNT"; payload: { password: string } };

export type Response =
  | { type: "SESSION_DATA"; payload: AuthDto | null }
  | { type: "MASTER_KEY"; payload: Uint8Array | null }
  | { type: "ENCRYPTED_VAULT_ITEMS"; payload: VaultItemDto[] }
  | { type: "DECRYPTED_VAULT_ITEMS"; payload: PasswordItem[] | null }
  | { type: "ERROR"; error: string }
  | { type: "LOGO_URL"; payload: string }
  | { type: "VAULT_ITEM_SAVED"; payload: PasswordItem }
  | { type: "VAULT_ITEM_DELETED"; id: string }
  | { type: "AUTOFILL_SUCCESS" }
  | { type: "MASTER_PASSWORD_CHANGED" }
  | { type: "ACCOUNT_DELETED" };

export const sendMessage = (message: Message): Promise<Response> => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, (response: Response) => {
      resolve(response);
    });
  });
};
