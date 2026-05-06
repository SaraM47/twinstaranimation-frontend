import { X, Plus, Minus } from "lucide-react";
import { useCartStore } from "../../features/cart/store/cart.store";
import { useCheckout } from "../../features/checkout/hooks/useCheckout";
import { Link } from "react-router-dom";

// Slide-in panel displaying cart items, quantity controls, and checkout

export default function CartPanel() {
  // Extract cart state and actions
  const {
    items,
    isOpen,
    close,
    remove,
    increase,
    decrease,
    getTotal,
    getCount,
  } = useCartStore();

  const checkoutMutation = useCheckout();

  // Navigate to product detail page
  const goToProduct = (id: number) => {
    window.location.href = `/products/${id}`;
  };

  // Trigger checkout process
  const handleCheckout = () => {
    if (items.length === 0 || checkoutMutation.isPending) return;

    checkoutMutation.mutate(
      items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      }))
    );
  };

  return (
    <>
      {/* Overlay (closes panel on click) */}
      <div
        onClick={close}
        className={`fixed inset-0 bg-black/50 z-100 transition-all duration-500 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Slide-in panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[420px] max-w-full bg-white z-100 flex flex-col
          shadow-2xl transition-all duration-500 ease-out
          ${isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
      >
        {/* Header */}
        <div className="p-6 flex justify-between items-center border-b">
          <h2 className="text-lg font-semibold text-black">
            My Cart ({getCount()})
          </h2>

          <button
            onClick={close}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={20} className="text-black" />
          </button>
        </div>

        {/* Empty state */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6 text-black">
            <div className="w-16 h-16 border rounded-full flex items-center justify-center">
              <X size={20} />
            </div>

            <h3 className="font-semibold">Your cart is empty</h3>

            <p className="text-sm text-gray-500">Add products to get started</p>

            {/* CTA to shop */}
            <Link to="/products" onClick={close}>
              <button className="mt-2 px-6 py-2 bg-black text-white rounded-lg hover:bg-black/90 transition">
                Continue shopping
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* Cart items list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-4 cursor-pointer hover:bg-gray-50 p-3 rounded-xl transition"
                  onClick={() => goToProduct(item.productId)}
                >
                  {/* Product image */}
                  <img
                    src={item.imageUrl}
                    className="w-20 h-20 object-cover rounded-lg"
                  />

                  {/* Product info */}
                  <div className="flex-1 text-black">
                    <p className="text-sm font-medium">{item.title}</p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          decrease(item.productId);
                        }}
                        disabled={item.quantity === 1}
                        className="p-1 rounded border border-gray-300 hover:bg-gray-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Minus size={14} className="text-black" />
                      </button>

                      <span className="text-sm font-medium min-w-[20px] text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          increase(item.productId);
                        }}
                        className="p-1 rounded border border-gray-300 hover:bg-gray-200 transition"
                      >
                        <Plus size={14} className="text-black" />
                      </button>
                    </div>

                    {/* Remove item */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        remove(item.productId);
                      }}
                      className="text-xs underline mt-3 text-gray-500 hover:text-black transition"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Price */}
                  <p className="text-sm font-medium text-black whitespace-nowrap">
                    {(item.price * item.quantity).toFixed(2)} USD
                  </p>
                </div>
              ))}
            </div>

            {/* Footer (subtotal & checkout) */}
            <div className="p-6 border-t space-y-4">
              <div className="flex justify-between text-sm text-black">
                <span>Subtotal</span>
                <span className="font-semibold">
                  {getTotal().toFixed(2)} USD
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkoutMutation.isPending}
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-black/90 transition disabled:opacity-50"
              >
                {checkoutMutation.isPending ? "Redirecting..." : "Checkout"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
