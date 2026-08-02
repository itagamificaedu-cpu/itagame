"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export const PALETA_CORES = ["#e11d48", "#1a3fd4", "#00c264", "#f59e0b", "#7c3aed", "#0ea5e9"];

export function LayoutGerador({
  titulo,
  cor = "#1a3fd4",
  config,
  children,
}: {
  titulo: string;
  cor?: string;
  config: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-neutral-50">
      <div
        className="border-b-4 bg-white px-6 py-4 print:hidden"
        style={{ borderColor: cor }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <Link href="/painel/geradores" className="text-sm font-semibold" style={{ color: cor }}>
              ← Geradores
            </Link>
            <h1 className="mt-1 text-xl font-extrabold text-neutral-900">{titulo}</h1>
          </div>
          <button
            onClick={() => window.print()}
            className="rounded-lg px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:brightness-110"
            style={{ backgroundColor: cor }}
          >
            🖨️ Imprimir
          </button>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 lg:flex-row">
        <aside className="w-full shrink-0 space-y-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm print:hidden lg:w-72">
          {config}
        </aside>
        <div
          className="min-w-0 flex-1 rounded-3xl p-3 print:bg-transparent print:p-0"
          style={{ backgroundColor: `${cor}0d` }}
        >
          <div
            className="overflow-x-auto rounded-2xl border-[3px] bg-white p-8 shadow-md print:border print:shadow-none"
            style={{ borderColor: cor }}
          >
            {children}
            <RodapeMotivacional cor={cor} />
          </div>
        </div>
      </div>
    </main>
  );
}

function RodapeMotivacional({ cor }: { cor: string }) {
  return (
    <div className="mt-10 flex justify-center">
      <span
        className="rounded-full border-2 px-5 py-1.5 text-sm font-extrabold"
        style={{ borderColor: cor, color: cor }}
      >
        ★ Você consegue! ★
      </span>
    </div>
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

export function CabecalhoFolha({
  titulo,
  subtitulo,
  cor = "#1a3fd4",
}: {
  titulo: string;
  subtitulo?: string;
  cor?: string;
}) {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4" style={{ backgroundColor: `${cor}12` }}>
        <div className="flex items-center gap-3">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-base font-extrabold text-white shadow-sm"
            style={{ backgroundColor: cor }}
          >
            IG
          </span>
          <div>
            <p className="text-xl font-extrabold text-neutral-900">{titulo}</p>
            {subtitulo && <p className="text-sm text-neutral-500">{subtitulo}</p>}
          </div>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-neutral-600">
          <p>Nome: ________________________</p>
          <p>Turma: ______________</p>
        </div>
      </div>
    </div>
  );
}

export function EstrelaDivisoria({ cor = "#1a3fd4" }: { cor?: string }) {
  return (
    <div className="my-6 flex items-center gap-3">
      <div className="h-0.5 flex-1" style={{ backgroundColor: cor }} />
      <span className="text-lg" style={{ color: cor }}>
        ★
      </span>
      <div className="h-0.5 flex-1" style={{ backgroundColor: cor }} />
    </div>
  );
}

export function NumeroColorido({ numero, cor }: { numero: number; cor: string }) {
  return (
    <span
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white shadow-sm"
      style={{ backgroundColor: cor }}
    >
      {numero}
    </span>
  );
}
