import { useNavigate } from "react-router";
import Logo from "../ui/Logo";

export function HeaderLanding() {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-360 px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <Logo className="w-10 h-10 sm:w-12 sm:h-12" />
            <span className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
              Lockena
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                navigate("/signin");
              }}
              className="cursor-pointer hidden sm:inline-flex px-6 py-2.5  text-gray-700 dark:text-gray-300 hover:text-[#4F39F6] dark:hover:text-[#6B59FF] font-medium transition-colors"
            >
              Войти
            </button>
            <button
              onClick={() => {
                navigate("/signup");
              }}
              className="cursor-pointer px-6 py-2.5 bg-[#4F39F6] text-white text-xs sm:text-base rounded-xl font-semibold hover:bg-[#3F29E6] transition-all shadow-md shadow-indigo-500/20"
            >
              Начать бесплатно
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
