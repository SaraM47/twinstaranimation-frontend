import { useParams, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getProductById, getProducts } from "../api/endpoints/products.api";
import { useState, useRef } from "react";
import PublicHeader from "../components/layout/PublicHeader";
import ActionButton from "../components/ui/ActionButton";
import { useCartStore } from "../features/cart/store/cart.store";
import { showSuccess } from "../components/ui/toast";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const productId = Number(id);

  const add = useCartStore((s) => s.add);

  // UI state
  const [open, setOpen] = useState(false); // description toggle
  const [isAdding, setIsAdding] = useState(false); // prevent spam clicks

  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch current product
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
  });

  // Fetch all products for related section
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  if (isLoading || !product) {
    return <div className="p-10 text-white">Loading...</div>;
  }

  // Filter related products (exclude current)
  const related = products.filter((p: any) => p.id !== product.id);

  // Scroll related products horizontally
  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 400,
      behavior: "smooth",
    });
  };

  // Add to cart with UX feedback
  const handleAddToCart = (p: any) => {
    if (isAdding) return;

    setIsAdding(true);

    add({
      productId: p.id,
      title: p.title,
      price: p.price,
      imageUrl: p.imageUrl,
      quantity: 1,
    });

    showSuccess("Added to cart");

    // Prevent rapid clicking
    setTimeout(() => {
      setIsAdding(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#7F13FD] text-white">
      {/* Header */}
      <div className="relative h-[120px]">
        <PublicHeader />
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Image */}
          <div className="bg-white aspect-square overflow-hidden">
            <img
              src={product.imageUrl}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* Info */}
          <div className="space-y-8">
            <h1 className="font-heading text-3xl md:text-4xl">
              {product.title}
            </h1>

            <p className="text-lg">$ {product.price}</p>

            {/* Add to cart button */}
            <ActionButton
              onClick={() => handleAddToCart(product)}
              disabled={isAdding}
              className="px-14 py-6 text-xl font-semibold transition active:scale-95 disabled:opacity-60"
            >
              {isAdding ? "Adding..." : "Add to cart"}
            </ActionButton>

            {/* Description */}
            <div className="pt-10 space-y-4">
              <div className="border-t border-white/40" />

              <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between"
              >
                <span className="font-heading text-lg">Description</span>

                <div
                  className={`w-10 h-10 bg-white flex items-center justify-center transition-transform duration-300 ${
                    open ? "rotate-0" : "rotate-45"
                  }`}
                >
                  <span className="text-black text-2xl font-bold">
                    {open ? "−" : "+"}
                  </span>
                </div>
              </button>

              <div className="border-b border-white/40" />

              {open && (
                <p className="text-sm text-white/80 max-w-md leading-relaxed">
                  {product.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Related products */}
        <div className="mt-24 space-y-6 relative">
          <h2 className="font-heading text-2xl">Related products</h2>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 scroll-smooth"
          >
            {related.slice(0, 6).map((p: any) => (
              <div
                key={p.id}
                className="w-[250px] shrink-0 flex flex-col items-center"
              >
                <Link to={`/products/${p.id}`} className="group block w-full">
                  {/* Image */}
                  <div className="bg-white h-[220px] overflow-hidden">
                    <img
                      src={p.imageUrl}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Info */}
                  <div className="bg-[#7F13FD] text-center py-3">
                    <p className="text-sm">{p.title}</p>
                    <p className="text-sm">$ {p.price}</p>
                  </div>
                </Link>

                {/* CTA */}
                <ActionButton
                  onClick={() => handleAddToCart(p)}
                  disabled={isAdding}
                  className="mt-3 transition active:scale-95"
                >
                  Add to cart
                </ActionButton>
              </div>
            ))}
          </div>

          {/* Scroll arrow button icon */}
          <button
            onClick={scrollRight}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-black text-6xl hover:scale-110 transition"
          >
            <ChevronRight size={56} strokeWidth={3} />{" "}
          </button>
        </div>
      </div>
    </div>
  );
}
