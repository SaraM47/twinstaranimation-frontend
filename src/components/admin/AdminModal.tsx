import { X } from "lucide-react";

// Props passed into modal component
type Props = {
  open: boolean; // Controls if modal is visible
  onClose: () => void; // Function to close modal
  title: string; // Modal title
  children: React.ReactNode; // Modal content
};

// Modal compontent for admin page
export default function AdminModal({ open, onClose, title, children }: Props) {
  // If modal is not open, render nothing
  if (!open) return null;

  return (
    // Background overlay behind modal
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {/* Main modal box */}
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

          {/* Close button */}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black text-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal body content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
