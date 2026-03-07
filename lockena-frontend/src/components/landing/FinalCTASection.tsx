import { ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router";

export function FinalCTASection() {
  const navigate = useNavigate();
  const benefits = [
    "Бесплатный аккаунт навсегда",
    "Неограниченное хранение паролей",
    "Синхронизация устройств",
    "Современное шифрование",
  ];

  return (
    <section className="py-24 bg-linear-to-br from-[#4F39F6] via-indigo-600 to-purple-600 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

      <div className="mx-auto max-w-360 px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Начните пользоваться Lockena уже сегодня
          </h2>

          <p className="text-lg sm:text-xl text-indigo-100 mb-12 max-w-2xl mx-auto">
            Присоединяйтесь к тысячам пользователей, которые доверяют Lockena
            защиту своих паролей
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => {
                navigate("/signup");
              }}
              className="cursor-pointer inline-flex items-center justify-center gap-2 px-10 py-5 bg-white text-[#4F39F6] rounded-xl font-bold hover:bg-gray-50 transition-all shadow-2xl hover:shadow-3xl text-sm sm:text-lg"
            >
              Создать аккаунт бесплатно
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center justify-center gap-2 text-white"
              >
                <Check className="w-5 h-5 shrink-0" />
                <span className="text-xs sm:text-sm font-medium">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
