import { MapPin, Send } from "lucide-react";
import Logo from "../ui/Logo";

export function FooterLanding() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300">
      <div className="mx-auto max-w-360 px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Logo className="w-12 h-12" />
              <span className="text-2xl font-bold text-white">Lockena</span>
            </div>
            <p className="text-sm sm:text-base text-gray-400 dark:text-gray-500 mb-6 leading-relaxed">
              Безопасный менеджер паролей с современным шифрованием для защиты
              ваших данных.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Send className="w-4 h-4" />
                <span>@k1ndast</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4" />
                <span>Краснодар, Россия</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 dark:border-gray-900">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-600">
              © 2026 Lockena. Все права защищены.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
