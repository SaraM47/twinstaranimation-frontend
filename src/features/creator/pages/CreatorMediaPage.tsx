import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { getSeries } from "../../../api/endpoints/series.api";
import { getChaptersBySeries } from "../../../api/endpoints/chapters.api";
import { getEpisodesBySeries } from "../../../api/endpoints/episodes.api";
import {
  createLink,
  createPage,
  createVideo,
  deleteLink,
  deletePage,
  deleteVideo,
  getLinksByChapter,
  getPagesByChapter,
  getVideosByEpisode,
  updateLink,
  updatePage,
  updateVideo,
} from "../../../api/endpoints/media.api";

import { useAuthStore } from "../../auth/store/auth.store";

import PageForm from "../components/PageForm";
import VideoForm from "../components/VideoForm";
import LinkForm from "../components/LinkForm";

import AdminTable from "../../../components/admin/AdminTable";
import AdminModal from "../../../components/admin/AdminModal";
import ActionMenu from "../../../components/ui/ActionMenu";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { showSuccess, showError } from "../../../components/ui/toast";

type MediaType = "page" | "video" | "link";

type DeleteItem =
  | { id: number; type: "page" }
  | { id: number; type: "video" }
  | { id: number; type: "link" }
  | null;

function parseNumberParam(value: string | null): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

