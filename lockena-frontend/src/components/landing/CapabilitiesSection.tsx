import { Lock, Key, FileText, Zap, Cloud, Smartphone } from "lucide-react";

function CapabilitiesSection() {
  const capabilities = [
    {
      icon: Lock,
      title: "Хранилище паролей",
      description: "Безопасное хранение неограниченного количества паролей",
    },
    {
      icon: Key,
      title: "Генератор надёжных паролей",
      description: "Создавайте сложные и уникальные пароли автоматически",
    },
    {
      icon: FileText,
      title: "Безопасные заметки",
      description: "Храните конфиденциальную информацию в защищённых заметках",
    },
    {
      icon: Zap,
      title: "Автозаполнение",
      description: "Мгновенный вход на сайты и в приложения",
    },
    {
      icon: Cloud,
      title: "Синхронизация устройств",
      description:
        "Автоматическая синхронизация между всеми вашими устройствами",
    },
    {
      icon: Smartphone,
      title: "Мобильные приложения",
      description: "Доступ к паролям на iOS и Android",
    },
  ];

  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-360 px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Возможности
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Всё необходимое для управления паролями в одном приложении
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((capability, index) => (
            <div
              key={index}
              className="group relative bg-linear-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:border-[#4F39F6] dark:hover:border-[#6B59FF] transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/20"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#4F39F6]/10 dark:bg-[#4F39F6]/20 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#4F39F6] transition-colors">
                  <capability.icon className="w-6 h-6 text-[#4F39F6] group-hover:text-white transition-colors" />
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {capability.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">
                    {capability.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CapabilitiesSection;
