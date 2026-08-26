"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { avaliarMissao } from "@/app/actions/missoes";

export function AvaliarEntregaCliente({ progressoId }: { progressoId: string }) {
  const [feedback, setFeedback] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciarTransicao] = useTransition();
  const router = useRouter();

  function avaliar(aprovado: boolean) {
    setErro(null);
    iniciarTransicao(async () => {
      const resultado = await avaliarMissao(progressoId, aprovado, feedback);
      if (!resultado.ok) {
        setErro(resultado.erro);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="mt-3 space-y-2">
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Feedback pro aluno (opcional)"
        rows={2}
        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => avaliar(true)}
          disabled={pendente}
          className="flex-1 rounded-lg bg-[#00c264] py-2 text-sm font-bold text-white hover:brightness-105 disabled:opacity-60"
        >
          ✅ Aprovar
        </button>
        <button
          type="button"
          onClick={() => avaliar(false)}
          disabled={pendente}
          className="flex-1 rounded-lg border border-red-200 py-2 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-60"
        >
          ❌ Reprovar
        </button>
      </div>
      {erro && <p className="text-xs text-red-600">{erro}</p>}
    </div>
  );
}
