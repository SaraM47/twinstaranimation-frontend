import { useEffect } from "react";
import { useAuthStore } from "../../features/auth/store/auth.store";

// Props type for AuthBootstrap component
type Props = {
  children: React.ReactNode;
};

export default function AuthBootstrap({ children }: Props) {
  // Gets the auth initialization function from the Zustand store
  const initializeAuth = useAuthStore((s) => s.initializeAuth);

  // Checks whether authentication has finished initializing
  const isInitialized = useAuthStore((s) => s.isInitialized);

  // Runs authentication setup on first render used to automatically restore the user session
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Displays loading state until auth initialization is complete
  if (!isInitialized) {
    return <div className="p-6">Loading...</div>;
  }

  // Renders the application content after authentication is ready
  return <>{children}</>;
}
