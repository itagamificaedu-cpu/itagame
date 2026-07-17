"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { entrarNaSalaCaboGuerra } from "@/app/actions/caboGuerraOnline";

export default function PaginaEntrarCaboGuerra() {
  const [estado, action, pendente] = useActionState(entrarNaSalaCaboGuerra, undefined);
  const [equipe, setEquipe] = useState<1 | 2>(1);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-50 px-4">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#42A5F5]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-[#EF5350]/10 blur-3xl" />

      <div className="relative w-full max-w-sm rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
        <Link href="/" className="text-xl font-extrabold text-[#1a3fd4]">
          ItaGame
        </Link>
        <h1 className="mt-4 text-2xl font-extrabold text-neutral-900">🪢 Cabo de Guerra</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Digite o código da sala, escolha seu apelido e um time pra defender.
        </p>

        <form action={action} className="mt-6 space-y-4">
          <div>
            <label htmlFor="codigo" className="text-sm font-semibold text-neutral-700">
              Código da sala
            </label>
            <input
              id="codigo"
              name="codigo"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              required
              className="mt-1 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-3 text-center text-2xl font-extrabold tracking-[0.3em] text-neutral-900 placeholder-neutral-300 focus:border-[#1a3fd4] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3fd4]/20"
            />
            {estado?.erros?.codigo && (
              <p className="mt-1 text-xs font-medium text-[#ff5470]">{estado.erros.codigo[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="apelido" className="text-sm font-semibold text-neutral-700">
              Seu apelido
            </label>
            <input
              id="apelido"
              name="apelido"
              type="text"
              maxLength={20}
              placeholder="Como o professor vai te ver"
              required
              className="mt-1 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm font-medium text-neutral-900 placeholder-neutral-400 focus:border-[#1a3fd4] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3fd4]/20"
            />
            {estado?.erros?.apelido && (
              <p className="mt-1 text-xs font-medium text-[#ff5470]">{estado.erros.apelido[0]}</p>
            )}
          </div>

          <div>
            <span className="text-sm font-semibold text-neutral-700">Escolha seu time</span>
            <input type="hidden" name="equipe" value={equipe} />
            <div className="mt-1 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setEquipe(1)}
                className={`rounded-xl border-2 py-3 text-sm font-extrabold transition ${
                  equipe === 1
                    ? "border-[#1565C0] bg-[#1565C0]/10 text-[#1565C0]"
                    : "border-neutral-200 text-neutral-400 hover:border-neutral-300"
                }`}
              >
                🔵 Equipe Azul
              </button>
              <button
                type="button"
                onClick={() => setEquipe(2)}
                className={`rounded-xl border-2 py-3 text-sm font-extrabold transition ${
                  equipe === 2
                    ? "border-[#C62828] bg-[#C62828]/10 text-[#C62828]"
                    : "border-neutral-200 text-neutral-400 hover:border-neutral-300"
                }`}
              >
                🔴 Equipe Vermelha
              </button>
            </div>
            {estado?.erros?.equipe && (
              <p className="mt-1 text-xs font-medium text-[#ff5470]">{estado.erros.equipe[0]}</p>
            )}
          </div>

          {estado?.mensagem && (
            <p className="text-sm font-medium text-[#ff5470]">{estado.mensagem}</p>
          )}

          <button
            type="submit"
            disabled={pendente}
            className="w-full rounded-xl bg-[#1a3fd4] py-3 text-sm font-extrabold text-white transition hover:brightness-110 active:scale-[0.99] disabled:opacity-60"
          >
            {pendente ? "Entrando..." : "Entrar na sala →"}
          </button>
        </form>
      </div>
    </main>
  );
}
