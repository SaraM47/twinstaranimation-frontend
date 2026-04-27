import axios from "axios";
import { useAuthStore } from "../features/auth/store/auth.store";

// Create axios instance for all api requests
export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// Handle responses globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;

    // If unauthorized
    if (status === 401) {
      const store = useAuthStore.getState();

      // If user is already null, ignore
      if (!store.user) {
        return Promise.reject(error);
      }

      // Otherwise session expired, logout and redirect
      store.logoutLocal();
      window.location.href = "/login";
    }

    // log other real errors
    else {
      console.error(error);
    }

    return Promise.reject(error);
  }
);
