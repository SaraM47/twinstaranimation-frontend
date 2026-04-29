import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSeries } from "../../../api/endpoints/series.api";
import {
  createEpisode,
  deleteEpisode,
  getEpisodesBySeriesForCreator,
  updateEpisode,
} from "../../../api/endpoints/episodes.api";
import type { Series } from "../../series/types";
import { useAuthStore } from "../../auth/store/auth.store";
import EpisodeForm from "../components/EpisodeForm";
import { Link } from "react-router-dom";
import { showSuccess, showError } from "../../../components/ui/toast";

import AdminTable from "../../../components/admin/AdminTable";
import AdminModal from "../../../components/admin/AdminModal";
import ActionMenu from "../../../components/ui/ActionMenu";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { Plus } from "lucide-react";

// Local Episode type used in this page
type Episode = {
  id: number;
  title: string;
  sortOrder: number;
  seriesId: number;
};

export default function CreatorEpisodesPage() {
  // React Query cache manager
  const queryClient = useQueryClient();

  // Current logged-in user
  const user = useAuthStore((s) => s.user);

  // Selected series for displaying episodes
  const [selectedSeriesId, setSelectedSeriesId] = useState<number | null>(null);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);

  // Controls create/edit modal visibility
  const [open, setOpen] = useState(false);

  // Stores selected episode id for delete confirmation
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Loading state while deleting
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch all available series
  const { data: seriesList = [] } = useQuery({
    queryKey: ["series"],
    queryFn: getSeries,
  });

  // Filter only the current creator's series
  const mySeries = seriesList.filter(
    (series: Series) => series.creatorId === user?.userId
  );

  // Fetch episodes for the selected series, only enabled when a series is selected
  const { data: episodes = [], isLoading } = useQuery({
    queryKey: ["episodes", selectedSeriesId],
    queryFn: () => getEpisodesBySeriesForCreator(selectedSeriesId as number),
    enabled: !!selectedSeriesId,
  });

  // Create episode mutation
  const createMutation = useMutation({
    mutationFn: createEpisode,
    onSuccess: () => {
      // Refresh episode list after creation
      queryClient.invalidateQueries({
        queryKey: ["episodes", selectedSeriesId],
      });
      showSuccess("Episode created");
      setOpen(false);
    },
    onError: () => showError("Failed to create episode"),
  });

  // Update episode mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: any }) =>
      updateEpisode(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        // Refresh episode list after update
        queryKey: ["episodes", selectedSeriesId],
      });
      showSuccess("Episode updated");
      setEditingEpisode(null);
      setOpen(false);
    },
    onError: () => showError("Failed to update episode"),
  });

  // Confirm delete function
  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);

      await deleteEpisode(deleteId);

      showSuccess("Episode deleted");

      // Refresh table after delete
      queryClient.invalidateQueries({
        queryKey: ["episodes", selectedSeriesId],
      });

      setDeleteId(null);
    } catch (error: any) {
      showError(error?.response?.data?.message || "Failed to delete episode");
    } finally {
      setIsDeleting(false);
    }
  };

  // Table column definitions
  const columns = [
    {
      header: "Episode",
      // Episode title column
      render: (e: Episode) => (
        <span className="font-medium text-gray-900">{e.title}</span>
      ),
    },
    {
      header: "Order",
      // Sort order column
      render: (e: Episode) => (
        <span className="text-gray-700">{e.sortOrder}</span>
      ),
    },
    {
      header: "Videos",
      // Link to manage episode media
      render: (e: Episode) => (
        <Link
          to={`/creator/media?episodeId=${e.id}&seriesId=${e.seriesId}`}
          className="text-sm text-yellow-600 hover:underline"
        >
          Manage
        </Link>
      ),
    },
    {
      header: "Action",
      className: "w-[90px]",
      // Edit/Delete action dropdown
      render: (e: Episode) => (
        <ActionMenu
          actions={[
            {
              label: "Edit",
              onClick: () => {
                setEditingEpisode(e);
                setOpen(true);
              },
            },
            {
              label: "Delete",
              variant: "danger",
              onClick: () => setDeleteId(e.id),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Episodes</h1>

          {/* Create button only shown after selecting series */}
          {selectedSeriesId && (
            <button
              onClick={() => {
                setEditingEpisode(null);
                setOpen(true);
              }}
              className="flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-white hover:bg-black/85"
            >
              <Plus size={16} />
              Create
            </button>
          )}
        </div>

        <div className="border-b border-gray-200" />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <label
          htmlFor="episode-series-select"
          className="block text-sm text-gray-700 mb-2"
        >
          Select animation series
        </label>

        <select
          id="episode-series-select"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
          value={selectedSeriesId ?? ""}
          onChange={(e) => setSelectedSeriesId(Number(e.target.value))}
        >
          <option value="">Choose series</option>
          {/* Render creator's available series */}
          {mySeries.map((series: Series) => (
            <option key={series.id} value={series.id}>
              {series.title}
            </option>
          ))}
        </select>
      </div>

      {/* Episodes table */}
      {selectedSeriesId &&
        (isLoading ? (
          <div className="text-gray-500">Loading...</div>
        ) : (
          <AdminTable data={episodes} columns={columns} />
        ))}

      {/* Create / Edit modal */}
      <AdminModal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditingEpisode(null);
        }}
        title={editingEpisode ? "Edit Episode" : "Create Episode"}
      >
        {selectedSeriesId && (
          <EpisodeForm
            seriesId={selectedSeriesId}
            initialValues={editingEpisode || undefined}
            submitLabel={editingEpisode ? "Update" : "Create"}
            isEdit={!!editingEpisode}
            // Create form handler
            onCreate={async (values) => {
              await createMutation.mutateAsync(values);
            }}
            // Update form handler
            onUpdate={async (values) => {
              await updateMutation.mutateAsync({
                id: editingEpisode!.id,
                dto: values,
              });
            }}
          />
        )}
      </AdminModal>

      {/* Delete confirmation modal */}
      <ConfirmModal
        open={deleteId !== null}
        title="Delete episode"
        description="Are you sure you want to delete this episode?"
        onConfirm={confirmDelete}
        onClose={() => setDeleteId(null)}
        loading={isDeleting}
      />
    </div>
  );
}
