import { useState, useEffect, useCallback } from "react";
import { CheckCircle2, XCircle, LoaderCircle, Send } from "lucide-react";
import Logo from "../components/ui/Logo";
import { useParams } from "react-router";
import { authService } from "../api/services/authService";

export function EmailConfirmationScreen() {
  const { token } = useParams();
  const [status, setStatus] = useState<
    "success" | "error" | "loading" | "sended"
  >("loading");

  const resendEmail = useCallback(async () => {
    if (!token) return;
    setStatus("loading");
    const response = await authService.sendEmailConfirmation(token);
    if (response.state === "success") {
      setStatus("sended");
    } else {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        return;
      }
      setStatus("loading");
      const response = await authService.verifyEmail(token);
      if (response.state === "success") {
        setStatus("success");
      } else {
        setStatus("error");
      }
    };

    verifyEmail();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900 transition-colors duration-300">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-10 transition-colors duration-300">
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-3">
                <Logo className="w-12 h-12" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Lockena
                </h1>
              </div>
            </div>

            {status === "loading" && (
              <>
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900 dark:to-indigo-800 rounded-full flex items-center justify-center">
                    <LoaderCircle className="w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-spin" />
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
                  Проверка...
                </h2>

                <p className="text-center text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  Пожалуйста, подождите, мы проверяем вашу ссылку подтверждения.
                </p>
              </>
            )}

            {status === "sended" && (
              <>
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900 dark:to-indigo-800 rounded-full flex items-center justify-center animate-pulse">
                    <Send className="w-10 h-10 text-indigo-600 dark:text-indigo-400 -ml-1 mt-1" />
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
                  Письмо отправлено!
                </h2>

                <p className="text-center text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  Мы отправили новую ссылку для подтверждения на вашу почту.
                  Пожалуйста, проверьте папку «Входящие» и «Спам».
                </p>
              </>
            )}

            {status === "success" && (
              <>
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900 dark:to-indigo-800 rounded-full flex items-center justify-center animate-pulse">
                    <CheckCircle2 className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
                  Почта подтверждена!
                </h2>

                <p className="text-center text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  Ваш адрес электронной почты успешно подтвержден. Теперь вы
                  можете пользоваться всеми возможностями Lockena.
                </p>

                <div className="space-y-3">
                  <button
                    className="cursor-pointer w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    onClick={() => (window.location.href = "/dashboard")}
                  >
                    Перейти к приложению
                  </button>

                  <button
                    className="cursor-pointer w-full text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 py-3 rounded-xl transition-colors duration-200"
                    onClick={() => (window.location.href = "/signin")}
                  >
                    Войти в аккаунт
                  </button>
                </div>
              </>
            )}

            {status === "error" && (
              <>
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 rounded-full flex items-center justify-center animate-pulse">
                    <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
                  Ошибка подтверждения
                </h2>

                <p className="text-center text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  К сожалению, не удалось подтвердить ваш адрес электронной
                  почты. Ссылка могла устареть или быть недействительной.
                </p>

                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-8">
                  <p className="text-sm text-red-800 dark:text-red-300 text-center">
                    Возможные причины:
                  </p>
                  <ul className="mt-2 text-sm text-red-700 dark:text-red-400 list-disc list-inside space-y-1">
                    <li>Ссылка устарела (срок действия 10 минут)</li>
                    <li>Почта уже была подтверждена ранее</li>
                    <li>Неверная ссылка подтверждения</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <button
                    className="cursor-pointer w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    onClick={resendEmail}
                  >
                    Отправить ссылку повторно
                  </button>
                  <button
                    className="cursor-pointer w-full text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 py-3 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                    onClick={() => (window.location.href = "/")}
                  >
                    На главную
                  </button>
                </div>
              </>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                © 2026 Lockena. Ваши пароли в безопасности.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
