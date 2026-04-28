import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../../features/auth/store/auth.store";

type Props = {
  children: React.ReactNode;
};

// ProtectedRoute component checks if the user is authenticated before allowing access to its children routes. 
export default function ProtectedRoute({ children }: Props) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  // If the user authentication state is still initializing, show a loading message to prevent rendering protected content before auth state is ready
  if (!isInitialized) {
    return <div className="p-6">Loading...</div>;
  }

  // If the user is not authenticated, redirect them to the login page. The 'replace' prop prevents adding a new entry to the history stack, ensuring that the user cannot navigate back to the protected route after logging out.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}