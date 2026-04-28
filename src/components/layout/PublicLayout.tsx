import { Outlet } from "react-router-dom";
import PublicHeader from "./PublicHeader";
import Footer from "./Footer";
import CartPanel from "../cart/CartPanel";

// This layout is used for all public-facing pages (home, comics, products, etc.)
export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#7F13FD] text-white">
      
      <PublicHeader />

      <main>
        <Outlet />
      </main>

      <Footer />

      <CartPanel />
    </div>
  );
}