"use client";

import { useActionState } from "react";
import Link from "next/link";
import { gerarAtividade } from "@/app/actions/atividades";

export default function PaginaNovaAtividade() {
  const [estado, action, pendente] = useActionState(gerarAtividade, undefined);

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/painel" className="text-sm font-semibold text-[#1a3fd4]">
          ← Voltar ao painel
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-neutral-900">Gerar atividade com IA</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Descreva o tema e a IA monta as questões prontas para aplicar em sala.
        </p>

        <form action={action} className="mt-8 space-y-5 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          <div>
            <label htmlFor="tipo" className="text-sm font-medium text-neutral-700">
              Tipo de atividade
            </label>
            <select
              id="tipo"
              name="tipo"
              defaultValue="quiz"
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
            >
              <option value="quiz">Quiz (múltipla escolha)</option>
              <option value="verdadeiro_falso">Verdadeiro ou falso</option>
            </select>
            {estado?.erros?.tipo && <p className="mt-1 text-xs text-red-600">{estado.erros.tipo[0]}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="disciplina" className="text-sm font-medium text-neutral-700">
                Disciplina
              </label>
              <input
                id="disciplina"
                name="disciplina"
                type="text"
                placeholder="Ex: Matemática"
                required
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
              />
              {estado?.erros?.disciplina && (
                <p className="mt-1 text-xs text-red-600">{estado.erros.disciplina[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="serie" className="text-sm font-medium text-neutral-700">
                Série/ano
              </label>
              <input
                id="serie"
                name="serie"
                type="text"
                placeholder="Ex: 6º ano"
                required
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
              />
              {estado?.erros?.serie && <p className="mt-1 text-xs text-red-600">{estado.erros.serie[0]}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="tema" className="text-sm font-medium text-neutral-700">
              Tema da atividade
            </label>
            <input
              id="tema"
              name="tema"
              type="text"
              placeholder="Ex: Frações equivalentes"
              required
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
            />
            {estado?.erros?.tema && <p className="mt-1 text-xs text-red-600">{estado.erros.tema[0]}</p>}
          </div>

          <div>
            <label htmlFor="quantidadeQuestoes" className="text-sm font-medium text-neutral-700">
              Quantidade de questões
            </label>
            <input
              id="quantidadeQuestoes"
              name="quantidadeQuestoes"
              type="number"
              min={3}
              max={15}
              defaultValue={5}
              required
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
            />
            {estado?.erros?.quantidadeQuestoes && (
              <p className="mt-1 text-xs text-red-600">{estado.erros.quantidadeQuestoes[0]}</p>
            )}
          </div>

          {estado?.mensagem && <p className="text-sm text-red-600">{estado.mensagem}</p>}

          <button
            type="submit"
            disabled={pendente}
            className="w-full rounded-lg bg-[#1a3fd4] py-2.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {pendente ? "Gerando atividade..." : "Gerar atividade"}
          </button>
        </form>
      </div>
    </main>
  );
}
