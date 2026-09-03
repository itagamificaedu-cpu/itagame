"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { exigirAssinaturaAtiva, verificarSessaoAluno } from "@/lib/acessoDados";
import { verificarDonoTrilha } from "@/app/actions/trilhas";

// Missões dentro de uma trilha (professor) + progresso do aluno (aluno):
// entregar/responder quiz/avaliar. XP, badge e desbloqueio de missões
// seguintes ficam concentrados em concluirMissao(), chamada nos três
// caminhos que podem aprovar uma missão (quiz automático certo, professor
// aprova entrega manual).

export type QuestaoQuizMissao = {
  enunciado: string;
  alternativas: string[];
  respostaCorreta: string;
};

export type EntradaAdicionarMissao = {
  trilhaId: string;
  titulo: string;
  descricao: string;
  tipoAtividade: "video" | "quiz" | "pratica" | "projeto" | "leitura" | "desafio";
  nivelDificuldade?: string;
  preRequisitoId?: string | null;
  criterioDesbloqueio?: string;
  xp: number;
  checkpointTipo: "quiz_automatico" | "correcao_professor" | "avaliacao_pratica" | "banca";
  notaMinima?: number | null;
  quizPerguntas?: QuestaoQuizMissao[];
  // Se preenchido, cria um badge novo e vincula à missão. Ícone é um emoji
  // (sem upload de imagem, pra manter simples na v1).
  badgeNovo?: { nome: string; descricao: string; icone?: string } | null;
};

export type ResultadoAcaoMissao = { ok: true } | { ok: false; erro: string };

export async function adicionarMissao(input: EntradaAdicionarMissao): Promise<ResultadoAcaoMissao> {
  const sessao = await exigirAssinaturaAtiva();
  const trilha = await verificarDonoTrilha(input.trilhaId, sessao.userId);

  if (trilha.status === "publicada") {
    return { ok: false, erro: "Essa trilha já foi publicada. Não dá mais pra adicionar missão nela." };
  }

  const titulo = input.titulo.trim();
  const descricao = input.descricao.trim();
  if (!titulo) return { ok: false, erro: "Dê um título pra missão." };
  if (!descricao) return { ok: false, erro: "Descreva a missão." };
  if (!Number.isFinite(input.xp) || input.xp <= 0) {
    return { ok: false, erro: "Informe um XP válido (maior que zero)." };
  }

  if (input.preRequisitoId) {
    const preRequisito = await prisma.missao.findUnique({ where: { id: input.preRequisitoId } });
    if (!preRequisito || preRequisito.trilhaId !== input.trilhaId) {
      return { ok: false, erro: "A missão pré-requisito escolhida não pertence a essa trilha." };
    }
  }

  let quizPerguntasLimpas: QuestaoQuizMissao[] | undefined;
  if (input.checkpointTipo === "quiz_automatico") {
    const perguntas = input.quizPerguntas ?? [];
    if (perguntas.length === 0) {
      return { ok: false, erro: "Adicione pelo menos uma pergunta do quiz." };
    }
    for (const [indice, pergunta] of perguntas.entries()) {
      const numero = indice + 1;
      const enunciado = pergunta.enunciado.trim();
      const alternativas = pergunta.alternativas.map((a) => a.trim()).filter(Boolean);
      const respostaCorreta = pergunta.respostaCorreta.trim();
      if (!enunciado) return { ok: false, erro: `Escreva o texto da pergunta ${numero} do quiz.` };
      if (alternativas.length < 2) {
        return { ok: false, erro: `A pergunta ${numero} do quiz precisa de pelo menos 2 alternativas.` };
      }
      if (!respostaCorreta || !alternativas.includes(respostaCorreta)) {
        return { ok: false, erro: `Marque a alternativa correta da pergunta ${numero} do quiz.` };
      }
    }
    quizPerguntasLimpas = perguntas.map((p) => ({
      enunciado: p.enunciado.trim(),
      alternativas: p.alternativas.map((a) => a.trim()).filter(Boolean),
      respostaCorreta: p.respostaCorreta.trim(),
    }));
  }

  let badgeId: string | undefined;
  if (input.badgeNovo?.nome.trim()) {
    const badge = await prisma.badge.create({
      data: {
        nome: input.badgeNovo.nome.trim(),
        descricao: input.badgeNovo.descricao.trim(),
        icone: input.badgeNovo.icone?.trim() || undefined,
      },
    });
    badgeId = badge.id;
  }

  const totalMissoes = await prisma.missao.count({ where: { trilhaId: input.trilhaId } });

  await prisma.missao.create({
    data: {
      titulo,
      descricao,
      xpRecompensa: input.xp,
      criadaPorId: sessao.userId,
      trilhaId: input.trilhaId,
      ordem: totalMissoes,
      tipoAtividade: input.tipoAtividade,
      nivelDificuldade: input.nivelDificuldade?.trim() || undefined,
      preRequisitoId: input.preRequisitoId || undefined,
      criterioDesbloqueio: input.criterioDesbloqueio?.trim() || undefined,
      checkpointTipo: input.checkpointTipo,
      notaMinima: input.notaMinima ?? undefined,
      quizPerguntas: quizPerguntasLimpas as Prisma.InputJsonValue | undefined,
      badgeId,
    },
  });

  revalidatePath(`/painel/trilhas/${input.trilhaId}`);
  return { ok: true };
}

