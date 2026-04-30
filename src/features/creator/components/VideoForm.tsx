import { useState } from "react";
import type { VideoItem } from "../types";

// Props definition for VideoForm component, which can be used for both creating and editing video items. It accepts optional seriesId and episodeId for associating the video with a specific series or episode, initial values for pre-filling the form when editing, an onSubmit function that handles form submission, and a submitLabel for the submit button text.
type Props = {
  seriesId?: number;
  episodeId?: number;
  initialValues?: Partial<VideoItem>;
  onSubmit: (values: {
    title: string;
    videoUrl: string;
    sortOrder: number;
    seriesId?: number | null;
    episodeId?: number | null;
  }) => Promise<void>;
  submitLabel: string;
};

// Form component for creating or editing a video item, with fields for title, video URL, and sort order. It manages local state for form inputs and handles form submission by calling the provided onSubmit function with the form values, while also managing a loading state during submission.
export default function VideoForm({
  seriesId,
  episodeId,
  initialValues,
  onSubmit,
  submitLabel,
}: Props) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [videoUrl, setVideoUrl] = useState(initialValues?.videoUrl ?? "");
  const [sortOrder, setSortOrder] = useState(
    initialValues?.sortOrder?.toString() ?? ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        title,
        videoUrl,
        sortOrder: Number(sortOrder),
        seriesId: seriesId ?? null,
        episodeId: episodeId ?? null,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the form with inputs for title, video URL, and sort order, along with a submit button that shows loading state when submitting
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="video-title" className="text-sm text-gray-700">
          Title
        </label>
        <input
          id="video-title"
          className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg bg-white text-black"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="video-url" className="text-sm text-gray-700">
          Video URL
        </label>
        <input
          id="video-url"
          className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg bg-white text-black"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="video-sort-order" className="text-sm text-gray-700">
          Sort order
        </label>
        <input
          id="video-sort-order"
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
