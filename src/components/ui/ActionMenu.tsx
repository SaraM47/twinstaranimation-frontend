import { useEffect, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";

// Represents a single menu action
type ActionItem = {
  label: string; // Display text
  onClick: () => void; // Action handler
  variant?: "default" | "danger"; // Visual style (e.g., red for destructive actions)
};

// Props for ActionMenu
type Props = {
  actions: ActionItem[]; // List of actions to display in the menu
};

// Dropdown menu for contextual actions (edit, delete, etc.)
export default function ActionMenu({ actions }: Props) {
  const [open, setOpen] = useState(false); // Controls menu visibility
  const ref = useRef<HTMLDivElement>(null); // Reference for outside click detection

  // Close menu when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Menu toggle button */}
      <button
        type="button"
        aria-label="Open actions menu"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-black focus:outline-none focus:ring-2 focus:ring-black/20"
      >
        <MoreHorizontal size={18} />
      </button>

      {/* Dropdown menu */}
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-10 z-50 min-w-36 rounded-xl border border-gray-200 bg-white p-1 shadow-lg"
        >
          {actions.map((a, i) => (
            <button
              key={i}
              role="menuitem"
              onClick={() => {
                a.onClick(); // Execute action
                setOpen(false); // Close menu after click
              }}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg transition ${
                a.variant === "danger"
                  ? "text-red-600 hover:bg-red-50"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
