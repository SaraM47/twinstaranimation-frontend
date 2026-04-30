import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// This layout is used for viewer pages like comic reader or animation player. It provides a consistent UI with a top bar and back button.
type Props = {
  children: React.ReactNode;
};

// ViewerLayout component wraps its children with a layout that includes a top bar with a back button and a title, and centers the content in the middle of the screen.
export default function ViewerLayout({ children }: Props) {
  const navigate = useNavigate();

  // This layout uses a black background and white text, with a top bar that has a back button on the left and a title on the right. The main content is centered both vertically and horizontally.
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* Top bar */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <span className="text-sm opacity-70">Viewer</span>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}