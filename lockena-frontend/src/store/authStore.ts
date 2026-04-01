import { create } from "zustand";

type AuthState = {
  accessToken: string | null;
  masterKey: Uint8Array | null;
  email: string | null;
  isAuthenticated: boolean;
};

type AuthActions = {
  setAuth: (token: string, email: string) => void;
  setMasterKey: (masterKey: Uint8Array) => void;
  clearAuth: () => void;
};

const useAuthStore = create<AuthState & AuthActions>((set) => ({
  accessToken: null,
  masterKey: null,
  email: null,
  isAuthenticated: false,

  setAuth: (token, email) =>
    set({
      accessToken: token,
      email: email,
      isAuthenticated: true,
    }),

  setMasterKey: (masterKey: Uint8Array) => {
    set({
      masterKey,
    });
  },

  clearAuth: () => {
    set({
      accessToken: null,
      masterKey: null,
      email: null,
      isAuthenticated: false,
    });
  },
}));

export default useAuthStore;
