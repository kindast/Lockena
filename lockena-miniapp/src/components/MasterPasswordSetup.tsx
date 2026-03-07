import { Eye, EyeOff, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import Button from "./Button";
import Logo from "./Logo";
import { authService } from "../api/services/authService";

const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{8,100}$/;

const MasterPasswordSetup = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCreate = async () => {
    if (password.length < 8) {
      toast.error("Пароль минимум 8 символов");
      return;
    } else if (!passwordRegex.test(password)) {
      toast.error(
        "Пароль должен содержать: заглавную букву, строчную букву, цифру, специальный символ",
      );
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Пароли не совпадают");
      return;
    }
    const tg = window.Telegram.WebApp;
    const signup = await authService.signUp(tg.initData, password);
    if (signup.state === "success") {
      toast.success("Аккаунт успешно создан");
    } else {
      toast.error("Ошибка при создании аккаунта");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCreate();
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center px-4">
      <Toaster position="bottom-center" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-10">
          <Logo />
          <h1 className="text-3xl font-bold  text-[#6366f1]  mb-2">Lockena</h1>
          <h2 className="text-2xl font-bold text-white mb-2">
            Добро пожаловать
          </h2>
          <p className="text-[#8e8e93] text-center">
            Создайте мастер-пароль для защиты ваших данных
          </p>
        </div>

        <div className="bg-[#f2f2f7] dark:bg-[#1c1c1e] rounded-xl border border-[#c6c6c8] dark:border-[#38383a] overflow-hidden mb-6">
          <div className="px-4 py-3 border-b border-[#c6c6c8] dark:border-[#38383a]">
            <p className="text-[13px] text-[#8e8e93] mb-2">Мастер-пароль</p>
            <div className="flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Минимум 8 символов"
                className="flex-1 text-[17px] outline-none placeholder-[#545458] bg-transparent text-white"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-[#6366f1] p-2 active:opacity-50"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div className="px-4 py-3">
            <p className="text-[13px] text-[#8e8e93] mb-2">
              Подтвердите пароль
            </p>
            <div className="flex items-center">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Повторите пароль"
                className="flex-1 text-[17px] outline-none placeholder-[#545458] bg-transparent dark:text-white"
              />
              <button
                onClick={() => setShowConfirm(!showConfirm)}
                className="ml-2 text-[#6366f1] p-2 active:opacity-50"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </div>

        <Button onClick={handleCreate}>Создать мастер-пароль</Button>

        <div className="mt-6 bg-[#f2f2f7] dark:bg-[#1c1c1e] rounded-xl border border-[#c6c6c8] dark:border-[#38383a] p-4">
          <div className="flex items-start">
            <Shield size={20} className="text-[#6366f1] mr-3 mt-0.5 shrink-0" />
            <div>
              <p className="text-[15px] dark:text-white mb-1">Важно!</p>
              <p className="text-[13px] text-[#8e8e93]">
                Не забывайте мастер-пароль. Восстановление невозможно, и вы
                потеряете доступ ко всем данным.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MasterPasswordSetup;
