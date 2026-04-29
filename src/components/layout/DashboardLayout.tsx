// Import routing components for page navigation
import { NavLink, Outlet } from "react-router-dom";

// useState is used to control mobile sidebar open/close state
import { useState } from "react";

// Get logout function from Zustand auth store
import { useAuthStore } from "../../features/auth/store/auth.store";

// API client for sending logout request to backend
import { api } from "../../api/client";

// Import icons from lucide-react
import {
  LayoutDashboard,
  Package,
  BookOpen,
  FileText,
  Clapperboard,
  Film,
  Menu,
  LogOut,
} from "lucide-react";

// List of sidebar navigation items
const navItems = [
  { name: "Dashboard", path: "/creator/dashboard", icon: LayoutDashboard },
  { name: "Products", path: "/creator/products", icon: Package },
  { name: "Series", path: "/creator/series", icon: BookOpen },
  { name: "Chapters", path: "/creator/chapters", icon: FileText },
  { name: "Episodes", path: "/creator/episodes", icon: Clapperboard },
  { name: "Media", path: "/creator/media", icon: Film },
];

export default function DashboardLayout() {
  // Controls if mobile sidebar is open or closed
  const [isOpen, setIsOpen] = useState(false);

  // Get local logout function
  const logoutLocal = useAuthStore((s) => s.logoutLocal);

  // Logout function
  const handleLogout = async () => {
    try {
      // Send logout request to backend to clear cookie/session
      await api.post("/Auth/logout", {}, { withCredentials: true });
    } catch {
      // Ignore backend logout errors
    }

    // Clear local user state and redirect to login page
    logoutLocal();
    window.location.href = "/login";
  };

  return (
    // Main dashboard layout wrapper
    <div className="flex min-h-screen bg-[#f6f6f6] text-black">
      {/* Mobile sidebar only shown when menu is open */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-72 border-r border-gray-200 bg-white p-6 shadow-xl">
            <SidebarContent close={() => setIsOpen(false)} />
          </div>

          {/* Dark overlay behind sidebar */}
          <div
            className="flex-1 bg-black/30 backdrop-blur-[1px]"
            onClick={() => setIsOpen(false)}
          />
        </div>
      )}

      {/* Desktop sidebar always visible on larger screens */}
      <aside className="hidden w-72 shrink-0 border-r border-gray-200 bg-[#f6f6f6] md:flex">
        <div className="flex w-full flex-col px-5 py-6">
          <SidebarContent />
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top navigation bar */}
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-[#f6f6f6]/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-3">
              {/* Mobile hamburger menu button */}
              <button
                onClick={() => setIsOpen(true)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 md:hidden"
              >
                <Menu size={20} />
              </button>

              <h2 className="text-sm font-medium text-gray-500">
                Workspace admin dashboard
              </h2>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>

        {/* Child route content */}
        <main className="flex-1 bg-[#f6f6f6]">
          <div className="mx-auto w-full max-w-[1400px] px-4 py-6 md:px-6 md:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

// Sidebar content component
function SidebarContent({ close }: { close?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="mb-8">
        <img src="/logo.svg" alt="Twinstar Animation" className="h-20 w-auto" />
      </div>

      {/* Navigation links */}
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={close}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-white hover:text-gray-900"
                }`
              }
            >
              <Icon size={18} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}