import { useState } from "react";
import { useFormValidation } from "../../../hooks/useFormValidation";

// Props definition for EpisodeForm
type Props = {
  seriesId: number;
  initialValues?: {
    title?: string;
    sortOrder?: number;
  };
  onCreate?: (values: {
    title: string;
    sortOrder: number;
    seriesId: number;
  }) => Promise<void>;
  onUpdate?: (values: { title: string; sortOrder: number }) => Promise<void>;
  submitLabel: string;
  isEdit?: boolean;
};

// Function component for creating or editing an episode within a series
export default function EpisodeForm({
  seriesId,
  initialValues,
  onCreate,
  onUpdate,
  submitLabel,
  isEdit = false,
}: Props) {
  // Local state for episode title, initialized with initial values if provided
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [sortOrder, setSortOrder] = useState(
    initialValues?.sortOrder?.toString() ?? ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { errors, validate } = useFormValidation<{
    title: string;
    sortOrder: string;
  }>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validate(
      { title, sortOrder },
      {
        title: (v) => (!v ? "Title is required" : null),
        sortOrder: (v) => (!v ? "Sort order is required" : null),
      }
    );

    if (!isValid) return;

    setIsSubmitting(true);

    // Depending on whether we're editing or creating, call the appropriate function with the form values
    try {
      if (isEdit && onUpdate) {
        await onUpdate({
          title,
          sortOrder: Number(sortOrder),
        });
      } else if (onCreate) {
        await onCreate({
          title,
          sortOrder: Number(sortOrder),
          seriesId,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form layout with inputs for title and sort order, and a submit button that shows loading state when submitting
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label className="text-sm text-gray-700">Title</label>
        <input
          className={`w-full mt-1 px-3 py-2 border rounded-lg bg-white text-black ${
            errors.title ? "border-red-500" : "border-gray-200"
          }`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      {/* Sort order */}
      <div>
        <label className="text-sm text-gray-700">Sort order</label>
        <input
          type="number"
          className={`w-full mt-1 px-3 py-2 border rounded-lg bg-white text-black ${
            errors.sortOrder ? "border-red-500" : "border-gray-200"
          }`}
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        />
        {errors.sortOrder && (
          <p className="mt-1 text-sm text-red-500">{errors.sortOrder}</p>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-black/80"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
