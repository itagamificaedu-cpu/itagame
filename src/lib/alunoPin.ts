import "server-only";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// Verificação de PIN do aluno, compartilhada entre /entrar-trilha, Cabo de
// Guerra online e Salas ao Vivo — mesmo bloqueio de força bruta nos 3 lugares
// (o PIN só tem 4 dígitos, então sem limite de tentativas daria pra
// "adivinhar" o PIN de outro aluno).
const LIMITE_TENTATIVAS_PIN = 5;
const BLOQUEIO_MINUTOS_PIN = 10;

function mensagemBloqueioPin(bloqueadoAte: Date): string {
  const minutos = Math.max(1, Math.ceil((bloqueadoAte.getTime() - Date.now()) / 60000));
  return `Muitas tentativas erradas. Tente de novo em ${minutos} minuto${minutos === 1 ? "" : "s"}.`;
}

export type ResultadoVerificarPin =
  | { ok: true; aluno: { id: string; nome: string; turmaId: string } }
  | { ok: false; erro: string };

export async function verificarPinAluno(alunoId: string, pin: string): Promise<ResultadoVerificarPin> {
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

  return { ok: true, aluno: { id: aluno.id, nome: aluno.nome, turmaId: aluno.turmaId } };
}
