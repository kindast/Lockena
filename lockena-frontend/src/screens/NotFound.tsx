import { Home, ArrowLeft } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-indigo-100 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900 transition-colors duration-300">
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-lg">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-1 md:p-6 transition-colors duration-300">
            <div className="text-center mb-8">
              <div className="mb-6">
                <h2 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-indigo-600 to-indigo-800 dark:from-indigo-400 dark:to-indigo-600 bg-clip-text text-transparent mb-4">
                  404
                </h2>
                <div className="flex justify-center">
                  <div className="w-24 h-1 bg-linear-to-r from-indigo-600 to-indigo-800 dark:from-indigo-400 dark:to-indigo-600 rounded-full"></div>
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Страница не найдена
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-md mx-auto">
                К сожалению, страница, которую вы ищете, не существует или была
                перемещена. Проверьте правильность адреса или вернитесь на
                главную страницу.
              </p>
            </div>
            <div className="space-y-2">
              <button
                className="cursor-pointer w-full bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                onClick={() => (window.location.href = "/")}
              >
                <Home className="w-5 h-5" />
                Вернуться на главную
              </button>

              <button
                className="cursor-pointer w-full text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 py-3 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="w-4 h-4" />
                Вернуться назад
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
