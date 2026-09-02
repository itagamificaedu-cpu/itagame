import { ImageResponse } from "next/og";

// Ícone do app (usado na aba do navegador em telas modernas e no manifest
// do PWA). Fundo quadrado de ponta a ponta — não arredondamos aqui porque o
// Android aplica sua própria máscara de recorte quando o ícone é instalado.
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a3fd4 0%, #0e2694 100%)",
        }}
      >
        <div style={{ fontSize: 260, display: "flex" }}>🎮</div>
      </div>
    ),
    { ...size }
  );
}
