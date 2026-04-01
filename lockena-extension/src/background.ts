import { authService } from "./api/services/authService";
import { fromBase64Url } from "./crypto/utils";
import { unlockMasterKey } from "./crypto/masterKey";
import type { VaultItemDto } from "./api/dto/vault-item/vault-item.dto";
import type { PasswordDto } from "./api/dto/vault-item/password.dto";
import { vaultService } from "./api/services/vaultService";
import { logoService } from "./api/services/logoService";
import { decryptVaultItem, encryptVaultItem } from "./crypto/vaultItem";
import {
  clearAllSessionState,
  getDecryptedVaultItems,
  getEncryptedVaultItems,
  getMasterKey,
  getSession,
  setDecryptedVaultItems,
  setEncryptedVaultItems,
  setMasterKey,
  setSession,
} from "./session";
import type { AuthDto } from "./api/dto/auth/auth.dto";
import { userService } from "./api/services/userService";
import type { ChangePasswordDto } from "./api/dto/user/change-password.dto";
import type { Message, Response } from "./messages";
import type { DeleteAccountDto } from "./api/dto/user/delete-account.dto";

chrome.storage.local.get(
  ["sessionData", "encryptedVaultItems"],
  async (result: {
    sessionData?: AuthDto;
    encryptedVaultItems?: VaultItemDto[];
  }) => {
    setSession(result.sessionData || null);
    setEncryptedVaultItems(result.encryptedVaultItems || []);
    const refreshResult = await authService.refresh();
    if (refreshResult.state !== "loading" && refreshResult.code === 401) {
      clearAllSessionState();
      chrome.storage.local.remove(["sessionData", "encryptedVaultItems"]);
      chrome.runtime
        .sendMessage({
          type: "AUTH_STATE_CHANGED",
          authenticated: false,
        })
        .catch(() => {});
    }
  },
);

