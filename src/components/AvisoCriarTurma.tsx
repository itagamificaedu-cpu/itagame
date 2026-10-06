"use client";

import Link from "next/link";
import { useState } from "react";

// Aviso para o professor convidado (login compartilhado do SPAECE): antes de
// testar simulados e provas ele precisa criar a própria turma e os alunos.
// Só aparece enquanto ele ainda não tem turma; pode ser fechado.
export function AvisoCriarTurma() {
  const [aberto, setAberto] = useState(true);
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <p className="text-3xl">🏫</p>
        <h2 className="mt-2 text-xl font-extrabold text-neutral-900">Antes de testar, crie sua turma</h2>
        <p className="mt-2 text-sm text-neutral-700">
          Para usar os simulados, a prova cronometrada e as trilhas, você precisa primeiro criar a sua turma e
          cadastrar os nomes dos seus alunos. Leva uns 2 minutos.
        </p>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-neutral-700">
          <li>Clique em <b>Criar minha turma</b> e dê um nome a ela.</li>
          <li>Cole a lista de nomes dos seus alunos.</li>
          <li>Clique em <b>Gerar PIN de todos</b>.</li>
          <li>Volte ao SPAECE e escolha a sua turma no teste.</li>
        </ol>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link
            href="/painel/turmas/nova"
            className="flex-1 rounded-lg bg-[#1f8f4e] px-4 py-2.5 text-center text-sm font-bold text-white hover:brightness-110"
          >
            Criar minha turma
          </Link>
          <button
            type="button"
            onClick={() => setAberto(false)}
            className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
