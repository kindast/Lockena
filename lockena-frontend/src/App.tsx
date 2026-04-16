import { Route, Routes, useLocation, useNavigate } from "react-router";
import DashboardScreen from "./screens/DashboardScreen";
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import { useCallback, useEffect, useState } from "react";
import useAuthStore from "./store/authStore";
import MasterPasswordScreen from "./screens/MasterPasswordScreen";
import LandingScreen from "./screens/LandingScreen";
import { EmailConfirmationScreen } from "./screens/EmailConfirmationScreen";
import { NotFound } from "./screens/NotFound";
import {
  authService,
  keyService,
  setupHttpClient,
  sodiumLoader,
} from "lockena-core";

export default function App() {
  const { isAuthenticated, masterKey } = useAuthStore();
  const [error, setError] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    sodiumLoader.initSodium();
    setupHttpClient({
      getToken: () => useAuthStore.getState().auth?.accessToken || null,
      refreshToken: async () => {
        const result = await authService.refresh();
        if (result.state === "success") {
          useAuthStore.getState().setAuth(result.data);
          return true;
        } else if (result.state === "error" && result.code === 401) {
          useAuthStore.getState().clearAuth();
          navigate("/signin");
        }
        return false;
      },
    });
  }, []);

  useEffect(() => {
    const authorize = async () => {
      const result = await authService.refresh();
      if (result.state === "success") {
        useAuthStore.getState().setAuth(result.data);
      }
      if (result.state === "error") {
        navigate("/signin");
      }
    };

    if (!isAuthenticated && location.pathname === "/dashboard") authorize();
  }, [isAuthenticated, location.pathname, navigate]);

  const decryptMasterKey = useCallback(async () => {
    try {
      const auth = useAuthStore.getState().auth;
      if (!auth) return;
      const key = await keyService.decrypt(password, {
        encryptedMasterKey: auth.encryptedMasterKey,
        salt: auth.salt,
      });
      useAuthStore.getState().setMasterKey(key);
    } catch {
      setError("Неверный мастер-пароль");
    }
  }, [password]);

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingScreen />} />
        <Route
          path="/dashboard"
          element={
            isAuthenticated && masterKey ? (
              <DashboardScreen />
            ) : (
              <MasterPasswordScreen
                password={password}
                onChangePassword={(p) => setPassword(p)}
                error={error}
                onSubmit={() => {
                  decryptMasterKey();
                }}
              />
            )
          }
        />
        <Route
          path="/email-confirmation/:token"
          element={<EmailConfirmationScreen />}
        />
        <Route path="/signin" element={<SignInScreen />} />
        <Route path="/signup" element={<SignUpScreen />} />
        <Route path="*" element={<NotFound />} />"
      </Routes>
    </>
  );
}
