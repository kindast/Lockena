import { useState } from "react";
import { X } from "lucide-react";

interface ChangeMasterPasswordModalProps {
  onClose: () => void;
  onChange: (oldPassword: string, newPassword: string) => Promise<void>;
  isChanging?: boolean;
  error?: string | null;
}

export function ChangeMasterPasswordModal({
  onClose,
  onChange,
  isChanging,
  error,
}: ChangeMasterPasswordModalProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = () => {
    setValidationError(null);
    if (!oldPassword || !newPassword || !confirmPassword) {
      setValidationError("Все поля обязательны для заполнения.");
      return;
    }
    if (newPassword.length < 8) {
      setValidationError("Новый пароль должен быть не менее 8 символов.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setValidationError("Новые пароли не совпадают.");
      return;
    }
    onChange(oldPassword, newPassword);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Смена мастер-пароля
            </h3>
            <button
              onClick={onClose}
              className="p-1 -mr-2 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-3">
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Старый мастер-пароль"
              className="w-full text-sm outline-none bg-gray-50 placeholder:text-gray-400 text-gray-900 rounded-lg px-3 py-2.5 border border-gray-200 focus:ring-2 focus:ring-indigo-200"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Новый мастер-пароль"
              className="w-full text-sm outline-none bg-gray-50 placeholder:text-gray-400 text-gray-900 rounded-lg px-3 py-2.5 border border-gray-200 focus:ring-2 focus:ring-indigo-200"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Подтвердите новый пароль"
              className="w-full text-sm outline-none bg-gray-50 placeholder:text-gray-400 text-gray-900 rounded-lg px-3 py-2.5 border border-gray-200 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {(validationError || error) && (
            <div className="mt-3 text-xs text-red-600">
              {validationError || error}
            </div>
          )}

          <div className="flex items-center gap-3 w-full mt-5">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              Отмена
            </button>
            <button
              onClick={handleSubmit}
              disabled={isChanging}
              className="flex-1 px-4 py-2.5 bg-[#4F39F6] hover:bg-[#4430d9] text-white text-sm font-medium rounded-lg transition-colors cursor-pointer disabled:bg-indigo-300 disabled:cursor-not-allowed"
            >
              {isChanging ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
