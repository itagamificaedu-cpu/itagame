"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { exigirAssinaturaAtiva, verificarSessaoAluno } from "@/lib/acessoDados";

// Loja de recompensas: o professor cadastra prêmios (físicos ou digitais)
// numa turma, os alunos trocam o XP acumulado nas trilhas por eles. O
// resgate fica "pendente" até o professor entregar o prêmio de verdade e
// marcar como entregue — ou cancelar (devolve o XP e o estoque).

async function verificarDonoTurma(turmaId: string, professorId: string) {
  const turma = await prisma.turma.findUnique({ where: { id: turmaId } });
  if (!turma || turma.professorId !== professorId) {
    throw new Error("Turma não encontrada.");
  }
  return turma;
}

export type ResultadoAcaoLoja = { ok: true } | { ok: false; erro: string };

export async function criarItemLoja(input: {
  turmaId: string;
  nome: string;
  descricao?: string;
  custoXp: number;
  icone?: string;
  estoque?: number | null;
}): Promise<ResultadoAcaoLoja> {
  const sessao = await exigirAssinaturaAtiva();
  await verificarDonoTurma(input.turmaId, sessao.userId);

  const nome = input.nome.trim();
  if (!nome) return { ok: false, erro: "Dê um nome pro item." };
  if (!Number.isFinite(input.custoXp) || input.custoXp <= 0) {
    return { ok: false, erro: "Informe um custo em XP válido (maior que zero)." };
  }

  await prisma.itemLoja.create({
    data: {
      turmaId: input.turmaId,
      nome,
      descricao: input.descricao?.trim() || undefined,
      custoXp: Math.round(input.custoXp),
      icone: input.icone?.trim() || undefined,
      estoque:
        input.estoque !== null && input.estoque !== undefined && Number.isFinite(input.estoque)
          ? Math.max(0, Math.round(input.estoque))
          : undefined,
    },
  });

  revalidatePath("/painel/loja");
  return { ok: true };
}

export async function removerItemLoja(turmaId: string, itemId: string): Promise<ResultadoAcaoLoja> {
  const sessao = await exigirAssinaturaAtiva();
  await verificarDonoTurma(turmaId, sessao.userId);

  const item = await prisma.itemLoja.findUnique({ where: { id: itemId } });
  if (!item || item.turmaId !== turmaId) {
    return { ok: false, erro: "Item não encontrado." };
  }

  // Só desativa (não apaga) — preserva o histórico de resgates já feitos.
  await prisma.itemLoja.update({ where: { id: itemId }, data: { ativo: false } });

  revalidatePath("/painel/loja");
  return { ok: true };
}

export async function marcarResgateEntregue(resgateId: string): Promise<ResultadoAcaoLoja> {
  const sessao = await exigirAssinaturaAtiva();

  const resgate = await prisma.resgateLoja.findUnique({
    where: { id: resgateId },
    include: { item: { include: { turma: true } } },
  });
  if (!resgate || resgate.item.turma.professorId !== sessao.userId) {
    return { ok: false, erro: "Resgate não encontrado." };
  }

  await prisma.resgateLoja.update({
    where: { id: resgateId },
    data: { status: "entregue", entregueEm: new Date() },
  });

  revalidatePath("/painel/loja");
  return { ok: true };
}

export async function cancelarResgate(resgateId: string): Promise<ResultadoAcaoLoja> {
  const sessao = await exigirAssinaturaAtiva();

  const resgate = await prisma.resgateLoja.findUnique({
    where: { id: resgateId },
    include: { item: { include: { turma: true } } },
  });
  if (!resgate || resgate.item.turma.professorId !== sessao.userId) {
    return { ok: false, erro: "Resgate não encontrado." };
  }
  if (resgate.status !== "pendente") {
    return { ok: false, erro: "Esse resgate já foi finalizado." };
  }

  await prisma.$transaction(async (tx) => {
    await tx.resgateLoja.update({ where: { id: resgateId }, data: { status: "cancelado" } });
    await tx.xpTransacao.create({
      data: {
        alunoId: resgate.alunoId,
        origem: `Estorno: ${resgate.item.nome}`,
        quantidade: resgate.custoXp,
      },
    });
    if (resgate.item.estoque !== null) {
      await tx.itemLoja.update({ where: { id: resgate.itemId }, data: { estoque: { increment: 1 } } });
    }
  });

  revalidatePath("/painel/loja");
  return { ok: true };
}

// --- lado do aluno ---

export type ResultadoResgate = { ok: true; xpRestante: number } | { ok: false; erro: string };

export async function resgatarItem(itemId: string): Promise<ResultadoResgate> {
  const aluno = await verificarSessaoAluno();

  const item = await prisma.itemLoja.findUnique({ where: { id: itemId } });
  if (!item || item.turmaId !== aluno.turmaId || !item.ativo) {
    return { ok: false, erro: "Item não encontrado." };
  }
  if (item.estoque !== null && item.estoque <= 0) {
    return { ok: false, erro: "Esse item está sem estoque no momento." };
  }

  const xpTransacoes = await prisma.xpTransacao.findMany({ where: { alunoId: aluno.id } });
  const xpTotal = xpTransacoes.reduce((soma, t) => soma + t.quantidade, 0);

  if (xpTotal < item.custoXp) {
    return {
      ok: false,
      erro: `XP insuficiente. Você tem ${xpTotal} XP, esse item custa ${item.custoXp} XP.`,
    };
  }

  await prisma.$transaction(async (tx) => {
    await tx.xpTransacao.create({
      data: { alunoId: aluno.id, origem: `Resgate: ${item.nome}`, quantidade: -item.custoXp },
    });
    await tx.resgateLoja.create({
      data: { alunoId: aluno.id, itemId, custoXp: item.custoXp },
    });
    if (item.estoque !== null) {
      await tx.itemLoja.update({ where: { id: itemId }, data: { estoque: { decrement: 1 } } });
    }
  });

  revalidatePath("/trilha/loja");
  return { ok: true, xpRestante: xpTotal - item.custoXp };
}
