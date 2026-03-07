import { Route, Routes, useLocation, useNavigate } from "react-router";
import DashboardScreen from "./screens/DashboardScreen";
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import { useCallback, useEffect, useState } from "react";
import useAuthStore from "./store/authStore";
import { authService } from "./api/services/authService";
import MasterPasswordScreen from "./screens/MasterPasswordScreen";
import { unlockMasterKey } from "./crypto/masterKey";
import { fromBase64Url } from "./crypto/utils";
import LandingScreen from "./screens/LandingScreen";

export default function App() {
  const { isAuthenticated, masterKey } = useAuthStore();
  const [encryptedState, setEncryptedState] = useState<{
    encryptedMasterKey: string;
    iv: string;
    salt: string;
  }>();
  const [error, setError] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const authorize = async () => {
      const result = await authService.refresh();
      if (result.state === "success")
        setEncryptedState({
          encryptedMasterKey: result.data.encryptedMasterKey,
          iv: result.data.masterKeyIv,
          salt: result.data.salt,
        });
      if (result.state === "error") {
        navigate("/signin");
      }
    };

    if (!isAuthenticated && location.pathname === "/dashboard") authorize();
  }, [isAuthenticated, location.pathname, navigate]);

  const decryptMasterKey = useCallback(async () => {
    if (!encryptedState) return;
    try {
      const key = await unlockMasterKey(
        password,
        fromBase64Url(encryptedState.encryptedMasterKey),
        fromBase64Url(encryptedState.iv),
        fromBase64Url(encryptedState.salt),
      );
      useAuthStore.getState().setMasterKey(key);
    } catch {
      setError("Неверный мастер-пароль");
    }
  }, [password, encryptedState]);

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

        <Route path="/signin" element={<SignInScreen />} />
        <Route path="/signup" element={<SignUpScreen />} />
      </Routes>
    </>
  );
}
