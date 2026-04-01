import {
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
} from "lucide-react";
import type { PasswordDto } from "../api/dto/vault-item/password.dto";
import { useCallback, useState } from "react";
import { ServiceIcon } from "../components/ServiceIcon";

interface PasswordDetailScreenProps {
  password: PasswordDto;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function PasswordDetailScreen({
  password,
  onBack,
  onEdit,
  onDelete,
}: PasswordDetailScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleCopyToClipboard = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLabel(label);
    setTimeout(() => setCopiedLabel(null), 2000);
  }, []);

  return (
    <div className="w-90 min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 p-0 hover:bg-gray-100 flex items-center justify-center rounded-lg transition-colors cursor-pointer"
              onClick={onBack}
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </div>
            <h1 className="font-semibold text-gray-900 truncate">
              {password.serviceName}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              title="Редактировать"
              onClick={onEdit}
              className="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 gap-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 h-9 w-9 flex items-center justify-center rounded-lg"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              title="Удалить"
              onClick={() => setShowDeleteConfirm(true)}
              className="hover:bg-red-50 hover:text-red-600 gap-1.5 text-sm text-gray-600 h-9 w-9 flex items-center justify-center rounded-lg"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex flex-col items-center py-4">
          <ServiceIcon
            serviceName={password.serviceName}
            className="w-16 h-16 rounded-lg"
          />
          <h2 className="mt-4 text-xl font-bold">{password.serviceName}</h2>
          {password.category && (
            <p className="text-sm text-gray-500">{password.category}</p>
          )}
        </div>

        {/* Details */}
        <div className="border border-gray-100 rounded-lg">
          {/* Login */}
          <div className="flex items-center justify-between p-3">
            <div className="flex-1 overflow-hidden">
              <p className="text-xs text-gray-500 mb-0.5">Логин</p>
              <p className="text-sm select-all truncate">{password.login}</p>
            </div>
            <button
              onClick={() => handleCopyToClipboard(password.login, "Логин")}
              className="p-2 -mr-2 text-gray-500 hover:text-[#4F39F6] hover:bg-indigo-50 rounded-md active:opacity-50"
            >
              {copiedLabel === "Логин" ? (
                <Check size={18} className="text-green-500" />
              ) : (
                <Copy size={18} />
              )}
            </button>
          </div>

          <div className="w-full h-px bg-gray-100 shrink-0" />

          {/* Password */}
          <div className="flex items-center justify-between p-3">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-0.5">Пароль</p>
              <p className="text-sm font-mono tracking-wider">
                {showPassword ? password.password : "••••••••••••"}
              </p>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="p-2 text-gray-500 hover:text-[#4F39F6] hover:bg-indigo-50 rounded-md active:opacity-50"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <button
                onClick={() =>
                  handleCopyToClipboard(password.password, "Пароль")
                }
                className="p-2 -mr-2 text-gray-500 hover:text-[#4F39F6] hover:bg-indigo-50 rounded-md active:opacity-50"
              >
                {copiedLabel === "Пароль" ? (
                  <Check size={18} className="text-green-500" />
                ) : (
                  <Copy size={18} />
                )}
              </button>
            </div>
          </div>

          {password.url && (
            <>
              <div className="w-full h-px bg-gray-100 shrink-0" />
              <div className="flex items-center justify-between p-3">
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs text-gray-500 mb-0.5">Веб-сайт</p>
                  <a
                    href={password.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#4F39F6] truncate block hover:underline"
                  >
                    {password.url}
                  </a>
                </div>
                <a
                  href={password.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 -mr-2 text-gray-500 hover:text-[#4F39F6] hover:bg-indigo-50 rounded-md"
                >
                  <ExternalLink size={18} />
                </a>
              </div>
            </>
          )}
        </div>

        {password.notes && (
          <div className="border border-gray-100 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Заметки</p>
            <p className="text-sm whitespace-pre-wrap wrap-break-word">
              {password.notes}
            </p>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-5 text-center">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Удалить пароль?
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Вы уверены, что хотите удалить пароль для «
                  {password.serviceName}»? Это действие нельзя отменить.
                </p>
                <div className="flex items-center gap-3 w-full">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      onDelete();
                    }}
                    className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
