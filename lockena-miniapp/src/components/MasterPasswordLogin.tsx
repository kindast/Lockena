import { motion } from "motion/react";
import Button from "./Button";
import { Eye, EyeOff } from "lucide-react";
import { toast, Toaster } from "sonner";
import { useState } from "react";
import Logo from "./Logo";
import { unlockMasterKey } from "../crypto/masterKey";
import { fromBase64Url } from "../crypto/utils";
import useAuthStore from "../store/authStore";

const MasterPasswordLogin = ({
  encryptedState,
}: {
  encryptedState: {
    encryptedMasterKey: string;
    iv: string;
    salt: string;
  };
}) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!encryptedState) return;
    try {
      const key = await unlockMasterKey(
        password,
        fromBase64Url(encryptedState.encryptedMasterKey),
        fromBase64Url(encryptedState.iv),
        fromBase64Url(encryptedState.salt),
      );
      useAuthStore.getState().setMasterKey(key);
      toast.success("Вход выполнен");
    } catch {
      setPassword("");
      toast.error("Неверный пароль");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
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
          <h1 className="text-3xl font-bold text-[#6366f1] mb-2">Lockena</h1>
          <p className="text-[#8e8e93] text-center">
            Введите мастер-пароль для доступа
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
                placeholder="Введите пароль"
                autoFocus
                className="flex-1 text-[17px] outline-none placeholder-[#545458] bg-transparent dark:text-white"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-[#6366f1] p-2 active:opacity-50"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </div>

        <Button onClick={handleLogin}>Войти</Button>

        <div className="mt-8 text-center">
          <p className="text-[#8e8e93] dark:text-[#545458] text-[13px]">
            Забыли пароль? Восстановление невозможно
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default MasterPasswordLogin;
