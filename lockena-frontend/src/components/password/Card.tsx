import { useEffect, useState } from "react";
import { Copy, ExternalLink, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { logoService } from "../../api/services/logoService";
import type { PasswordDto } from "../../api/dto/vault-item/password.dto";

interface CardProps {
  password: PasswordDto;
  onDelete: () => void;
  onEdit: () => void;
}

function Card({ password, onDelete, onEdit }: CardProps) {
  const [copiedLogin, setCopiedLogin] = useState<string>(password.login);
  const [copiedPassword, setCopiedPassword] = useState<string>(
    password.password,
  );
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    const fetchLogo = async () => {
      const response = await logoService.getLogo(password.serviceName);
      if (response.state === "success") {
        const url = URL.createObjectURL(response.data);
        setImageUrl(url);
      } else setImageUrl("");
    };

    fetchLogo();
  }, [password]);

  return (
    <div
      key={password.id}
      className={`dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600 bg-white border-gray-200 hover:border-gray-300 border rounded-lg  transition-all hover:shadow-md`}
    >
      {/* Изображение */}
      <div className="relative  overflow-hidden rounded-t-lg flex items-center p-4 gap-3">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={password.serviceName}
            className="w-16 h-16 rounded-full object-cover bg-gray-100 border border-black/5"
          />
        ) : (
          <div
            className={`w-16 h-16 rounded-full bg-linear-to-br from-[#4f46e5] to-[#3730a3] flex items-center justify-center text-white font-bold text-3xl`}
          >
            {password.serviceName.charAt(0).toUpperCase()}
          </div>
        )}
        {password.url && (
          <a
            href={password.url}
            className="absolute top-3 right-3 bg-white/90 hover:bg-white cursor-pointer p-1 rounded-full transition-colors"
            target="_blank"
            rel="noopener noreferrer"
            title="Открыть сайт"
          >
            <ExternalLink className="w-5 h-5 text-gray-900" />
          </a>
        )}
        <div className="flex flex-col items-start gap-0.5">
          <h3 className="text-xl text-white  font-semibold">
            {password.serviceName}
          </h3>
          {password.category && (
            <span
              className={`inline-flex px-2 py-1 text-xs rounded-full dark:bg-blue-900/30 dark:text-blue-400 bg-blue-100 text-blue-700`}
            >
              {password.category}
            </span>
          )}
        </div>
      </div>

      {/* Информация */}
      <div className="space-y-3 p-4 border-t dark:border-gray-700 border-gray-200">
        {/* Логин */}
        <div>
          <label
            className={`text-xs dark:text-gray-400 text-gray-500  uppercase tracking-wide`}
          >
            Логин
          </label>
          <div className={`mt-1 dark:text-gray-300 text-gray-900  break-all`}>
            {copiedLogin}{" "}
            <button
              className="cursor-pointer p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
              title="Скопировать"
              onClick={() => {
                navigator.clipboard.writeText(password.login);
                const value = password.login;
                setCopiedLogin("Скопировано!");
                setTimeout(() => {
                  setCopiedLogin(value);
                }, 300);
              }}
            >
              <Copy className="w-4 h-4 dark:text-gray-300 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Пароль */}
        <div>
          <label
            className={`text-xs dark:text-gray-400 text-gray-500  uppercase tracking-wide`}
          >
            Пароль
          </label>
          <div className={`mt-1 font-mono dark:text-gray-300 text-gray-900 `}>
            {showPassword
              ? copiedPassword
              : copiedPassword === "Скопировано!"
                ? copiedPassword
                : "•".repeat(password.password.length)}
          </div>
        </div>

        {/* Дата обновления */}
        <div>
          <label
            className={`text-xs dark:text-gray-400 text-gray-500  uppercase tracking-wide`}
          >
            Обновлен
          </label>
          <div className={`mt-1 text-sm dark:text-gray-400 text-gray-600 `}>
            {password.updatedAtUtc &&
              new Date(password.updatedAtUtc).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Действия */}
      <div
        className={`p-4 flex items-center gap-2 border-t dark:border-gray-700 border-gray-200`}
      >
        <button
          className={`cursor-pointer flex-1 flex items-center justify-center gap-2 px-3 py-2 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-700  rounded-lg transition-colors`}
          onClick={() => setShowPassword((prev) => !prev)}
          title="Показать пароль"
        >
          {showPassword ? (
            <>
              <EyeOff className="w-4 h-4" />
              <span className="text-sm">Скрыть</span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              <span className="text-sm">Показать</span>
            </>
          )}
        </button>
        <button
          className={`cursor-pointer p-2 dark:bg-gray-700 dark:hover:bg-gray-600 bg-gray-100 hover:bg-gray-200  rounded-lg transition-colors`}
          title="Скопировать"
          onClick={() => {
            navigator.clipboard.writeText(password.password);
            const value = password.password;
            setCopiedPassword("Скопировано!");
            setTimeout(() => {
              setCopiedPassword(value);
            }, 300);
          }}
        >
          <Copy className={`w-4 h-4 dark:text-gray-300 text-gray-700 `} />
        </button>
        <button
          onClick={onEdit}
          className={`cursor-pointer p-2 dark:bg-gray-700 dark:hover:bg-gray-600 bg-gray-100 hover:bg-gray-200  rounded-lg transition-colors`}
          title="Редактировать"
        >
          <Pencil className={`w-4 h-4 dark:text-gray-300 text-gray-700 `} />
        </button>
        <button
          className={`cursor-pointer p-2 dark:bg-gray-700 dark:hover:bg-gray-600 bg-gray-100 hover:bg-gray-200  rounded-lg transition-colors`}
          title="Удалить"
          onClick={onDelete}
        >
          <Trash2 className={`w-4 h-4 dark:text-red-400 text-red-600 `} />
        </button>
      </div>
    </div>
  );
}

export default Card;
