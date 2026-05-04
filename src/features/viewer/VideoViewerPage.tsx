import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getVideosByChapter } from "../../api/endpoints/media.api";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ViewerLayout from "../components/ViewerLayout";

// Video viewer for manga/comic chapters. Fetches all videos for a chapter and allows navigation between them.
export default function VideoViewerPage() {
  // Get chapter ID from URL params
  const { chapterId } = useParams();

  // Convert chapterId to number
  const id = Number(chapterId);

  // Fetch videos for the chapter using React Query
  const { data: videos = [], isLoading } = useQuery({
    queryKey: ["viewer-videos", id],
    queryFn: () => getVideosByChapter(id),
    enabled: !!id,
  });

  // Local state to track current video index
  const [index, setIndex] = useState(0);

  // Handle loading state
  if (isLoading) {
    return <div className="text-white p-6">Loading...</div>;
  }

  // Handle case where no videos are found
  if (!videos.length) {
    return <div className="text-white p-6">No videos</div>;
  }

  // Get current video based on index
  const video = videos[index];

  // Handlers for navigating to next and previous videos
  return (
    <ViewerLayout>
      <div className="w-full max-w-4xl space-y-4">

        {/* Video */}
        <video
          src={video.videoUrl}
          controls
          className="w-full rounded"
        />

        {/* Controls */}
        <div className="flex justify-between items-center">
          <button onClick={() => setIndex((i) => Math.max(i - 1, 0))}>
            <ChevronLeft />
          </button>

          <span className="text-sm">
            {index + 1} / {videos.length}
          </span>

          <button
            onClick={() =>
              setIndex((i) => Math.min(i + 1, videos.length - 1))
            }
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </ViewerLayout>
  );
}