"use client";

import { useActionState } from "react";
import Link from "next/link";
import { solicitarRedefinicaoSenha } from "@/app/actions/redefinicaoSenha";

export default function PaginaEsqueciSenha() {
  const [estado, action, pendente] = useActionState(solicitarRedefinicaoSenha, undefined);

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <Link href="/" className="text-xl font-extrabold text-[#1a3fd4]">
          ItaGameficaEdu
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-neutral-900">Esqueci minha senha</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Informe o e-mail da sua conta e mandamos um link pra criar uma senha nova.
        </p>

        {estado?.mensagem ? (
          <p className="mt-6 rounded-lg bg-[#00c264]/10 p-4 text-sm text-[#00854a]">{estado.mensagem}</p>
        ) : (
          <form action={action} className="mt-6 space-y-4">
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
              {estado?.erros?.email && <p className="mt-1 text-xs text-red-600">{estado.erros.email[0]}</p>}
            </div>

            <button
              type="submit"
              disabled={pendente}
              className="w-full rounded-lg bg-[#1a3fd4] py-2.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"
            >
              {pendente ? "Enviando..." : "Enviar link"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-neutral-500">
          <Link href="/login" className="font-semibold text-[#1a3fd4]">
            ← Voltar pro login
          </Link>
        </p>
      </div>
    </main>
  );
}
