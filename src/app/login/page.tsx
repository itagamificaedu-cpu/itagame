"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { entrar } from "@/app/actions/autenticacao";

export default function PaginaLogin() {
  return (
    <Suspense>
      <FormularioLogin />
    </Suspense>
  );
}

function FormularioLogin() {
  const [estado, action, pendente] = useActionState(entrar, undefined);
  const parametros = useSearchParams();
  const proximo = parametros.get("next") ?? "";
  const redefinida = parametros.get("redefinida") === "1";

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <Link href="/" className="text-xl font-extrabold text-[#1a3fd4]">
          ItaGameficaEdu
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-neutral-900">Entrar</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Acesse seu painel de professor.
        </p>

        {redefinida && (
          <p className="mt-4 rounded-lg bg-[#00c264]/10 p-3 text-sm text-[#00854a]">
            Senha redefinida! Já pode entrar com a senha nova.
          </p>
        )}

        <form action={action} className="mt-6 space-y-4">
          <input type="hidden" name="proximo" value={proximo} />
          <div>
            <label htmlFor="email" className="text-sm font-medium text-neutral-700">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
            />
            {estado?.erros?.email && (
              <p className="mt-1 text-xs text-red-600">{estado.erros.email[0]}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="senha" className="text-sm font-medium text-neutral-700">
                Senha
              </label>
              <Link href="/esqueci-senha" className="text-xs font-semibold text-[#1a3fd4]">
                Esqueceu a senha?
              </Link>
            </div>
            <input
              id="senha"
              name="senha"
              type="password"
              required
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
            />
          </div>

          {estado?.mensagem && <p className="text-sm text-red-600">{estado.mensagem}</p>}

          <button
            type="submit"
            disabled={pendente}
            className="w-full rounded-lg bg-[#1a3fd4] py-2.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {pendente ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          Ainda não tem conta?{" "}
          <Link
            href={proximo ? `/cadastro?next=${encodeURIComponent(proximo)}` : "/cadastro"}
            className="font-semibold text-[#1a3fd4]"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </main>
  );
}
