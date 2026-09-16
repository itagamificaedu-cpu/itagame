"use client";

import { SeletorTurmaSala } from "@/components/comum/SeletorTurmaSala";
import { lancarSimuladoComoSala, type QuestaoParaSala } from "@/app/actions/geradores";

// Botão "lançar como Sala Ao Vivo" pros simulados dos Geradores (BNCC
// Computação, SPAECE/SAEB) — vira uma Atividade tipo quiz de verdade e abre
// a sala normal, com o mesmo XP/ranking das outras atividades da
// plataforma. Diferente do modo "Responder na tela" (que é só o próprio
// professor testando/revisando na hora, sem salvar nada): aqui quem
// responde é a turma de verdade, ao vivo, pelo código da sala.
export function LancarSimuladoComoSala({
  disciplina,
  serie,
  tema,
  questoes,
  turmas,
  cor,
}: {
  disciplina: string;
  serie: string;
  tema: string;
  questoes: QuestaoParaSala[];
  turmas: { id: string; nome: string }[];
  cor: string;
}) {
  return (
    <form action={lancarSimuladoComoSala.bind(null, { disciplina, serie, tema, questoes })} className="space-y-2">
      <SeletorTurmaSala turmas={turmas} />
      <button
        type="submit"
        disabled={questoes.length === 0}
        className="w-full rounded-lg py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-110 disabled:opacity-60"
        style={{ backgroundColor: cor }}
      >
        🎮 Lançar como Sala Ao Vivo
      </button>
      <p className="text-[11px] leading-relaxed text-neutral-400">
        A turma entra pelo código da sala e responde ao vivo — cada acerto conta XP de verdade pro aluno.
      </p>
    </form>
  );
}
