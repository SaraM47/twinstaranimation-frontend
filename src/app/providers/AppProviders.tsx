import { useEffect } from "react";
import { useAuthStore } from "../../features/auth/store/auth.store";

type Props = {
  children: React.ReactNode;
};

// AppProviders component initializes authentication state and ensures that the app waits for auth to be ready before rendering content
export default function AppProviders({ children }: Props) {
  const initializeAuth = useAuthStore((s) => s.initializeAuth);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  // On component mount, initialize authentication to restore user session if possible
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // While authentication is initializing, show a loading message to prevent rendering the app before auth state is ready
  if (!isInitialized) {
    return <div className="p-6">Loading auth...</div>;
  }

  // Once authentication is initialized, render the app content
  return <>{children}</>;
}