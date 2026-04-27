import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    port: 5174,

    proxy: {
      "/api": {
        target: "http://localhost:5066", // backend
        changeOrigin: true,
        secure: false,

        // important to handle cookies correctly
        cookieDomainRewrite: "localhost",

        // forward cookies from client to backend
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            if (req.headers.cookie) {
              proxyReq.setHeader("cookie", req.headers.cookie);
            }
          });
        },
      },
    },
  },
});