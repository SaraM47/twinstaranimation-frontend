import { api } from "../client";

// Create checkout session for order
export const checkout = async (items: {
  productId: number;
  quantity: number;
}[]) => {
  const res = await api.post("/Orders/checkout", {
    items,
  });

  return res.data;
};

// get current user's orders (customer)
export const getMyOrders = async () => {
    const res = await api.get("/Orders/my");
    return res.data;
  };