import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSeriesById } from "../api/endpoints/series.api";
import { getChaptersBySeries } from "../api/endpoints/chapters.api";
import { getMyRating, rateSeries } from "../api/endpoints/ratings.api";

import PublicHeader from "../components/layout/PublicHeader";
import { showSuccess, showError } from "../components/ui/toast";

import { Lock } from "lucide-react";
import { useAuthStore } from "../features/auth/store/auth.store";
import RatingStars from "../components/ui/RatingStars";

// Detailed page for a comic/series. Displays info, summary, chapters, and allows rating if authenticated.
export default function ComicDetailsPage() {
  const { id } = useParams(); // Get series ID from URL params
  const seriesId = Number(id); // Convert ID to number for API calls

  // React Query client for cache management
  const queryClient = useQueryClient();

  // Authentication state from global store
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Local state to track user's selected rating (null if not rated)
  const [selected, setSelected] = useState<number | null>(null);

  // Fetch comic/series details
  const { data: comic } = useQuery({
    queryKey: ["comic", seriesId],
    queryFn: () => getSeriesById(seriesId),
    enabled: !!seriesId,
  });

  // Fetch chapters for the series
  const { data: chapters = [] } = useQuery({
    queryKey: ["chapters", seriesId],
    queryFn: () => getChaptersBySeries(seriesId),
    enabled: !!seriesId,
    retry: false,
  });

  // Load user's existing rating for this series when component mounts or when seriesId/auth state changes
  useEffect(() => {
    if (!seriesId || !isAuthenticated) {
      setSelected(null);
      return;
    }

    // Fetch user's rating for the series
    const fetchRating = async () => {
      try {
        const res = await getMyRating(seriesId);
        if (res?.value) setSelected(res.value);
      } catch {
        setSelected(null);
      }
    };

    // Only fetch rating if user is authenticated and seriesId is valid
    fetchRating();
  }, [seriesId, isAuthenticated]);

  // Mutation for submitting a new rating. Optimistically updates UI and handles success/error states.
  const rateMutation = useMutation({
    mutationFn: ({ value }: { value: number }) =>
      rateSeries(seriesId, value),

      // Optimistically update selected rating immediately on mutation trigger
    onMutate: ({ value }) => {
      setSelected(value);
    },

    // On success, show a success message and invalidate the comic query to refetch updated average rating
    onSuccess: (_, variables) => {
      showSuccess(`Rated ${variables.value}/10`);
      queryClient.invalidateQueries({ queryKey: ["comic", seriesId] });
    },

    // On error, revert the selected rating to null and show an error message
    onError: () => {
      showError("Only logged in customers can rate this comic");
    },
  });

  // If comic data is still loading, show a loading state
  if (!comic) return <div className="p-10">Loading...</div>;

  // Parse genres string into an array, handling empty or invalid cases gracefully
  const genres =
    typeof comic.genres === "string" && comic.genres.trim().length > 0
      ? comic.genres.split(",").map((g: string) => g.trim()).filter(Boolean)
      : [];

  // Main UI rendering
  return (
    <div className="bg-white text-black">
      {/* Hero */}
      <div className="relative h-[260px] sm:h-[320px] md:h-[420px] bg-gray-200">
        <PublicHeader dark />

        <img
          src={comic.coverImageUrl}
          className="w-full h-full object-cover opacity-30"
          alt={comic.title}
        />
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-10 md:py-16 space-y-10 md:space-y-14">
        {/* Breadcrumbs */}
        <div className="text-sm flex flex-wrap gap-1">
          <Link to="/" className="underline">
            Home
          </Link>

          <span>&gt;</span>

          <Link to="/comics" className="underline">
            Comics
          </Link>

          <span>&gt;</span>

          <span className="font-semibold">Detailed comic</span>
        </div>

        {/* Title */}
        <h1 className="font-heading text-3xl sm:text-4xl md:text-4xl">
          {comic.title}
        </h1>

        {/* Info */}
        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-8 md:gap-16 items-start">
          {/* Image */}
          <div className="w-full h-[280px] sm:h-[320px] bg-gray-100">
            <img
              src={comic.coverImageUrl}
              className="w-full h-full object-cover"
              alt={comic.title}
            />
          </div>

          {/* Meta data */}
          <div className="space-y-5 text-[15px] leading-relaxed min-w-0">
            <p>
              <span className="font-semibold">Authors:</span>{" "}
              {comic.authors || "Unknown"}
            </p>

            <p>
              <span className="font-semibold">Status:</span>{" "}
              {comic.status || "Unknown"}
            </p>

            <div className="flex flex-wrap items-start gap-2">
              <span className="font-semibold">Genres:</span>

              {genres.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {genres.map((g: string) => (
                    <span
                      key={g}
                      className="bg-gray-200 px-3 py-1 rounded-md text-sm"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              ) : (
                <span>Unknown</span>
              )}
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <span className="font-semibold shrink-0">Rating:</span>

                <div className="flex flex-wrap items-center gap-3 min-w-0">
                  <RatingStars
                    value={selected ?? comic.averageRating ?? 0}
                    disabled={!isAuthenticated}
                    onRate={(value) => {
                      if (!isAuthenticated) {
                        showError("Login as customer to rate this comic");
                        return;
                      }

                      setSelected(value);
                      rateMutation.mutate({ value });
                    }}
                  />

                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    {typeof comic.averageRating === "number"
                      ? `${comic.averageRating.toFixed(1)} / 10`
                      : "Not rated"}
                  </span>
                </div>
              </div>

              {!isAuthenticated && (
                <p className="text-sm text-gray-500">
                  Login as customer to submit your rating.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-5 max-w-2xl">
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold">
            Summary
          </h2>

          <p className="text-[15px] leading-relaxed">
            {comic.description || "Section to explain what is the comic about"}
          </p>
        </div>

        {/* Chapter list */}
        <div className="space-y-8 pb-20 md:pb-28">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6">
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold">
              Chapters
            </h2>

            {!isAuthenticated && (
              <p className="text-sm text-gray-500 max-w-[240px] md:max-w-none">
                Login to open and read chapters.
              </p>
            )}
          </div>

          <div className="border-t border-black">
            {chapters.map((c: any, index: number) => {
              const content = (
                <>
                  <span className="text-[15px] md:min-w-[150px]">
                    Chapter {index + 1}
                  </span>

                  <span className="text-[15px] break-words">
                    {c.title}
                  </span>

                  {!isAuthenticated && (
                    <div className="md:ml-auto flex items-center gap-2 text-gray-500">
                      <Lock size={16} />

                      <span className="text-xs">
                        Login to read
                      </span>
                    </div>
                  )}
                </>
              );

              if (!isAuthenticated) {
                return (
                  <div
                    key={c.id}
                    className="
                      flex flex-col md:flex-row
                      md:items-center
                      gap-3 md:gap-10
                      py-5 md:py-6
                      border-b border-black
                      opacity-80
                      cursor-not-allowed
                    "
                  >
                    {content}
                  </div>
                );
              }

              return (
                <Link
                  key={c.id}
                  to={`/viewer/${c.id}`}
                  className="
                    flex flex-col md:flex-row
                    md:items-center
                    gap-3 md:gap-10
                    py-5 md:py-6
                    border-b border-black
                    transition
                    hover:bg-black
                    hover:text-white
                  "
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}