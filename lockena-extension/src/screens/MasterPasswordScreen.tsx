import { Lock, ArrowRight } from "lucide-react";
import Logo from "../components/Logo";
import Button from "../components/Button";
import { useState, useCallback } from "react";

interface MasterPasswordScreenProps {
  onSubmit: (password: string) => Promise<void> | void;
  isLoading?: boolean;
  error?: string | null;
}

export function MasterPasswordScreen({
  onSubmit,
  isLoading = false,
  error,
}: MasterPasswordScreenProps) {
  const [password, setPassword] = useState("");

  const handleSubmit = useCallback(
    (e?: React.SyntheticEvent) => {
      if (e) e.preventDefault();
      if (password && !isLoading) {
        onSubmit(password);
      }
    },
    [password, onSubmit, isLoading],
  );

  return (
    <div className="w-90 min-h-125 bg-linear-to-b from-white to-indigo-50/30 flex flex-col items-center justify-center p-6">
      <div className="w-full text-center space-y-6">
        <div className="flex justify-center">
          <Logo />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[#6366f1] mb-2">Lockena</h1>
          <p className="text-gray-600 text-sm">
            Введите мастер-пароль для доступа к вашим данным
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1 text-left">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`block w-full pl-10 pr-3 py-2.5 border ${
                  error
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-200 focus:ring-[#4F39F6] focus:border-[#4F39F6]"
                } rounded-lg focus:outline-none focus:ring-2 sm:text-sm bg-white text-gray-900 transition-colors`}
                placeholder="Ваш мастер-пароль"
                disabled={isLoading}
                autoFocus
              />
            </div>
            {error && <p className="text-xs text-red-600 pl-1">{error}</p>}
          </div>

          <Button
            onClick={handleSubmit}
            icon={<ArrowRight />}
            title={isLoading ? "Проверка..." : "Разблокировать"}
            className={`w-full h-11 text-white rounded-lg font-medium shadow-sm transition-colors ${
              isLoading || !password
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-[#4F39F6] hover:bg-[#4430d9]"
            }`}
          />
        </form>
      </div>
    </div>
  );
}
