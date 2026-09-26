"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { preferenciaMercadoPago, PRECO_FORMACAO_IA } from "@/lib/mercadoPago";
import { verificarSessao } from "@/lib/acessoDados";
import { CURSO_FORMACAO_IA, cpfValido } from "@/lib/formacaoIA";
import type { TempoDocenciaFormacaoIA } from "@prisma/client";

export type ResultadoAcaoFormacaoIA = { ok: true; codigo: string } | { ok: false; erro: string };

async function contarVagasUsadas() {
  return prisma.matriculaFormacaoIA.count({
    where: { status: { in: ["aguardando_pagamento", "pago", "certificado_emitido"] } },
  });
}

export async function vagasDisponiveisFormacaoIA() {
  const usadas = await contarVagasUsadas();
  return Math.max(0, CURSO_FORMACAO_IA.vagasTotal - usadas);
}

// Inscrição pública — sem login. `nomeMeio` é honeypot (campo-armadilha
// invisível pra gente de verdade, só bot preenche): se vier preenchido,
// finge que deu certo mas não grava nada.
export async function inscreverFormacaoIA(input: {
  nomeCompleto: string;
  cpf: string;
  email: string;
  telefone: string;
  instituicaoEnsino: string;
  areaDisciplina: string;
  tempoDocencia: TempoDocenciaFormacaoIA;
  declaraAtuacaoDocente: boolean;
  autorizaImagem: boolean;
  aceitaTermos: boolean;
  nomeMeio?: string;
}): Promise<ResultadoAcaoFormacaoIA> {
  if (input.nomeMeio?.trim()) {
    return { ok: true, codigo: "0" }; // bot no honeypot — nunca é usado pra navegar
  }

  const nomeCompleto = input.nomeCompleto.trim();
  const email = input.email.trim().toLowerCase();
  const telefone = input.telefone.trim();
  const instituicaoEnsino = input.instituicaoEnsino.trim();
  const areaDisciplina = input.areaDisciplina.trim();

  if (!nomeCompleto || nomeCompleto.split(/\s+/).length < 2) {
    return { ok: false, erro: "Informe seu nome completo." };
  }
  if (!cpfValido(input.cpf)) {
    return { ok: false, erro: "CPF inválido." };
  }
  if (!email || !email.includes("@")) {
    return { ok: false, erro: "E-mail inválido." };
  }
  if (telefone.replace(/\D/g, "").length < 10) {
    return { ok: false, erro: "Telefone/WhatsApp inválido." };
  }
  if (!instituicaoEnsino || !areaDisciplina) {
    return { ok: false, erro: "Preencha instituição e área/disciplina." };
  }
  if (!input.declaraAtuacaoDocente) {
    return { ok: false, erro: "É preciso declarar atuação na docência." };
  }
  if (!input.aceitaTermos) {
    return { ok: false, erro: "É preciso aceitar os termos da inscrição." };
  }

  const vagas = await vagasDisponiveisFormacaoIA();
  if (vagas <= 0) {
    return { ok: false, erro: "As vagas desta turma se esgotaram." };
  }

  const matricula = await prisma.matriculaFormacaoIA.create({
    data: {
      nomeCompleto,
      cpf: input.cpf.replace(/\D/g, ""),
      email,
      telefone,
      instituicaoEnsino,
      areaDisciplina,
      tempoDocencia: input.tempoDocencia,
      declaraAtuacaoDocente: input.declaraAtuacaoDocente,
      autorizaImagem: input.autorizaImagem,
      aceitaTermos: input.aceitaTermos,
      status: "aguardando_pagamento",
      valorPago: PRECO_FORMACAO_IA,
    },
  });

  return { ok: true, codigo: matricula.codigoMatricula };
}

export async function iniciarCheckoutFormacaoIA(codigoMatricula: string) {
  const urlBase = process.env.NEXT_PUBLIC_APP_URL as string;

  const matricula = await prisma.matriculaFormacaoIA.findUnique({ where: { codigoMatricula } });
  if (!matricula) {
    throw new Error("Matrícula não encontrada.");
  }
  if (matricula.status === "pago" || matricula.status === "certificado_emitido") {
    redirect(`/formacao-ia/confirmado/${codigoMatricula}`);
  }

  const preferencia = await preferenciaMercadoPago.create({
    body: {
      items: [
        {
          id: "formacao-ia-educacao",
          title: `${CURSO_FORMACAO_IA.nome} — ${CURSO_FORMACAO_IA.edicao}`,
          quantity: 1,
          unit_price: PRECO_FORMACAO_IA,
          currency_id: "BRL",
        },
      ],
      payer: { name: matricula.nomeCompleto, email: matricula.email },
      external_reference: `formacao-ia:${matricula.id}`,
      back_urls: {
        success: `${urlBase}/formacao-ia/confirmado/${codigoMatricula}`,
        pending: `${urlBase}/formacao-ia/confirmado/${codigoMatricula}`,
        failure: `${urlBase}/formacao-ia/pagamento/${codigoMatricula}?status=falha`,
      },
      auto_return: "approved",
      notification_url: `${urlBase}/api/mercadopago/webhook`,
      statement_descriptor: "CEITEC FORMACAO IA",
    },
  });

  const urlCheckout = preferencia.init_point ?? preferencia.sandbox_init_point;
  if (!urlCheckout) {
    throw new Error("Não foi possível iniciar o checkout do Mercado Pago.");
  }

  return urlCheckout;
}

// ─── Administração (ita_owner) ──────────────────────────────────────────────

async function exigirDono() {
  const sessao = await verificarSessao();
  if (sessao.papel !== "ita_owner") {
    throw new Error("Sem permissão.");
  }
  return sessao;
}

export async function lancarAvaliacaoFormacaoIA(input: {
  id: string;
  frequenciaPct: number | null;
  notaFinal: number | null;
  projetoFinalTitulo: string;
  observacoesStaff: string;
}): Promise<ResultadoAcaoFormacaoIA> {
  await exigirDono();

  const matricula = await prisma.matriculaFormacaoIA.update({
    where: { id: input.id },
    data: {
      frequenciaPct: input.frequenciaPct,
      notaFinal: input.notaFinal,
      projetoFinalTitulo: input.projetoFinalTitulo.trim(),
      observacoesStaff: input.observacoesStaff.trim(),
    },
  });

  revalidatePath("/painel/admin/formacao-ia");
  return { ok: true, codigo: matricula.codigoMatricula };
}
