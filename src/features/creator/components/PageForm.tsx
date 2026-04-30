import { useState } from "react";
import type { PageItem } from "../types";

// Props for PageForm component
type Props = {
  chapterId: number;
  initialValues?: Partial<PageItem>;
  onSubmit: (values: {
    title?: string;
    imageUrl: string;
    pageNumber: number;
    content?: string;
    chapterId: number;
  }) => Promise<void>;
  submitLabel: string;
};

// Form component for creating or editing a page within a chapter
export default function PageForm({
  chapterId,
  initialValues,
  onSubmit,
  submitLabel,
}: Props) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [imageUrl, setImageUrl] = useState(initialValues?.imageUrl ?? "");
  const [pageNumber, setPageNumber] = useState(
    initialValues?.pageNumber?.toString() ?? ""
  );
  const [content, setContent] = useState(initialValues?.content ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        title,
        imageUrl,
        pageNumber: Number(pageNumber),
        content,
        chapterId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the form with fields for title, image URL, page number, and optional content, along with a submit button that shows loading state when submitting
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="page-title" className="text-sm text-gray-700">
          Title
        </label>
        <input
          id="page-title"
          className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg bg-white text-black"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="page-image-url" className="text-sm text-gray-700">
          Image URL
        </label>
        <input
          id="page-image-url"
          className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg bg-white text-black"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="page-number" className="text-sm text-gray-700">
          Page number
        </label>
        <input
          id="page-number"
          type="number"
          className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg bg-white text-black"
          value={pageNumber}
          onChange={(e) => setPageNumber(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="page-content" className="text-sm text-gray-700">
          Content (optional)
        </label>
        <textarea
          id="page-content"
          className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg bg-white text-black"
          value={content}
          onChange={(e) => setContent(e.target.value)}
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
