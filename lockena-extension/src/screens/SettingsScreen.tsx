import {
  ArrowLeft,
  Shield,
  User,
  Lock,
  Download,
  Trash2,
  LogOut,
} from "lucide-react";
import Button from "../components/Button";
import { useCallback, useEffect, useState } from "react";
import { ChangeMasterPasswordModal } from "../components/ChangeMasterPasswordModal";
import { DeleteAccountModal } from "../components/DeleteAccountModal";
import { sendMessage } from "../messages";

interface SettingsScreenProps {
  onBack?: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [email, setEmail] = useState<string>("Загрузка...");
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState<string | null>(
    null,
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    sendMessage({ type: "GET_SESSION" }).then((response) => {
      if (response && response.type === "SESSION_DATA" && response.payload) {
        setEmail(response.payload.email);
      }
    });
  }, []);

  const handleChangePassword = useCallback(
    async (oldPassword: string, newPassword: string) => {
      setIsChangingPassword(true);
      setChangePasswordError(null);
      try {
        const response = await sendMessage({
          type: "CHANGE_MASTER_PASSWORD",
          payload: { oldPassword, newPassword },
        });

        if (response.type === "ERROR") {
          setChangePasswordError(response.error);
          return;
        }

        if (response.type === "MASTER_PASSWORD_CHANGED") {
          setShowChangePasswordModal(false);
          alert("Мастер-пароль успешно изменен!");
        }
      } catch (err) {
        setChangePasswordError("Произошла неизвестная ошибка.");
        console.error("Change password failed:", err);
      } finally {
        setIsChangingPassword(false);
      }
    },
    [],
  );

  const handleDeleteAccount = useCallback(async (password: string) => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const response = await sendMessage({
        type: "DELETE_ACCOUNT",
        payload: { password },
      });

      if (response.type === "ERROR") {
        setDeleteError(response.error || "Неверный пароль или ошибка сервера");
        return;
      }

      setShowDeleteModal(false);
    } catch (err) {
      setDeleteError("Произошла неизвестная ошибка.");
      console.error("Delete account failed:", err);
    } finally {
      setIsDeleting(false);
    }
  }, []);

  const handleExport = useCallback(async () => {
    try {
      const response = await sendMessage({ type: "GET_DECRYPTED_VAULT_ITEMS" });
      if (
        response &&
        response.type === "DECRYPTED_VAULT_ITEMS" &&
        response.payload
      ) {
        const passwords = response.payload;

        if (passwords.length === 0) {
          alert("Хранилище пусто, нечего экспортировать.");
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
        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "lockena_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("Произошла ошибка при экспорте паролей");
    }
  }, []);

  return (
    <div className="w-90 min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div
            className="h-9 w-9 p-0 hover:bg-gray-100 flex items-center justify-center rounded-lg transition-colors cursor-pointer"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </div>
          <h1 className="font-semibold text-gray-900">Настройки</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Account Section */}
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#4F39F6] to-[#6B5EFF] flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="font-medium text-sm text-gray-900">{email}</div>
              <div className="text-sm text-gray-500">Премиум аккаунт</div>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-gray-200 shrink-0" />

        {/* Security Section */}
        <div className="px-4 py-4 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-wide">
            <Shield className="h-4 w-4" />
            Безопасность
          </div>

          <button
            onClick={() => setShowChangePasswordModal(true)}
            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Lock className="h-4 w-4 text-[#4F39F6]" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">
                  Мастер-пароль
                </div>
                <div className="text-xs text-gray-500">Изменить пароль</div>
              </div>
            </div>
          </button>
        </div>

        <div className="w-full h-px bg-gray-200 shrink-0" />

        {/* Data Section */}
        <div className="px-4 py-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-wide">
            Данные
          </div>

          <button
            onClick={handleExport}
            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center">
              <Download className="h-4 w-4 text-gray-600" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-gray-900">
                Экспорт паролей
              </div>
              <div className="text-xs text-gray-500">Сохранить в файл</div>
            </div>
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-lg transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
              <Trash2 className="h-4 w-4 text-red-600" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-red-600">
                Удалить все данные
              </div>
              <div className="text-xs text-gray-500">Очистить хранилище</div>
            </div>
          </button>
        </div>

        <div className="w-full h-px bg-gray-200 shrink-0" />

        {/* Logout */}
        <div className="px-4 py-4">
          <Button
            icon={<LogOut />}
            onClick={() => {
              sendMessage({ type: "LOGOUT" });
            }}
            title={"Выйти из аккаунта"}
            className="w-full h-11 border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 rounded-lg font-medium"
          />
        </div>

        {/* App Info */}
        <div className="px-4 py-6 text-center">
          <div className="text-xs text-gray-500">Lockena v1.0.0</div>
          <div className="text-xs text-gray-400 mt-1">
            © 2026 Lockena. Все права защищены.
          </div>
        </div>
      </div>

      {showChangePasswordModal && (
        <ChangeMasterPasswordModal
          onClose={() => setShowChangePasswordModal(false)}
          onChange={handleChangePassword}
          isChanging={isChangingPassword}
          error={changePasswordError}
        />
      )}

      {showDeleteModal && (
        <DeleteAccountModal
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleDeleteAccount}
          isDeleting={isDeleting}
          error={deleteError}
        />
      )}
    </div>
  );
}
