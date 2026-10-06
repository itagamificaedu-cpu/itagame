"use client";

import { useEffect, useState } from "react";

// Desestímulo contra print e repasse de tela para quem usa o login
// compartilhado dos professores. Nenhum site consegue impedir de verdade uma
// foto ou captura de tela; o que dá para fazer é: marca d'água com data e hora
// em cima de tudo (qualquer imagem que vazar mostra quando foi tirada), bloquear
// impressão e "salvar como PDF", e desligar seleção de texto e menu do botão
// direito.
function agora() {
  return new Date().toLocaleString("pt-BR", { timeZone: "America/Fortaleza", dateStyle: "short", timeStyle: "short" });
}

export default function ProtecaoColaborador() {
  const [hora, setHora] = useState(agora);

  useEffect(() => {
    const relogio = setInterval(() => setHora(agora()), 30000);

    const barrar = (e: Event) => e.preventDefault();
    document.addEventListener("contextmenu", barrar);
    document.addEventListener("copy", barrar);
    document.addEventListener("dragstart", barrar);

    // Tecla Print Screen: limpa a área de transferência logo depois.
    const aoSoltarTecla = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen") {
        navigator.clipboard?.writeText("").catch(() => {});
      }
    };
    document.addEventListener("keyup", aoSoltarTecla);

    return () => {
      clearInterval(relogio);
      document.removeEventListener("contextmenu", barrar);
      document.removeEventListener("copy", barrar);
      document.removeEventListener("dragstart", barrar);
      document.removeEventListener("keyup", aoSoltarTecla);
    };
  }, []);

  const texto = `SPAECE · uso restrito · ${hora}`;

  return (
    <>
      <style>{`
        body { -webkit-user-select: none; user-select: none; }
        input, textarea, select { -webkit-user-select: text; user-select: text; }
        @media print { html { display: none !important; } }
      `}</style>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
        style={{ opacity: 0.1 }}
      >
        <div
          className="absolute -inset-1/2 flex flex-wrap content-start gap-x-16 gap-y-14"
          style={{ transform: "rotate(-24deg)" }}
        >
          {Array.from({ length: 140 }, (_, i) => (
            <span key={i} className="whitespace-nowrap text-sm font-bold text-neutral-900">
              {texto}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
