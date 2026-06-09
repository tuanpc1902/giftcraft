import { create } from "zustand";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
}

interface AuthStore {
  user: AuthUser | null;
  token: string | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  init: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  login(token, user) {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      localStorage.setItem("gc_user", JSON.stringify(user));
    }
    set({ token, user });
  },
  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("gc_user");
    }
    set({ token: null, user: null });
  },
  init() {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    const raw = localStorage.getItem("gc_user");
    if (token && raw) {
      try {
        set({ token, user: JSON.parse(raw) });
        return;
      } catch { /* fall through to clear */ }
    }
    // Clear any partial/corrupted state
    localStorage.removeItem("token");
    localStorage.removeItem("gc_user");
  },
}));