chrome.runtime.onMessage.addListener(
  (message: Message, _sender, sendResponse: (response: Response) => void) => {
    switch (message.type) {
      case "STORE_SESSION":
        setSession(message.payload);
        chrome.storage.local.set({ sessionData: message.payload });
        chrome.runtime
          .sendMessage({
            type: "AUTH_STATE_CHANGED",
            authenticated: true,
          })
          .catch(() => {});
        break;

      case "GET_SESSION":
        sendResponse({ type: "SESSION_DATA", payload: getSession() });
        break;

      case "LOGOUT":
        authService.logout().finally(() => {
          clearAllSessionState();
          chrome.storage.local.remove(["sessionData", "encryptedVaultItems"]);
          chrome.runtime
            .sendMessage({
              type: "AUTH_STATE_CHANGED",
              authenticated: false,
            })
            .catch(() => {});
        });
        break;

      case "UNLOCK_MASTER_KEY": {
        const currentSession = getSession();
        if (!currentSession) {
          sendResponse({ type: "ERROR", error: "Сессия не найдена" });
          break;
        }

        unlockMasterKey(
          message.password,
          fromBase64Url(currentSession.encryptedMasterKey),
          fromBase64Url(currentSession.masterKeyIv),
          fromBase64Url(currentSession.salt),
        )
          .then((key) => {
            setMasterKey(key);
            sendResponse({ type: "MASTER_KEY", payload: getMasterKey() });
          })
          .catch((error) => {
            sendResponse({ type: "ERROR", error: (error as Error).message });
          });
        break;
      }

      case "GET_MASTER_KEY":
        sendResponse({ type: "MASTER_KEY", payload: getMasterKey() });
        break;

      case "LOCK_VAULT":
        setMasterKey(null);
        setDecryptedVaultItems(null);
        sendResponse({ type: "MASTER_KEY", payload: null });
        break;

      case "REFRESH": {
        const refresh = async () => {
          const refreshResult = await authService.refresh();
          if (refreshResult.state !== "loading" && refreshResult.code === 401) {
            clearAllSessionState();
            chrome.storage.local.remove(["sessionData", "encryptedVaultItems"]);
            chrome.runtime
              .sendMessage({
                type: "AUTH_STATE_CHANGED",
                authenticated: false,
              })
              .catch(() => {});
            sendResponse({ type: "ERROR", error: "Сессия истекла" });
          }
          if (refreshResult.state === "success") {
            sendResponse({ type: "SESSION_DATA", payload: refreshResult.data });
          }
        };
        refresh();
        break;
      }

      case "SET_ENCRYPTED_VAULT_ITEMS":
        setEncryptedVaultItems(message.payload);
        chrome.storage.local.set({ encryptedVaultItems: message.payload });
        sendResponse({
          type: "ENCRYPTED_VAULT_ITEMS",
          payload: getEncryptedVaultItems(),
        });
        break;

      case "SET_DECRYPTED_VAULT_ITEMS":
        setDecryptedVaultItems(message.payload);
        sendResponse({
          type: "DECRYPTED_VAULT_ITEMS",
          payload: getDecryptedVaultItems(),
        });
        break;

      case "GET_ENCRYPTED_VAULT_ITEMS":
        sendResponse({
          type: "ENCRYPTED_VAULT_ITEMS",
          payload: getEncryptedVaultItems(),
        });
        break;

      case "GET_DECRYPTED_VAULT_ITEMS":
        sendResponse({
          type: "DECRYPTED_VAULT_ITEMS",
          payload: getDecryptedVaultItems(),
        });
        break;

      case "CLEAR_VAULT_ITEMS":
        setEncryptedVaultItems([]);
        setDecryptedVaultItems(null);
        chrome.storage.local.remove("encryptedVaultItems");
        sendResponse({ type: "DECRYPTED_VAULT_ITEMS", payload: null });
        break;

      case "SYNC_VAULT_ITEMS":
        {
          const currentMasterKey = getMasterKey();
          if (!currentMasterKey) {
            sendResponse({ type: "ERROR", error: "Мастер-ключ не найден" });
            break;
          }

          vaultService
            .getVaultItems({ page: 1, pageSize: 100 })
            .then(async (result) => {
              if (result.state === "success") {
                setEncryptedVaultItems(result.data.items);
                chrome.storage.local.set({
                  encryptedVaultItems: getEncryptedVaultItems(),
                });

                const passwords: PasswordDto[] = [];
                for (const item of result.data.items) {
                  passwords.push({
                    ...(await decryptVaultItem(currentMasterKey, item)),
                    id: item.id,
                    updatedAtUtc: item.updatedAtUtc,
                  });
                }
                setDecryptedVaultItems(passwords);
                sendResponse({
                  type: "DECRYPTED_VAULT_ITEMS",
                  payload: passwords,
                });
              } else {
                sendResponse({ type: "ERROR", error: "Ошибка синхронизации" });
              }
            })
            .catch((error) => {
              sendResponse({ type: "ERROR", error: (error as Error).message });
            });
        }
        break;

      case "GET_LOGO": {
        logoService
          .getLogo(message.serviceName)
          .then((res) => {
            if (res.state === "success") {
              const url = URL.createObjectURL(res.data);
              sendResponse({ type: "LOGO_URL", payload: url });
            }
          })
          .catch(() => {
            sendResponse({ type: "ERROR", error: "Логотип не найден" });
          });
        break;
      }

      case "SAVE_VAULT_ITEM": {
        const currentMasterKey = getMasterKey();
        if (!currentMasterKey) {
          sendResponse({ type: "ERROR", error: "Мастер-ключ не найден" });
          break;
        }

        encryptVaultItem(currentMasterKey, message.payload)
          .then(async (encryptedDto) => {
            const response = message.id
              ? await vaultService.updateVaultItem(message.id, encryptedDto)
              : await vaultService.createVaultItem(encryptedDto);

            if (response.state === "error") {
              sendResponse({
                type: "ERROR",
                error: "Ошибка при сохранении пароля",
              });
              return;
            }

            if (response.state === "success") {
              sendResponse({
                type: "VAULT_ITEM_SAVED",
                payload: {
                  ...message.payload,
                  id: message.id || response.data.id,
                  updatedAtUtc: response.data.updatedAtUtc,
                },
              });
            }
          })
          .catch((error) => {
            sendResponse({ type: "ERROR", error: (error as Error).message });
          });
        break;
      }

      case "DELETE_VAULT_ITEM": {
        vaultService
          .deleteVaultItem(message.id)
          .then((response) => {
            if (response.state === "error") {
              sendResponse({
                type: "ERROR",
                error: "Ошибка при удалении пароля",
              });
            } else {
              sendResponse({ type: "VAULT_ITEM_DELETED", id: message.id });
            }
          })
          .catch((error) => {
            sendResponse({ type: "ERROR", error: (error as Error).message });
          });
        break;
      }

      case "CHANGE_MASTER_PASSWORD": {
        const data: ChangePasswordDto = {
          currentPassword: message.payload.oldPassword,
          newPassword: message.payload.newPassword,
        };
        userService.changePassword(data).then((response) => {
          if (response.state === "error") {
            sendResponse({
              type: "ERROR",
              error: "Ошибка при изменении пароля",
            });
          } else {
            sendResponse({ type: "MASTER_PASSWORD_CHANGED" });
          }
        });
        break;
      }

      case "DELETE_ACCOUNT": {
        const data: DeleteAccountDto = {
          password: message.payload.password,
        };
        userService.deleteAccount(data).then((response) => {
          if (response.state === "error") {
            sendResponse({
              type: "ERROR",
              error: "Ошибка при удалении аккаунта",
            });
          } else {
            clearAllSessionState();
            chrome.storage.local.remove(["sessionData", "encryptedVaultItems"]);
            chrome.runtime
              .sendMessage({
                type: "AUTH_STATE_CHANGED",
                authenticated: false,
              })
              .catch(() => {});
          }
        });
        break;
      }

      default:
        console.warn("Unknown message type:", message);
    }

    return true;
  },
);
