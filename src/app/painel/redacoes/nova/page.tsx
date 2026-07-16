"use client";

import { useActionState } from "react";
import Link from "next/link";
import { corrigirRedacao } from "@/app/actions/redacoes";

export default function PaginaNovaCorrecao() {
  const [estado, action, pendente] = useActionState(corrigirRedacao, undefined);

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/painel" className="text-sm font-semibold text-[#1a3fd4]">
          ← Voltar ao painel
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-neutral-900">Corrigir redação com IA</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Cole o tema e o texto do aluno — a IA avalia gramática, coerência, argumentação e
          repertório.
        </p>

        <form action={action} className="mt-8 space-y-5 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          <div>
            <label htmlFor="tema" className="text-sm font-medium text-neutral-700">
              Tema da redação
            </label>
            <input
              id="tema"
              name="tema"
              type="text"
              placeholder="Ex: Os desafios da mobilidade urbana no Brasil"
              required
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
            />
            {estado?.erros?.tema && <p className="mt-1 text-xs text-red-600">{estado.erros.tema[0]}</p>}
          </div>

          <div>
            <label htmlFor="texto" className="text-sm font-medium text-neutral-700">
              Texto da redação
            </label>
            <textarea
              id="texto"
              name="texto"
              rows={14}
              placeholder="Cole aqui o texto completo que o aluno escreveu..."
              required
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
            />
            {estado?.erros?.texto && <p className="mt-1 text-xs text-red-600">{estado.erros.texto[0]}</p>}
          </div>

          {estado?.mensagem && <p className="text-sm text-red-600">{estado.mensagem}</p>}

          <button
            type="submit"
            disabled={pendente}
            className="w-full rounded-lg bg-[#1a3fd4] py-2.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {pendente ? "Corrigindo..." : "Corrigir com IA"}
          </button>
        </form>
      </div>
    </main>
  );
}
