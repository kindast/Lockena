import type { PasswordItem } from "lockena-core";
import { useEffect, useState } from "react";

interface PasswordFormScreenProps {
  initialData?: PasswordItem;
  onSave: (data: PasswordItem) => void;
  onCancel: () => void;
}

export function PasswordFormScreen({
  initialData,
  onSave,
  onCancel,
}: PasswordFormScreenProps) {
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<PasswordItem>>({
    serviceName: "",
    login: "",
    password: "",
    url: "",
    notes: "",
  });

  useEffect(() => {
    async function initData() {
      if (initialData) {
        setFormData({
          serviceName: initialData.serviceName,
          login: initialData.login,
          password: initialData.password,
          url: initialData.url,
          notes: initialData.notes,
        });
      }
    }
    initData();
  }, [initialData]);

  const handleChange = (field: keyof PasswordItem, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSubmit = () => {
    if (!formData.serviceName || !formData.login || !formData.password) {
      setError("Пожалуйста, заполните обязательные поля");
      return;
    }
    onSave({
      id: initialData?.id || "",
      serviceName: formData.serviceName!,
      login: formData.login!,
      password: formData.password!,
      url: formData.url || "",
      notes: formData.notes || "",
    } as PasswordItem);
  };

  return (
    <div className="w-90 min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={onCancel}
          className="text-gray-600 text-sm font-medium hover:text-gray-900 transition-colors"
        >
          Отмена
        </button>
        <h1 className="font-semibold text-gray-900 truncate max-w-35 text-center">
          {initialData ? "Редактировать" : "Новый пароль"}
        </h1>
        <button
          onClick={handleSubmit}
          className="text-[#4F39F6] text-sm font-medium hover:text-[#4430d9] transition-colors"
        >
          Сохранить
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {error && (
          <div className="text-red-500 text-xs text-center">{error}</div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="p-3 border-b border-gray-100">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Сервис
            </label>
            <input
              type="text"
              value={formData.serviceName}
              onChange={(e) => handleChange("serviceName", e.target.value)}
              placeholder="Например Netflix"
              className="w-full text-sm outline-none bg-transparent placeholder:text-gray-300 text-gray-900"
            />
          </div>
          <div className="p-3 border-b border-gray-100">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Логин
            </label>
            <input
              type="text"
              value={formData.login}
              onChange={(e) => handleChange("login", e.target.value)}
              placeholder="Имя пользователя или Email"
              className="w-full text-sm outline-none bg-transparent placeholder:text-gray-300 text-gray-900"
            />
          </div>
          <div className="p-3">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Пароль
            </label>
            <input
              type="text"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Пароль"
              className="w-full text-sm outline-none bg-transparent placeholder:text-gray-300 font-mono tracking-wider text-gray-900"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="p-3 border-b border-gray-100">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Веб-сайт
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => handleChange("url", e.target.value)}
              placeholder="https://example.com"
              className="w-full text-sm outline-none bg-transparent placeholder:text-gray-300 text-[#4F39F6]"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="p-3">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Заметки
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Добавьте любые дополнительные сведения..."
              className="w-full text-sm outline-none bg-transparent resize-none h-20 placeholder:text-gray-300 text-gray-900"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
