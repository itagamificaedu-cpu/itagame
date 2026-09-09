"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { criarSalaCaboGuerra } from "@/app/actions/caboGuerraOnline";

type Turma = { id: string; nome: string };

export function NovaSalaCaboGuerraCliente({ turmas }: { turmas: Turma[] }) {
  const [estado, action, pendente] = useActionState(criarSalaCaboGuerra, undefined);
  const [modo, setModo] = useState<"equipes" | "individual">("equipes");

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-lg">
        <Link href="/painel/cabo-de-guerra" className="text-sm font-semibold text-[#1a3fd4]">
          ← Voltar
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-neutral-900">🪢 Cabo de Guerra Online</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Cada aluno entra pelo próprio celular e todos competem juntos.
        </p>

        <form action={action} className="mt-8 space-y-5 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          <div>
            <span className="text-sm font-medium text-neutral-700">Modo de disputa</span>
            <input type="hidden" name="modo" value={modo} />
            <div className="mt-1 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setModo("equipes")}
                className={`rounded-xl border-2 py-3 text-sm font-extrabold transition ${
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
                className={`rounded-xl border-2 py-3 text-sm font-extrabold transition ${
                  modo === "individual"
                    ? "border-[#1a3fd4] bg-[#1a3fd4]/10 text-[#1a3fd4]"
                    : "border-neutral-200 text-neutral-400 hover:border-neutral-300"
                }`}
              >
                🎯 Individual
              </button>
            </div>
            <p className="mt-1 text-xs text-neutral-400">
              {modo === "equipes"
                ? "Dois times puxam a corda — quem responde primeiro pontua pro time."
                : "Cada aluno compete sozinho, num ranking ao vivo — sem times."}
            </p>
          </div>

          {modo === "equipes" && (
            <>
              <div>
                <label htmlFor="nomeEquipe1" className="text-sm font-medium text-neutral-700">
                  🔵 Nome da equipe 1
                </label>
                <input
                  id="nomeEquipe1"
                  name="nomeEquipe1"
                  type="text"
                  defaultValue="Equipe Azul"
                  maxLength={20}
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
                />
                {estado?.erros?.nomeEquipe1 && (
                  <p className="mt-1 text-xs text-red-600">{estado.erros.nomeEquipe1[0]}</p>
                )}
              </div>

              <div>
                <label htmlFor="nomeEquipe2" className="text-sm font-medium text-neutral-700">
                  🔴 Nome da equipe 2
                </label>
                <input
                  id="nomeEquipe2"
                  name="nomeEquipe2"
                  type="text"
                  defaultValue="Equipe Vermelha"
                  maxLength={20}
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
                />
                {estado?.erros?.nomeEquipe2 && (
                  <p className="mt-1 text-xs text-red-600">{estado.erros.nomeEquipe2[0]}</p>
                )}
              </div>
            </>
          )}

          <div>
            <label htmlFor="turmaId" className="text-sm font-medium text-neutral-700">
              Turma (opcional)
            </label>
            <select
              id="turmaId"
              name="turmaId"
              defaultValue=""
              className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
            >
              <option value="">Sem turma — aluno digita um apelido</option>
              {turmas.map((turma) => (
                <option key={turma.id} value={turma.id}>
                  {turma.nome}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-neutral-400">
              Escolhendo uma turma, o aluno entra pelo nome + PIN da turma, e a pontuação fica
              guardada nele entre partidas diferentes.
            </p>
          </div>

          {estado?.mensagem && <p className="text-sm text-red-600">{estado.mensagem}</p>}

          <button
            type="submit"
            disabled={pendente}
            className="w-full rounded-lg bg-[#1a3fd4] py-2.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {pendente ? "Criando sala..." : "Criar sala"}
          </button>
        </form>
      </div>
    </main>
  );
}
