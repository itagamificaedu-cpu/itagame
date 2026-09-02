import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import RegistrarServiceWorker from "@/components/RegistrarServiceWorker";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ItaGameficaEdu — IA e gamificação para a sua sala de aula",
  description:
    "Gere atividades com IA em segundos, corrija provas e redações automaticamente e transforme a turma em um jogo com ranking ao vivo.",
  // Faz o "Adicionar à Tela de Início" do iPhone abrir em tela cheia, sem
  // barra de navegador — no Android quem faz isso é o manifest.ts.
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ItaGameficaEdu",
  },
};

export const viewport: Viewport = {
  themeColor: "#1a3fd4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white">
        {children}
        <RegistrarServiceWorker />
      </body>
    </html>
  );
}
