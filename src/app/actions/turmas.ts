"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import {
  EsquemaCriarTurma,
  EstadoCriarTurma,
  EsquemaAdicionarAluno,
  EstadoAdicionarAluno,
} from "@/lib/definicoes";

async function verificarDonoTurma(turmaId: string, professorId: string) {
  const turma = await prisma.turma.findUnique({ where: { id: turmaId } });
  if (!turma || turma.professorId !== professorId) {
    throw new Error("Turma não encontrada.");
  }
  return turma;
}

export async function criarTurma(
  _estado: EstadoCriarTurma,
  formData: FormData
): Promise<EstadoCriarTurma> {
  const sessao = await exigirAssinaturaAtiva();

  const camposValidados = EsquemaCriarTurma.safeParse({
    nome: formData.get("nome"),
    serie: formData.get("serie"),
  });

  if (!camposValidados.success) {
    return { erros: camposValidados.error.flatten().fieldErrors };
  }

  const { nome, serie } = camposValidados.data;

  const turma = await prisma.turma.create({
    data: { nome, serie, professorId: sessao.userId },
  });

  revalidatePath("/painel/turmas");
  redirect(`/painel/turmas/${turma.id}`);
}

export async function excluirTurma(turmaId: string) {
  const sessao = await exigirAssinaturaAtiva();
  await verificarDonoTurma(turmaId, sessao.userId);

  await prisma.aluno.deleteMany({ where: { turmaId } });
  await prisma.turma.delete({ where: { id: turmaId } });

  revalidatePath("/painel/turmas");
  redirect("/painel/turmas");
}

export async function adicionarAluno(
  turmaId: string,
  _estado: EstadoAdicionarAluno,
  formData: FormData
): Promise<EstadoAdicionarAluno> {
  const sessao = await exigirAssinaturaAtiva();
  await verificarDonoTurma(turmaId, sessao.userId);

  const camposValidados = EsquemaAdicionarAluno.safeParse({
    nome: formData.get("nome"),
  });

  if (!camposValidados.success) {
    return { erros: camposValidados.error.flatten().fieldErrors };
  }

  await prisma.aluno.create({
    data: { nome: camposValidados.data.nome, turmaId },
  });

  revalidatePath(`/painel/turmas/${turmaId}`);
  return undefined;
}

export async function removerAluno(turmaId: string, alunoId: string) {
  const sessao = await exigirAssinaturaAtiva();
  await verificarDonoTurma(turmaId, sessao.userId);

  await prisma.aluno.deleteMany({ where: { id: alunoId, turmaId } });

  revalidatePath(`/painel/turmas/${turmaId}`);
}
