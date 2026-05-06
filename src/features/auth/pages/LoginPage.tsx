import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../../api/client";
import { useAuthStore } from "../store/auth.store";
import PublicHeader from "../../../components/layout/PublicHeader";
import { XCircle } from "lucide-react";

// Login page with role-based redirect after authentication

export default function LoginPage() {
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Validation state
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const navigate = useNavigate();
  const initializeAuth = useAuthStore((s) => s.initializeAuth);

  // Validate inputs
  const validate = () => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handles login request and redirects user based on role
  const handleLogin = async () => {
    if (!validate()) return;

    try {
      await api.post("/Auth/login", { email, password });

      await initializeAuth();

      const user = useAuthStore.getState().user;

      if (!user) throw new Error("User not found after login");

      if (user.roles.includes("Creator")) {
        navigate("/creator/dashboard", { replace: true });
      } else {
        navigate("/orders", { replace: true });
      }
    } catch (error: any) {
      console.error(error);

      setErrors({
        email: "Invalid email or password",
      });
    }
  };

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
            {/* Email */}
            <div>
              <label className="text-sm">Email</label>

              <input
                type="email"
                className={`w-full px-4 py-3 rounded-md bg-[#D9D9D9] text-black border ${
                  errors.email ? "border-red-500" : "border-transparent"
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {errors.email && (
                <div className="flex items-center gap-2 text-red-500 mt-2 text-sm">
                  <XCircle size={16} />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm">Password</label>

              <input
                type="password"
                className={`w-full px-4 py-3 rounded-md bg-[#D9D9D9] text-black border ${
                  errors.password ? "border-red-500" : "border-transparent"
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {errors.password && (
                <div className="flex items-center gap-2 text-red-500 mt-2 text-sm">
                  <XCircle size={16} />
                  <span>{errors.password}</span>
                </div>
              )}
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

    </div>
  );
}