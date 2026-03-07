import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import { toast, Toaster } from "sonner";
import Dashboard from "./components/Dashboard";
import PasswordDetail from "./components/PasswordDetail";
import PasswordForm from "./components/PasswordForm";
import useAuthStore from "./store/authStore";
import { LoaderCircle, OctagonAlert } from "lucide-react";
import { authService } from "./api/services/authService";
import Profile from "./components/Profile";
import { userService } from "./api/services/userService";
import type { PasswordDto } from "./api/dto/vault-item/password.dto";
import MasterPasswordLogin from "./components/MasterPasswordLogin";
import MasterPasswordSetup from "./components/MasterPasswordSetup";
import { vaultService } from "./api/services/vaultService";
import { encryptVaultItem } from "./crypto/vaultItem";

export default function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [isTelegramReady, setIsTelegramReady] = useState<boolean | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [encryptedState, setEncryptedState] = useState<{
    encryptedMasterKey: string;
    iv: string;
    salt: string;
  }>();
  const masterKey = useAuthStore((s) => s.masterKey);
  useEffect(() => {
    const loadTelegram = async () => {
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        if (tg.initData) setIsTelegramReady(true);
        else setIsTelegramReady(false);
      }
    };
    loadTelegram();
  }, []);

  useEffect(() => {
    const signIn = async () => {
      setIsLoading(true);
      let auth = await authService.refresh();
      if (auth.state === "error") {
        const tg = window.Telegram.WebApp;
        auth = await authService.signIn({ initData: tg.initData });
      }

      if (auth.state === "success") {
        setEncryptedState({
          encryptedMasterKey: auth.data.encryptedMasterKey,
          iv: auth.data.masterKeyIv,
          salt: auth.data.salt,
        });
      }
      if (auth.state === "error" && auth.code !== 404)
        setAuthError(
          "Не удалось получить данные для авторизации. Попробуйте перезагрузить страницу.",
        );

      setIsLoading(false);
    };

    if (isTelegramReady) signIn();
  }, [isTelegramReady]);

  const [passwords, setPasswords] = useState<PasswordDto[]>([]);
  const [view, setView] = useState<"list" | "detail" | "form" | "profile">(
    "list",
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleAdd = useCallback(() => {
    setSelectedId(null);
    setIsEditing(false);
    setView("form");
  }, []);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    setView("detail");
  }, []);

  const fetchPasswords = useCallback(async () => {
    if (!masterKey) return;
    const response = await vaultService.getVaultItems({
      pageSize: 100,
      page: 1,
    });

    if (response.state === "success") {
      setPasswords(response.data.items);
    } else {
      toast.error("Ошибка при загрузке паролей");
      console.error("Fetch error:", response);
    }
  }, [masterKey]);

  const handleSave = useCallback(
    async (data: PasswordDto) => {
      if (!masterKey) return;
      if (selectedId && isEditing) {
        // UPDATE
        const dto = await encryptVaultItem(masterKey, data);
        const response = await vaultService.updateVaultItem(selectedId, dto);
        if (response.state === "error") {
          toast.error("Ошибка при обновлении пароля");
          console.error("Update error:", response);
          return;
        }

        if (response.state === "success") {
          const updatedItem = {
            id: selectedId,
            ...data,
            updatedAtUtc: response.data.updatedAtUtc,
          };
          setPasswords((prev) =>
            prev.map((p) => (p.id === selectedId ? updatedItem : p)),
          );
          toast.success("Пароль обновлён");
          setView("detail");
        }
      } else {
        // ADD
        const dto = await encryptVaultItem(masterKey, data);
        const response = await vaultService.createVaultItem(dto);
        if (response.state === "error") {
          toast.error("Ошибка при сохранении пароля");
          console.error("Save error:", response);
          return;
        }
        if (response.state === "success") {
          const newItem = {
            id: response.data.id,
            ...data,
            updatedAtUtc: response.data.updatedAtUtc,
          };
          setPasswords((prev) => [...prev, newItem]);
          toast.success("Пароль сохранён");
          setView("list");
        }
      }
      setIsEditing(false);
    },
    [selectedId, isEditing, masterKey],
  );

  const handleDelete = useCallback(async () => {
    if (confirm("Вы уверены, что хотите удалить этот пароль?")) {
      const response = await vaultService.deleteVaultItem(selectedId!);
      if (response.state === "error") {
        toast.error("Ошибка при удалении пароля");
        console.error("Delete error:", response);
        return;
      }
      setPasswords((prev) => prev.filter((p) => p.id !== selectedId));
      toast.success("Пароль удалён");
      setView("list");
      setSelectedId(null);
    }
  }, [selectedId]);

  const handleClearAll = useCallback(async () => {
    if (confirm("Это действие удалит ВСЕ ваши пароли. Вы уверены?")) {
      const response = await userService.deleteAccount();
      if (response.state === "error") {
        toast.error("Ошибка при удалении данных");
        console.error("Account delete error:", response);
        return;
      }
      window.Telegram?.WebApp.close();
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      (async () => {
        await fetchPasswords();
      })();
    }
  }, [fetchPasswords, isAuthenticated]);

  const selectedEntry = passwords.find((p) => p.id === selectedId);

  if (isTelegramReady === false) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#efeff4] dark:bg-black">
        <div className="flex flex-col items-center  gap-4 px-6 text-center">
          <OctagonAlert className="dark:text-white w-20 h-20" />
          <div className="text-black dark:text-white text-xl ">
            Это приложение работает только через Telegram
          </div>
        </div>
      </div>
    );
  }

  if (isTelegramReady === undefined) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#efeff4] dark:bg-black">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle className="animate-spin text-[#4f46e5] w-12 h-12" />
          <div className="text-black dark:text-white text-xl">
            Загрузка Telegram...
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#efeff4] dark:bg-black">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle className="animate-spin text-[#4f46e5] w-12 h-12" />
          <div className="text-black dark:text-white text-xl">
            Авторизация...
          </div>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#efeff4] dark:bg-black">
        <div className="flex flex-col items-center  gap-4 px-6 text-center">
          <OctagonAlert className="dark:text-white w-20 h-20" />
          <div className="text-black dark:text-white text-xl ">{authError}</div>
        </div>
      </div>
    );
  }

  if (isAuthenticated && !masterKey && encryptedState) {
    return <MasterPasswordLogin encryptedState={encryptedState} />;
  }

  if (!isAuthenticated && !masterKey) {
    return <MasterPasswordSetup />;
  }

  return (
    <div className="bg-[#efeff4] dark:bg-[#1c1c1e]">
      <div className="max-w-3xl mx-auto bg-black min-h-screen relative overflow-hidden shadow-2xl">
        <Toaster position="bottom-center" />

        <AnimatePresence mode="wait">
          {view === "list" && (
            <Dashboard
              key="dashboard"
              passwords={passwords}
              onAdd={handleAdd}
              onSelect={handleSelect}
              onProfile={() => setView("profile")}
            />
          )}

          {view === "profile" && (
            <Profile
              key="profile"
              count={passwords.length}
              onBack={() => setView("list")}
              onClear={handleClearAll}
            />
          )}

          {view === "detail" && selectedEntry && (
            <PasswordDetail
              key="detail"
              entry={selectedEntry}
              onBack={() => setView("list")}
              onEdit={() => {
                setIsEditing(true);
                setView("form");
              }}
              onDelete={handleDelete}
            />
          )}

          {view === "form" && (
            <PasswordForm
              key="form"
              initialData={isEditing ? selectedEntry : undefined}
              onSave={handleSave}
              onCancel={() => {
                if (isEditing) setView("detail");
                else setView("list");
                setIsEditing(false);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
