"use client";

import { useState } from "react";

// Botão pra copiar o link de acesso do aluno (/entrar-trilha) — usa
// window.location.origin em vez de fixar o domínio, então funciona igual em
// qualquer ambiente (produção, preview etc.).
export default function CopiarLinkTrilhaCliente() {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    const link = `${window.location.origin}/entrar-trilha`;
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      // navegador sem permissão de clipboard — evita quebrar o botão
    }
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copiar}
      className="mt-3 rounded-lg bg-[#1a3fd4] px-4 py-2 text-sm font-bold text-white hover:brightness-110"
    >
      {copiado ? "✅ Link copiado!" : "📋 Acesse a trilha (copiar link)"}
    </button>
  );
}