export async function removerMissao(trilhaId: string, missaoId: string): Promise<ResultadoAcaoMissao> {
  const sessao = await exigirAssinaturaAtiva();
  const trilha = await verificarDonoTrilha(trilhaId, sessao.userId);

  if (trilha.status === "publicada") {
    return { ok: false, erro: "Essa trilha já foi publicada. Não dá mais pra remover missão dela." };
  }

  const missao = await prisma.missao.findUnique({ where: { id: missaoId } });
  if (!missao || missao.trilhaId !== trilhaId) {
    return { ok: false, erro: "Missão não encontrada nessa trilha." };
  }

  await prisma.$transaction([
    // Missões que tinham essa como pré-requisito ficam sem pré-requisito
    // (não pode apagar uma missão referenciada por outra sem tratar isso).
    prisma.missao.updateMany({ where: { preRequisitoId: missaoId }, data: { preRequisitoId: null } }),
    prisma.progressoAluno.deleteMany({ where: { missaoId } }),
    prisma.missao.delete({ where: { id: missaoId } }),
  ]);

  revalidatePath(`/painel/trilhas/${trilhaId}`);
  return { ok: true };
}

// --- conclusão de missão: XP + badge (idempotente) + desbloqueio ---

const NOME_BADGE_MESTRE_BNCC = "Mestre da Computação";

async function obterOuCriarBadgeMestreBncc() {
  const existente = await prisma.badge.findFirst({ where: { nome: NOME_BADGE_MESTRE_BNCC } });
  if (existente) return existente;
  return prisma.badge.create({
    data: {
      nome: NOME_BADGE_MESTRE_BNCC,
      descricao: "Completou pelo menos uma trilha de cada um dos 3 eixos da BNCC Computação.",
      icone: "🏆",
    },
  });
}

// Toda vez que uma missão de uma trilha de BNCC Computação é concluída,
// confere se essa trilha específica ficou 100% completa e, se sim, se o
// aluno já fechou pelo menos uma trilha de CADA um dos 3 eixos oficiais
// (na turma dele) — nesse caso concede o badge especial automaticamente.
// Não bloqueia nem atrasa a conclusão normal da missão se algo der errado
// aqui (é só um bônus cosmético em cima do progresso de verdade).
async function verificarConquistaBnccComputacao(alunoId: string, trilhaId: string | null) {
  if (!trilhaId) return;

  const trilhaAtual = await prisma.trilha.findUnique({ where: { id: trilhaId } });
  if (!trilhaAtual?.eixoBnccComputacao) return;

  const trilhasBncc = await prisma.trilha.findMany({
    where: { turmaId: trilhaAtual.turmaId, eixoBnccComputacao: { not: null } },
    include: { missoes: { select: { id: true } } },
  });

  const progressosConcluidos = await prisma.progressoAluno.findMany({
    where: {
      alunoId,
      status: "concluida",
      missao: { trilhaId: { in: trilhasBncc.map((t) => t.id) } },
    },
    select: { missaoId: true },
  });
  const missoesConcluidasIds = new Set(progressosConcluidos.map((p) => p.missaoId));

  const eixosConcluidos = new Set(
    trilhasBncc
      .filter((t) => t.missoes.length > 0 && t.missoes.every((m) => missoesConcluidasIds.has(m.id)))
      .map((t) => t.eixoBnccComputacao)
  );

  if (eixosConcluidos.size < 3) return;

  const badge = await obterOuCriarBadgeMestreBncc();
  await prisma.badgeConcedida.createMany({
    data: [{ alunoId, badgeId: badge.id }],
    skipDuplicates: true,
  });
}

async function concluirMissao(progressoId: string) {
  const progresso = await prisma.progressoAluno.findUnique({
    where: { id: progressoId },
    include: { missao: true },
  });
  if (!progresso) return;

  // Se a missão dá badge, cria a concessão (idempotente, via skipDuplicates)
  // dentro da mesma transação das outras duas operações.
  const badgeId = progresso.missao.badgeId;

  await prisma.$transaction(async (tx) => {
    await tx.progressoAluno.update({
      where: { id: progressoId },
      data: {
        status: "concluida",
        xpGanho: progresso.missao.xpRecompensa,
        concluidaEm: new Date(),
      },
    });
    await tx.xpTransacao.create({
      data: {
        alunoId: progresso.alunoId,
        origem: `Missão: ${progresso.missao.titulo}`,
        quantidade: progresso.missao.xpRecompensa,
      },
    });
    if (badgeId) {
      await tx.badgeConcedida.createMany({
        data: [{ alunoId: progresso.alunoId, badgeId }],
        skipDuplicates: true,
      });
    }
  });

  // Libera as missões que dependiam dessa como pré-requisito (trilha
  // linear). Em trilha livre não existe "bloqueada" pra desbloquear.
  const dependentes = await prisma.missao.findMany({
    where: { preRequisitoId: progresso.missaoId },
    select: { id: true },
  });

  if (dependentes.length > 0) {
    await prisma.progressoAluno.updateMany({
      where: {
        alunoId: progresso.alunoId,
        missaoId: { in: dependentes.map((m) => m.id) },
        status: "bloqueada",
      },
      data: { status: "disponivel" },
    });
  }

  await verificarConquistaBnccComputacao(progresso.alunoId, progresso.missao.trilhaId);
}

