import { Lock } from "lucide-react";
import { useAuthStore } from "../../auth/store/auth.store";

// Props for ChapterItem component, representing a single chapter in the chapter list
type Props = {
  chapter: any;
  index: number;
};

// ChapterItem component displays chapter information and handles click behavior based on authentication state
export default function ChapterItem({ chapter, index }: Props) {
  const isAuth = useAuthStore((s) => s.isAuthenticated);

  // Click handler for chapter item, only navigates if user is authenticated
  const handleClick = () => {
    if (!isAuth) return;
    window.location.href = `/viewer/${chapter.id}`;
  };

  // The component renders a clickable chapter item with title and index. If the user is not authenticated, it shows a lock icon and tooltip on hover, and the item is styled as disabled.
  return (
    <div
      onClick={handleClick}
      className={`group relative flex items-center gap-10 py-6 border-b border-black transition
        ${
          isAuth
            ? "cursor-pointer hover:bg-black hover:text-white"
            : "cursor-not-allowed opacity-70"
        }`}
    >
      {/* Text */}
      <span className="text-[15px] min-w-[150px]">
        Chapter {index + 1}
      </span>

      <span className="text-[15px]">{chapter.title}</span>

      {/* Lock and tooltip */}
      {!isAuth && (
        <div className="absolute right-4 flex items-center gap-2">
          <Lock size={16} className="text-gray-400" />

          <span className="opacity-0 group-hover:opacity-100 text-xs bg-black text-white px-2 py-1 rounded transition">
            Login to read
          </span>
        </div>
      )}
    </div>
  );
}