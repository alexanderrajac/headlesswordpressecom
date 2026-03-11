"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface AuthStore {
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  getUser: () => AuthUser | null;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,

      login: (user) => set({ user, isLoggedIn: true }),

      logout: () => set({ user: null, isLoggedIn: false }),

      getUser: () => get().user,
    }),
    {
      name: "carpenterbullet-auth",
    }
  )
);
