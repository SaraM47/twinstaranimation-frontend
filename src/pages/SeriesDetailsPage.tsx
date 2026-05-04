import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getChaptersBySeries } from "../api/endpoints/chapters.api";
import { Lock, Unlock, PlayCircle, BookOpen } from "lucide-react";

// Displays chapters for a series with access control (locked/unlocked state)

export default function SeriesDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const seriesId = Number(id);

  // Fetch chapters for the series
  const {
    data: chapters = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["series-content", seriesId],
    queryFn: () => getChaptersBySeries(seriesId),
    enabled: !!seriesId, // Only fetch when valid ID exists
    retry: false, // Prevent retries, used to detect locked content
  });

  // Loading state (skeleton UI)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#7F13FD] to-[#43089B] text-white p-10">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-40 bg-white/20 rounded" />
          <div className="h-20 bg-white/10 rounded" />
          <div className="h-20 bg-white/10 rounded" />
        </div>
      </div>
    );
  }

  // Locked state (access denied)
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#7F13FD] to-[#43089B] text-white flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md">
          <Lock size={40} />
          <h1 className="text-2xl font-semibold">This content is locked</h1>
          <p className="opacity-80">
            You need to purchase the product to access this series.
          </p>
          {/* Redirect to store */}
          <button
            onClick={() => navigate("/products")}
            className="rounded-full bg-white px-6 py-3 text-black"
          >
            Go to store
          </button>
        </div>
      </div>
    );
  }

  // Unlocked content view
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#7F13FD] to-[#43089B] text-white">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Series</h1>

        {/* Access indicator */}
        <div className="flex items-center gap-2 text-green-300">
          <Unlock size={18} />
          <span className="text-sm">Unlocked</span>
        </div>
      </div>

      {/* Chapter list */}
      <div className="p-6 space-y-6">
        {chapters.map((c: any) => {
          const pages = c.pages ?? [];
          const videos = c.videos ?? [];

          return (
            <div
              key={c.id}
              className="rounded-2xl bg-white/10 p-5 border border-white/10"
            >
              {/* Chapter header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{c.title}</h2>

                <div className="text-xs opacity-70">
                  {pages.length} pages • {videos.length} videos
                </div>
              </div>

              {/* Actions */}
              <div className="grid gap-3 sm:grid-cols-2">
                {/* Pages viewer */}
                {pages.length > 0 && (
                  <button
                    onClick={() => navigate(`/viewer/pages/${c.id}`)}
                    className="flex items-center gap-3 rounded-xl bg-black/40 px-4 py-3 hover:bg-black/60 transition"
                  >
                    <BookOpen size={18} />
                    <span>Read pages</span>
                  </button>
                )}

                {/* Video viewer */}
                {videos.length > 0 && (
                  <button
                    onClick={() => navigate(`/viewer/videos/${c.id}`)}
                    className="flex items-center gap-3 rounded-xl bg-black/40 px-4 py-3 hover:bg-black/60 transition"
                  >
                    <PlayCircle size={18} />
                    <span>Watch videos</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
