import type { AuthDto } from "lockena-core";
import { create } from "zustand";

type AuthState = {
  auth: AuthDto | null;
  masterKey: Uint8Array | null;
  isAuthenticated: boolean;
};

type AuthActions = {
  setAuth: (auth: AuthDto) => void;
  setMasterKey: (masterKey: Uint8Array) => void;
  clearAuth: () => void;
};

const useAuthStore = create<AuthState & AuthActions>((set) => ({
  auth: null,
  masterKey: null,
  isAuthenticated: false,

  setAuth: (auth) =>
    set({
      auth,
      isAuthenticated: true,
    }),

  setMasterKey: (masterKey) => {
    set({
      masterKey,
    });
  },

  clearAuth: () => {
    set({
      masterKey: null,
      auth: null,
      isAuthenticated: false,
    });
  },
}));

export default useAuthStore;
