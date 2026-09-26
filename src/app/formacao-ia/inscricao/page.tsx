import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CURSO_FORMACAO_IA } from "@/lib/formacaoIA";
import { FormularioInscricaoFormacaoIA } from "./FormularioInscricaoFormacaoIA";

// Contagem de vagas muda a cada inscrição — nunca cachear/prerenderizar.
export const dynamic = "force-dynamic";

export default async function InscricaoFormacaoIA() {
  const usadas = await prisma.matriculaFormacaoIA.count({
    where: { status: { in: ["aguardando_pagamento", "pago", "certificado_emitido"] } },
  });
  const vagasDisponiveis = Math.max(0, CURSO_FORMACAO_IA.vagasTotal - usadas);

  if (vagasDisponiveis <= 0) {
    return (
      <main className="min-h-screen bg-neutral-50 px-6 py-16 text-center">
        <h1 className="text-2xl font-extrabold text-neutral-900">Vagas esgotadas</h1>
        <p className="mt-3 text-sm text-neutral-500">
          Todas as vagas desta turma já foram preenchidas.
        </p>
        <a
          href="https://wa.me/5588988411890?text=Ol%C3%A1!%20Quero%20ser%20avisado(a)%20quando%20abrir%20uma%20nova%20turma%20da%20Forma%C3%A7%C3%A3o%20em%20IA."
          target="_blank"
          className="mt-6 inline-block rounded-xl bg-[#25D366] px-6 py-3 text-sm font-bold text-white"
        >
          📱 Avisem-me pelo WhatsApp
        </a>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-lg">
        <Link href="/formacao-ia" className="text-sm font-semibold text-[#1a3fd4]">
          ← Voltar
        </Link>
        <h1 className="mt-4 text-2xl font-extrabold text-neutral-900">Inscrição</h1>
        <p className="mt-1 text-sm text-neutral-500">{CURSO_FORMACAO_IA.nome}</p>

        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <FormularioInscricaoFormacaoIA />
        </div>
      </div>
    </main>
  );
}
