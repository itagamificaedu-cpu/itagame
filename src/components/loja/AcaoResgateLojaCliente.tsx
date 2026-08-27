"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { marcarResgateEntregue, cancelarResgate } from "@/app/actions/loja";

export function AcaoResgateLojaCliente({ resgateId }: { resgateId: string }) {
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciarTransicao] = useTransition();
  const router = useRouter();

  function agir(acao: "entregar" | "cancelar") {
    setErro(null);
    iniciarTransicao(async () => {
      const resultado = acao === "entregar" ? await marcarResgateEntregue(resgateId) : await cancelarResgate(resgateId);
      if (!resultado.ok) {
        setErro(resultado.erro);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => agir("entregar")}
          disabled={pendente}
          className="whitespace-nowrap rounded-lg bg-[#00c264] px-3 py-1.5 text-xs font-bold text-white hover:brightness-105 disabled:opacity-60"
        >
          ✅ Entregar
        </button>
        <button
          type="button"
          onClick={() => agir("cancelar")}
          disabled={pendente}
          className="whitespace-nowrap rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-60"
        >
          ❌ Cancelar
        </button>
      </div>
      {erro && <p className="text-xs text-red-600">{erro}</p>}
    </div>
  );
}
