import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSeries } from "../../../api/endpoints/series.api";
import {
  createChapter,
  deleteChapter,
  getChaptersBySeries,
  updateChapter,
} from "../../../api/endpoints/chapters.api";
import type { Series, Chapter } from "../../series/types";
import { useAuthStore } from "../../auth/store/auth.store";
import ChapterForm from "../components/ChapterForm";
import { Link } from "react-router-dom";
import { showSuccess, showError } from "../../../components/ui/toast";

import AdminTable from "../../../components/admin/AdminTable";
import AdminModal from "../../../components/admin/AdminModal";
import ActionMenu from "../../../components/ui/ActionMenu";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { Plus } from "lucide-react";

// Function to manage chapters for a creator, allowing them to create, update, and delete chapters associated with their series.
export default function CreatorChaptersPage() {
  // React Query cache controller
  const queryClient = useQueryClient();

  // Current logged-in user
  const user = useAuthStore((s) => s.user);

  // Selected series for chapter management
  const [selectedSeriesId, setSelectedSeriesId] = useState<number | null>(null);

  // Currently edited chapter
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);

  // Controls create/edit modal
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch all series
  const { data: seriesList = [] } = useQuery({
    queryKey: ["series"],
    queryFn: getSeries,
  });

  // Filter only current creator's series
  const mySeries = seriesList.filter(
    (series: Series) => series.creatorId === user?.userId
  );

  // Fetch chapters only when a series is selected
  const { data: chapters = [], isLoading } = useQuery({
    queryKey: ["chapters", selectedSeriesId],
    queryFn: () => getChaptersBySeries(selectedSeriesId as number),
    enabled: !!selectedSeriesId,
  });

  // Create chapter mutation
  const createMutation = useMutation({
    mutationFn: createChapter,
    onSuccess: () => {
      // Refresh chapter list after create
      queryClient.invalidateQueries({
        queryKey: ["chapters", selectedSeriesId],
      });
      showSuccess("Chapter created");
      setOpen(false);
    },
    onError: () => showError("Failed to create chapter"),
  });

  // Update chapter mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: any) => updateChapter(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chapters", selectedSeriesId],
      });
      showSuccess("Chapter updated");
      setEditingChapter(null);
      setOpen(false);
    },
    onError: () => showError("Failed to update chapter"),
  });

  // Confirm delete function
  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);

      // Delete chapter from backend
      await deleteChapter(deleteId);

      showSuccess("Chapter deleted");

      // Refresh chapter list after delete
      queryClient.invalidateQueries({
        queryKey: ["chapters", selectedSeriesId],
      });

      setDeleteId(null);
    } catch (error: any) {
      showError(error?.response?.data?.message || "Failed to delete chapter");
    } finally {
      setIsDeleting(false);
    }
  };

  // Table column configuration
  const columns = [
    {
      header: "Chapter",
      render: (c: Chapter) => (
        <span className="font-medium text-gray-900">{c.title}</span>
      ),
    },
    {
      header: "Order",
      render: (c: Chapter) => (
        <span className="text-gray-700">{c.sortOrder}</span>
      ),
    },
    {
      header: "Media",
      render: (c: Chapter) => (
        <Link
          to={`/creator/media?chapterId=${c.id}&seriesId=${c.seriesId}`}
          className="text-sm text-yellow-600 hover:underline"
        >
          Manage
        </Link>
      ),
    },
    {
      header: "Action",
      className: "w-[90px]",
      render: (c: Chapter) => (
        <ActionMenu
          actions={[
            {
              label: "Edit",
              onClick: () => {
                setEditingChapter(c);
                setOpen(true);
              },
            },
            {
              label: "Delete",
              variant: "danger",
              onClick: () => setDeleteId(c.id),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Chapters</h1>

          {selectedSeriesId && (
            <button
              onClick={() => {
                setEditingChapter(null);
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
          htmlFor="series-select"
          className="block text-sm text-gray-700 mb-2"
        >
          Select series
        </label>

        <select
          id="series-select"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
          value={selectedSeriesId ?? ""}
          onChange={(e) => setSelectedSeriesId(Number(e.target.value))}
        >
          <option value="">Choose series</option>
          {mySeries.map((series: Series) => (
            <option key={series.id} value={series.id}>
              {series.title}
            </option>
          ))}
        </select>
      </div>

      {selectedSeriesId &&
        (isLoading ? (
          <div className="text-gray-500">Loading...</div>
        ) : (
          <AdminTable data={chapters} columns={columns} />
        ))}

      <AdminModal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditingChapter(null);
        }}
        title={editingChapter ? "Edit Chapter" : "Create Chapter"}
      >
        {selectedSeriesId && (
          <ChapterForm
            seriesId={selectedSeriesId}
            initialValues={editingChapter || undefined}
            submitLabel={editingChapter ? "Update" : "Create"}
            isEdit={!!editingChapter}
            onCreate={async (values) => {
              await createMutation.mutateAsync(values);
            }}
            onUpdate={async (values) => {
              await updateMutation.mutateAsync({
                id: editingChapter!.id,
                dto: values,
              });
            }}
          />
        )}
      </AdminModal>

      <ConfirmModal
        open={deleteId !== null}
        title="Delete chapter"
        description="Are you sure you want to delete this chapter?"
        onConfirm={confirmDelete}
        onClose={() => setDeleteId(null)}
        loading={isDeleting}
      />
    </div>
  );
}
