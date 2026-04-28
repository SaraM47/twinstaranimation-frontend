import { createBrowserRouter } from "react-router-dom";

// Layouts 
import PublicLayout from "../../components/layout/PublicLayout";
import DashboardLayout from "../../components/layout/DashboardLayout";

// Auth
import LoginPage from "../../features/auth/pages/LoginPage";
import RegisterPage from "../../features/auth/pages/RegisterPage";

// Public pages
import HomePage from "../../pages/HomePage";
import ProductsPage from "../../pages/ProductsPage";
import ProductDetailsPage from "../../pages/ProductDetailsPage";
import AnimationPage from "../../pages/AnimationPage";
import AnimationDetailsPage from "../../pages/AnimationDetailsPage";
import ComicsPage from "../../pages/ComicsPage";
import ComicDetailsPage from "../../pages/ComicDetailsPage";
import SupportPage from "../../pages/SupportPage";

// Customer
import SeriesDetailsPage from "../../pages/SeriesDetailsPage";
import MyOrdersPage from "../../features/orders/pages/MyOrdersPage";

// Viewer
import PageViewerPage from "../../features/viewer/PageViewerPage";
import VideoViewerPage from "../../features/viewer/VideoViewerPage";

// Creator
import CreatorDashboardPage from "../../features/creator/pages/CreatorDashboardPage";
import CreatorProductsPage from "../../features/creator/pages/CreatorProductsPage";
import CreatorSeriesPage from "../../features/creator/pages/CreatorSeriesPage";
import CreatorChaptersPage from "../../features/creator/pages/CreatorChaptersPage";
import CreatorEpisodesPage from "../../features/creator/pages/CreatorEpisodesPage";
import CreatorMediaPage from "../../features/creator/pages/CreatorMediaPage";

// Guards
import ProtectedRoute from "./guards/ProtectedRoute";
import RoleRoute from "./guards/RoleRoute";

export const router = createBrowserRouter([
  // Auth
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },

  // Public 
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },

      { path: "products", element: <ProductsPage /> },
      { path: "products/:id", element: <ProductDetailsPage /> },

      { path: "animation", element: <AnimationPage /> },
      { path: "animation/:id", element: <AnimationDetailsPage /> },

      { path: "comics", element: <ComicsPage /> },
      { path: "comics/:id", element: <ComicDetailsPage /> },

      { path: "support", element: <SupportPage /> },
    ],
  },

  // Customer protected routes
  {
    path: "/orders",
    element: (
      <ProtectedRoute>
        <RoleRoute role="Customer">
          <MyOrdersPage />
        </RoleRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/series/:id",
    element: (
      <ProtectedRoute>
        <SeriesDetailsPage />
      </ProtectedRoute>
    ),
  },

  // Viewer protected routes
  {
    path: "/viewer/pages/:chapterId",
    element: (
      <ProtectedRoute>
        <PageViewerPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/viewer/videos/:chapterId",
    element: (
      <ProtectedRoute>
        <VideoViewerPage />
      </ProtectedRoute>
    ),
  },

  // Creator panel
  {
    path: "/creator",
    element: (
      <ProtectedRoute>
        <RoleRoute role="Creator">
          <DashboardLayout />
        </RoleRoute>
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <CreatorDashboardPage /> },
      { path: "products", element: <CreatorProductsPage /> },
      { path: "series", element: <CreatorSeriesPage /> },
      { path: "chapters", element: <CreatorChaptersPage /> },
      { path: "episodes", element: <CreatorEpisodesPage /> },
      { path: "media", element: <CreatorMediaPage /> },
    ],
  },

  // Fallback route
  {
    path: "*",
    element: <HomePage />,
  },
]);