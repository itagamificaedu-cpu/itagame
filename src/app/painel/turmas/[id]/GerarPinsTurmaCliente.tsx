"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { gerarPinsDaTurma } from "@/app/actions/trilhaAcesso";

// Gera o PIN de todos os alunos que ainda não têm e abre a lista pra imprimir.
export default function GerarPinsTurmaCliente({ turmaId, semPin }: { turmaId: string; semPin: number }) {
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [pendente, iniciarTransicao] = useTransition();

  function gerar() {
    setMensagem(null);
    iniciarTransicao(async () => {
      const resultado = await gerarPinsDaTurma(turmaId);
      setMensagem(resultado.ok ? `${resultado.gerados} PIN(s) gerado(s).` : resultado.erro);
    });
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-3">
      {semPin > 0 && (
        <button
          type="button"
          onClick={gerar}
          disabled={pendente}
          className="rounded-lg bg-[#1a3fd4] px-4 py-2 text-xs font-bold text-white hover:brightness-110 disabled:opacity-50"
        >
          {pendente ? "Gerando..." : `🔑 Gerar PIN de todos (${semPin} sem PIN)`}
        </button>
      )}
      <Link
        href={`/painel/turmas/${turmaId}/pins`}
        className="rounded-lg border border-[#1a3fd4] px-4 py-2 text-xs font-bold text-[#1a3fd4] hover:bg-[#1a3fd4]/5"
      >
        🖨️ Lista de PINs para imprimir
      </Link>
      {mensagem && <span className="text-xs font-semibold text-[#00854a]">{mensagem}</span>}
    </div>
  );
}
