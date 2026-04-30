import { useState } from "react";
import type {
  CreateProductDto,
  Product,
  UpdateProductDto,
} from "../../products/types";

// Props definition for ProductForm component
type Props = {
  initialValues?: Partial<Product>;
  onSubmit: (values: CreateProductDto | UpdateProductDto) => Promise<void>;
  submitLabel: string;
};

// Form component for creating or editing a product
export default function ProductForm({
  initialValues,
  onSubmit,
  submitLabel,
}: Props) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(
    initialValues?.description ?? ""
  );
  const [price, setPrice] = useState(initialValues?.price?.toString() ?? "");
  const [imageUrl, setImageUrl] = useState(initialValues?.imageUrl ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Call the onSubmit function passed in props with the form values, converting price to a number
    try {
      await onSubmit({
        title,
        description,
        price: Number(price),
        imageUrl,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the form with fields for title, description, price, and image URL, along with a submit button that shows loading state when submitting
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          className="w-full p-2 rounded border border-gray-300 bg-white text-black"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          className="w-full p-2 rounded border border-gray-300 bg-white text-black"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price
        </label>
        <input
          type="number"
          className="w-full p-2 rounded border border-gray-300 bg-white text-black"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image URL
        </label>
        <input
          className="w-full p-2 rounded border border-gray-300 bg-white text-black"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-black text-white rounded hover:bg-black/80"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
