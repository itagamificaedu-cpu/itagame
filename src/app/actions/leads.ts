"use server";

import { revalidatePath } from "next/cache";
import { verificarSessao } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import type { StatusLead } from "@prisma/client";

// Funil de vendas manual do dono da plataforma — só ita_owner mexe aqui.
// Nada disso afeta a assinatura de verdade (Mercado Pago); é só o
// acompanhamento de quem ainda está em prospecção.

async function exigirDono() {
  const sessao = await verificarSessao();
  if (sessao.papel !== "ita_owner") {
    throw new Error("Sem permissão.");
  }
  return sessao;
}

export type ResultadoAcaoLead = { ok: true } | { ok: false; erro: string };

export async function criarLead(input: {
  nome: string;
  contato: string;
  origem?: string;
  valorPotencialMensal?: number;
}): Promise<ResultadoAcaoLead> {
  const sessao = await exigirDono();

  const nome = input.nome.trim();
  const contato = input.contato.trim();
  if (!nome || !contato) {
    return { ok: false, erro: "Preencha nome e contato." };
  }

  await prisma.leadVenda.create({
    data: {
      nome,
      contato,
      origem: input.origem?.trim() || null,
      valorPotencialMensal: input.valorPotencialMensal || null,
      criadoPorId: sessao.userId,
    },
  });

  revalidatePath("/painel/admin/leads");
  return { ok: true };
}

export async function atualizarStatusLead(leadId: string, status: StatusLead) {
  await exigirDono();
  await prisma.leadVenda.update({ where: { id: leadId }, data: { status } });
  revalidatePath("/painel/admin/leads");
}

export async function atualizarNotasLead(leadId: string, notas: string, proximoContatoEm: string) {
  await exigirDono();
  await prisma.leadVenda.update({
    where: { id: leadId },
    data: {
      notas: notas.trim() || null,
      proximoContatoEm: proximoContatoEm ? new Date(proximoContatoEm) : null,
    },
  });
  revalidatePath("/painel/admin/leads");
}

export async function excluirLead(leadId: string) {
  await exigirDono();
  await prisma.leadVenda.delete({ where: { id: leadId } });
  revalidatePath("/painel/admin/leads");
}