async function buscarProgressoDoAluno(progressoId: string) {
  const aluno = await verificarSessaoAluno();
  const progresso = await prisma.progressoAluno.findUnique({
    where: { id: progressoId },
    include: { missao: true },
  });
  if (!progresso || progresso.alunoId !== aluno.id) return null;
  return progresso;
}

export type ResultadoEntregaMissao = { ok: true } | { ok: false; erro: string };

// Entrega de missão que precisa de correção do professor (prática, projeto,
// leitura, banca etc.) — texto ou link. Fica "em_andamento" até o professor
// avaliar em avaliarMissao.
export async function entregarMissao(
  progressoId: string,
  entregaTexto: string
): Promise<ResultadoEntregaMissao> {
  const progresso = await buscarProgressoDoAluno(progressoId);
  if (!progresso) return { ok: false, erro: "Missão não encontrada." };
  if (progresso.status !== "disponivel" && progresso.status !== "em_andamento") {
    return { ok: false, erro: "Essa missão ainda está bloqueada." };
  }
  if (progresso.missao.checkpointTipo === "quiz_automatico") {
    return { ok: false, erro: "Essa missão é de quiz — responda pelo formulário do quiz." };
  }

  const texto = entregaTexto.trim();
  if (!texto) return { ok: false, erro: "Escreva ou cole sua entrega antes de enviar." };

  await prisma.progressoAluno.update({
    where: { id: progressoId },
    data: { status: "em_andamento", entregaTexto: texto, feedbackProfessor: null },
  });

  revalidatePath(`/trilha/${progresso.missao.trilhaId}`);
  return { ok: true };
}

export type ResultadoQuizMissao =
  | { ok: true; aprovado: boolean; acertos: number; total: number }
  | { ok: false; erro: string };

export async function responderQuizMissao(
  progressoId: string,
  respostas: string[]
): Promise<ResultadoQuizMissao> {
  const progresso = await buscarProgressoDoAluno(progressoId);
  if (!progresso) return { ok: false, erro: "Missão não encontrada." };
  if (progresso.status !== "disponivel" && progresso.status !== "em_andamento") {
    return { ok: false, erro: "Essa missão ainda está bloqueada." };
  }
  if (progresso.missao.checkpointTipo !== "quiz_automatico") {
    return { ok: false, erro: "Essa missão não é de quiz automático." };
  }

  const perguntas = (progresso.missao.quizPerguntas as QuestaoQuizMissao[] | null) ?? [];
  if (perguntas.length === 0) {
    return { ok: false, erro: "Essa missão não tem perguntas configuradas." };
  }

  const acertos = perguntas.reduce(
    (total, pergunta, indice) => (respostas[indice] === pergunta.respostaCorreta ? total + 1 : total),
    0
  );
  const percentual = (acertos / perguntas.length) * 100;
  const notaMinima = progresso.missao.notaMinima ?? 60;
  const aprovado = percentual >= notaMinima;

  if (aprovado) {
    await concluirMissao(progressoId);
  } else {
    await prisma.progressoAluno.update({
      where: { id: progressoId },
      data: { status: "em_andamento" },
    });
  }

  revalidatePath(`/trilha/${progresso.missao.trilhaId}`);
  return { ok: true, aprovado, acertos, total: perguntas.length };
}

export async function avaliarMissao(
  progressoId: string,
  aprovado: boolean,
  feedback?: string
): Promise<ResultadoAcaoMissao> {
  const sessao = await exigirAssinaturaAtiva();

  const progresso = await prisma.progressoAluno.findUnique({
    where: { id: progressoId },
    include: { missao: { include: { trilha: true } } },
  });
  if (!progresso || progresso.missao.trilha?.professorId !== sessao.userId) {
    return { ok: false, erro: "Entrega não encontrada." };
  }

  if (aprovado) {
    await concluirMissao(progressoId);
    await prisma.progressoAluno.update({
      where: { id: progressoId },
      data: { avaliadoPorId: sessao.userId, feedbackProfessor: feedback?.trim() || null },
    });
  } else {
    await prisma.progressoAluno.update({
      where: { id: progressoId },
      data: {
        status: "disponivel",
        avaliadoPorId: sessao.userId,
        feedbackProfessor: feedback?.trim() || "Sua entrega não foi aprovada. Tente novamente.",
      },
    });
  }

  revalidatePath(`/painel/trilhas/${progresso.missao.trilhaId}`);
  return { ok: true };
}
