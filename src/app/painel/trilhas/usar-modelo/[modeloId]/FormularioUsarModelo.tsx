"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { criarTrilhaAPartirDeModelo } from "@/app/actions/trilhas";

export default function FormularioUsarModelo({
  modeloId,
  turmas,
  cor,
}: {
  modeloId: string;
  turmas: { id: string; nome: string }[];
  cor: string;
}) {
  const [turmaId, setTurmaId] = useState("");
  const [criando, setCriando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const router = useRouter();

  async function usarModelo() {
    setErro(null);
    if (!turmaId) {
      setErro("Escolha a turma.");
      return;
    }

    setCriando(true);
    const resultado = await criarTrilhaAPartirDeModelo({ modeloId, turmaId });
    setCriando(false);

    if (!resultado.ok) {
      setErro(resultado.erro);
      return;
    }
    router.push(`/painel/trilhas/${resultado.trilhaId}`);
  }

  return (
    <div className="mt-6 space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div>
        <label className="text-sm font-medium text-neutral-700">Turma</label>
        <select
          value={turmaId}
          onChange={(e) => setTurmaId(e.target.value)}
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-1"
          style={{ borderColor: turmaId ? cor : undefined }}
        >
          <option value="">Escolha a turma</option>
          {turmas.map((turma) => (
            <option key={turma.id} value={turma.id}>
              {turma.nome}
            </option>
          ))}
        </select>
      </div>

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      <button
        type="button"
        onClick={usarModelo}
        disabled={criando}
        className="w-full rounded-lg py-2.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"
        style={{ backgroundColor: cor }}
      >
        {criando ? "Adicionando..." : "+ Adicionar essa trilha na turma"}
      </button>
    </div>
  );
}
