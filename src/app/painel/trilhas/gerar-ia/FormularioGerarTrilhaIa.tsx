"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { gerarTrilhaIa } from "@/app/actions/trilhas";
import type { EixoBnccComputacao } from "@/lib/bnccComputacao";

export default function FormularioGerarTrilhaIa({
  turmas,
  eixo,
}: {
  turmas: { id: string; nome: string }[];
  // Preenchido quando a página é aberta a partir da aba "BNCC Computação" —
  // trava a geração nesse eixo, sem seletor livre.
  eixo?: EixoBnccComputacao;
}) {
  const [turmaId, setTurmaId] = useState("");
  const [nivel, setNivel] = useState("");
  const [tema, setTema] = useState("");
  const [quantidadeMissoes, setQuantidadeMissoes] = useState(5);
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const router = useRouter();

  async function gerar() {
    setErro(null);
    if (!turmaId) {
      setErro("Escolha a turma.");
      return;
    }
    if (!nivel.trim()) {
      setErro("Informe o nível/ano da turma.");
      return;
    }

    setGerando(true);
    const resultado = await gerarTrilhaIa({
      turmaId,
      nivel: nivel.trim(),
      tema: tema.trim() || undefined,
      quantidadeMissoes,
      eixo,
    });
    setGerando(false);

    if (!resultado.ok) {
      setErro(resultado.erro);
      return;
    }
    router.push(`/painel/trilhas/${resultado.trilhaId}`);
  }

  return (
    <div className="mt-8 space-y-5 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
      <div>
        <label className="text-sm font-medium text-neutral-700">Turma</label>
        <select
          value={turmaId}
          onChange={(e) => setTurmaId(e.target.value)}
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
        >
          <option value="">Escolha a turma</option>
          {turmas.map((turma) => (
            <option key={turma.id} value={turma.id}>
              {turma.nome}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-neutral-700">Nível/ano da turma</label>
        <input
          value={nivel}
          onChange={(e) => setNivel(e.target.value)}
          placeholder="Ex: 7º ano, Ensino Médio..."
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-neutral-700">
          {eixo
            ? "Tema dentro desse eixo (opcional — deixe em branco pra IA escolher)"
            : "Tema (opcional — deixe em branco pra IA escolher)"}
        </label>
        <input
          value={tema}
          onChange={(e) => setTema(e.target.value)}
          placeholder="Ex: pensamento computacional com jogos, segurança na internet..."
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-neutral-700">Quantidade de missões</label>
        <input
          type="number"
          min={3}
          max={8}
          value={quantidadeMissoes}
          onChange={(e) => setQuantidadeMissoes(Number(e.target.value))}
          className="mt-1 w-32 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
        />
      </div>

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      <button
        type="button"
        onClick={gerar}
        disabled={gerando}
        className="w-full rounded-lg bg-[#1a3fd4] py-2.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"
      >
        {gerando ? "Gerando trilha com IA... (pode levar até 1 minuto)" : "✨ Gerar trilha"}
      </button>
    </div>
  );
}
