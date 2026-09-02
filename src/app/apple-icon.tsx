import { ImageResponse } from "next/og";

// Ícone específico pra "Adicionar à Tela de Início" no iPhone/iPad — o iOS
// ignora o manifest do PWA e usa só esse arquivo. Tamanho padrão da Apple.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
        <div style={{ fontSize: 96, display: "flex" }}>🎮</div>
      </div>
    ),
    { ...size }
  );
}
