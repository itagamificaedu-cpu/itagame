"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { exigirAcessoBnccComputacao } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { TOTAL_SEMANAS_CURSO } from "@/lib/cursoBnccComputacao";

// Progresso do professor no Curso de Formação BNCC Computação (80h). Cria o
// registro na primeira visita (upsert), pra não precisar de uma tela de
// "começar o curso" separada.
export async function buscarOuCriarProgressoCurso() {
  const sessao = await exigirAcessoBnccComputacao();

  return prisma.progressoCursoBnccComputacao.upsert({
    where: { professorId: sessao.userId },
    create: { professorId: sessao.userId },
    update: {},
  });
}

export async function alternarSemanaConcluidaCurso(semana: number) {
  const sessao = await exigirAcessoBnccComputacao();

  const progresso = await prisma.progressoCursoBnccComputacao.upsert({
    where: { professorId: sessao.userId },
    create: { professorId: sessao.userId },
    update: {},
  });

  const jaConcluida = progresso.semanasConcluidas.includes(semana);
  const novaLista = jaConcluida
    ? progresso.semanasConcluidas.filter((s) => s !== semana)
    : [...progresso.semanasConcluidas, semana].sort((a, b) => a - b);

  await prisma.progressoCursoBnccComputacao.update({
    where: { professorId: sessao.userId },
    data: { semanasConcluidas: novaLista },
  });

  revalidatePath("/painel/bncc-computacao/curso");
}

export async function emitirCertificadoCurso() {
  const sessao = await exigirAcessoBnccComputacao();

  const progresso = await prisma.progressoCursoBnccComputacao.findUnique({
    where: { professorId: sessao.userId },
  });

  if (!progresso || progresso.semanasConcluidas.length < TOTAL_SEMANAS_CURSO) {
    throw new Error("Conclua as 40 aulas dos 4 módulos do curso antes de emitir o certificado.");
  }

  if (progresso.codigoCertificado) {
    return progresso;
  }

  const codigo = `BNCC-COMP-${new Date().getFullYear()}-${randomBytes(3).toString("hex").toUpperCase()}`;

  const atualizado = await prisma.progressoCursoBnccComputacao.update({
    where: { professorId: sessao.userId },
    data: { concluidoEm: new Date(), codigoCertificado: codigo },
  });

  revalidatePath("/painel/bncc-computacao/curso");
  revalidatePath("/painel/bncc-computacao/curso/certificado");

  return atualizado;
}
