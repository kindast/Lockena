import { create } from "zustand";

type AuthState = {
  accessToken: string | null;
  masterKey: Uint8Array | null;
  isAuthenticated: boolean;
};

type AuthActions = {
  setAuth: (token: string) => void;
  setMasterKey: (masterKey: Uint8Array) => void;
  clearAuth: () => void;
};

const useAuthStore = create<AuthState & AuthActions>((set) => ({
  accessToken: null,
  masterKey: null,
  isAuthenticated: false,

  setAuth: (token) =>
    set({
      accessToken: token,
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
      isAuthenticated: false,
    });
  },
}));

export default useAuthStore;
