import { Cloud, ExternalLink, Key, Shield } from "lucide-react";
import Logo from "../components/Logo";
import Button from "../components/Button";
import { useCallback } from "react";
import { BASE_URL } from "../config";

function SignInScreen() {
  const handleSignIn = useCallback(() => {
    window.open(`https://${BASE_URL}/signin`);
  }, []);

  return (
    <div className="w-90 min-h-125 bg-linear-to-b from-white to-indigo-50/30 flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <Logo />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">
            Добро пожаловать в Lockena
          </h1>
          <p className="text-gray-600 text-sm">
            Безопасный менеджер паролей для вашего браузера
          </p>
        </div>

        <div className="space-y-3 text-left bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
              <Shield className="h-4 w-4 text-[#4F39F6]" />
            </div>
            <div>
              <div className="font-medium text-sm text-gray-900">
                Шифрование данных
              </div>
              <div className="text-xs text-gray-600">
                AES-256 защита ваших паролей
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
              <Key className="h-4 w-4 text-[#4F39F6]" />
            </div>
            <div>
              <div className="font-medium text-sm text-gray-900">
                Мастер-пароль
              </div>
              <div className="text-xs text-gray-600">Один пароль для всего</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
              <Cloud className="h-4 w-4 text-[#4F39F6]" />
            </div>
            <div>
              <div className="font-medium text-sm text-gray-900">
                Синхронизация
              </div>
              <div className="text-xs text-gray-600">
                Доступ на всех устройствах
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <Button
            onClick={handleSignIn}
            icon={<ExternalLink />}
            title="Войти через веб-сайт"
            className="w-full h-11 bg-[#4F39F6] hover:bg-[#4430d9] text-white rounded-lg font-medium shadow-sm"
          />

          <p className="text-xs text-gray-500 text-center">
            Нажимая кнопку, вы будете перенаправлены на сайт Lockena для входа
            или регистрации
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignInScreen;
