"use client";

import { useEffect } from "react";

// Registra o service worker em segundo plano (ver public/sw.js) — não
// renderiza nada. É essa peça que faz o navegador considerar o site
// "instalável" como app.
export default function RegistrarServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Navegador antigo, modo privado etc. — o site continua funcionando
        // normal, só sem o recurso de instalar como app.
      });
    }
  }, []);

  return null;
}
