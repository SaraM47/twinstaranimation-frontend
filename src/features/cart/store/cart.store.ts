// Cart store using Zustand with persistence
// Handles cart state, item management, and derived values (total, count)

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Represents a single item in the cart
type CartItem = {
  productId: number;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
};

// Cart state and actions
type CartState = {
  items: CartItem[];
  isOpen: boolean; // Controls cart panel visibility

  open: () => void;
  close: () => void;

  add: (item: CartItem) => void;
  remove: (productId: number) => void;
  increase: (productId: number) => void;
  decrease: (productId: number) => void;
  clear: () => void;

  getTotal: () => number; // Total price
  getCount: () => number; // Total item count
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      open: () => set({ isOpen: true }), // Open cart panel
      close: () => set({ isOpen: false }), // Close cart panel

      // Add item to cart or increase quantity if already exists
      add: (item) => {
        const exists = get().items.find((i) => i.productId === item.productId);

        const updated = exists
          ? get().items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
          : [...get().items, item];

        // Force re-open animation for better UX feedback
        set({ isOpen: false });

        setTimeout(() => {
          set({ items: updated, isOpen: true });
        }, 50);
      },

      // Remove item completely from cart
      remove: (productId) => {
        set({
          items: get().items.filter((i) => i.productId !== productId),
        });
      },

      // Increase quantity of a specific item
      increase: (productId) => {
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        });
      },

            // Decrease quantity and remove if it reaches zero
      decrease: (productId) => {
        set({
          items: get()
            .items.map((i) =>
              i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i
            )
            .filter((i) => i.quantity > 0),
        });
      },

            // Clear entire cart
      clear: () => set({ items: [], isOpen: false }),

            // Calculate total price
      getTotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

              // Calculate total item count
      getCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "cart-storage", // Persist key in localStorage
    }
  )
);
