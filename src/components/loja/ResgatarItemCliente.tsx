"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { resgatarItem } from "@/app/actions/loja";

export function ResgatarItemCliente({
  itemId,
  xpTotal,
  custoXp,
  estoqueEsgotado,
}: {
  itemId: string;
  xpTotal: number;
  custoXp: number;
  estoqueEsgotado: boolean;
}) {
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciarTransicao] = useTransition();
  const router = useRouter();

  function resgatar() {
    setErro(null);
    iniciarTransicao(async () => {
      const resultado = await resgatarItem(itemId);
      if (!resultado.ok) {
        setErro(resultado.erro);
        return;
      }
      router.refresh();
    });
  }

  const podeResgatar = !estoqueEsgotado && xpTotal >= custoXp;

  return (
    <div>
      <button
        type="button"
        onClick={resgatar}
        disabled={pendente || !podeResgatar}
        className="w-full rounded-lg bg-[#1a3fd4] py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-40"
      >
        {pendente
          ? "Resgatando..."
          : estoqueEsgotado
            ? "Sem estoque"
            : podeResgatar
              ? "Resgatar"
              : "XP insuficiente"}
      </button>
      {erro && <p className="mt-1 text-xs text-red-600">{erro}</p>}
    </div>
  );
}
