type Props = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
  };
  
  export default function DeleteModal({
    open,
    onClose,
    onConfirm,
    title = "Delete product",
    description = "Are you sure you want to delete this product? This action cannot be undone.",
  }: Props) {
    if (!open) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
  
        <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 space-y-4">
  
          <h2 className="text-lg font-semibold">{title}</h2>
  
          <p className="text-sm text-gray-500">{description}</p>
  
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
  
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
  
        </div>
      </div>
    );
  }