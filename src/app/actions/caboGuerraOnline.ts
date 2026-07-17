"use server";

import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verificarSessao } from "@/lib/acessoDados";
import {
  criarSessaoParticipanteCaboGuerra,
  obterSessaoParticipanteCaboGuerra,
} from "@/lib/caboGuerraSessao";
import { nivelDaRodada, gerarPergunta } from "@/lib/caboGuerraPerguntas";
import { prepararPerguntasPersonalizadas } from "@/lib/caboGuerraPersonalizado";
import {
  EsquemaCriarSalaCaboGuerra,
  EstadoCriarSalaCaboGuerra,
  EsquemaEntrarCaboGuerra,
  EstadoEntrarCaboGuerra,
} from "@/lib/definicoes";
import { Prisma } from "@prisma/client";

function gerarCodigo() {
  return String(crypto.randomInt(100000, 999999));
}

export async function criarSalaCaboGuerra(
  _estado: EstadoCriarSalaCaboGuerra,
  formData: FormData
): Promise<EstadoCriarSalaCaboGuerra> {
  const sessao = await verificarSessao();

  const camposValidados = EsquemaCriarSalaCaboGuerra.safeParse({
    nomeEquipe1: formData.get("nomeEquipe1"),
    nomeEquipe2: formData.get("nomeEquipe2"),
  });

  if (!camposValidados.success) {
    return { erros: camposValidados.error.flatten().fieldErrors };
  }

  const { nomeEquipe1, nomeEquipe2 } = camposValidados.data;

  let sala = null;
  for (let tentativa = 0; tentativa < 5 && !sala; tentativa++) {
    try {
      sala = await prisma.salaCaboGuerra.create({
        data: { codigo: gerarCodigo(), professorId: sessao.userId, nomeEquipe1, nomeEquipe2 },
      });
    } catch {
      sala = null;
    }
  }

  if (!sala) {
    return { mensagem: "Não foi possível criar a sala. Tente novamente." };
  }

  redirect(`/painel/cabo-de-guerra-online/${sala.codigo}`);
}

export async function criarSalaCaboGuerraPersonalizada(atividadeId: string) {
  const sessao = await verificarSessao();

  const atividade = await prisma.atividade.findUnique({ where: { id: atividadeId } });
  if (!atividade || atividade.professorId !== sessao.userId || atividade.tipo !== "cabo_de_guerra") {
    throw new Error("Atividade não encontrada.");
  }

  const perguntas = prepararPerguntasPersonalizadas(atividade);
  if (perguntas.length === 0) {
    throw new Error("Esta atividade não tem perguntas válidas para o Cabo de Guerra.");
  }

  let sala = null;
  for (let tentativa = 0; tentativa < 5 && !sala; tentativa++) {
    try {
      sala = await prisma.salaCaboGuerra.create({
        data: {
          codigo: gerarCodigo(),
          professorId: sessao.userId,
          nomeEquipe1: "Equipe Azul",
          nomeEquipe2: "Equipe Vermelha",
          totalRodadas: perguntas.length,
          perguntas: perguntas as unknown as Prisma.InputJsonValue,
        },
      });
    } catch {
      sala = null;
    }
  }

  if (!sala) {
    throw new Error("Não foi possível criar a sala.");
  }

  redirect(`/painel/cabo-de-guerra-online/${sala.codigo}`);
}

export async function iniciarPartidaCaboGuerra(codigo: string) {
  const sessao = await verificarSessao();

  const sala = await prisma.salaCaboGuerra.findUnique({ where: { codigo } });
  if (!sala || sala.professorId !== sessao.userId) {
    throw new Error("Sala não encontrada.");
  }

  const perguntasPersonalizadas = sala.perguntas as
    | { enunciado: string; alternativas: string[]; indiceCorreto: number }[]
    | null;

  const primeiraPergunta = perguntasPersonalizadas
    ? {
        texto: perguntasPersonalizadas[0].enunciado,
        resposta: perguntasPersonalizadas[0].indiceCorreto,
        alternativas: perguntasPersonalizadas[0].alternativas,
      }
    : { ...gerarPergunta(nivelDaRodada(1)), alternativas: null };

  await prisma.salaCaboGuerra.update({
    where: { id: sala.id },
    data: {
      status: "em_andamento",
      rodadaAtual: 1,
      perguntaTexto: primeiraPergunta.texto,
      perguntaResposta: primeiraPergunta.resposta,
      perguntaAlternativas: primeiraPergunta.alternativas ?? Prisma.JsonNull,
      perguntaComecouEm: new Date(),
      rodadaGanhaPor: null,
      rodadaTerminouEm: null,
      pontosEquipe1: 0,
      pontosEquipe2: 0,
    },
  });

  revalidatePath(`/painel/cabo-de-guerra-online/${codigo}`);
}

