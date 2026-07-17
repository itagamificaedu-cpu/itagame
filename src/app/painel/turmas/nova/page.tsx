"use client";

import { useActionState } from "react";
import Link from "next/link";
import { criarTurma } from "@/app/actions/turmas";

export default function PaginaNovaTurma() {
  const [estado, action, pendente] = useActionState(criarTurma, undefined);

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/painel/turmas" className="text-sm font-semibold text-[#1a3fd4]">
          ← Minhas turmas
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-neutral-900">Nova turma</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Crie a turma e depois adicione os alunos na tela seguinte.
        </p>

        <form action={action} className="mt-8 space-y-5 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          <div>
            <label htmlFor="nome" className="text-sm font-medium text-neutral-700">
              Nome da turma
            </label>
            <input
              id="nome"
              name="nome"
              type="text"
              placeholder="Ex: 6º Ano A"
              required
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
            />
            {estado?.erros?.nome && <p className="mt-1 text-xs text-red-600">{estado.erros.nome[0]}</p>}
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

          {estado?.mensagem && <p className="text-sm text-red-600">{estado.mensagem}</p>}

          <button
            type="submit"
            disabled={pendente}
            className="w-full rounded-lg bg-[#1a3fd4] py-2.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {pendente ? "Criando..." : "Criar turma"}
          </button>
        </form>
      </div>
    </main>
  );
}
