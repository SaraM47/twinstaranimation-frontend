// PublicHeader component used across all public-facing pages
// Handles navigation, cart access, auth state, and mobile menu

import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, LogOut, X } from "lucide-react";
import { useCartStore } from "../../features/cart/store/cart.store";
import { useAuthStore } from "../../features/auth/store/auth.store";
import { logout } from "../../api/endpoints/auth.api";
import { FaInstagram, FaTiktok, FaYoutube, FaTwitter } from "react-icons/fa";

// Props to control header styling (theme variations)
type Props = {
  dark?: boolean; // If true, header uses dark theme (black icons/lines)
  purple?: boolean; // If true, header uses purple theme (#7F13FD icons/lines)
};

export default function PublicHeader({ dark = false, purple = false }: Props) {
  const [open, setOpen] = useState(false); // mobile menu state

  // Global state
  const openCart = useCartStore((s) => s.open); // open cart drawer
  const count = useCartStore((s) => s.getCount()); // cart item count
  const user = useAuthStore((s) => s.user); // current user

  // Logout handler
  const handleLogout = async () => {
    await logout();
    window.location.href = "/"; // force reload to reset app state
  };

  // Base navigation links
  const baseLinks = [
    { name: "Home", to: "/" },
    { name: "Animation", to: "/animation" },
    { name: "Comics", to: "/comics" },
    { name: "Shop", to: "/products" },
    { name: "Support", to: "/support" },
  ];

  // Conditional auth links
  const authLinks = user
    ? [{ name: "My Orders", to: "/orders" }]
    : [
        { name: "Login", to: "/login" },
        { name: "Register", to: "/register" },
      ];

  const links = [...baseLinks, ...authLinks];

  // Dynamic styling based on theme
  const iconColor = purple
    ? "text-[#7F13FD]"
    : dark
      ? "text-black"
      : "text-white";

  const lineColor = purple ? "bg-[#7F13FD]" : dark ? "bg-black" : "bg-white";

  const hoverColor = purple
    ? "group-hover:bg-white"
    : dark
      ? "group-hover:bg-white"
      : "group-hover:bg-black";

  return (
    <>
      {/* Header */}
      <header className="absolute top-0 left-0 w-full flex items-center justify-between px-6 py-6 z-50">
        <Link to="/">
          <img
            src="/logo.svg"
            className="h-16 md:h-20 lg:h-24 cursor-pointer"
          />
        </Link>

        {/* Right side (cart and menu) */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Cart button */}
          <button onClick={openCart} className="relative">
            <ShoppingCart className={`w-5 h-5 md:w-6 md:h-6 ${iconColor}`} />

            {/* Cart count badge */}
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {count}
              </span>
            )}
          </button>

          {/* Hamburger menu */}
          <button
            onClick={() => setOpen(true)}
            className="flex flex-col justify-center gap-1 w-10 md:w-12 h-6 group"
          >
            <span className={`h-0.5 w-full ${lineColor} ${hoverColor}`} />
            <span className={`h-0.5 w-full ${lineColor} ${hoverColor}`} />
            <span className={`h-0.5 w-full ${lineColor} ${hoverColor}`} />
          </button>
        </div>
      </header>

      {/* Fullscreen menu */}
      <div
        className={`fixed inset-0 z-[100] transition duration-300 ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        {/* Background overlay */}
        <div className="absolute inset-0 bg-black" />

        {/* Top bar */}
        <div className="relative h-full w-full flex flex-col px-6 md:px-10 py-8 md:py-10">
          <div className="flex justify-between items-center mb-8 md:mb-12">
            <Link to="/" onClick={() => setOpen(false)}>
              <img src="/logo.svg" className="h-12 md:h-16" />
            </Link>

            {/* Close button */}
            <button onClick={() => setOpen(false)}>
              <X
                size={30}
                className="text-white opacity-80 hover:opacity-100"
              />
            </button>
          </div>

          {/* Main content */}
          <div className="flex flex-1 flex-col md:flex-row">
            {/* Navigation links */}
            <div className="flex flex-col justify-center gap-6 md:gap-10 w-full md:w-1/2">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="
                    text-white
                    hover:text-[#7F13FD]
                    transition
                    text-2xl
                    sm:text-3xl
                    md:text-4xl
                    font-semibold
                    leading-tight
                  "
                >
                  {l.name}
                </Link>
              ))}

              {/* Logout */}
              {user && (
                <button
                  onClick={handleLogout}
                  className="
                    flex items-center gap-3 text-left
                    text-white
                    hover:text-red-400
                    transition
                    text-2xl
                    sm:text-3xl
                    md:text-4xl
                    font-semibold
                  "
                >
                  <LogOut size={22} />
                  Logout
                </button>
              )}
            </div>

            {/* Branding section */}
            <div className="hidden md:flex flex-col justify-center items-center w-1/2 text-center">
              <h2 className="text-4xl lg:text-5xl font-heading mb-6 text-white">
                Twinstar Animation
              </h2>

              <p className="text-white/60 max-w-sm text-sm lg:text-md leading-relaxed">
                Creating worlds through animation, comics and storytelling.
                Discover our universe of characters and stories.
              </p>

              <div className="mt-10 w-32 h-0.5 bg-[#7F13FD]" />
            </div>
          </div>

          {/* Social icons */}
          <div className="mt-8 md:mt-10 pb-4">
            <div className="flex items-center gap-6 md:gap-8 text-white text-2xl md:text-3xl">
              <FaInstagram className="cursor-pointer hover:opacity-70 transition" />
              <FaTiktok className="cursor-pointer hover:opacity-70 transition" />
              <FaYoutube className="cursor-pointer hover:opacity-70 transition" />
              <FaTwitter className="cursor-pointer hover:opacity-70 transition" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
