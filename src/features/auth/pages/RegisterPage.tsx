import { useState } from "react";
import { Link } from "react-router-dom";
import PublicHeader from "../../../components/layout/PublicHeader";
import Footer from "../../../components/layout/Footer";

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

  // Layout wrapper with header and footer
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <PublicHeader purple />

      <div className="flex-1 flex flex-col items-center justify-start pt-40 pb-32 px-4">
        <div className="w-full max-w-md border border-white/30 rounded-xl p-10 space-y-8">
          <h1 className="font-heading text-3xl">Sign up</h1>

          <form className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="text-sm">
                  First name
                </label>
                <input
                  id="firstName"
                  className="w-full px-4 py-3 rounded-md bg-[#D9D9D9] text-black"
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                />
              </div>

              <div>
                <label htmlFor="lastName" className="text-sm">
                  Last name
                </label>
                <input
                  id="lastName"
                  className="w-full px-4 py-3 rounded-md bg-[#D9D9D9] text-black"
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="text-sm">
                Email
              </label>
              <input
                id="email"
                className="w-full px-4 py-3 rounded-md bg-[#D9D9D9] text-black"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-3 rounded-md bg-[#D9D9D9] text-black"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="text-sm">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="w-full px-4 py-3 rounded-md bg-[#D9D9D9] text-black"
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
              />
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

      <Footer />
    </div>
  );
}
