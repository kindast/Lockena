import useAuthStore from "../store/authStore";
import { useState } from "react";
import ProfilePage from "../components/pages/ProfilePage";
import PasswordsPage from "../components/pages/PasswordsPage";
import Header from "../components/ui/Header";
import SideBar from "../components/ui/SideBar";
import ModalProvider from "../components/ModalProvider";

function DashboardScreen() {
  const email = useAuthStore((s) => s.auth?.email);

  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showSideBar, setShowSideBar] = useState<boolean>(false);

  return (
    <ModalProvider>
      <div className={`w-full min-h-screen flex dark:bg-gray-800 `}>
        <div
          className={`fixed inset-y-0 left-0 z-60 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 bg-white dark:bg-gray-800 ${
            showSideBar ? "translate-x-0" : "-translate-x-full"
          } w-64`}
          onClick={(e) => e.stopPropagation()}
        >
          <SideBar
            showSettings={showSettings}
            onPasswords={() => setShowSettings(false)}
            onSettings={setShowSettings}
            onClose={() => setShowSideBar(false)}
          />
        </div>
        <div
          className={`w-full min-h-screen flex flex-col fixed inset-0 `}
          onClick={() => setShowSideBar(false)}
        >
          <Header
            email={email ?? ""}
            openSettings={() => setShowSettings(true)}
            openSideBar={() => {
              setShowSideBar(true);
            }}
          />
          {showSettings ? <ProfilePage /> : <PasswordsPage />}
        </div>
      </div>
    </ModalProvider>
  );
}

export default DashboardScreen;
