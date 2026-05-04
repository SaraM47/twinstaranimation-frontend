// Custom checkout hook using React Query
// Handles authentication check, checkout request, and redirect flow

import { useMutation } from "@tanstack/react-query";
import { checkout } from "../../../api/endpoints/orders.api";
import { showError } from "../../../components/ui/toast";
import { useCartStore } from "../../cart/store/cart.store";
import { useAuthStore } from "../../auth/store/auth.store";

// Defines the shape of items being checked out, including product ID and quantity
type CheckoutItem = {
  productId: number;
  quantity: number;
};

export const useCheckout = () => {
  return useMutation({
    // Main checkout function
    mutationFn: async (items: CheckoutItem[]) => {
      const isAuthenticated = useAuthStore.getState().isAuthenticated;

      // Prevent checkout if user is not logged in
      if (!isAuthenticated) {
        showError("Please login to continue checkout");

        setTimeout(() => {
          window.location.href = "/login";
        }, 800);

        throw new Error("User not authenticated");
      }

      // Call backend checkout endpoint
      return checkout(items);
    },

    // On successful checkout, clear cart and redirect to Stripe (or similar)
    onSuccess: (data) => {
      useCartStore.getState().clear();

      window.location.href = data.checkoutUrl;
    },

    // Error handling with fallback message
    onError: (error: any) => {
      if (error?.message === "User not authenticated") return;

      const message =
        error?.response?.data?.message || "Failed to start checkout";

      showError(message);
    },
  });
};
