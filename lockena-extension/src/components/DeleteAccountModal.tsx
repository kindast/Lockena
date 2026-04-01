import { useState } from "react";
import { X } from "lucide-react";

interface DeleteAccountModalProps {
  onClose: () => void;
  onDelete: (password: string) => Promise<void>;
  isDeleting?: boolean;
  error?: string | null;
}

export function DeleteAccountModal({
  onClose,
  onDelete,
  isDeleting,
  error,
}: DeleteAccountModalProps) {
  const [password, setPassword] = useState("");

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Удалить аккаунт
            </h3>
            <button
              onClick={onClose}
              className="p-1 -mr-2 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="mb-5 text-sm text-gray-600 space-y-2">
            <p>Вы уверены, что хотите навсегда удалить свой аккаунт?</p>
            <p className="text-red-600 font-medium">
              ⚠️ Все данные (пароли, заметки, настройки) будут безвозвратно
              удалены. Это действие нельзя отменить.
            </p>
          </div>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль для подтверждения"
            className="w-full text-sm outline-none bg-gray-50 placeholder:text-gray-400 text-gray-900 rounded-lg px-3 py-2.5 border border-gray-200 focus:ring-2 focus:ring-red-200"
          />

          {error && <div className="mt-3 text-xs text-red-600">{error}</div>}

          <div className="flex items-center gap-3 w-full mt-5">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              Отмена
            </button>
            <button
              onClick={() => onDelete(password)}
              disabled={!password || isDeleting}
              className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer disabled:bg-red-300 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Удаление..." : "Удалить"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
