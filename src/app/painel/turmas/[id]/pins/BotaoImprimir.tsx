"use client";

export default function BotaoImprimir() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-lg bg-[#1a3fd4] px-4 py-2 text-sm font-bold text-white print:hidden"
    >
      🖨️ Imprimir
    </button>
  );
}
