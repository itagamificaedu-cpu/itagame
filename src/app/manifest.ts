import type { MetadataRoute } from "next";

// Manifest do PWA — é isso que deixa o navegador oferecer "Adicionar à tela
// de início" e faz o app abrir em tela cheia (sem barra de endereço), tanto
// pro professor quanto pro aluno. Serve o mesmo app pras duas pontas — cada
// um segue seu próprio fluxo normal (login ou código da turma) a partir da
// home.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ItaGameficaEdu",
    short_name: "ItaGameficaEdu",
    description:
      "Gere atividades com IA, corrija provas e redações, e transforme a turma em um jogo com ranking ao vivo.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    lang: "pt-BR",
    background_color: "#fafafa",
    theme_color: "#1a3fd4",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
