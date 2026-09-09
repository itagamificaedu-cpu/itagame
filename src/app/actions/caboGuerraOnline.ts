"use server";

import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { verificarPinAluno } from "@/lib/alunoPin";
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
} from "@/lib/definicoes";
import { Prisma } from "@prisma/client";

function gerarCodigo() {
  return String(crypto.randomInt(100000, 999999));
}

async function validarTurmaDoProfessor(turmaId: string | undefined, professorId: string) {
  if (!turmaId) return null;
  const turma = await prisma.turma.findUnique({ where: { id: turmaId } });
  if (!turma || turma.professorId !== professorId) return null;
  return turma.id;
}

export async function criarSalaCaboGuerra(
  _estado: EstadoCriarSalaCaboGuerra,
  formData: FormData
): Promise<EstadoCriarSalaCaboGuerra> {
  const sessao = await exigirAssinaturaAtiva();

  const camposValidados = EsquemaCriarSalaCaboGuerra.safeParse({
    modo: formData.get("modo") || undefined,
    nomeEquipe1: formData.get("nomeEquipe1") || undefined,
    nomeEquipe2: formData.get("nomeEquipe2") || undefined,
    turmaId: formData.get("turmaId") || undefined,
  });

  if (!camposValidados.success) {
    return { erros: camposValidados.error.flatten().fieldErrors };
  }

  const { modo, turmaId } = camposValidados.data;
  const nomeEquipe1 = camposValidados.data.nomeEquipe1?.trim() || "Equipe Azul";
  const nomeEquipe2 = camposValidados.data.nomeEquipe2?.trim() || "Equipe Vermelha";

  const turmaValidada = await validarTurmaDoProfessor(turmaId, sessao.userId);

  let sala = null;
  for (let tentativa = 0; tentativa < 5 && !sala; tentativa++) {
    try {
      sala = await prisma.salaCaboGuerra.create({
        data: {
          codigo: gerarCodigo(),
          professorId: sessao.userId,
          modo,
          nomeEquipe1,
          nomeEquipe2,
          turmaId: turmaValidada,
        },
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

export async function criarSalaCaboGuerraPersonalizada(atividadeId: string, formData: FormData) {
  const sessao = await exigirAssinaturaAtiva();

  const atividade = await prisma.atividade.findUnique({ where: { id: atividadeId } });
  if (!atividade || atividade.professorId !== sessao.userId || atividade.tipo !== "cabo_de_guerra") {
    throw new Error("Atividade não encontrada.");
  }

  const perguntas = prepararPerguntasPersonalizadas(atividade);
  if (perguntas.length === 0) {
    throw new Error("Esta atividade não tem perguntas válidas para o Cabo de Guerra.");
  }

  const turmaValidada = await validarTurmaDoProfessor(
    (formData.get("turmaId") as string) || undefined,
    sessao.userId
  );

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
          turmaId: turmaValidada,
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
  const sessao = await exigirAssinaturaAtiva();

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
      rodadaGanhaPorParticipanteId: null,
      rodadaTerminouEm: null,
      pontosEquipe1: 0,
      pontosEquipe2: 0,
    },
  });

  revalidatePath(`/painel/cabo-de-guerra-online/${codigo}`);
}

export async function encerrarSalaCaboGuerra(codigo: string) {
  const sessao = await exigirAssinaturaAtiva();

  const sala = await prisma.salaCaboGuerra.findUnique({ where: { codigo } });
  if (!sala || sala.professorId !== sessao.userId) {
    throw new Error("Sala não encontrada.");
  }

  await prisma.salaCaboGuerra.update({ where: { id: sala.id }, data: { status: "encerrada" } });
  revalidatePath(`/painel/cabo-de-guerra-online/${codigo}`);
}

// --- entrada do aluno ---

export type InfoSalaCaboGuerraEntrada =
  | {
      ok: true;
      modo: "equipes" | "individual";
      nomeEquipe1: string;
      nomeEquipe2: string;
      turma: { id: string; nome: string; alunos: { id: string; nome: string }[] } | null;
    }
  | { ok: false; erro: string };

export async function buscarSalaCaboGuerraParaEntrada(codigo: string): Promise<InfoSalaCaboGuerraEntrada> {
  const codigoLimpo = codigo.trim();
  if (codigoLimpo.length !== 6) {
    return { ok: false, erro: "O código tem 6 dígitos." };
  }

  const sala = await prisma.salaCaboGuerra.findUnique({
    where: { codigo: codigoLimpo },
    include: { turma: { include: { alunos: { orderBy: { nome: "asc" } } } } },
  });

  if (!sala) {
    return { ok: false, erro: "Código de sala não encontrado." };
  }
  if (sala.status !== "aberta") {
    return { ok: false, erro: "Esta sala já começou ou foi encerrada." };
  }

  return {
    ok: true,
    modo: sala.modo,
    nomeEquipe1: sala.nomeEquipe1,
    nomeEquipe2: sala.nomeEquipe2,
    turma: sala.turma
      ? {
          id: sala.turma.id,
          nome: sala.turma.nome,
          alunos: sala.turma.alunos.map((a) => ({ id: a.id, nome: a.nome })),
        }
      : null,
  };
}

export type ResultadoEntrarCaboGuerra = { ok: true } | { ok: false; erro: string };

export async function entrarNaSalaCaboGuerra(
  codigo: string,
  apelido: string,
  equipe?: 1 | 2
): Promise<ResultadoEntrarCaboGuerra> {
  const camposValidados = EsquemaEntrarCaboGuerra.safeParse({ codigo, apelido, equipe });

  if (!camposValidados.success) {
    const primeiroErro = Object.values(camposValidados.error.flatten().fieldErrors)[0]?.[0];
    return { ok: false, erro: primeiroErro ?? "Dados inválidos." };
  }

  const dados = camposValidados.data;

  const sala = await prisma.salaCaboGuerra.findUnique({ where: { codigo: dados.codigo } });
  if (!sala) {
    return { ok: false, erro: "Código de sala não encontrado." };
  }
  if (sala.status !== "aberta") {
    return { ok: false, erro: "Esta sala já começou ou foi encerrada." };
  }
  if (sala.turmaId) {
    return { ok: false, erro: "Essa sala pede pra entrar escolhendo seu nome na turma. Volte e tente de novo." };
  }
  if (sala.modo === "equipes" && !dados.equipe) {
    return { ok: false, erro: "Escolha uma equipe." };
  }

  let participante;
  try {
    participante = await prisma.participanteCaboGuerra.create({
      data: {
        salaId: sala.id,
        apelido: dados.apelido,
        equipe: sala.modo === "individual" ? 0 : (dados.equipe as number),
      },
    });
  } catch {
    return { ok: false, erro: "Esse apelido já está em uso nesta sala. Escolha outro." };
  }

  await criarSessaoParticipanteCaboGuerra(dados.codigo, {
    participanteId: participante.id,
    salaId: sala.id,
  });
  redirect(`/cabo-guerra/${dados.codigo}/jogo`);
}

export type ResultadoEntrarComoAlunoCaboGuerra = { ok: true } | { ok: false; erro: string };

// Entrada vinculada ao aluno de verdade (nome da turma + PIN), pra pontuação
// ficar de fato ligada ao aluno entre partidas diferentes — ver comentário
// em prisma/schema.prisma no campo turmaId de SalaCaboGuerra.
export async function entrarComoAlunoNaSalaCaboGuerra(
  codigo: string,
  alunoId: string,
  pin: string,
  equipe?: 1 | 2
): Promise<ResultadoEntrarComoAlunoCaboGuerra> {
  const sala = await prisma.salaCaboGuerra.findUnique({ where: { codigo } });
  if (!sala) {
    return { ok: false, erro: "Código de sala não encontrado." };
  }
  if (sala.status !== "aberta") {
    return { ok: false, erro: "Esta sala já começou ou foi encerrada." };
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
  if (sala.modo === "equipes" && !equipe) {
    return { ok: false, erro: "Escolha uma equipe." };
  }

  // Reentrada: se o aluno já tinha entrado nessa sala (ex: recarregou a
  // página e perdeu o cookie), reaproveita o participante em vez de tentar
  // criar de novo e esbarrar na restrição de apelido único.
  let participante = await prisma.participanteCaboGuerra.findFirst({
    where: { salaId: sala.id, alunoId: resultadoPin.aluno.id },
  });

  if (!participante) {
    try {
      participante = await prisma.participanteCaboGuerra.create({
        data: {
          salaId: sala.id,
          apelido: resultadoPin.aluno.nome,
          alunoId: resultadoPin.aluno.id,
          equipe: sala.modo === "individual" ? 0 : (equipe as number),
        },
      });
    } catch {
      return { ok: false, erro: "Não foi possível entrar na sala. Tente de novo." };
    }
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

  if (sala.modo === "individual") {
    const atualizado = await prisma.salaCaboGuerra.updateMany({
      where: { id: sala.id, rodadaGanhaPor: null },
      data: {
        rodadaGanhaPor: 1,
        rodadaGanhaPorParticipanteId: participante.id,
        rodadaTerminouEm: new Date(),
      },
    });

    if (atualizado.count === 0) {
      return { ok: true, correta: true, tarde: true };
    }

    await prisma.participanteCaboGuerra.update({
      where: { id: participante.id },
      data: { pontuacao: { increment: 1 } },
    });

    return { ok: true, correta: true };
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

  await prisma.participanteCaboGuerra.update({
    where: { id: participante.id },
    data: { pontuacao: { increment: 1 } },
  });

  return { ok: true, correta: true };
}
