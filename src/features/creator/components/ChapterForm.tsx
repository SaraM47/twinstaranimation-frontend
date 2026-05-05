import { useState } from "react";
import type { Chapter } from "../../series/types";
import { useFormValidation } from "../../../hooks/useFormValidation";

// Props definition for ChapterForm
type Props = {
  seriesId: number; // Parent series ID for the chapter
  initialValues?: Partial<Chapter>; // Optional initial values for editing an existing chapter
  onCreate?: (values: any) => Promise<void>; // Function to call when creating a new chapter
  onUpdate?: (values: any) => Promise<void>; // Function to call when updating an existing chapter
  submitLabel: string; // Buton label (Create or Update)
  isEdit?: boolean; // Flag to determine create vs edit mode
};

// Form component for creating or editing a chapter
export default function ChapterForm({
  seriesId,
  initialValues,
  onCreate,
  onUpdate,
  submitLabel,
  isEdit = false,
}: Props) {
    // Local state for chapter title
  const [title, setTitle] = useState(initialValues?.title ?? "");
    // Local state for chapter order (stored as string for input control)
  const [sortOrder, setSortOrder] = useState(
    initialValues?.sortOrder?.toString() ?? ""
  );

  // Loading state while submitting form
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation hook
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

    try {
      // If editing, call update function
      if (isEdit && onUpdate) {
        await onUpdate({ title, sortOrder: Number(sortOrder) });
        // Otherwise, call create function
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

  return (
    // Form layout with title and sort order inputs, and submit button
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
