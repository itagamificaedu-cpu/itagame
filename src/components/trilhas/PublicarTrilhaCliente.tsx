"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { publicarTrilha } from "@/app/actions/trilhas";

export function PublicarTrilhaCliente({ trilhaId }: { trilhaId: string }) {
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciarTransicao] = useTransition();
  const router = useRouter();

  function publicar() {
    setErro(null);
    iniciarTransicao(async () => {
      const resultado = await publicarTrilha(trilhaId);
      if (!resultado.ok) {
        setErro(resultado.erro);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={publicar}
        disabled={pendente}
        className="whitespace-nowrap rounded-lg bg-[#00c264] px-4 py-2 text-sm font-bold text-white hover:brightness-105 disabled:opacity-60"
      >
        {pendente ? "Publicando..." : "🚀 Publicar trilha"}
      </button>
      {erro && <p className="text-xs text-red-600">{erro}</p>}
    </div>
  );
}
