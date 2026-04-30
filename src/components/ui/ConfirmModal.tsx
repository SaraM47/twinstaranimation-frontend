import { useEffect } from "react";

// Props for confirmation modal component
type Props = {
  open: boolean; // Controls visibility
  title: string; // Modal title
  description?: string; // Optional explanatory text
  confirmText?: string; // Text for confirm button
  cancelText?: string; // Text for cancel button
  onConfirm: () => void; // Confirm action handler
  onClose: () => void; // Close modal handler
  loading?: boolean; // Loading state for async actions
};

// Modal component used for confirming destructive actions (e.g. delete)
export default function ConfirmModal({
  open,
  title,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onClose,
  loading = false,
}: Props) {
  // Handle ESC key and scroll lock
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Lock scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, onClose]);

  // Do not render if modal is closed
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-description"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        {/* Title */}
        <h2
          id="confirm-modal-title"
          className="text-lg font-semibold text-gray-900"
        >
          {title}
        </h2>

        {/* Description */}
        {description && (
          <p
            id="confirm-modal-description"
            className="mt-2 text-sm text-gray-500"
          >
            {description}
          </p>
        )}

        {/* Actions buttons */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            autoFocus
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-100"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            {loading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}