export async function encerrarSalaCaboGuerra(codigo: string) {
  const sessao = await verificarSessao();

  const sala = await prisma.salaCaboGuerra.findUnique({ where: { codigo } });
  if (!sala || sala.professorId !== sessao.userId) {
    throw new Error("Sala não encontrada.");
  }

  await prisma.salaCaboGuerra.update({ where: { id: sala.id }, data: { status: "encerrada" } });
  revalidatePath(`/painel/cabo-de-guerra-online/${codigo}`);
}

export async function entrarNaSalaCaboGuerra(
  _estado: EstadoEntrarCaboGuerra,
  formData: FormData
): Promise<EstadoEntrarCaboGuerra> {
  const camposValidados = EsquemaEntrarCaboGuerra.safeParse({
    codigo: formData.get("codigo"),
    apelido: formData.get("apelido"),
    equipe: formData.get("equipe"),
  });

  if (!camposValidados.success) {
    return { erros: camposValidados.error.flatten().fieldErrors };
  }

  const { codigo, apelido, equipe } = camposValidados.data;

  const sala = await prisma.salaCaboGuerra.findUnique({ where: { codigo } });
  if (!sala) {
    return { mensagem: "Código de sala não encontrado." };
  }
  if (sala.status !== "aberta") {
    return { mensagem: "Esta sala já começou ou foi encerrada." };
  }

  let participante;
  try {
    participante = await prisma.participanteCaboGuerra.create({
      data: { salaId: sala.id, apelido, equipe },
    });
  } catch {
    return { mensagem: "Esse apelido já está em uso nesta sala. Escolha outro." };
  }

  await criarSessaoParticipanteCaboGuerra(codigo, {
    participanteId: participante.id,
    salaId: sala.id,
  });
  redirect(`/cabo-guerra/${codigo}/jogo`);
}

type ResultadoRespostaCaboGuerra =
  | { ok: true; correta: boolean; tarde?: boolean }
  | { ok: false; mensagem: string };

export async function responderCaboGuerra(
  codigo: string,
  valorDigitado: string
): Promise<ResultadoRespostaCaboGuerra> {
  const sessaoParticipante = await obterSessaoParticipanteCaboGuerra(codigo);
  if (!sessaoParticipante) {
    return { ok: false, mensagem: "Sessão não encontrada. Entre na sala novamente." };
  }

  const sala = await prisma.salaCaboGuerra.findUnique({ where: { id: sessaoParticipante.salaId } });
  if (!sala || sala.status !== "em_andamento") {
    return { ok: false, mensagem: "O jogo não está em andamento." };
  }
  if (sala.rodadaGanhaPor !== null) {
    return { ok: true, correta: false, tarde: true };
  }

  const valor = parseInt(valorDigitado, 10);
  if (Number.isNaN(valor) || valor !== sala.perguntaResposta) {
    return { ok: true, correta: false };
  }

  const participante = await prisma.participanteCaboGuerra.findUnique({
    where: { id: sessaoParticipante.participanteId },
  });
  if (!participante || participante.salaId !== sala.id) {
    return { ok: false, mensagem: "Participante inválido." };
  }

  const campoPontos = participante.equipe === 1 ? "pontosEquipe1" : "pontosEquipe2";

  const atualizado = await prisma.salaCaboGuerra.updateMany({
    where: { id: sala.id, rodadaGanhaPor: null },
    data: {
      rodadaGanhaPor: participante.equipe,
      rodadaTerminouEm: new Date(),
      [campoPontos]: { increment: 1 },
    },
  });

  if (atualizado.count === 0) {
    return { ok: true, correta: true, tarde: true };
  }

  return { ok: true, correta: true };
}
