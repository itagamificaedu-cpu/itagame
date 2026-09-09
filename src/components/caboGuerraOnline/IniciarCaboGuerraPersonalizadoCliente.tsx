"use client";

import { useState } from "react";
import { criarSalaCaboGuerraPersonalizada } from "@/app/actions/caboGuerraOnline";
import { SeletorTurmaSala } from "@/components/comum/SeletorTurmaSala";

type Turma = { id: string; nome: string };

// Versão compacta do seletor de modo (equipes/individual) do
// NovaSalaCaboGuerraCliente.tsx, pra usar direto na tela da atividade —
// antes disso, "Jogar online" aqui só criava sala em modo equipes, sem
// opção de individual (pedido do Genezio).
export function IniciarCaboGuerraPersonalizadoCliente({
  atividadeId,
  turmas,
}: {
  atividadeId: string;
  turmas: Turma[];
}) {
  const [modo, setModo] = useState<"equipes" | "individual">("equipes");
  const [aberto, setAberto] = useState(false);

  if (!aberto) {
    return (
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="whitespace-nowrap rounded-lg border-2 border-[#1a3fd4] px-4 py-2 text-sm font-bold text-[#1a3fd4] hover:bg-[#1a3fd4]/5"
      >
        📱 Jogar online
      </button>
    );
  }

  return (
    <form
      action={criarSalaCaboGuerraPersonalizada.bind(null, atividadeId)}
      className="w-full rounded-xl border border-neutral-200 bg-white p-4"
    >
      <input type="hidden" name="modo" value={modo} />

      <p className="text-xs font-bold text-neutral-500 uppercase">Modo de disputa</p>
      <div className="mt-1 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setModo("equipes")}
          className={`rounded-lg border-2 py-2 text-xs font-extrabold transition ${
            modo === "equipes"
              ? "border-[#1a3fd4] bg-[#1a3fd4]/10 text-[#1a3fd4]"
              : "border-neutral-200 text-neutral-400 hover:border-neutral-300"
          }`}
        >
          🪢 Equipes
        </button>
        <button
          type="button"
          onClick={() => setModo("individual")}
          className={`rounded-lg border-2 py-2 text-xs font-extrabold transition ${
            modo === "individual"
              ? "border-[#1a3fd4] bg-[#1a3fd4]/10 text-[#1a3fd4]"
              : "border-neutral-200 text-neutral-400 hover:border-neutral-300"
          }`}
        >
          🎯 Individual
        </button>
      </div>

      {modo === "equipes" && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <input
            name="nomeEquipe1"
            defaultValue="Equipe Azul"
            maxLength={20}
            className="rounded-lg border border-neutral-300 px-2 py-1.5 text-xs focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
          />
          <input
            name="nomeEquipe2"
            defaultValue="Equipe Vermelha"
            maxLength={20}
            className="rounded-lg border border-neutral-300 px-2 py-1.5 text-xs focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
          />
        </div>
      )}

      <div className="mt-3">
        <SeletorTurmaSala turmas={turmas} />
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => setAberto(false)}
          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-neutral-500 hover:bg-neutral-100"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 rounded-lg bg-[#1a3fd4] py-1.5 text-xs font-bold text-white hover:brightness-110"
        >
          Criar sala
        </button>
      </div>
    </form>
  );
}
