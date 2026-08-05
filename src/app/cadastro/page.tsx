"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { cadastrar } from "@/app/actions/autenticacao";

export default function PaginaCadastro() {
  return (
    <Suspense>
      <FormularioCadastro />
    </Suspense>
  );
}

function FormularioCadastro() {
  const [estado, action, pendente] = useActionState(cadastrar, undefined);
  const parametros = useSearchParams();
  const proximo = parametros.get("next") ?? "";

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <Link href="/" className="text-xl font-extrabold text-[#1a3fd4]">
          ItaGameficaEdu
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-neutral-900">Criar sua conta</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Comece a gerar atividades em segundos.
        </p>

        <form action={action} className="mt-6 space-y-4">
          <input type="hidden" name="proximo" value={proximo} />
          <div>
            <label htmlFor="nome" className="text-sm font-medium text-neutral-700">
              Nome completo
            </label>
            <input
              id="nome"
              name="nome"
              type="text"
              required
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
            />
            {estado?.erros?.nome && (
              <p className="mt-1 text-xs text-red-600">{estado.erros.nome[0]}</p>
            )}
          </div>

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
            <label htmlFor="senha" className="text-sm font-medium text-neutral-700">
              Senha
            </label>
            <input
              id="senha"
              name="senha"
              type="password"
              required
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
            />
            {estado?.erros?.senha && (
              <ul className="mt-1 list-inside list-disc text-xs text-red-600">
                {estado.erros.senha.map((erro) => (
                  <li key={erro}>{erro}</li>
                ))}
              </ul>
            )}
          </div>

          {estado?.mensagem && <p className="text-sm text-red-600">{estado.mensagem}</p>}

          <button
            type="submit"
            disabled={pendente}
            className="w-full rounded-lg bg-[#00c264] py-2.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {pendente ? "Criando conta..." : "Criar minha conta"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          Já tem conta?{" "}
          <Link
            href={proximo ? `/login?next=${encodeURIComponent(proximo)}` : "/login"}
            className="font-semibold text-[#1a3fd4]"
          >
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