// This page allows creators to manage media (pages, videos, links) for their series.
export default function CreatorMediaPage() {

  // React Query client for cache management
  const queryClient = useQueryClient();

  // Current logged-in user
  const user = useAuthStore((s) => s.user);
  const [params] = useSearchParams();

  // Parse initial selected series, chapter, and episode from URL query parameters
  const initialSeriesId = parseNumberParam(params.get("seriesId"));
  const initialChapterId = parseNumberParam(params.get("chapterId"));
  const initialEpisodeId = parseNumberParam(params.get("episodeId"));

  // Local state for selected series, chapter, episode, modal visibility, editing item, and delete confirmation
  const [selectedSeriesId, setSelectedSeriesId] = useState<number | null>(
    initialSeriesId
  );
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(
    initialChapterId
  );
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<number | null>(
    initialEpisodeId
  );

  // Modal state
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<MediaType>("page");
  const [editing, setEditing] = useState<any | null>(null);
  const [deleteItem, setDeleteItem] = useState<DeleteItem>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Labels for media types
  const typeLabels: Record<MediaType, string> = {
    page: "Page",
    video: "Video",
    link: "Link",
  };

  // Fetch all series to populate the series dropdown
  const { data: seriesList = [] } = useQuery({
    queryKey: ["series"],
    queryFn: getSeries,
  });

  // Filter series to only include those created by the current user
  const mySeries = useMemo(
    () => seriesList.filter((s: any) => s.creatorId === user?.userId),
    [seriesList, user?.userId]
  );

  // Fetch chapters for the selected series, enabled only when a series is selected
  const { data: chapters = [] } = useQuery({
    queryKey: ["chapters", selectedSeriesId],
    queryFn: () => getChaptersBySeries(selectedSeriesId as number),
    enabled: !!selectedSeriesId,
  });

  // Fetch episodes for the selected series, enabled only when a series is selected
  const { data: episodes = [] } = useQuery({
    queryKey: ["episodes", selectedSeriesId],
    queryFn: () => getEpisodesBySeries(selectedSeriesId as number),
    enabled: !!selectedSeriesId,
  });

  // Ensure that the selected chapter and episode IDs are valid for the currently selected series
  const validSelectedChapterId = useMemo(() => {
    // If no chapter is selected, return null
    if (!selectedChapterId) return null;
    const exists = chapters.some((c: any) => c.id === selectedChapterId);
    return exists ? selectedChapterId : null;
  }, [chapters, selectedChapterId]);

  // Similar validation for selected episode ID
  const validSelectedEpisodeId = useMemo(() => {
    if (!selectedEpisodeId) return null;
    const exists = episodes.some((e: any) => e.id === selectedEpisodeId);
    return exists ? selectedEpisodeId : null;
  }, [episodes, selectedEpisodeId]);

  // Fetch pages for the selected chapter, enabled only when a valid chapter is selected
  const { data: pages = [] } = useQuery({
    queryKey: ["pages", validSelectedChapterId],
    queryFn: () => getPagesByChapter(validSelectedChapterId as number),
    enabled: !!validSelectedChapterId,
  });

  // Fetch videos for the selected episode, enabled only when a valid episode is selected
  const { data: videos = [] } = useQuery({
    queryKey: ["videos", validSelectedEpisodeId],
    queryFn: () => getVideosByEpisode(validSelectedEpisodeId as number),
    enabled: !!validSelectedEpisodeId,
  });

  // Fetch links for the selected chapter, enabled only when a valid chapter is selected
  const { data: links = [] } = useQuery({
    queryKey: ["links", validSelectedChapterId],
    queryFn: () => getLinksByChapter(validSelectedChapterId as number),
    enabled: !!validSelectedChapterId,
  });

  // Helper function to refresh all media-related queries after a mutation
  const refreshMediaQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["pages", validSelectedChapterId],
      }),
      queryClient.invalidateQueries({
        queryKey: ["videos", validSelectedEpisodeId],
      }),
      queryClient.invalidateQueries({
        queryKey: ["links", validSelectedChapterId],
      }),
    ]);
  };

  // Mutations for creating and updating pages, videos, and links, with success and error handling
  const createPageMutation = useMutation({
    mutationFn: createPage,
    onSuccess: async () => {
      showSuccess("Page created");
      await refreshMediaQueries();
      setOpen(false);
      setEditing(null);
    },
    onError: () => showError("Failed to create page"),
  });

  // Update page mutation
  const updatePageMutation = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: any }) => updatePage(id, dto),
    onSuccess: async () => {
      showSuccess("Page updated");
      await refreshMediaQueries();
      setOpen(false);
      setEditing(null);
    },
    onError: () => showError("Failed to update page"),
  });

  // Create video mutation
  const createVideoMutation = useMutation({
    mutationFn: createVideo,
    onSuccess: async () => {
      showSuccess("Video created");
      await refreshMediaQueries();
      setOpen(false);
      setEditing(null);
    },
    onError: () => showError("Failed to create video"),
  });

  // Update video mutation
  const updateVideoMutation = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: any }) => updateVideo(id, dto),
    onSuccess: async () => {
      showSuccess("Video updated");
      await refreshMediaQueries();
      setOpen(false);
      setEditing(null);
    },
    onError: () => showError("Failed to update video"),
  });

  // Create link mutation
  const createLinkMutation = useMutation({
    mutationFn: createLink,
    onSuccess: async () => {
      showSuccess("Link created");
      await refreshMediaQueries();
      setOpen(false);
      setEditing(null);
    },
    onError: () => showError("Failed to create link"),
  });

  // Update link mutation
  const updateLinkMutation = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: any }) => updateLink(id, dto),
    onSuccess: async () => {
      showSuccess("Link updated");
      await refreshMediaQueries();
      setOpen(false);
      setEditing(null);
    },
    onError: () => showError("Failed to update link"),
  });

  // Confirm delete function that handles deletion of pages, videos, and links based on the type of item being deleted
  const confirmDelete = async () => {
    if (!deleteItem) return;

    try {
      setIsDeleting(true);

      if (deleteItem.type === "page") {
        await deletePage(deleteItem.id);
        showSuccess("Page deleted");
      }

      if (deleteItem.type === "video") {
        await deleteVideo(deleteItem.id);
        showSuccess("Video deleted");
      }

      if (deleteItem.type === "link") {
        await deleteLink(deleteItem.id);
        showSuccess("Link deleted");
      }

      await refreshMediaQueries();
      setDeleteItem(null);
    } catch (error: any) {
      showError(error?.response?.data?.message || "Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  // Column configurations for pages, videos, and links tables, including action menus for editing and deleting items
  const pageColumns = [
    {
      header: "Page",
      render: (p: any) => (
        <span className="font-medium text-gray-900">
          {p.title || `Page ${p.pageNumber}`}
        </span>
      ),
    },
    {
      header: "Number",
      render: (p: any) => (
        <span className="text-gray-700">{p.pageNumber}</span>
      ),
    },
    {
      header: "Action",
      className: "w-[90px]",
      render: (p: any) => (
        <ActionMenu
          actions={[
            {
              label: "Edit",
              onClick: () => {
                setType("page");
                setEditing(p);
                setOpen(true);
              },
            },
            {
              label: "Delete",
              variant: "danger",
              onClick: () => setDeleteItem({ id: p.id, type: "page" }),
            },
          ]}
        />
      ),
    },
  ];

  // Column configuration for videos
  const videoColumns = [
    {
      header: "Video",
      render: (v: any) => (
        <span className="font-medium text-gray-900">{v.title}</span>
      ),
    },
    {
      header: "URL",
      render: (v: any) => (
        <span className="block max-w-105 truncate text-gray-500">
          {v.videoUrl}
        </span>
      ),
    },
    {
      header: "Order",
      render: (v: any) => (
        <span className="text-gray-700">{v.sortOrder}</span>
      ),
    },
    {
      header: "Action",
      className: "w-[90px]",
      render: (v: any) => (
        <ActionMenu
          actions={[
            {
              label: "Edit",
              onClick: () => {
                setType("video");
                setEditing(v);
                setOpen(true);
              },
            },
            {
              label: "Delete",
              variant: "danger",
              onClick: () => setDeleteItem({ id: v.id, type: "video" }),
            },
          ]}
        />
      ),
    },
  ];

  // Column configuration for links
  const linkColumns = [
    {
      header: "Link",
      render: (l: any) => (
        <span className="font-medium text-gray-900">{l.title}</span>
      ),
    },
    {
      header: "URL",
      render: (l: any) => (
        <span className="block max-w-105 truncate text-gray-500">{l.url}</span>
      ),
    },
    {
      header: "Action",
      className: "w-[90px]",
      render: (l: any) => (
        <ActionMenu
          actions={[
            {
              label: "Edit",
              onClick: () => {
                setType("link");
                setEditing(l);
                setOpen(true);
              },
            },
            {
              label: "Delete",
              variant: "danger",
              onClick: () => setDeleteItem({ id: l.id, type: "link" }),
            },
          ]}
        />
      ),
    },
  ];

  // Determine permissions for managing media based on whether a valid chapter or episode is selected
  const canManageComicMedia = !!validSelectedChapterId;
  const canManageAnimationMedia = !!validSelectedEpisodeId;
  const canManageAnything = canManageComicMedia || canManageAnimationMedia;

  return (
    <div className="space-y-8">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Media</h1>

          {canManageAnything && (
            <div className="flex gap-2">
              {canManageComicMedia && (
                <>
                  <button
                    onClick={() => {
                      setType("page");
                      setEditing(null);
                      setOpen(true);
                    }}
                    className="flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-white hover:bg-black/85"
                  >
                    <Plus size={14} />
                    Page
                  </button>

                  <button
                    onClick={() => {
                      setType("link");
                      setEditing(null);
                      setOpen(true);
                    }}
                    className="flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-white hover:bg-black/85"
                  >
                    <Plus size={14} />
                    Link
                  </button>
                </>
              )}

              {canManageAnimationMedia && (
                <button
                  onClick={() => {
                    setType("video");
                    setEditing(null);
                    setOpen(true);
                  }}
                  className="flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-white hover:bg-black/85"
                >
                  <Plus size={14} />
                  Video
                </button>
              )}
            </div>
          )}
        </div>

        <div className="border-b border-gray-200" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Series */}
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <label
            htmlFor="media-series-select"
            className="mb-2 block text-sm text-gray-700"
          >
            Select series
          </label>

          <select
            id="media-series-select"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2"
            value={selectedSeriesId ?? ""}
            onChange={(e) => {
              const value = Number(e.target.value);
              setSelectedSeriesId(
                Number.isNaN(value) || value === 0 ? null : value
              );
              setSelectedChapterId(null);
              setSelectedEpisodeId(null);
            }}
          >
            <option value="">Choose series</option>
            {mySeries.map((series: any) => (
              <option key={series.id} value={series.id}>
                {series.title}
              </option>
            ))}
          </select>
        </div>

        {/* Chapter */}
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <label
            htmlFor="media-chapter-select"
            className="mb-2 block text-sm text-gray-700"
          >
            Select chapter (Comics)
          </label>

          <select
            id="media-chapter-select"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2"
            value={validSelectedChapterId ?? ""}
            onChange={(e) => {
              const value = Number(e.target.value);
              setSelectedChapterId(
                Number.isNaN(value) || value === 0 ? null : value
              );
            }}
            disabled={!selectedSeriesId}
          >
            <option value="">Choose chapter</option>
            {chapters.map((chapter: any) => (
              <option key={chapter.id} value={chapter.id}>
                {chapter.title}
              </option>
            ))}
          </select>
        </div>

        {/* Episode */}
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <label
            htmlFor="media-episode-select"
            className="mb-2 block text-sm text-gray-700"
          >
            Select episode (Animation)
          </label>

          <select
            id="media-episode-select"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2"
            value={validSelectedEpisodeId ?? ""}
            onChange={(e) => {
              const value = Number(e.target.value);
              setSelectedEpisodeId(
                Number.isNaN(value) || value === 0 ? null : value
              );
            }}
            disabled={!selectedSeriesId}
          >
            <option value="">Choose episode</option>
            {episodes.map((episode: any) => (
              <option key={episode.id} value={episode.id}>
                {episode.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!canManageAnything ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
          Select a series and then choose either a chapter for comics media or an
          episode for animation videos.
        </div>
      ) : (
        <div className="space-y-6">
          {canManageComicMedia && (
            <>
              <AdminTable data={pages} columns={pageColumns} />
              <AdminTable data={links} columns={linkColumns} />
            </>
          )}

          {canManageAnimationMedia && (
            <AdminTable data={videos} columns={videoColumns} />
          )}
        </div>
      )}

      <AdminModal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        title={`${editing ? "Edit" : "Create"} ${typeLabels[type]}`}
      >
        {type === "page" && validSelectedChapterId && (
          <PageForm
            chapterId={validSelectedChapterId}
            initialValues={editing || undefined}
            submitLabel={editing ? "Update" : "Create"}
            onSubmit={(values) =>
              editing
                ? updatePageMutation.mutateAsync({
                    id: editing.id,
                    dto: values,
                  })
                : createPageMutation.mutateAsync(values)
            }
          />
        )}

        {type === "video" && validSelectedEpisodeId && (
          <VideoForm
            episodeId={validSelectedEpisodeId}
            seriesId={selectedSeriesId || undefined}
            initialValues={editing || undefined}
            submitLabel={editing ? "Update" : "Create"}
            onSubmit={(values) =>
              editing
                ? updateVideoMutation.mutateAsync({
                    id: editing.id,
                    dto: values,
                  })
                : createVideoMutation.mutateAsync(values)
            }
          />
        )}

        {type === "link" && validSelectedChapterId && (
          <LinkForm
            chapterId={validSelectedChapterId}
            initialValues={editing || undefined}
            submitLabel={editing ? "Update" : "Create"}
            onSubmit={(values) =>
              editing
                ? updateLinkMutation.mutateAsync({
                    id: editing.id,
                    dto: values,
                  })
                : createLinkMutation.mutateAsync(values)
            }
          />
        )}
      </AdminModal>

      <ConfirmModal
        open={deleteItem !== null}
        title="Delete item"
        description="Are you sure you want to delete this item?"
        onConfirm={confirmDelete}
        onClose={() => setDeleteItem(null)}
        loading={isDeleting}
      />
    </div>
  );
}