"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { criarConteudoSpaeceMatematicaDoBanco } from "@/app/actions/trilhas";
import type { EixoSpaece9Ano } from "@/lib/spaece";

// Botão "1 clique" que monta Trilha + Simulado + Cabo de Guerra de um eixo
// de Matemática direto do banco de questões originais (sem IA) — ver
// criarConteudoSpaeceMatematicaDoBanco em actions/trilhas.ts. Diferente do
// BotaoGerarAtividadeSpaece (que chama a Anthropic), esse exige escolher a
// turma antes porque a Trilha precisa de turmaId.
export function BotaoCriarConteudoSpaeceMatematica({
  eixoChave,
  turmas,
  cor,
  corEscura,
}: {
  eixoChave: EixoSpaece9Ano;
  turmas: { id: string; nome: string }[];
  cor: string;
  corEscura: string;
}) {
  const [turmaId, setTurmaId] = useState(turmas[0]?.id ?? "");
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciarTransicao] = useTransition();
  const router = useRouter();

  if (turmas.length === 0) return null;

  function criar() {
    setErro(null);
    iniciarTransicao(async () => {
      const resultado = await criarConteudoSpaeceMatematicaDoBanco({ eixoChave, turmaId });
      if (!resultado.ok) {
        setErro(resultado.erro);
        return;
      }
      router.push(`/painel/trilhas/${resultado.trilhaId}`);
    });
  }

  return (
    <div className="mt-3 rounded-lg border-2 p-2" style={{ borderColor: cor }}>
      <p className="text-xs font-bold" style={{ color: corEscura }}>
        📚 Banco oficial SPAECE (sem IA)
      </p>
      <p className="mt-0.5 text-[11px] text-neutral-500">
        Cria de uma vez a Trilha, o Simulado e o Cabo de Guerra desse eixo com questões já prontas.
      </p>
      <div className="mt-2 flex gap-1.5">
        <select
          value={turmaId}
          onChange={(e) => setTurmaId(e.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-neutral-300 bg-white px-2 py-2 text-xs text-neutral-700 focus:outline-none"
        >
          {turmas.map((turma) => (
            <option key={turma.id} value={turma.id}>
              {turma.nome}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={criar}
          disabled={pendente || !turmaId}
          className="shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-bold text-white transition hover:brightness-95 disabled:opacity-60"
          style={{ backgroundColor: cor }}
        >
          {pendente ? "Criando..." : "Criar tudo"}
        </button>
      </div>
      {erro && <p className="mt-1 text-xs text-red-600">{erro}</p>}
    </div>
  );
}
