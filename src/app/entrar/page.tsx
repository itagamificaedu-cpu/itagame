"use client";

import { useActionState } from "react";
import Link from "next/link";
import { entrarNaSala } from "@/app/actions/salas";

export default function PaginaEntrarNaSala() {
  const [estado, action, pendente] = useActionState(entrarNaSala, undefined);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b1230] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 shadow-sm backdrop-blur">
        <Link href="/" className="text-xl font-extrabold text-white">
          ItaGame
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-white">Entrar na sala</h1>
        <p className="mt-1 text-sm text-white/60">
          Digite o código que o professor mostrou e escolha um apelido.
        </p>

        <form action={action} className="mt-6 space-y-4">
          <div>
            <label htmlFor="codigo" className="text-sm font-medium text-white/80">
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
              className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-center text-lg font-bold tracking-widest text-white placeholder-white/30 focus:border-[#00c264] focus:outline-none focus:ring-1 focus:ring-[#00c264]"
            />
            {estado?.erros?.codigo && (
              <p className="mt-1 text-xs text-red-400">{estado.erros.codigo[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="apelido" className="text-sm font-medium text-white/80">
              Seu apelido
            </label>
            <input
              id="apelido"
              name="apelido"
              type="text"
              maxLength={20}
              required
              className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/30 focus:border-[#00c264] focus:outline-none focus:ring-1 focus:ring-[#00c264]"
            />
            {estado?.erros?.apelido && (
              <p className="mt-1 text-xs text-red-400">{estado.erros.apelido[0]}</p>
            )}
          </div>

          {estado?.mensagem && <p className="text-sm text-red-400">{estado.mensagem}</p>}

          <button
            type="submit"
            disabled={pendente}
            className="w-full rounded-lg bg-[#00c264] py-2.5 text-sm font-bold text-[#0b1230] transition hover:brightness-110 disabled:opacity-60"
          >
            {pendente ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
