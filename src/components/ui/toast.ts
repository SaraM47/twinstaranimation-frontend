import toast from "react-hot-toast";

// Displays a success notification with consistent styling
export const showSuccess = (message: string) => {
  toast.success(message, {
    style: {
      background: "#000", // Dark background for brand consistency
      color: "#fff", // White text for readability
      border: "1px solid rgba(255,255,255,0.1)", // Subtle border for contrast
    },
  });
};

// Displays an error notification with consistent styling
export const showError = (message: string) => {
  toast.error(message, {
    style: {
      background: "#000", // Same styling as success for unified design
      color: "#fff",
      border: "1px solid rgba(255,255,255,0.1)",
    },
  });
};
