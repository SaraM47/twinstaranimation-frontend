import { create } from "zustand";
import { api } from "../../../api/client";

// Auth store using Zustand
// Handles authentication state, user data, and initialization

// User model returned from backend
type AuthUser = {
  userId: string;
  email?: string;
  roles: string[];
};

// Store state definition
type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitialized: boolean;

  setUser: (user: AuthUser | null) => void;
  initializeAuth: () => Promise<void>;
  logoutLocal: () => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false,

  // Sets user and updates auth flags
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isInitialized: true,
    }),

  // Fetch current user from backend (used after login or page reload)
  initializeAuth: async () => {
    // Prevent unnecessary calls if already initialized
    if (get().isInitialized && get().user) return;

    try {
      const res = await api.get("/Auth/me");

      set({
        user: {
          userId: res.data.userId,
          email: res.data.email,
          roles: res.data.roles ?? [],
        },
        isAuthenticated: true,
        isInitialized: true,
      });
    } catch {
      // If request fails, assume user is not authenticated
      set({
        user: null,
        isAuthenticated: false,
        isInitialized: true,
      });
    }
  },

  // Clears user state locally (used on logout)
  logoutLocal: () =>
    set({
      user: null,
      isAuthenticated: false,
      isInitialized: true,
    }),
}));
