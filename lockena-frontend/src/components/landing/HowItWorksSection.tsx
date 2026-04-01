import { UserPlus, Save, CheckCircle } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      icon: UserPlus,
      number: "01",
      title: "Создайте аккаунт",
      description: "Регистрация займёт всего минуту",
    },
    {
      icon: Save,
      number: "02",
      title: "Сохраните свои пароли",
      description: "Импортируйте или добавьте пароли вручную",
    },
    {
      icon: CheckCircle,
      number: "03",
      title: "Быстрый и безопасный доступ",
      description: "Входите на сайты одним кликом",
    },
  ];

  return (
    <section className="py-24 bg-linear-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="mx-auto max-w-360 px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Как это работает
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Три простых шага к безопасности
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-20 left-1/6 right-1/6 h-0.5 bg-linear-to-r from-[#4F39F6]/20 via-[#4F39F6]/40 to-[#4F39F6]/20" />

          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-lg shadow-gray-900/5 dark:shadow-black/20 border border-gray-100 dark:border-gray-700 hover:border-[#4F39F6] dark:hover:border-[#6B59FF] transition-all">
                <div className="relative inline-flex mb-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br from-[#4F39F6] to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <step.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-[#4F39F6] dark:text-[#6B59FF] border-2 border-[#4F39F6] dark:border-[#6B59FF]">
                    {step.number}
                  </div>
                </div>

                <h3 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>

                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
