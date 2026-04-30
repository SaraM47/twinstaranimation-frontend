import { useState } from "react";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      <div>
        <label htmlFor="episode-title" className="text-sm text-gray-700">
          Title
        </label>
        <input
          id="episode-title"
          className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg bg-white text-black"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="episode-sort-order" className="text-sm text-gray-700">
          Sort order
        </label>
        <input
          id="episode-sort-order"
          type="number"
          className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg bg-white text-black"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        />
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
