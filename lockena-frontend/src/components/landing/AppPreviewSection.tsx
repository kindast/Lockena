import { Check } from "lucide-react";

function AppPreviewSection() {
  const features = [
    "Быстрый доступ к паролям",
    "Удобный интерфейс",
    "Организация по категориям",
    "Поиск и фильтры",
  ];

  return (
    <section className="py-24 bg-linear-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="mx-auto max-w-360 px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-full mb-6">
                <span className="text-xs sm:text-sm text-[#4F39F6] dark:text-[#6B59FF] font-medium">
                  Интерфейс
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Простой и удобный интерфейс
              </h2>

              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Lockena разработан для максимального удобства. Интуитивный
                интерфейс позволяет быстро находить и использовать ваши пароли.
              </p>
            </div>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#4F39F6] rounded-full flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-8 -left-8 w-64 h-64 bg-[#4F39F6] rounded-full opacity-10 blur-3xl" />
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-indigo-300 rounded-full opacity-10 blur-3xl" />

            <div className="relative">
              <div className="bg-gray-900 dark:bg-gray-950 rounded-3xl shadow-2xl shadow-gray-900/30 dark:shadow-black/50 p-3 border-4 border-gray-800 dark:border-gray-700">
                <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
                  <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 flex items-center gap-2 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 bg-red-400 rounded-full" />
                      <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                      <div className="w-3 h-3 bg-green-400 rounded-full" />
                    </div>
                    <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg px-4 py-1 text-xs text-gray-500 dark:text-gray-400 mx-4">
                      app.lockena.com/vault
                    </div>
                  </div>

                  <div className="p-6 space-y-4 bg-linear-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                    <div className="bg-white dark:bg-gray-700 rounded-xl p-3 shadow-sm border border-gray-200 dark:border-gray-600">
                      <div className="text-sm text-gray-400 dark:text-gray-300">
                        🔍 Поиск паролей...
                      </div>
                    </div>

                    {[
                      {
                        name: "Google Account",
                        icon: "🔵",
                        email: "user@gmail.com",
                      },
                      {
                        name: "Facebook",
                        icon: "🔷",
                        email: "user@facebook.com",
                      },
                      {
                        name: "GitHub",
                        icon: "⚫",
                        email: "developer@github.com",
                      },
                      {
                        name: "LinkedIn",
                        icon: "🔹",
                        email: "pro@linkedin.com",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-600 flex items-center gap-4 hover:border-[#4F39F6] dark:hover:border-[#6B59FF] transition-colors"
                      >
                        <div className="text-2xl">{item.icon}</div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            {item.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {item.email}
                          </div>
                        </div>
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 border border-gray-100 dark:border-gray-700">
                <div className="text-center">
                  <div className="sm:text-2xl font-bold text-[#4F39F6] dark:text-[#6B59FF]">
                    150+
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Паролей
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AppPreviewSection;
