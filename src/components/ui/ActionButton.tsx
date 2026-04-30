// Props definition for a reusable button component
type ActionButtonProps = {
  children: React.ReactNode; // Button content (text, icon, etc.)
  variant?: "light" | "dark"; // Visual style of the button
  onClick?: () => void; // Click handler function
  type?: "button" | "submit"; // HTML button type
  className?: string; // Additional CSS classes for custom styling
  disabled?: boolean; // Disable state of the button
};

// Reusable action button with consistent styling across the app
export default function ActionButton({
  children,
  variant = "light",
  onClick,
  type = "button",
  className = "",
  disabled = false,
}: ActionButtonProps) {
  // Base styles shared across all variants
  const base =
    "px-6 py-3 text-sm font-medium transition inline-flex items-center justify-center";

  // Variant-specific styles (light or dark theme)
  const styles =
    variant === "light"
      ? "bg-white text-black border border-black hover:bg-black hover:text-white"
      : "bg-black text-white border border-black hover:bg-white hover:text-black";

  // Styles applied when button is disabled
  const disabledStyles =
    "opacity-50 cursor-not-allowed hover:bg-current hover:text-current";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles} ${
        disabled ? disabledStyles : ""
      } ${className}`}
      style={{
        borderRadius: "4rem 0 4rem 0", // Custom asymmetrical border radius
      }}
    >
      {children}
    </button>
  );
}
