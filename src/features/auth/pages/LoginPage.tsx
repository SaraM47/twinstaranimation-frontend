import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../../api/client";
import { useAuthStore } from "../store/auth.store";
import PublicHeader from "../../../components/layout/PublicHeader";
import Footer from "../../../components/layout/Footer";

// Login page with role-based redirect after authentication

export default function LoginPage() {
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const initializeAuth = useAuthStore((s) => s.initializeAuth);

  // Handles login request and redirects user based on role
  const handleLogin = async () => {
    try {
      // Send login request
      await api.post("/Auth/login", {
        email,
        password,
      });

      // Fetch user data after login (important for HttpOnly cookies)
      await initializeAuth();

      const user = useAuthStore.getState().user;

      if (!user) {
        throw new Error("User not found after login");
      }

      // Role-based routing
      if (user.roles.includes("Creator")) {
        navigate("/creator/dashboard", { replace: true });
      } else {
        navigate("/orders", { replace: true });
      }
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  // UI with form and links to registration and password reset
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <PublicHeader purple />

      <div className="flex-1 flex flex-col items-center pt-40 pb-32 px-4">
        <div className="w-full max-w-md border border-white/30 rounded-xl p-10 space-y-8">
          <h1 className="font-heading text-3xl">Login</h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-5"
          >
            <div>
              <label className="text-sm">Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 rounded-md bg-[#D9D9D9] text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 rounded-md bg-[#D9D9D9] text-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                type="submit"
                className="px-8 py-3 bg-white text-black"
                style={{ borderRadius: "4rem 0 4rem 0" }}
              >
                Login
              </button>

              <button
                type="button"
                className="px-8 py-3 bg-white text-black text-sm"
                style={{ borderRadius: "4rem 0 4rem 0" }}
              >
                Forgot password
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-white/80">
            Don't have an account?{" "}
            <Link to="/register" className="underline">
              Create one
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
