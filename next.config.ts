import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  output: "standalone",
  compress: false, // evita buffer de gzip quebrar o streaming SSE de /api/salas/[codigo]/eventos
  turbopack: {
    root: path.join(__dirname),
  },
  experimental: {
    serverActions: {
      // Limite padrão do Next é 1MB — pequeno demais pra mandar a imagem do
      // mapa interativo em base64 (até ~1.5MB, ver TAMANHO_MAXIMO_MAPA em
      // actions/missoes.ts) dentro do corpo da server action.
      bodySizeLimit: "3mb",
    },
  },
};

export default nextConfig;
