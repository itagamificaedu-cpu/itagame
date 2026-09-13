"use client";

export function BotaoImprimirMapa() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-lg bg-[#1a3fd4] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:brightness-110 print:hidden"
    >
      🖨️ Imprimir / salvar em PDF
    </button>
  );
}
