import { create } from "zustand";
import type { AuthDto } from "lockena-core";

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

  setMasterKey: (masterKey: Uint8Array) => {
    set({
      masterKey,
    });
  },

  clearAuth: () => {
    set({
      auth: null,
      masterKey: null,
      isAuthenticated: false,
    });
  },
}));

export default useAuthStore;
