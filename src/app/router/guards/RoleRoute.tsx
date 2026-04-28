import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../../features/auth/store/auth.store";

type Props = {
  children: React.ReactNode;
  role: string;
};

export default function RoleRoute({ children, role }: Props) {
  // Get current user from auth store
  const user = useAuthStore((s) => s.user);

  // Check if auth initialization is finished
  const isInitialized = useAuthStore((s) => s.isInitialized);

  // Show loading message while auth is being initialized
  if (!isInitialized) {
    return <div className="p-6">Loading...</div>;
  }

  // If no user exists, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user does not have the required role, redirect to forbidden page
  if (!user.roles?.includes(role)) {
    return <Navigate to="/forbidden" replace />;
  }

  // If user has correct role, render protected content
  return <>{children}</>;
}
