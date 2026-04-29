import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSeries,
  deleteSeries,
  getSeries,
  updateSeries,
} from "../../../api/endpoints/series.api";
import { getProducts } from "../../../api/endpoints/products.api";
import { useAuthStore } from "../../auth/store/auth.store";
import type { Product } from "../../products/types";
import type { Series } from "../../series/types";
import SeriesForm from "../components/SeriesForm";
import { useMemo, useState } from "react";
import { showSuccess, showError } from "../../../components/ui/toast";
import AdminTable from "../../../components/admin/AdminTable";
import AdminModal from "../../../components/admin/AdminModal";
import ActionMenu from "../../../components/ui/ActionMenu";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { Plus } from "lucide-react";

// Function to manage series for a creator, allowing them to create, update, and delete series they have created or that are associated with their products.
export default function CreatorSeriesPage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  // Controls create/edit modal visibility
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Series | null>(null);

  // Stores the series currently being edited and loading state for delete operation
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch all products from backend
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  // Fetch all series from backend
  const { data: seriesList = [], isLoading } = useQuery({
    queryKey: ["series"],
    queryFn: getSeries,
  });

  // Filter only products owned by the current creator
  const myProducts = useMemo(
    () => products.filter((p: Product) => p.creatorId === user?.userId),
    [products, user?.userId]
  );

  // Extract product ids for matching series access
  const myProductIds = myProducts.map((p) => p.id);

  // Filter creator's own series
  // Also include series connected to creator-owned products
  const mySeries = useMemo(
    () =>
      seriesList.filter(
        (s: Series) =>
          s.creatorId === user?.userId ||
          (s.productId && myProductIds.includes(s.productId))
      ),
    [seriesList, user?.userId, myProductIds]
  );

  // Create series mutation
  const createMutation = useMutation({
    mutationFn: createSeries,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["series"] });
      showSuccess("Series created");
      setOpen(false);
    },
  });

  // Update series mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: any }) =>
      updateSeries(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["series"] });
      showSuccess("Series updated");
      setEditing(null);
      setOpen(false);
    },
  });

  // Confirm delete function with error handling
  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      await deleteSeries(deleteId);

      showSuccess("Series deleted");
      queryClient.invalidateQueries({ queryKey: ["series"] });

      setDeleteId(null);
    } catch {
      showError("Failed to delete series");
    } finally {
      setIsDeleting(false);
    }
  };

  // Define table columns with custom renderers for series details and actions
  const columns = [
    {
      header: "Series",
      // Cover image + title column
      render: (s: Series) => (
        <div className="flex items-center gap-3 min-w-0">
          {/* Show cover image if available */}
          {s.coverImageUrl ? (
            <img
              src={s.coverImageUrl}
              alt={`Cover image for ${s.title}`}
              className="h-11 w-11 rounded-lg object-cover bg-gray-100"
            />
          ) : (
            // Fallback placeholder if no cover exists
            <div
              role="img"
              aria-label="No series cover image"
              className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-200 text-[10px] text-gray-500"
            >
              IMG
            </div>
          )}

          <span className="truncate font-medium text-gray-900">{s.title}</span>
        </div>
      ),
    },
    {
      header: "Description",
      // Series description column
      render: (s: Series) => (
        <span className="block max-w-105 truncate text-gray-500">
          {s.description}
        </span>
      ),
    },
    {
      header: "Product",
      // Shows linked premium product or Free if no product is associated
      render: (s: Series) => {
        const product = myProducts.find((p) => p.id === s.productId);
        return (
          <span className="text-gray-700">
            {product ? product.title : "Free"}
          </span>
        );
      },
    },
    {
      header: "Action",
      className: "w-[90px]",
      // Edit/Delete dropdown actions
      render: (s: Series) => (
        <ActionMenu
          actions={[
            {
              label: "Edit",
              onClick: () => {
                setEditing(s);
                setOpen(true);
              },
            },
            {
              label: "Delete",
              variant: "danger",
              onClick: () => setDeleteId(s.id),
            },
          ]}
        />
      ),
    },
  ];

  // Show loading state while fetching series
  if (isLoading) return <div className="p-6">Loading...</div>;

  // Main render of the series management page with header, table, and modals for create/edit and delete confirmation
  return (
    <div className="space-y-6">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Series</h1>

          <button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-white hover:bg-black/85"
          >
            <Plus size={16} />
            Create
          </button>
        </div>

        <div className="border-b border-gray-200" />
      </div>

      <AdminTable data={mySeries} columns={columns} />

      <AdminModal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        title={editing ? "Edit Series" : "Create Series"}
      >
        <SeriesForm
          products={myProducts}
          initialValues={editing || undefined}
          submitLabel={editing ? "Update" : "Create"}
          isEdit={!!editing}
          onSubmit={(values) =>
            editing
              ? updateMutation.mutateAsync({
                  id: editing.id,
                  dto: values,
                })
              : createMutation.mutateAsync(values)
          }
        />
      </AdminModal>

      <ConfirmModal
        open={deleteId !== null}
        title="Delete series"
        description="Are you sure you want to delete this series?"
        onConfirm={confirmDelete}
        onClose={() => setDeleteId(null)}
        loading={isDeleting}
      />
    </div>
  );
}
