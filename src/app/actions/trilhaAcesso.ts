"use server";

import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { criarSessaoAluno, excluirSessaoAluno } from "@/lib/alunoSessao";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";

// Acesso do ALUNO às Trilhas — sem e-mail. O aluno digita o código fixo da
// turma (gerado quando o professor cria a turma) pra ver a lista de nomes,
// escolhe o seu e confere com um PIN de 4 dígitos que o professor gerou.

export type ResultadoBuscaTurma =
  | { ok: true; turmaId: string; turmaNome: string; alunos: { id: string; nome: string }[] }
  | { ok: false; erro: string };

export async function buscarAlunosDaTurma(codigo: string): Promise<ResultadoBuscaTurma> {
  const codigoLimpo = codigo.trim();
  if (!codigoLimpo) {
    return { ok: false, erro: "Informe o código da turma." };
  }

  const turma = await prisma.turma.findUnique({
    where: { codigoAcesso: codigoLimpo },
    include: { alunos: { orderBy: { nome: "asc" } } },
  });

  if (!turma) {
    return { ok: false, erro: "Código de turma não encontrado." };
  }

  return {
    ok: true,
    turmaId: turma.id,
    turmaNome: turma.nome,
    alunos: turma.alunos.map((a) => ({ id: a.id, nome: a.nome })),
  };
}

export type ResultadoEntrarAluno = { ok: true } | { ok: false; erro: string };

// Bloqueio de força bruta: o PIN só tem 4 dígitos (10 mil combinações), então
// sem limite de tentativas daria pra "adivinhar" o PIN de outro aluno.
const LIMITE_TENTATIVAS_PIN = 5;
const BLOQUEIO_MINUTOS_PIN = 10;

function mensagemBloqueioPin(bloqueadoAte: Date): string {
  const minutos = Math.max(1, Math.ceil((bloqueadoAte.getTime() - Date.now()) / 60000));
  return `Muitas tentativas erradas. Tente de novo em ${minutos} minuto${minutos === 1 ? "" : "s"}.`;
}

export async function entrarComoAluno(alunoId: string, pin: string): Promise<ResultadoEntrarAluno> {
  const aluno = await prisma.aluno.findUnique({ where: { id: alunoId } });

  if (!aluno || !aluno.pinHash) {
    return {
      ok: false,
      erro: "Esse aluno ainda não tem PIN configurado. Peça pro professor gerar um na página da turma.",
    };
  }

  if (aluno.pinBloqueadoAte && aluno.pinBloqueadoAte > new Date()) {
    return { ok: false, erro: mensagemBloqueioPin(aluno.pinBloqueadoAte) };
  }

  const pinConfere = await bcrypt.compare(pin.trim(), aluno.pinHash);
  if (!pinConfere) {
    const tentativas = aluno.tentativasPinFalhas + 1;
    const bloqueado = tentativas >= LIMITE_TENTATIVAS_PIN;
    const bloqueadoAte = new Date(Date.now() + BLOQUEIO_MINUTOS_PIN * 60000);

    await prisma.aluno.update({
      where: { id: alunoId },
      data: bloqueado
        ? { tentativasPinFalhas: 0, pinBloqueadoAte: bloqueadoAte }
        : { tentativasPinFalhas: tentativas },
    });

    return { ok: false, erro: bloqueado ? mensagemBloqueioPin(bloqueadoAte) : "PIN incorreto." };
  }

  if (aluno.tentativasPinFalhas > 0 || aluno.pinBloqueadoAte) {
    await prisma.aluno.update({
      where: { id: alunoId },
      data: { tentativasPinFalhas: 0, pinBloqueadoAte: null },
    });
  }

  await criarSessaoAluno({ alunoId: aluno.id, turmaId: aluno.turmaId });
  redirect("/trilha");
}

export async function sairComoAluno() {
  await excluirSessaoAluno();
  redirect("/entrar-trilha");
}

// --- lado do professor: gerar/resetar PIN e código de acesso da turma ---

function gerarPin() {
  return String(crypto.randomInt(1000, 10000));
}

export type ResultadoGerarPin = { ok: true; pin: string } | { ok: false; erro: string };

export async function gerarPinAluno(turmaId: string, alunoId: string): Promise<ResultadoGerarPin> {
  const sessao = await exigirAssinaturaAtiva();

  const turma = await prisma.turma.findUnique({ where: { id: turmaId } });
  if (!turma || turma.professorId !== sessao.userId) {
    return { ok: false, erro: "Turma não encontrada." };
  }

  const aluno = await prisma.aluno.findUnique({ where: { id: alunoId } });
  if (!aluno || aluno.turmaId !== turmaId) {
    return { ok: false, erro: "Aluno não encontrado nessa turma." };
  }

  const pin = gerarPin();
  const pinHash = await bcrypt.hash(pin, 10);

  await prisma.aluno.update({ where: { id: alunoId }, data: { pinHash } });

  revalidatePath(`/painel/turmas/${turmaId}`);
  return { ok: true, pin };
}
