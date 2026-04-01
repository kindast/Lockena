import { Shield, Lock, Eye, Server } from "lucide-react";

export function SecuritySection() {
  const securityFeatures = [
    {
      icon: Shield,
      text: "AES-256 шифрование",
    },
    {
      icon: Lock,
      text: "Zero-knowledge архитектура",
    },
    {
      icon: Eye,
      text: "Никто не видит ваши данные",
    },
    {
      icon: Server,
      text: "Защищённые серверы",
    },
  ];

  return (
    <section className="py-24 bg-linear-to-br from-[#4F39F6] to-indigo-700 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

      <div className="mx-auto max-w-360 px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-8 border border-white/20">
              <img
                src="/security.png"
                alt="Security"
                className="w-full rounded-xl"
              />
            </div>

            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-gray-300" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Уровень защиты
                  </p>
                  <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">
                    Максимальный
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Безопасность — наш приоритет
              </h2>

              <p className="text-lg sm:text-xl text-indigo-100 leading-relaxed">
                Lockena использует современное шифрование и zero-knowledge
                архитектуру, чтобы ваши данные оставались полностью приватными.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {securityFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm sm:text-base text-white font-medium">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
