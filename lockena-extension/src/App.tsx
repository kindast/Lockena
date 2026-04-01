import { useEffect, useState } from "react";
import DashboardScreen from "./screens/DashboardScreen";
import SignInScreen from "./screens/SignInScreen";
import { Route, Routes, useNavigate } from "react-router";
import { SettingsScreen } from "./screens/SettingsScreen";
import type { Message } from "./messages";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      const sessionData = await chrome.runtime.sendMessage({
        type: "GET_SESSION",
      });
      setIsAuthenticated(sessionData && sessionData.payload ? true : false);
    }

    checkAuth();

    const listener = (message: Message) => {
      if (message.type === "AUTH_STATE_CHANGED") {
        setIsAuthenticated(message.authenticated);
      }
    };

    chrome.runtime.onMessage.addListener(listener);

    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated === false) navigate("/signin");
  }, [isAuthenticated, navigate]);

  return (
    <div className="h-full w-full overflow-hidden rounded-none border-gray-200 bg-white">
      <Routes>
        {isAuthenticated ? (
          <>
            <Route path="/" element={<DashboardScreen />} />
            <Route
              path="/settings"
              element={<SettingsScreen onBack={() => navigate("/")} />}
            />
          </>
        ) : (
          <Route path="*" element={<SignInScreen />} />
        )}
      </Routes>
    </div>
  );
}
