"use server";

import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verificarSessao } from "@/lib/acessoDados";
import { criarSessaoParticipante, obterSessaoParticipante } from "@/lib/salaSessao";
import { EsquemaEntrarSala, EstadoEntrarSala } from "@/lib/definicoes";

function gerarCodigo() {
  return String(crypto.randomInt(100000, 999999));
}

export async function iniciarSala(atividadeId: string) {
  const sessao = await verificarSessao();

  const atividade = await prisma.atividade.findUnique({ where: { id: atividadeId } });
  if (!atividade || atividade.professorId !== sessao.userId) {
    throw new Error("Atividade não encontrada.");
  }

  let sala = null;
  for (let tentativa = 0; tentativa < 5 && !sala; tentativa++) {
    try {
      sala = await prisma.salaAoVivo.create({
        data: { codigo: gerarCodigo(), atividadeId },
      });
    } catch {
      sala = null;
    }
  }

  if (!sala) {
    throw new Error("Não foi possível criar a sala. Tente novamente.");
  }

  redirect(`/painel/salas/${sala.codigo}`);
}

export async function avancarPergunta(codigo: string) {
  const sessao = await verificarSessao();

  const sala = await prisma.salaAoVivo.findUnique({
    where: { codigo },
    include: { atividade: true },
  });
  if (!sala || sala.atividade.professorId !== sessao.userId) {
    throw new Error("Sala não encontrada.");
  }

  const conteudo = sala.atividade.conteudoGerado as { questoes: unknown[] };
  const totalQuestoes = conteudo.questoes.length;
  const proximaPergunta = sala.perguntaAtual + 1;

  if (proximaPergunta >= totalQuestoes) {
    await prisma.salaAoVivo.update({
      where: { id: sala.id },
      data: { status: "encerrada" },
    });
  } else {
    await prisma.salaAoVivo.update({
      where: { id: sala.id },
      data: {
        perguntaAtual: proximaPergunta,
        status: "em_andamento",
        perguntaComecouEm: new Date(),
      },
    });
  }

  revalidatePath(`/painel/salas/${codigo}`);
}

export async function encerrarSala(codigo: string) {
  const sessao = await verificarSessao();

  const sala = await prisma.salaAoVivo.findUnique({
    where: { codigo },
    include: { atividade: true },
  });
  if (!sala || sala.atividade.professorId !== sessao.userId) {
    throw new Error("Sala não encontrada.");
  }

  await prisma.salaAoVivo.update({ where: { id: sala.id }, data: { status: "encerrada" } });
  revalidatePath(`/painel/salas/${codigo}`);
}

export async function entrarNaSala(
  _estado: EstadoEntrarSala,
  formData: FormData
): Promise<EstadoEntrarSala> {
  const camposValidados = EsquemaEntrarSala.safeParse({
    codigo: formData.get("codigo"),
    apelido: formData.get("apelido"),
  });

  if (!camposValidados.success) {
    return { erros: camposValidados.error.flatten().fieldErrors };
  }

  const { codigo, apelido } = camposValidados.data;

  const sala = await prisma.salaAoVivo.findUnique({ where: { codigo } });
  if (!sala) {
    return { mensagem: "Código de sala não encontrado." };
  }
  if (sala.status === "encerrada") {
    return { mensagem: "Esta sala já foi encerrada." };
  }

  let participante;
  try {
    participante = await prisma.participanteSala.create({
      data: { salaId: sala.id, apelido },
    });
  } catch {
    return { mensagem: "Esse apelido já está em uso nesta sala. Escolha outro." };
  }

  await criarSessaoParticipante(codigo, { participanteId: participante.id, salaId: sala.id });
  redirect(`/sala/${codigo}/jogo`);
}

type ResultadoResposta =
  | { ok: true; correta: boolean; pontosGanhos: number; respostaCorreta: string | undefined }
  | { ok: false; mensagem: string };

export async function responder(
  codigo: string,
  alternativaEscolhida: string
): Promise<ResultadoResposta> {
  const sessaoParticipante = await obterSessaoParticipante(codigo);
  if (!sessaoParticipante) {
    return { ok: false, mensagem: "Sessão não encontrada. Entre na sala novamente." };
  }

  const sala = await prisma.salaAoVivo.findUnique({
    where: { id: sessaoParticipante.salaId },
    include: { atividade: true },
  });
  if (!sala || sala.status !== "em_andamento") {
    return { ok: false, mensagem: "A pergunta não está mais disponível." };
  }

  const gabarito = sala.atividade.gabarito as { respostaCorreta: string }[];
  const respostaCorreta = gabarito[sala.perguntaAtual]?.respostaCorreta;
  const correta = alternativaEscolhida === respostaCorreta;

  const segundos = sala.perguntaComecouEm
    ? (Date.now() - sala.perguntaComecouEm.getTime()) / 1000
    : 0;
  const penalidade = Math.min(50, Math.floor(segundos * 2));
  const pontosGanhos = correta ? 100 - penalidade : 0;

  try {
    await prisma.$transaction([
      prisma.respostaParticipante.create({
        data: {
          participanteId: sessaoParticipante.participanteId,
          indiceQuestao: sala.perguntaAtual,
          correta,
          pontosGanhos,
        },
      }),
      prisma.participanteSala.update({
        where: { id: sessaoParticipante.participanteId },
        data: { pontuacao: { increment: pontosGanhos } },
      }),
    ]);
  } catch {
    return { ok: false, mensagem: "Você já respondeu esta pergunta." };
  }

  return { ok: true, correta, pontosGanhos, respostaCorreta };
}
