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

// ---------------------------------------------------------------------------
// Modo online (responder na tela, com conferência automática)
// ---------------------------------------------------------------------------

export type ModoAtividade = "imprimir" | "online";

export function SeletorModo({
  modo,
  aoAlterar,
  cor,
}: {
  modo: ModoAtividade;
  aoAlterar: (modo: ModoAtividade) => void;
  cor: string;
}) {
  return (
    <div className="flex rounded-lg border border-neutral-300 p-1 text-xs font-bold">
      <button
        type="button"
        onClick={() => aoAlterar("imprimir")}
        className="flex-1 rounded-md py-1.5 transition"
        style={
          modo === "imprimir"
            ? { backgroundColor: cor, color: "white" }
            : { color: "#6b7280" }
        }
      >
        🖨️ Imprimir
      </button>
      <button
        type="button"
        onClick={() => aoAlterar("online")}
        className="flex-1 rounded-md py-1.5 transition"
        style={
          modo === "online"
            ? { backgroundColor: cor, color: "white" }
            : { color: "#6b7280" }
        }
      >
        📱 Responder na tela
      </button>
    </div>
  );
}

export function ControleConferencia({
  conferido,
  aoConferir,
  aoTentarNovamente,
  cor,
}: {
  conferido: boolean;
  aoConferir: () => void;
  aoTentarNovamente: () => void;
  cor: string;
}) {
  if (conferido) {
    return (
      <button
        type="button"
        onClick={aoTentarNovamente}
        className="w-full rounded-lg py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-110"
        style={{ backgroundColor: cor }}
      >
        🔄 Tentar novamente
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={aoConferir}
      className="w-full rounded-lg bg-[#00c264] py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-110"
    >
      ✅ Conferir respostas
    </button>
  );
}

export function ResumoPontuacao({
  acertos,
  total,
  cor,
}: {
  acertos: number;
  total: number;
  cor: string;
}) {
  const percentual = total === 0 ? 0 : Math.round((acertos / total) * 100);
  const emoji = percentual === 100 ? "🏆" : percentual >= 70 ? "🎉" : percentual >= 40 ? "💪" : "📚";
  return (
    <div
      className="mb-8 flex items-center justify-center gap-2 rounded-xl border-2 p-3 text-center font-extrabold"
      style={{ borderColor: cor, color: cor, backgroundColor: `${cor}12` }}
    >
      <span className="text-xl">{emoji}</span>
      <span>
        Você acertou {acertos} de {total}!
      </span>
    </div>
  );
}

export function CampoRespostaCurta({
  valor,
  aoAlterar,
  cor,
  conferido,
  correta,
  largura = "w-16",
}: {
  valor: string;
  aoAlterar: (valor: string) => void;
  cor: string;
  conferido: boolean;
  correta: boolean;
  largura?: string;
}) {
  return (
    <input
      type="text"
      inputMode="numeric"
      value={valor}
      onChange={(e) => aoAlterar(e.target.value)}
      disabled={conferido}
      className={`${largura} rounded-lg border-2 px-2 py-1 text-center text-sm font-bold outline-none disabled:opacity-100 ${
        conferido
          ? correta
            ? "border-[#00c264] bg-[#00c264]/10 text-[#00854a]"
            : "border-[#e11d48] bg-[#e11d48]/10 text-[#e11d48]"
          : "bg-white text-neutral-800"
      }`}
      style={!conferido ? { borderColor: cor } : undefined}
    />
  );
}
