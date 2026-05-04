import { useQuery } from "@tanstack/react-query";
import { getMyOrders } from "../../../api/endpoints/orders.api";
import PublicHeader from "../../../components/layout/PublicHeader";

// This page shows the user's past orders with details like items, total, and status.
export default function MyOrdersPage() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: getMyOrders,
  });

  // Show loading state
  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  // Show orders or empty state
  return (
    <div className="min-h-screen bg-white">
    <PublicHeader dark />

    <div className="max-w-4xl mx-auto pt-32 p-6 space-y-8">

      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900 mt-20">
        My Orders
      </h1>

      {/* Empty */}
      {orders.length === 0 && (
        <div className="text-gray-500">
          You have no orders yet.
        </div>
      )}

      {/* Orders */}
      <div className="space-y-6">
        {orders.map((order: any) => (
          <div
            key={order.id}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            
            {/* Top */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg text-gray-900">
                Order #{order.id}
              </h2>

              <span className="text-sm font-medium text-green-600">
                {order.status}
              </span>
            </div>

            {/* Items */}
            <div className="space-y-2">
              {order.items?.map((item: any, i: number) => (
                <div
                  key={i}
                  className="flex justify-between text-sm text-gray-700"
                >
                  <span>
                    {item.productTitle} × {item.quantity}
                  </span>
                  <span>
                    {(item.price * item.quantity).toFixed(2)} USD
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-4 border-t pt-3 flex justify-between font-medium text-gray-900">
              <span>Total</span>
              <span>{order.totalAmount} USD</span>
            </div>

            {/* Date */}
            <div className="text-xs text-gray-400 mt-2">
              {new Date(order.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
}