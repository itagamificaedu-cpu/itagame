"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { removerMissao } from "@/app/actions/missoes";

export function RemoverMissaoCliente({ trilhaId, missaoId }: { trilhaId: string; missaoId: string }) {
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciarTransicao] = useTransition();
  const router = useRouter();

  function remover() {
    setErro(null);
    iniciarTransicao(async () => {
      const resultado = await removerMissao(trilhaId, missaoId);
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
        onClick={remover}
        disabled={pendente}
        className="text-xs font-semibold text-red-500 hover:text-red-700 disabled:opacity-60"
      >
        {pendente ? "Removendo..." : "Remover"}
      </button>
      {erro && <p className="text-xs text-red-600">{erro}</p>}
    </div>
  );
}
