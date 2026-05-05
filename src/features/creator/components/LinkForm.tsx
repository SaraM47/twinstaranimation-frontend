import { useState } from "react";
import type { LinkItem } from "../types";
import { useFormValidation } from "../../../hooks/useFormValidation";

// Props definition for LinkForm component
type Props = {
  chapterId: number;
  initialValues?: Partial<LinkItem>;
  onSubmit: (values: {
    title: string;
    url: string;
    platform?: string;
    chapterId: number;
  }) => Promise<void>;
  submitLabel: string;
};

// Form component for creating or editing a link
export default function LinkForm({
  chapterId,
  initialValues,
  onSubmit,
  submitLabel,
}: Props) {
    // Local state for link title
  const [title, setTitle] = useState(initialValues?.title ?? "");
    // Local state for URL
  const [url, setUrl] = useState(initialValues?.url ?? "");
    // Optional platform field (Patreon, YouTube, etc.)
  const [platform, setPlatform] = useState(initialValues?.platform ?? "");
    // Loading state while submitting
  const [isSubmitting, setIsSubmitting] = useState(false);

    // Form submit handler
  const { errors, validate } = useFormValidation<{
    title: string;
    url: string;
  }>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validate(
      { title, url },
      {
        title: (v) => (!v ? "Title is required" : null),
        url: (v) => (!v ? "URL is required" : null),
      }
    );

    if (!isValid) return;

    setIsSubmitting(true);

    try {
      await onSubmit({
        title,
        url,
        platform,
        chapterId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

    // Render the form with fields for title, URL, and platform, along with a submit button that shows loading state
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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

      {/* Url */}
      <div>
        <label className="text-sm text-gray-700">URL</label>
        <input
          className={`w-full mt-1 px-3 py-2 border rounded-lg bg-white text-black ${
            errors.url ? "border-red-500" : "border-gray-200"
          }`}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        {errors.url && (
          <p className="mt-1 text-sm text-red-500">{errors.url}</p>
        )}
      </div>

      {/* Platform */}
      <div>
        <label className="text-sm text-gray-700">
          Platform (optional)
        </label>
        <input
          className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg bg-white text-black"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
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