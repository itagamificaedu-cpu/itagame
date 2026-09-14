"use client";

import { BotaoImprimirCurso } from "./BotaoImprimirCurso";
import type { AtividadeGuiadaCurso } from "@/lib/cursoBnccComputacao";

// Ficha imprimível pro ALUNO — derivada da mesma atividade guiada que o
// professor usa (nome, objetivo, passo a passo), sem inventar conteúdo
// novo: cada etapa do passo a passo vira um espaço de registro/desenho.
// Não é a atividade em si (que continua sendo desplugada, aplicada
// fisicamente em sala) — é o material de apoio que o professor imprime e
// distribui pra cada aluno preencher enquanto participa.
export function FichaAlunoImprimivel({ atividade }: { atividade: AtividadeGuiadaCurso }) {
  return (
    <div>
      <div className="mb-4 print:hidden">
        <BotaoImprimirCurso texto="🖨️ Imprimir ficha do aluno" />
      </div>

      <div className="rounded-2xl border-2 border-neutral-200 bg-white p-8 print:rounded-none print:border-0">
        <p className="text-xs font-bold uppercase tracking-wide text-[#1a3fd4]">
          Ficha do Aluno · Curso de Formação BNCC Computação
        </p>
        <h1 className="mt-1 text-2xl font-extrabold text-neutral-900">{atividade.nome}</h1>
        <p className="mt-1 text-xs text-neutral-500">Faixa etária: {atividade.faixaEtaria}</p>

        <div className="mt-4 grid grid-cols-1 gap-3 border-y border-neutral-200 py-3 text-sm sm:grid-cols-3">
          <p>
            Nome: <span className="inline-block w-full border-b border-neutral-300">&nbsp;</span>
          </p>
          <p>
            Turma: <span className="inline-block w-full border-b border-neutral-300">&nbsp;</span>
          </p>
          <p>
            Data: <span className="inline-block w-full border-b border-neutral-300">&nbsp;</span>
          </p>
        </div>

        <div className="mt-4 rounded-xl bg-neutral-50 p-4">
          <p className="text-sm text-neutral-700">
            <span className="font-bold">O que vamos fazer hoje:</span> {atividade.objetivo}
          </p>
        </div>

        <p className="mt-6 text-sm font-bold text-neutral-800">
          Vá registrando aqui (com palavras ou desenho) enquanto participa de cada etapa:
        </p>
        <div className="mt-3 space-y-6">
          {atividade.passoAPasso.map((passo, indice) => (
            <div key={indice} className="break-inside-avoid">
              <p className="text-sm text-neutral-700">
                <span className="font-bold text-[#1a3fd4]">Etapa {indice + 1}.</span> {passo}
              </p>
              <div className="mt-2 h-20 rounded-lg border border-dashed border-neutral-300 print:h-24" />
            </div>
          ))}
        </div>

        <div className="mt-6 break-inside-avoid">
          <p className="text-sm font-bold text-neutral-800">O que você mais gostou de descobrir nessa atividade?</p>
          <div className="mt-2 h-16 rounded-lg border border-dashed border-neutral-300" />
        </div>

        {atividade.habilidadeBncc && (
          <p className="mt-6 text-xs font-semibold text-neutral-400">{atividade.habilidadeBncc}</p>
        )}
      </div>
    </div>
  );
}
