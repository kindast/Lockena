import Logo from "../components/Logo";
import { Plus, Search, Settings, Lock, Cloud } from "lucide-react";
import Button from "../components/Button";
import AccentButton from "../components/AccentButton";
import { useNavigate } from "react-router";
import { useCallback, useEffect, useState } from "react";
import { MasterPasswordScreen } from "./MasterPasswordScreen";
import type { PasswordDto } from "../api/dto/vault-item/password.dto";
import { PasswordItem } from "../components/PasswordItem";
import { PasswordDetailScreen } from "./PasswordDetailScreen";
import { PasswordFormScreen } from "./PasswordFormScreen";
import TextField from "../components/TextField";
import { sendMessage } from "../messages";

function DashboardScreen() {
  const navigate = useNavigate();
  const [isMasterKeyUnlocked, setIsMasterKeyUnlocked] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [passwords, setPasswords] = useState<PasswordDto[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function checkMasterKey() {
      const response = await sendMessage({ type: "GET_MASTER_KEY" });
      if (response && response.type === "MASTER_KEY" && response.payload) {
        setIsMasterKeyUnlocked(true);
      }
    }

    checkMasterKey();
  }, []);

  const unlockMasterKey = useCallback(async (password: string) => {
    setIsUnlocking(true);
    setError(null);
    try {
      const response = await sendMessage({
        type: "UNLOCK_MASTER_KEY",
        password,
      });
      if (response && response.type === "MASTER_KEY" && response.payload) {
        setIsMasterKeyUnlocked(true);
      } else {
        setError("Неверный пароль");
      }
    } catch {
      setError("Произошла ошибка при проверке пароля");
    } finally {
      setIsUnlocking(false);
    }
  }, []);

  const lockVault = useCallback(async () => {
    try {
      // Отправляем команду на блокировку в background
      await sendMessage({ type: "LOCK_VAULT" });
      // Обновляем состояние UI
      setIsMasterKeyUnlocked(false);
      setPasswords([]);
      setError(null);
    } catch (e) {
      console.error("Failed to lock vault:", e);
    }
  }, []);

  useEffect(() => {
    if (!isMasterKeyUnlocked) return;

    async function syncPasswords() {
      setIsSyncing(true);
      try {
        // Сначала моментально подгружаем кэшированные расшифрованные пароли (если есть)
        const cached = await sendMessage({ type: "GET_DECRYPTED_VAULT_ITEMS" });
        if (cached.type === "DECRYPTED_VAULT_ITEMS" && cached.payload) {
          setPasswords(cached.payload);
        }

        // Запускаем синхронизацию и дешифровку в background
        const response = await sendMessage({ type: "SYNC_VAULT_ITEMS" });
        if (response.type === "DECRYPTED_VAULT_ITEMS" && response.payload) {
          setPasswords(response.payload);
        }
      } catch (err) {
        console.error("Failed to sync passwords:", err);
      } finally {
        setIsSyncing(false);
      }
    }

    syncPasswords();
  }, [isMasterKeyUnlocked]);

  const filteredPasswords = passwords.filter(
    (pwd) =>
      pwd.serviceName.toLowerCase().includes(search.toLowerCase()) ||
      pwd.login.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSave = useCallback(
    async (data: PasswordDto) => {
      try {
        const response = await sendMessage({
          type: "SAVE_VAULT_ITEM",
          payload: data,
          id: selectedId,
        });

        if (response.type === "ERROR") {
          alert(response.error);
          return;
        }

        if (response.type === "VAULT_ITEM_SAVED") {
          const savedItem = response.payload;
          if (selectedId) {
            setPasswords((prev) =>
              prev.map((p) => (p.id === selectedId ? savedItem : p)),
            );
            setSelectedId(savedItem.id);
          } else {
            setPasswords((prev) => [...prev, savedItem]);
            setSelectedId(undefined);
          }
        }
        setIsEditing(false);

        // Запускаем фоновую синхронизацию, чтобы обновить локальное хранилище расширения
        sendMessage({ type: "SYNC_VAULT_ITEMS" }).catch(() => {});
      } catch (err) {
        alert("Произошла ошибка при сохранении");
        console.error("Save failed:", err);
      }
    },
    [selectedId],
  );

  const handleDelete = useCallback(async () => {
    if (!selectedId) return;
    try {
      const response = await sendMessage({
        type: "DELETE_VAULT_ITEM",
        id: selectedId,
      });

      if (response.type === "ERROR") {
        alert(response.error);
        return;
      }

      if (response.type === "VAULT_ITEM_DELETED") {
        setPasswords((prev) => prev.filter((p) => p.id !== selectedId));
        setSelectedId(undefined);
      }

      sendMessage({ type: "SYNC_VAULT_ITEMS" }).catch(() => {});
    } catch (err) {
      alert("Произошла ошибка при удалении");
      console.error("Delete failed:", err);
    }
  }, [selectedId]);

  if (!isMasterKeyUnlocked) {
    return (
      <MasterPasswordScreen
        onSubmit={(password) => unlockMasterKey(password)}
        isLoading={isUnlocking}
        error={error}
      />
    );
  }

  if (isEditing) {
    return (
      <PasswordFormScreen
        initialData={passwords.find((p) => p.id === selectedId) || undefined}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  const selectedPassword = passwords.find((p) => p.id === selectedId);
  if (selectedId && !isEditing && selectedPassword) {
    return (
      <PasswordDetailScreen
        password={selectedPassword}
        onBack={() => setSelectedId(undefined)}
        onEdit={() => setIsEditing(true)}
        onDelete={handleDelete}
      />
    );
  }

  return (
    <div className="w-90 min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Logo className="w-10 h-10" />
            <h1 className="font-semibold text-xl text-gray-900">Lockena</h1>
          </div>
        </div>

        {/* Search */}
        <TextField
          id={"search"}
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          icon={<Search />}
          placeholder="Поиск паролей"
          type="text"
        />
      </div>

      {/* Password List */}
      <div className="flex-1 py-2">
        <div className="px-4 py-2">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Сохраненные аккаунты ({filteredPasswords.length})
          </h3>
        </div>

        <div className="space-y-1 px-2 overflow-y-auto">
          {filteredPasswords.map((pwd) => (
            <div
              key={pwd.id}
              onClick={() => setSelectedId(pwd.id)}
              className="cursor-pointer"
            >
              <PasswordItem
                password={pwd}
                onAutofill={async () => {
                  try {
                    const [tab] = await chrome.tabs.query({
                      active: true,
                      currentWindow: true,
                    });
                    if (tab && tab.id) {
                      await chrome.tabs.sendMessage(tab.id, {
                        type: "AUTOFILL_CREDENTIALS",
                        payload: { login: pwd.login, password: pwd.password },
                      });
                      window.close();
                    }
                  } catch (e) {
                    console.error("Failed to autofill", e);
                  }
                }}
              />
            </div>
          ))}
        </div>

        {filteredPasswords.length === 0 && !isSyncing && (
          <div className="px-4 py-8 text-center text-gray-500">
            Пароли не найдены
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="px-4 pb-3 space-y-2">
        <Button
          icon={<Plus />}
          title="Добавить пароль"
          onClick={() => {
            setSelectedId(undefined);
            setIsEditing(true);
          }}
        />
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 border-t border-gray-100 pt-3">
        <div className="flex items-center justify-between">
          <AccentButton
            icon={<Settings />}
            title="Настройки"
            className="min-w-32"
            onClick={() => navigate("/settings")}
          />
          <div className="flex items-center gap-2">
            {isSyncing && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500 animate-pulse">
                <Cloud className="h-3.5 w-3.5 text-[#4F39F6]" />
                <span>Синхронизация...</span>
              </div>
            )}

            <button
              onClick={lockVault}
              title="Заблокировать хранилище"
              className="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 gap-1.5 has-[>svg]:px-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 h-9 px-3 rounded-lg"
            >
              <Lock className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardScreen;
