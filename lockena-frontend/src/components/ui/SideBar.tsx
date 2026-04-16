import { X, Settings } from "lucide-react";
import Logo from "./Logo";

interface SideBarProps {
  showSettings: boolean;
  onPasswords: () => void;
  onSettings: (b: boolean) => void;
  onClose: () => void;
}

function SideBar({
  showSettings,
  onSettings,
  onPasswords,
  onClose,
}: SideBarProps) {
  return (
    <div className="w-full">
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl flex justify-center items-center">
            <Logo />
          </div>
          <p className="text-gray-900 dark:text-white font-semibold text-xl">
            Lockena
          </p>
        </div>
        <div
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300 rounded-lg cursor-pointer"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </div>
      </div>

      <div className="p-4 space-y-1 border-b border-gray-200 dark:border-gray-700 select-none">
        <div
          className={
            !showSettings
              ? "text-indigo-600 bg-indigo-50 dark:bg-gray-700 dark:text-gray-300 cursor-pointer px-4 py-2 font-medium rounded-lg"
              : "text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-gray-300 cursor-pointer px-4 py-2 font-medium rounded-lg"
          }
          onClick={() => {
            onSettings(false);
            onPasswords();
            onClose();
          }}
        >
          Все пароли
        </div>
      </div>

      <div className="p-4 select-none">
        <div
          className={
            showSettings
              ? "text-indigo-600 bg-indigo-50 dark:bg-gray-700 dark:text-gray-300 cursor-pointer px-4 py-2 font-medium rounded-lg flex items-center gap-2"
              : "text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-gray-300 cursor-pointer px-4 py-2 font-medium rounded-lg flex items-center gap-2"
          }
          onClick={() => {
            onSettings(true);
            onClose();
          }}
        >
          <Settings className="w-4 h-4" />
          Настройки
        </div>
      </div>
    </div>
  );
}
export default SideBar;
