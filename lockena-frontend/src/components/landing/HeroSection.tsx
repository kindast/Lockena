import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

export function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-360 px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-full">
              <div className="w-2 h-2 bg-[#4F39F6] rounded-full animate-pulse" />
              <span className="text-xs sm:text-sm text-[#4F39F6] dark:text-[#6B59FF] font-medium">
                Безопасность нового поколения
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Все ваши пароли — в одном безопасном месте
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Lockena — это простой и безопасный менеджер паролей с современным
              шифрованием и удобным доступом ко всем вашим аккаунтам.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  navigate("/signup");
                }}
                className="text-sm sm:text-base cursor-pointer inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#4F39F6] text-white rounded-xl font-semibold hover:bg-[#3F29E6] transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40"
              >
                Начать бесплатно
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-4 -left-4 w-72 h-72 bg-[#4F39F6] rounded-full opacity-10 blur-3xl" />
            <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-indigo-300 rounded-full opacity-10 blur-3xl" />

            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl shadow-gray-900/10 dark:shadow-black/30 p-3 sm:p-6 border border-gray-100 dark:border-gray-700">
              <img
                src="/mockup.png"
                alt="Lockena Interface Preview"
                className="w-full rounded-xl"
              />

              <div className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                    256-bit AES
                  </span>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#4F39F6] rounded-full animate-pulse" />
                  <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                    Zero-Knowledge
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
