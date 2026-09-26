import Link from "next/link";
import { notFound } from "next/navigation";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { CURSO_FORMACAO_IA } from "@/lib/formacaoIA";
import { LinhaMatriculaFormacaoIA } from "./LinhaMatriculaFormacaoIA";

export default async function PainelAdminFormacaoIA() {
  const sessao = await exigirAssinaturaAtiva();
  if (sessao.papel !== "ita_owner") {
    notFound();
  }

  const matriculas = await prisma.matriculaFormacaoIA.findMany({
    orderBy: { criadoEm: "desc" },
  });

  const usadas = matriculas.filter((m) =>
    ["aguardando_pagamento", "pago", "certificado_emitido"].includes(m.status)
  ).length;

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/painel" className="text-sm font-semibold text-[#1a3fd4]">
          ← Voltar ao painel
        </Link>

        <div className="mt-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Formação em IA — Matrículas</h1>
            <p className="mt-1 text-sm text-neutral-500">{CURSO_FORMACAO_IA.edicao}</p>
          </div>
          <span className="whitespace-nowrap rounded-full bg-[#1a3fd4]/10 px-3 py-1 text-xs font-bold text-[#1a3fd4]">
            {usadas} / {CURSO_FORMACAO_IA.vagasTotal} vagas
          </span>
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500">
                <th className="px-4 py-3 font-semibold">Professor(a)</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Frequência</th>
                <th className="px-4 py-3 font-semibold">Nota final</th>
                <th className="px-4 py-3 font-semibold">Projeto final</th>
                <th className="px-4 py-3 font-semibold">Observações</th>
                <th className="px-4 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {matriculas.map((m) => (
                <LinhaMatriculaFormacaoIA key={m.id} matricula={m} />
              ))}
              {matriculas.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-neutral-400">
                    Nenhuma matrícula ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-neutral-400">
          Frequência mínima {CURSO_FORMACAO_IA.frequenciaMinimaPct}% e nota final ≥ {CURSO_FORMACAO_IA.notaMinima} liberam o
          certificado automaticamente quando o professor acessa a página de certificado.
        </p>
      </div>
    </main>
  );
}
