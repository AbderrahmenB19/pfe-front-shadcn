// src/store/authStore.ts
import { create } from 'zustand';

interface AuthState {
  token: string | null;
  roles: string[];
  setToken: (token: string) => void;
  setRoles: (roles: string[]) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  roles: [],
  setToken: (token: string) => set({ token }),
  setRoles: (roles: string[]) => set({ roles }),
  clearAuth: () => set({ token: null, roles: [] }),
}));
