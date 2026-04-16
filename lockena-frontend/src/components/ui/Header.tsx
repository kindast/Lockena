import { authService } from "lockena-core";
import { ChevronDown, LogOut, Menu, User } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  email: string;
  openSideBar: () => void;
  openSettings: () => void;
}

function Header({ email, openSideBar, openSettings }: HeaderProps) {
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 px-2 sm:px-6 py-1 sm:py-2 flex shrink-0  dark:bg-gray-800 justify-between items-center">
      <div className="flex items-center gap-4">
        <div
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300 rounded-lg cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            openSideBar();
          }}
        >
          <Menu className="w-5 h-5" />
        </div>
        <p className="font-medium text-sm sm:text-xl  text-gray-900 dark:text-white">
          Менеджер паролей
        </p>
      </div>
      <div
        className="relative select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          onClick={() => setShowModal(!showModal)}
          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
        >
          <p className="font-medium text-xs sm:text-sm text-gray-700 dark:text-gray-300">
            {email}
          </p>
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-indigo-600" />
          </div>
          <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-300" />
        </div>
        <div
          onClick={(e) => e.stopPropagation()}
          className={
            showModal
              ? "absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-60"
              : "hidden"
          }
        >
          <div
            className="text-sm text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            onClick={() => {
              openSettings();
              setShowModal(false);
            }}
          >
            <User className="w-4 h-4" />
            Профиль
          </div>
          <div
            className="text-sm text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            onClick={() => {
              authService.logout();
            }}
          >
            <LogOut className="w-4 h-4" />
            Выйти
          </div>
        </div>
      </div>
    </div>
  );
}
export default Header;
