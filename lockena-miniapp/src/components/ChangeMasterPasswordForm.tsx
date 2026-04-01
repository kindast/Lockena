import { ArrowLeft, Eye, EyeOff, LoaderCircle, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Header from "./Header";
import Page from "./Page";
import Button from "./Button";

const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{8,100}$/;

const ChangeMasterPasswordForm = ({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: (current: string, newPass: string) => Promise<void>;
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!currentPassword) {
      toast.error("Введите текущий пароль");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Новый пароль минимум 8 символов");
      return;
    } else if (!passwordRegex.test(newPassword)) {
      toast.error(
        "Новый пароль должен содержать: заглавную букву, строчную букву, цифру, специальный символ",
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Пароли не совпадают");
      return;
    }

    setIsLoading(true);
    await onSubmit(currentPassword, newPassword);
    setIsLoading(false);
  };

  return (
    <Page className="z-30 absolute top-0 left-0 w-full bg-[#efeff4] dark:bg-[#000000]">
      <Header
        title="Смена пароля"
        left={
          <button
            onClick={onBack}
            className="flex items-center text-[#4f46e5] dark:text-[#6366f1] -ml-1"
          >
            <ArrowLeft />
          </button>
        }
      />

      <div className="mt-6 px-4">
        <div className="bg-white dark:bg-[#1c1c1e] rounded-xl border border-[#c6c6c8] dark:border-[#38383a] overflow-hidden mb-6">
          <div className="px-4 py-3 border-b border-[#c6c6c8] dark:border-[#38383a]">
            <p className="text-[13px] text-[#8e8e93] mb-2">Текущий пароль</p>
            <div className="flex items-center">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Введите текущий пароль"
                className="flex-1 text-[17px] outline-none placeholder-[#545458] bg-transparent text-black dark:text-white"
              />
              <button
                onClick={() => setShowCurrent(!showCurrent)}
                className="ml-2 text-[#4f46e5] dark:text-[#6366f1] p-2 active:opacity-50"
              >
                {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="px-4 py-3 border-b border-[#c6c6c8] dark:border-[#38383a]">
            <p className="text-[13px] text-[#8e8e93] mb-2">Новый пароль</p>
            <div className="flex items-center">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Минимум 8 символов"
                className="flex-1 text-[17px] outline-none placeholder-[#545458] bg-transparent text-black dark:text-white"
              />
              <button
                onClick={() => setShowNew(!showNew)}
                className="ml-2 text-[#4f46e5] dark:text-[#6366f1] p-2 active:opacity-50"
              >
                {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="px-4 py-3">
            <p className="text-[13px] text-[#8e8e93] mb-2">
              Подтвердите пароль
            </p>
            <div className="flex items-center">
              <input
                type={showNew ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Повторите новый пароль"
                className="flex-1 text-[17px] outline-none placeholder-[#545458] bg-transparent text-black dark:text-white"
              />
            </div>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          className="flex justify-center items-center"
        >
          {isLoading ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            "Изменить пароль"
          )}
        </Button>

        <div className="mt-6 bg-white dark:bg-[#1c1c1e] rounded-xl border border-[#c6c6c8] dark:border-[#38383a] p-4">
          <div className="flex items-start">
            <Shield
              size={20}
              className="text-[#4f46e5] dark:text-[#6366f1] mr-3 mt-0.5 shrink-0"
            />
            <div>
              <p className="text-[15px] text-black dark:text-white mb-1">
                Важно!
              </p>
              <p className="text-[13px] text-[#8e8e93]">
                Не забывайте новый мастер-пароль. В случае утери восстановление
                будет невозможно.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default ChangeMasterPasswordForm;
