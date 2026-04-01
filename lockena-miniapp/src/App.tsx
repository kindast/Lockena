import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
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
import ConfirmDialog from "./components/ConfirmDialog";
import { encryptVaultItem } from "./crypto/vaultItem";
import LinkEmailForm from "./components/LinkEmailForm";
import ChangeMasterPasswordForm from "./components/ChangeMasterPasswordForm";

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
  const [view, setView] = useState<
    "list" | "detail" | "form" | "profile" | "link-email" | "change-password"
  >("list");
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void | Promise<void>;
  } | null>(null);
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
    setConfirmState({
      isOpen: true,
      title: "Удалить пароль?",
      message: "Это действие нельзя будет отменить.",
      onConfirm: async () => {
        const response = await vaultService.deleteVaultItem(selectedId!);
        if (response.state === "error") {
          toast.error("Ошибка при удалении пароля");
          console.error("Delete error:", response);
        } else {
          setPasswords((prev) => prev.filter((p) => p.id !== selectedId));
          toast.success("Пароль удалён");
          setView("list");
          setSelectedId(null);
        }
        setConfirmState(null);
      },
    });
  }, [selectedId]);

  const handleDeleteMultiple = useCallback(async (ids: string[]) => {
    setConfirmState({
      isOpen: true,
      title: `Удалить пароли (${ids.length})?`,
      message: "Это действие нельзя будет отменить.",
      onConfirm: async () => {
        let errorCount = 0;
        for (const id of ids) {
          const response = await vaultService.deleteVaultItem(id);
          if (response.state === "error") {
            console.error("Delete error:", response);
            errorCount++;
          }
        }
        if (errorCount > 0) {
          toast.error(`Ошибка при удалении паролей (${errorCount})`);
        } else {
          toast.success("Пароли удалены");
        }
        setPasswords((prev) => prev.filter((p) => !ids.includes(p.id!)));
        setView("list");
        setSelectedId(null);
        setConfirmState(null);
      },
    });
  }, []);

  const handleExport = useCallback(async () => {
    if (passwords.length === 0) {
      toast.info("Хранилище пусто, нечего экспортировать.");
      console.log(passwords);
      return;
    }

    const headers = [
      "Сервис",
      "Логин",
      "Пароль",
      "Веб-сайт",
      "Категория",
      "Заметки",
    ];

    const escapeCSV = (field?: string) => {
      if (!field) return '""';
      return `"${String(field).replace(/"/g, '""')}"`;
    };

    const csvRows = passwords.map((p) =>
      [
        escapeCSV(p.serviceName),
        escapeCSV(p.login),
        escapeCSV(p.password),
        escapeCSV(p.url),
        escapeCSV(p.category),
        escapeCSV(p.notes),
      ].join(","),
    );

    const csvContent =
      "\uFEFF" + [headers.map(escapeCSV).join(","), ...csvRows].join("\n");
    navigator.clipboard.writeText(csvContent);
    toast.success(`Пароли скопированы в буфер обмена в формате CSV`);
  }, []);

  const handleClearAll = useCallback(async () => {
    setConfirmState({
      isOpen: true,
      title: "Стереть все данные?",
      message: "Это действие удалит ВСЕ ваши пароли и закроет приложение.",
      onConfirm: async () => {
        const response = await userService.deleteAccount();
        if (response.state === "error") {
          toast.error("Ошибка при удалении данных");
          console.error("Account delete error:", response);
        } else {
          window.Telegram?.WebApp.close();
        }
        setConfirmState(null);
      },
    });
  }, []);

  const handleLinkEmail = useCallback(async (email: string) => {
    const response = await authService.linkEmail(email);
    if (response.state === "success") {
      toast.success(`Ссылка для подтверждения отправлена на ${email}`);
      setView("list");
    } else if (response.state === "error") {
      toast.error(response.errors);
    }
  }, []);

  const handleChangePassword = useCallback(
    async (currentPass: string, newPass: string) => {
      const response = await userService.changePassword({
        currentPassword: currentPass,
        newPassword: newPass,
      });
      if (response.state === "success") {
        toast.success("Мастер-пароль успешно изменён");
        setView("profile");
      } else if (response.state === "error") {
        toast.error(response.errors);
      }
    },
    [],
  );

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

        {confirmState && (
          <ConfirmDialog
            isOpen={confirmState.isOpen}
            title={confirmState.title}
            message={confirmState.message}
            onConfirm={confirmState.onConfirm}
            onCancel={() => setConfirmState(null)}
          />
        )}

        <AnimatePresence mode="wait">
          {view === "list" && (
            <Dashboard
              key="dashboard"
              passwords={passwords}
              onAdd={handleAdd}
              onSelect={handleSelect}
              onProfile={() => setView("profile")}
              onDeleteMultiple={handleDeleteMultiple}
            />
          )}

          {view === "profile" && (
            <Profile
              key="profile"
              count={passwords.length}
              onBack={() => setView("list")}
              onClear={handleClearAll}
              onExport={handleExport}
              onLinkEmail={() => setView("link-email")}
              onChangePassword={() => setView("change-password")}
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

          {view === "link-email" && (
            <LinkEmailForm
              key="link-email"
              onBack={() => setView("profile")}
              onSubmit={handleLinkEmail}
            />
          )}

          {view === "change-password" && (
            <ChangeMasterPasswordForm
              key="change-password"
              onBack={() => setView("profile")}
              onSubmit={handleChangePassword}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
