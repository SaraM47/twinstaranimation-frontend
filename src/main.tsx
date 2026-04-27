import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./app/router/routes";
import AppProviders from "./app/providers/AppProviders";
import { Toaster } from "react-hot-toast";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppProviders>
        <RouterProvider router={router} />

        {/* Global toast system */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#000",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
            },
          }}
        />
      </AppProviders>
    </QueryClientProvider>
  </React.StrictMode>
);