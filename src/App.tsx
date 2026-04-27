import { Routes, Route } from "react-router-dom";
import LoginPage from "./features/auth/pages/LoginPage";
import CreatorDashboardPage from "./features/creator/pages/CreatorDashboardPage";
import ProtectedRoute from "./app/router/guards/ProtectedRoute";
import RoleRoute from "./app/router/guards/RoleRoute";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected */}
      <Route
        path="/creator/dashboard"
        element={
          <ProtectedRoute>
            <RoleRoute role="Creator">
              <CreatorDashboardPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Default */}
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
}

export default App;