import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/endpoints/products.api";
import { Link } from "react-router-dom";
import PublicHeader from "../components/layout/PublicHeader";
import ActionButton from "../components/ui/ActionButton";
import { useCartStore } from "../features/cart/store/cart.store";

export default function ProductsPage() {
  // Fetch products using React Query
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  // Cart action
  const add = useCartStore((s) => s.add);

  // Add product to cart with default quantity = 1
  const handleAddToCart = (p: any) => {
    add({
      productId: p.id,
      title: p.title,
      price: p.price,
      imageUrl: p.imageUrl,
      quantity: 1,
    });
  };

  // Loading state
  if (isLoading) {
    return <div className="p-10 text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#7F13FD] text-white">
      {/* Hero header */}
      <div className="relative h-[220px] sm:h-[260px] md:h-[300px] flex items-center justify-center px-4">
        <PublicHeader />

        <h1 className="font-heading text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-wide">
          SHOP OUR GOODIES
        </h1>
      </div>

      {/* Product grid */}
      <div className="pb-20 px-4 sm:px-6 md:px-8 lg:px-10">
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            gap-y-10
            sm:gap-y-12
            gap-x-4
            md:gap-x-6
          "
        >
          {products.map((p: any) => (
            <Link key={p.id} to={`/products/${p.id}`} className="group block">
              <div className="relative">
                <div className="relative overflow-hidden bg-white">
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="
                      w-full
                      h-[260px]
                      sm:h-[300px]
                      md:h-[320px]
                      object-cover
                    "
                  />

                  <div
                    className="
                      absolute inset-0
                      flex items-center justify-center
                      opacity-0
                      group-hover:opacity-100
                      transition
                      duration-300
                      bg-black/20
                    "
                  >
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart(p);
                      }}
                    >
                      <ActionButton>Add to cart</ActionButton>
                    </div>
                  </div>
                </div>

                {/* Product info */}
                <div className="bg-[#7F13FD] text-center py-3 sm:py-4">
                  <p className="text-base sm:text-lg md:text-xl font-medium">
                    {p.title}
                  </p>

                  <p className="text-sm sm:text-base md:text-md opacity-90">
                    $ {p.price}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
