import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  output: "standalone",
  compress: false, // evita buffer de gzip quebrar o streaming SSE de /api/salas/[codigo]/eventos
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
