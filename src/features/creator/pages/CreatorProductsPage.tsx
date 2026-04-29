import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../../../api/endpoints/products.api";
import { useAuthStore } from "../../auth/store/auth.store";
import ProductForm from "../components/ProductForm";
import type { Product } from "../../products/types";
import { useMemo, useState } from "react";
import { showSuccess, showError } from "../../../components/ui/toast";
import AdminTable from "../../../components/admin/AdminTable";
import AdminModal from "../../../components/admin/AdminModal";
import ActionMenu from "../../../components/ui/ActionMenu";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { Plus } from "lucide-react";

// Page for creators to manage their products, allowing them to create, update, and delete products they have created.
export default function CreatorProductsPage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch all products from backend
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  // Filter only products created by the current creator
  const myProducts = useMemo(
    () => products.filter((p: Product) => p.creatorId === user?.userId),
    [products, user?.userId]
  );

  // Create product mutation
  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      showSuccess("Product created");
      setOpen(false);
    },
    onError: () => showError("Failed to create product"),
  });

  // Update product mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: any }) =>
      updateProduct(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      showSuccess("Product updated");
      setEditing(null);
      setOpen(false);
    },
    onError: () => showError("Failed to update product"),
  });

  // Delete product handler with confirmation modal
  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      await deleteProduct(deleteId);

      showSuccess("Product deleted");
      queryClient.invalidateQueries({ queryKey: ["products"] });

      setDeleteId(null);
    } catch (error: any) {
      showError(error?.response?.data?.message || "Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  // Define table columns with custom renderers for product image, title, description, price, and action menu
  const columns = [
    {
      header: "Product",
      render: (p: Product) => (
        <div className="flex items-center gap-3 min-w-0">
          {/* Show product image if available */}
          {p.imageUrl ? (
            <img
              src={p.imageUrl}
              alt={p.title || "Product"}
              className="h-11 w-11 rounded-lg object-cover bg-gray-100"
            />
          ) : (
            // Fallback placeholder if no image exists
            <div
              role="img"
              aria-label="No product image available"
              className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-200 text-[10px] text-gray-500"
            >
              IMG
            </div>
          )}
          <span className="truncate font-medium text-gray-900">{p.title}</span>
        </div>
      ),
    },
    {
      header: "Description",
      // Product description column
      render: (p: Product) => (
        <span className="block max-w-105 truncate text-gray-500">
          {p.description}
        </span>
      ),
    },
    {
      header: "Price",
      className: "whitespace-nowrap",
      // Product price column with USD suffix
      render: (p: Product) => (
        <span className="font-medium text-gray-900">{p.price} USD</span>
      ),
    },
    {
      header: "Action",
      className: "w-[90px]",
      // Edit/Delete dropdown actions
      render: (p: Product) => (
        <ActionMenu
          actions={[
            {
              label: "Edit",
              onClick: () => {
                setEditing(p);
                setOpen(true);
              },
            },
            {
              label: "Delete",
              variant: "danger",
              onClick: () => setDeleteId(p.id),
            },
          ]}
        />
      ),
    },
  ];

  // Loading state before rendering content
  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>

          {/* Create new product button */}
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

      {/* Products table */}
      <AdminTable data={myProducts} columns={columns} />

      {/* Create / Edit modal */}
      <AdminModal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        title={editing ? "Edit Product" : "Create Product"}
      >
        <ProductForm
          initialValues={editing || undefined}
          submitLabel={editing ? "Update" : "Create"}
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

      {/* Delete confirmation modal */}
      <ConfirmModal
        open={deleteId !== null}
        title="Delete product"
        description="Are you sure you want to delete this product?"
        onConfirm={confirmDelete}
        onClose={() => setDeleteId(null)}
        loading={isDeleting}
      />
    </div>
  );
}
