import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPagesByChapter } from "../../api/endpoints/media.api";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ViewerLayout from "../components/ViewerLayout";

// Page viewer for manga/comic chapters. Fetches all pages for a chapter and allows navigation between them.
export default function PageViewerPage() {
  // Get chapter ID from URL params
  const { chapterId } = useParams();
  // Convert chapterId to number
  const id = Number(chapterId);

  // Fetch pages for the chapter using React Query
  const { data: pages = [], isLoading } = useQuery({
    queryKey: ["viewer-pages", id],
    queryFn: () => getPagesByChapter(id),
    enabled: !!id,
  });

  // Local state to track current page index
  const [index, setIndex] = useState(0);

  // Handle loading state
  if (isLoading) {
    return <div className="text-white p-6">Loading...</div>;
  }

  // Handle case where no pages are found
  if (!pages.length) {
    return <div className="text-white p-6">No pages found</div>;
  }

  // Get current page based on index
  const page = pages[index];

  // Handlers for navigating to next and previous pages
  const next = () => {
    if (index < pages.length - 1) setIndex(index + 1);
  };

  // Navigate to previous page if not on the first page
  const prev = () => {
    if (index > 0) setIndex(index - 1);
  };

  // Render the page viewer layout with image and navigation controls
  return (
    <ViewerLayout>
      <div className="relative w-full max-w-4xl">

        {/* Image */}
        <img
          src={page.imageUrl}
          className="w-full object-contain rounded"
        />

        {/* Left */}
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-3"
        >
          <ChevronLeft size={30} />
        </button>

        {/* Right */}
        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-3"
        >
          <ChevronRight size={30} />
        </button>

        {/* Counter */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-sm bg-black/60 px-3 py-1 rounded">
          {index + 1} / {pages.length}
        </div>
      </div>
    </ViewerLayout>
  );
}