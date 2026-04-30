import { useState } from "react";
import type { CreateSeriesDto, Series } from "../../series/types";
import type { Product } from "../../products/types";
import GenreSelector from "../../../components/ui/GenreSelector";

// Props definition for SeriesForm component
type Props = {
  products: Product[];
  initialValues?: Partial<Series>;
  onSubmit: (values: CreateSeriesDto) => Promise<void>;
  submitLabel: string;
  isEdit?: boolean;
};

// Function component for creating or editing a series, with form fields for title, description, cover image URL, authors, status, genres, and associated product (if not editing), along with a submit button that shows loading state when submitting
export default function SeriesForm({
  products,
  initialValues,
  onSubmit,
  submitLabel,
  isEdit = false,
}: Props) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(initialValues?.coverImageUrl ?? "");
  const [productId, setProductId] = useState(
    initialValues?.productId ? String(initialValues.productId) : ""
  );

  const [authors, setAuthors] = useState((initialValues as any)?.authors ?? "");
  const [status, setStatus] = useState((initialValues as any)?.status ?? "Ongoing");

  const [genres, setGenres] = useState<string[]>(
    (initialValues as any)?.genres
      ? (initialValues as any).genres.split(",")
      : []
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prepare the payload for submission, converting genres array to a comma-separated string and productId to a number if it's not empty. If editing, productId is not included in the payload.
    try {
      const payload: CreateSeriesDto = {
        title,
        description,
        coverImageUrl,
        authors: authors || null,
        status: status || null,
        genres: genres.length ? genres.join(",") : null,
        productId: isEdit
          ? undefined
          : productId
          ? Number(productId)
          : null,
      };

      await onSubmit(payload);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col max-h-[80vh]"
    >
      {/* Scroll container */}
      <div className="overflow-y-auto pr-2 space-y-5">

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="w-full p-2 border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Cover img of the series */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Cover Image URL
          </label>
          <input
            className="w-full p-2 border rounded"
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
          />
        </div>

        {/* Authors */}
        <div>
          <label className="block text-sm font-medium mb-1">Authors</label>
          <input
            className="w-full p-2 border rounded"
            value={authors}
            onChange={(e) => setAuthors(e.target.value)}
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            className="w-full p-2 border rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Genre */}
        <GenreSelector value={genres} onChange={setGenres} />

        {/* Product */}
        {!isEdit && (
          <div>
            <label className="block text-sm font-medium mb-1">Product</label>
            <select
              className="w-full p-2 border rounded"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            >
              <option value="">None (Free)</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Button */}
      <div className="pt-5 mt-5 border-t bg-white">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-black text-white rounded w-full"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}