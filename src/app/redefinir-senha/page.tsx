"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { redefinirSenha } from "@/app/actions/redefinicaoSenha";

export default function PaginaRedefinirSenha() {
  return (
    <Suspense>
      <FormularioRedefinirSenha />
    </Suspense>
  );
}

function FormularioRedefinirSenha() {
  const [estado, action, pendente] = useActionState(redefinirSenha, undefined);
  const parametros = useSearchParams();
  const id = parametros.get("id") ?? "";
  const token = parametros.get("token") ?? "";

  if (!id || !token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
        <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-neutral-600">Esse link de redefinição não é válido.</p>
          <Link href="/esqueci-senha" className="mt-4 inline-block text-sm font-semibold text-[#1a3fd4]">
            Pedir um novo link
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <Link href="/" className="text-xl font-extrabold text-[#1a3fd4]">
          ItaGameficaEdu
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-neutral-900">Criar nova senha</h1>
        <p className="mt-1 text-sm text-neutral-500">Escolha uma senha nova pra sua conta.</p>

        <form action={action} className="mt-6 space-y-4">
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="token" value={token} />

          <div>
            <label htmlFor="senha" className="text-sm font-medium text-neutral-700">
              Nova senha
            </label>
            <input
              id="senha"
              name="senha"
              type="password"
              required
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1a3fd4] focus:outline-none focus:ring-1 focus:ring-[#1a3fd4]"
            />
            {estado?.erros?.senha && <p className="mt-1 text-xs text-red-600">{estado.erros.senha[0]}</p>}
          </div>

          {estado?.mensagem && <p className="text-sm text-red-600">{estado.mensagem}</p>}

          <button
            type="submit"
            disabled={pendente}
            className="w-full rounded-lg bg-[#1a3fd4] py-2.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {pendente ? "Salvando..." : "Salvar nova senha"}
          </button>
        </form>
      </div>
    </main>
  );
}
