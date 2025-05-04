// src/store/authStore.ts
import { create } from 'zustand';

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  setToken: (token: string) => set({ token }),
  clearAuth: () => set({ token: null }),
}));
