"use client";

import { useState, useTransition } from "react";
import { gerarPinAluno } from "@/app/actions/trilhaAcesso";

export default function GerarPinCliente({
  turmaId,
  alunoId,
  temPin,
}: {
  turmaId: string;
  alunoId: string;
  temPin: boolean;
}) {
  const [pin, setPin] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciarTransicao] = useTransition();

  function gerar() {
    setErro(null);
    iniciarTransicao(async () => {
      const resultado = await gerarPinAluno(turmaId, alunoId);
      if (resultado.ok) {
        setPin(resultado.pin);
      } else {
        setErro(resultado.erro);
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      {pin ? (
        <span className="rounded-md bg-[#00c264]/10 px-2 py-1 text-xs font-bold text-[#00854a]">
          PIN: {pin}
        </span>
      ) : (
        <button
          type="button"
          onClick={gerar}
          disabled={pendente}
          className="text-xs font-semibold text-[#1a3fd4] hover:underline disabled:opacity-60"
        >
          {pendente ? "Gerando..." : temPin ? "Gerar novo PIN" : "Gerar PIN"}
        </button>
      )}
      {erro && <span className="text-xs text-red-600">{erro}</span>}
    </div>
  );
}
