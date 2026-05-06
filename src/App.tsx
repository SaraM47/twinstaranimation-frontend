import { Routes, Route } from "react-router-dom";
import LoginPage from "./features/auth/pages/LoginPage";
import CreatorDashboardPage from "./features/creator/pages/CreatorDashboardPage";
import ProtectedRoute from "./app/router/guards/ProtectedRoute";
import RoleRoute from "./app/router/guards/RoleRoute";
import PublicLayout from "./components/layout/PublicLayout";
import RegisterPage from "./features/auth/pages/RegisterPage";

function App() {
  return (
    <>
      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<LoginPage />} />
        </Route>

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
      </Routes>
    </>
  );
}

export default App;
