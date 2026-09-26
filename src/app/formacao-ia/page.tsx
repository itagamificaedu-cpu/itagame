import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CURSO_FORMACAO_IA, MODULOS_FORMACAO_IA, SOBRE_CURSO_FORMACAO_IA } from "@/lib/formacaoIA";
import { ModulosAccordion } from "./ModulosAccordion";

// Contagem de vagas muda a cada inscrição — nunca cachear/prerenderizar.
export const dynamic = "force-dynamic";

function reais(valor: number) {
  return `R$ ${valor.toFixed(2).replace(".", ",")}`;
}

const INCLUIDOS = [
  "Trilha completa dos 7 módulos",
  "Imersão presencial em Itapipoca",
  "Mentoria no projeto aplicado final",
  "Certificado de Extensão CEITEC",
  "Suporte via WhatsApp",
];

export default async function FormacaoIALanding() {
  const usadas = await prisma.matriculaFormacaoIA.count({
    where: { status: { in: ["aguardando_pagamento", "pago", "certificado_emitido"] } },
  });
  const vagasDisponiveis = Math.max(0, CURSO_FORMACAO_IA.vagasTotal - usadas);

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <section className="bg-gradient-to-br from-[#1a3fd4] to-[#0e2694] px-6 py-16 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold tracking-wide uppercase">
            Inscrições Abertas · {CURSO_FORMACAO_IA.edicao} · Híbrido
          </span>
          <h1 className="mt-5 text-3xl font-extrabold sm:text-4xl">
            Formação em IA Aplicada à Educação
          </h1>
          <p className="mt-4 text-base text-white/85">
            {CURSO_FORMACAO_IA.cargaHorariaTotal}h para professores da Educação Básica —{" "}
            {CURSO_FORMACAO_IA.periodoEadDescricao} e {CURSO_FORMACAO_IA.periodoPresencialDescricao},{" "}
            {CURSO_FORMACAO_IA.localPresencial}.
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl bg-white/10 p-3">
              <p className="text-2xl font-extrabold">{CURSO_FORMACAO_IA.cargaHorariaTotal}h</p>
              <p className="text-xs text-white/70">carga total</p>
            </div>
            <div className="rounded-xl bg-white/10 p-3">
              <p className="text-2xl font-extrabold">7</p>
              <p className="text-xs text-white/70">módulos</p>
            </div>
            <div className="rounded-xl bg-white/10 p-3">
              <p className="text-2xl font-extrabold">{CURSO_FORMACAO_IA.cargaHorariaEad}h</p>
              <p className="text-xs text-white/70">EAD</p>
            </div>
            <div className="rounded-xl bg-white/10 p-3">
              <p className="text-2xl font-extrabold">{CURSO_FORMACAO_IA.cargaHorariaPresencial}h</p>
              <p className="text-xs text-white/70">presencial</p>
            </div>
          </div>

          {vagasDisponiveis > 0 ? (
            <>
              <p className="mt-6 text-sm text-white/80">
                <span className="text-lg font-extrabold text-[#FFD600]">{vagasDisponiveis}</span> vagas
                disponíveis de {CURSO_FORMACAO_IA.vagasTotal}
              </p>
              <Link
                href="/formacao-ia/inscricao"
                className="mt-4 inline-block rounded-xl bg-[#FFD600] px-8 py-3.5 text-base font-extrabold text-[#1a1a2e] transition hover:brightness-105"
              >
                🚀 Quero me inscrever
              </Link>
              <p className="mt-3 text-xs text-white/60">
                Leva menos de 3 minutos · Pagamento via Mercado Pago
              </p>
            </>
          ) : (
            <p className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-500/20 px-5 py-3 text-sm font-bold text-white">
              ❌ Vagas esgotadas nesta turma
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-14">
        <h2 className="text-center text-2xl font-extrabold text-neutral-900">Sobre o curso</h2>
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-[#1a3fd4]">Introdução</p>
            <p className="mt-2 text-justify text-sm leading-relaxed text-neutral-600">{SOBRE_CURSO_FORMACAO_IA.introducao}</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-[#1a3fd4]">Justificativa</p>
            <p className="mt-2 text-justify text-sm leading-relaxed text-neutral-600">{SOBRE_CURSO_FORMACAO_IA.justificativa}</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-[#1a3fd4]">Metodologia</p>
            <p className="mt-2 text-justify text-sm leading-relaxed text-neutral-600">
              {SOBRE_CURSO_FORMACAO_IA.metodologiaGeral.intro}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-neutral-600">
              {SOBRE_CURSO_FORMACAO_IA.metodologiaGeral.itens.map((item) => (
                <li key={item} className="text-justify">{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-[#1a3fd4]">Organização curricular</p>
            <p className="mt-2 text-justify text-sm leading-relaxed text-neutral-600">
              {SOBRE_CURSO_FORMACAO_IA.organizacaoCurricular.intro}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-neutral-600">
              {SOBRE_CURSO_FORMACAO_IA.organizacaoCurricular.itens.map((item) => (
                <li key={item} className="text-justify">{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-14">
        <h2 className="text-center text-2xl font-extrabold text-neutral-900">Programa — 7 módulos</h2>
        <p className="mt-1 text-center text-xs text-neutral-400">Clique em um módulo para ver o conteúdo completo</p>

        <div className="mx-auto mt-4 flex max-w-md items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          <span className="text-base leading-none">🔒</span>
          <p>
            Conteúdo exclusivo de quem se inscrever nesta <strong>Formação em IA</strong> — não faz parte da
            assinatura Pro do ItaGame nem de nenhum outro plano da plataforma.
          </p>
        </div>

        <div className="mt-6">
          <ModulosAccordion modulos={MODULOS_FORMACAO_IA} />
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-6">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-extrabold text-neutral-900">✅ O que está incluído</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {INCLUIDOS.map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm text-neutral-600">
                <span className="font-bold text-[#00c264]">✓</span> {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-6">
        <div className="rounded-2xl border-2 border-[#1a3fd4]/20 bg-white p-6 text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">Investimento</p>
          <p className="mt-1 text-4xl font-extrabold text-[#1a3fd4]">{reais(CURSO_FORMACAO_IA.valorInscricao)}</p>
          <p className="text-sm text-neutral-500">pagamento único · PIX, cartão ou boleto</p>

          {vagasDisponiveis > 0 && (
            <Link
              href="/formacao-ia/inscricao"
              className="mt-5 block rounded-xl bg-[#1a3fd4] px-6 py-3.5 text-base font-extrabold text-white transition hover:brightness-110"
            >
              Garantir minha vaga
            </Link>
          )}
          <p className="mt-4 text-xs text-neutral-400">{CURSO_FORMACAO_IA.certificacaoDescricao}</p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-6">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-extrabold text-neutral-900">🎯 Quem pode participar</h2>
          <div className="mt-3 space-y-2 text-sm text-neutral-600">
            <p>
              <span className="font-bold text-neutral-900">Público-alvo:</span> professores da Educação
              Básica, qualquer nível de ensino.
            </p>
            <p>
              <span className="font-bold text-neutral-900">Pré-requisito:</span> atuação na docência
              (independente de formação em licenciatura) e acesso a computador/internet.
            </p>
            <p>
              <span className="font-bold text-neutral-900">Etapa presencial:</span>{" "}
              {CURSO_FORMACAO_IA.localPresencial}. Endereço enviado após confirmação do pagamento.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-14 text-center">
        <p className="text-sm text-neutral-500">Ficou com dúvida? Fale com a gente!</p>
        <a
          href="https://wa.me/5588988411890?text=Ol%C3%A1!%20Tenho%20d%C3%BAvidas%20sobre%20a%20Forma%C3%A7%C3%A3o%20em%20IA%20Aplicada%20%C3%A0%20Educa%C3%A7%C3%A3o."
          target="_blank"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-7 py-3 text-sm font-bold text-white"
        >
          📱 Falar pelo WhatsApp
        </a>
        <p className="mt-6 text-xs text-neutral-400">ITA Tecnologia Educacional · Itapipoca, Ceará</p>
      </section>
    </main>
  );
}
