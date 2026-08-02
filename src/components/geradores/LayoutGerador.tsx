"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export function LayoutGerador({
  titulo,
  config,
  children,
}: {
  titulo: string;
  config: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="border-b border-neutral-200 bg-white px-6 py-4 print:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <Link href="/painel/geradores" className="text-sm font-semibold text-[#1a3fd4]">
              ← Geradores
            </Link>
            <h1 className="mt-1 text-xl font-bold text-neutral-900">{titulo}</h1>
          </div>
          <button
            onClick={() => window.print()}
            className="rounded-lg bg-[#1a3fd4] px-4 py-2 text-sm font-bold text-white transition hover:brightness-110"
          >
            🖨️ Imprimir
          </button>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 lg:flex-row">
        <aside className="w-full shrink-0 space-y-4 rounded-2xl border border-neutral-200 bg-white p-5 print:hidden lg:w-72">
          {config}
        </aside>
        <div className="min-w-0 flex-1 overflow-x-auto rounded-2xl border border-neutral-200 bg-white p-8 print:border-0 print:p-0 print:shadow-none">
          {children}
        </div>
      </div>
    </main>
  );
}

export function CampoConfig({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-bold tracking-wide text-neutral-500 uppercase">{rotulo}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

export function CabecalhoFolha({ titulo }: { titulo: string }) {
  return (
    <div className="mb-6 border-b-2 border-neutral-800 pb-3">
      <p className="text-lg font-extrabold text-neutral-900">{titulo}</p>
      <div className="mt-2 flex flex-wrap gap-8 text-sm text-neutral-600">
        <p>Nome: ________________________________</p>
        <p>Turma: ______________</p>
      </div>
    </div>
  );
}
