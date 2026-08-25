"use server";

import crypto from "node:crypto";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verificarSessao } from "@/lib/acessoDados";

function gerarCodigo() {
  return String(crypto.randomInt(100000, 999999));
}

// Cria uma sala pra um jogo externo (ex: "ita3climas") e manda o professor pra tela
// com o código. Mesmo padrão de iniciarSala() em actions/salas.ts.
export async function iniciarSalaJogoExterno(jogo: string) {
  const sessao = await verificarSessao();

  let sala = null;
  for (let tentativa = 0; tentativa < 5 && !sala; tentativa++) {
    try {
      sala = await prisma.salaJogoExterno.create({
        data: { codigo: gerarCodigo(), jogo, professorId: sessao.userId },
      });
    } catch {
      sala = null;
    }
  }

  if (!sala) {
    throw new Error("Não foi possível criar a sala. Tente novamente.");
  }

  redirect(`/painel/jogos/${sala.codigo}`);
}

export async function encerrarSalaJogoExterno(codigo: string) {
  const sessao = await verificarSessao();

  const sala = await prisma.salaJogoExterno.findUnique({ where: { codigo } });
  if (!sala || sala.professorId !== sessao.userId) {
    throw new Error("Sala não encontrada.");
  }

  await prisma.salaJogoExterno.update({ where: { id: sala.id }, data: { status: "encerrada" } });
}

// Usado pelo painel do professor pra atualizar o placar periodicamente (sem SSE —
// esse jogo é autônomo/assíncrono, não precisa sincronizar pergunta a pergunta).
export async function listarParticipantesJogoExterno(codigo: string) {
  const sessao = await verificarSessao();

  const sala = await prisma.salaJogoExterno.findUnique({
    where: { codigo },
    include: { participantes: { orderBy: { pontuacao: "desc" } } },
  });

  if (!sala || sala.professorId !== sessao.userId) {
    throw new Error("Sala não encontrada.");
  }

  return {
    status: sala.status,
    jogo: sala.jogo,
    participantes: sala.participantes.map((p) => ({
      id: p.id,
      apelido: p.apelido,
      pontuacao: p.pontuacao,
      tempoSegundos: p.tempoSegundos,
      finalizado: Boolean(p.finalizadoEm),
      temCaptura: Boolean(p.capturaTela),
    })),
  };
}

// Busca a captura de tela de UM participante, sob demanda (o placar atualiza a cada
// 3s e não vale a pena carregar a imagem de todo mundo o tempo todo — só quando o
// professor clica pra conferir).
export async function obterCapturaParticipante(participanteId: string) {
  const sessao = await verificarSessao();

  const participante = await prisma.participanteJogoExterno.findUnique({
    where: { id: participanteId },
    include: { sala: true },
  });

  if (!participante || participante.sala.professorId !== sessao.userId) {
    throw new Error("Participante não encontrado.");
  }

  return { apelido: participante.apelido, capturaTela: participante.capturaTela };
}
