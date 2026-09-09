"use server";

import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { verificarPinAluno } from "@/lib/alunoPin";
import { criarSessaoParticipante, obterSessaoParticipante } from "@/lib/salaSessao";
import { normalizarResposta } from "@/lib/normalizarResposta";
import { EsquemaEntrarSala } from "@/lib/definicoes";

function gerarCodigo() {
  return String(crypto.randomInt(100000, 999999));
}

export async function iniciarSala(atividadeId: string, formData: FormData) {
  const sessao = await exigirAssinaturaAtiva();

  const atividade = await prisma.atividade.findUnique({ where: { id: atividadeId } });
  if (!atividade || atividade.professorId !== sessao.userId) {
    throw new Error("Atividade não encontrada.");
  }

  const turmaIdInformada = (formData.get("turmaId") as string) || undefined;
  let turmaId: string | null = null;
  if (turmaIdInformada) {
    const turma = await prisma.turma.findUnique({ where: { id: turmaIdInformada } });
    if (turma && turma.professorId === sessao.userId) {
      turmaId = turma.id;
    }
  }

  let sala = null;
  for (let tentativa = 0; tentativa < 5 && !sala; tentativa++) {
    try {
      sala = await prisma.salaAoVivo.create({
        data: { codigo: gerarCodigo(), atividadeId, turmaId },
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
  const sessao = await exigirAssinaturaAtiva();

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
  const sessao = await exigirAssinaturaAtiva();

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

export type ResultadoEntrarSala = { ok: true } | { ok: false; erro: string };

export async function entrarNaSala(codigo: string, apelido: string): Promise<ResultadoEntrarSala> {
  const camposValidados = EsquemaEntrarSala.safeParse({ codigo, apelido });

  if (!camposValidados.success) {
    const primeiroErro = Object.values(camposValidados.error.flatten().fieldErrors)[0]?.[0];
    return { ok: false, erro: primeiroErro ?? "Dados inválidos." };
  }

  const dados = camposValidados.data;

  const sala = await prisma.salaAoVivo.findUnique({ where: { codigo: dados.codigo } });
  if (!sala) {
    return { ok: false, erro: "Código de sala não encontrado." };
  }
  if (sala.status === "encerrada") {
    return { ok: false, erro: "Esta sala já foi encerrada." };
  }
  if (sala.turmaId) {
    return { ok: false, erro: "Essa sala pede pra entrar escolhendo seu nome na turma. Volte e tente de novo." };
  }

  let participante;
  try {
    participante = await prisma.participanteSala.create({
      data: { salaId: sala.id, apelido: dados.apelido },
    });
  } catch {
    return { ok: false, erro: "Esse apelido já está em uso nesta sala. Escolha outro." };
  }

  await criarSessaoParticipante(dados.codigo, { participanteId: participante.id, salaId: sala.id });
  redirect(`/sala/${dados.codigo}/jogo`);
}

export type InfoSalaEntrada =
  | { ok: true; turma: { id: string; nome: string; alunos: { id: string; nome: string }[] } | null }
  | { ok: false; erro: string };

export async function buscarSalaParaEntrada(codigo: string): Promise<InfoSalaEntrada> {
  const codigoLimpo = codigo.trim();
  if (codigoLimpo.length !== 6) {
    return { ok: false, erro: "O código tem 6 dígitos." };
  }

  const sala = await prisma.salaAoVivo.findUnique({
    where: { codigo: codigoLimpo },
    include: { turma: { include: { alunos: { orderBy: { nome: "asc" } } } } },
  });

  if (!sala) {
    return { ok: false, erro: "Código de sala não encontrado." };
  }
  if (sala.status === "encerrada") {
    return { ok: false, erro: "Esta sala já foi encerrada." };
  }

  return {
    ok: true,
    turma: sala.turma
      ? {
          id: sala.turma.id,
          nome: sala.turma.nome,
          alunos: sala.turma.alunos.map((a) => ({ id: a.id, nome: a.nome })),
        }
      : null,
  };
}

// Entrada vinculada ao aluno de verdade — ver comentário equivalente em
// entrarComoAlunoNaSalaCaboGuerra (actions/caboGuerraOnline.ts).
export async function entrarComoAlunoNaSala(
  codigo: string,
  alunoId: string,
  pin: string
): Promise<ResultadoEntrarSala> {
  const sala = await prisma.salaAoVivo.findUnique({ where: { codigo } });
  if (!sala) {
    return { ok: false, erro: "Código de sala não encontrado." };
  }
  if (sala.status === "encerrada") {
    return { ok: false, erro: "Esta sala já foi encerrada." };
  }
  if (!sala.turmaId) {
    return { ok: false, erro: "Essa sala não está vinculada a uma turma." };
  }

  const resultadoPin = await verificarPinAluno(alunoId, pin);
  if (!resultadoPin.ok) {
    return resultadoPin;
  }
  if (resultadoPin.aluno.turmaId !== sala.turmaId) {
    return { ok: false, erro: "Esse aluno não é dessa turma." };
  }

  let participante = await prisma.participanteSala.findFirst({
    where: { salaId: sala.id, alunoId: resultadoPin.aluno.id },
  });

  if (!participante) {
    try {
      participante = await prisma.participanteSala.create({
        data: { salaId: sala.id, apelido: resultadoPin.aluno.nome, alunoId: resultadoPin.aluno.id },
      });
    } catch {
      return { ok: false, erro: "Não foi possível entrar na sala. Tente de novo." };
    }
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

  // Quiz e verdadeiro/falso comparam exato (a resposta vem de um botão, sem
  // margem de digitação). Completar frase e associar colunas o aluno digita
  // de próprio punho, então compara normalizado (sem acento/maiúscula/
  // pontuação) pra não travar por causa de "sao paulo" vs "São Paulo".
  const respostaLivre =
    sala.atividade.tipo === "completar_frase" || sala.atividade.tipo === "associar_colunas";
  const correta = respostaLivre
    ? normalizarResposta(alternativaEscolhida) === normalizarResposta(respostaCorreta ?? "")
    : alternativaEscolhida === respostaCorreta;

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
