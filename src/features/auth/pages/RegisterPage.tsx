import { useState } from "react";
import { Link } from "react-router-dom";
import PublicHeader from "../../../components/layout/PublicHeader";
import { XCircle } from "lucide-react";

// Registration page for creating a new user account

export default function RegisterPage() {
  // Form state object
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Validation state
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};

    if (!form.firstName) newErrors.firstName = "First name is required";
    if (!form.lastName) newErrors.lastName = "Last name is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <PublicHeader purple />

      <div className="flex-1 flex flex-col items-center pt-40 pb-32 px-4">
        <div className="w-full max-w-md border border-white/30 rounded-xl p-10 space-y-8">
          <h1 className="font-heading text-3xl">Sign up</h1>

          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              validate();
            }}
          >
            {/* First name */}
            <div>
              <label className="text-sm">First name</label>
              <input
                className={`w-full px-4 py-3 rounded-md bg-[#D9D9D9] text-black border ${
                  errors.firstName ? "border-red-500" : ""
                }`}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
              />
              {errors.firstName && (
                <ErrorMsg msg={errors.firstName} />
              )}
            </div>

            {/* LAST NAME */}
            <div>
              <label className="text-sm">Last name</label>
              <input
                className={`w-full px-4 py-3 rounded-md bg-[#D9D9D9] text-black border ${
                  errors.lastName ? "border-red-500" : ""
                }`}
                onChange={(e) =>
                  setForm({ ...form, lastName: e.target.value })
                }
              />
              {errors.lastName && (
                <ErrorMsg msg={errors.lastName} />
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm">Email</label>
              <input
                className={`w-full px-4 py-3 rounded-md bg-[#D9D9D9] text-black border ${
                  errors.email ? "border-red-500" : ""
                }`}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
              {errors.email && (
                <ErrorMsg msg={errors.email} />
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm">Password</label>
              <input
                type="password"
                className={`w-full px-4 py-3 rounded-md bg-[#D9D9D9] text-black border ${
                  errors.password ? "border-red-500" : ""
                }`}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
              {errors.password && (
                <ErrorMsg msg={errors.password} />
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="text-sm">Confirm password</label>
              <input
                type="password"
                className={`w-full px-4 py-3 rounded-md bg-[#D9D9D9] text-black border ${
                  errors.confirmPassword ? "border-red-500" : ""
                }`}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
              />
              {errors.confirmPassword && (
                <ErrorMsg msg={errors.confirmPassword} />
              )}
            </div>

            <div className="pt-6 flex justify-center">
              <button
                className="px-10 py-3 bg-white text-black"
                style={{ borderRadius: "4rem 0 4rem 0" }}
              >
                Sign up
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-white/80">
            Already have an account?{" "}
            <Link to="/login" className="underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// Reusable error component (matches your UI design)
function ErrorMsg({ msg }: { msg: string }) {
  return (
    <div className="flex items-center gap-2 text-red-500 mt-2 text-sm">
      <XCircle size={16} />
      <span>{msg}</span>
    </div>
  );
}