import { api } from "../client";
import { useAuthStore } from "../../features/auth/store/auth.store";

// Login user
export const login = async (email: string, password: string) => {
  const res = await api.post("/Auth/login", { email, password });
  return res.data;
};

// Get current logged in user
export const getMe = async () => {
  const res = await api.get("/Auth/me");
  return res.data;
};

// Logout user
export const logout = async () => {
  try {
    await api.post("/Auth/logout");
  } finally {
    useAuthStore.getState().logoutLocal();
  }
};