import { Shield, Lock, Zap, Cloud } from "lucide-react";

function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: "Надёжное шифрование",
      description: "Все данные защищены современным end-to-end шифрованием.",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: Lock,
      title: "Zero-Knowledge архитектура",
      description: "Только вы имеете доступ к своим данным.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Zap,
      title: "Автозаполнение паролей",
      description: "Быстрый вход на сайты без ручного ввода.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Cloud,
      title: "Синхронизация устройств",
      description: "Доступ к вашим паролям на всех устройствах.",
      color: "from-emerald-500 to-green-500",
    },
  ];

  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-360 px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Преимущества
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Всё, что нужно для безопасного хранения паролей
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:border-[#4F39F6] dark:hover:border-[#6B59FF] hover:shadow-xl dark:hover:shadow-indigo-500/20 hover:shadow-indigo-500/10 transition-all duration-300"
            >
              <div
                className={`inline-flex p-3 sm:p-4 rounded-xl bg-linear-to-br ${feature.color} mb-6`}
              >
                <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>

              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
