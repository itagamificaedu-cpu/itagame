"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { gerarTrilhaComIa, type QuestaoTrilhaGerada } from "@/lib/ia";
import { EsquemaCriarTrilha, EstadoCriarTrilha } from "@/lib/definicoes";
import type { EixoBnccComputacao } from "@/lib/bnccComputacao";
import { modeloBnccPorId } from "@/lib/modelosBnccComputacao";

// Ações de professor pra Trilhas Educativas: criar, publicar e excluir. A
// criação de missão fica em missoes.ts (arquivo separado pra não ficar
// gigante). "Publicar" é o momento em que os alunos da turma passam a ver a
// trilha e o progresso de cada um é criado (ver publicarTrilha abaixo).

export async function verificarDonoTrilha(trilhaId: string, professorId: string) {
  const trilha = await prisma.trilha.findUnique({ where: { id: trilhaId } });
  if (!trilha || trilha.professorId !== professorId) {
    throw new Error("Trilha não encontrada.");
  }
  return trilha;
}

export async function criarTrilha(
  _estado: EstadoCriarTrilha,
  formData: FormData
): Promise<EstadoCriarTrilha> {
  const sessao = await exigirAssinaturaAtiva();

  const camposValidados = EsquemaCriarTrilha.safeParse({
    nome: formData.get("nome"),
    descricao: formData.get("descricao"),
    tipoEstrutura: formData.get("tipoEstrutura"),
    nivel: formData.get("nivel"),
    turmaId: formData.get("turmaId"),
  });

  if (!camposValidados.success) {
    return { erros: camposValidados.error.flatten().fieldErrors };
  }

  const { nome, descricao, tipoEstrutura, nivel, turmaId } = camposValidados.data;

  const turma = await prisma.turma.findUnique({ where: { id: turmaId } });
  if (!turma || turma.professorId !== sessao.userId) {
    return { mensagem: "Turma não encontrada." };
  }

  const trilha = await prisma.trilha.create({
    data: {
      nome,
      descricao,
      tipoEstrutura,
      nivel,
      turmaId,
      professorId: sessao.userId,
    },
  });

  revalidatePath("/painel/trilhas");
  redirect(`/painel/trilhas/${trilha.id}`);
}

export type ResultadoPublicarTrilha = { ok: true } | { ok: false; erro: string };

// Publica a trilha: a partir de agora os alunos da turma enxergam ela em
// /trilha. Cria o progresso inicial de cada aluno em cada missão — sem isso
// não tem como saber quais missões estão "bloqueada" vs "disponivel" pra
// cada aluno individualmente.
export async function publicarTrilha(trilhaId: string): Promise<ResultadoPublicarTrilha> {
  const sessao = await exigirAssinaturaAtiva();
  const trilha = await verificarDonoTrilha(trilhaId, sessao.userId);

  if (trilha.status === "publicada") {
    return { ok: false, erro: "Essa trilha já está publicada." };
  }

  const missoes = await prisma.missao.findMany({ where: { trilhaId } });
  if (missoes.length === 0) {
    return { ok: false, erro: "Adicione pelo menos uma missão antes de publicar." };
  }

  const alunos = await prisma.aluno.findMany({ where: { turmaId: trilha.turmaId } });
  if (alunos.length === 0) {
    return { ok: false, erro: "Essa turma ainda não tem alunos cadastrados." };
  }

  // Trilha "livre" ignora pré-requisito: tudo desbloqueado já na publicação.
  // Trilha "linear" só libera de cara as missões sem pré-requisito — as
  // outras começam "bloqueada" e vão sendo liberadas conforme o aluno conclui
  // a anterior (ver concluirMissao em missoes.ts).
  const progressosIniciais = alunos.flatMap((aluno) =>
    missoes.map((missao) => ({
      alunoId: aluno.id,
      missaoId: missao.id,
      status:
        trilha.tipoEstrutura === "livre" || !missao.preRequisitoId
          ? ("disponivel" as const)
          : ("bloqueada" as const),
    }))
  );

  await prisma.$transaction([
    prisma.trilha.update({ where: { id: trilhaId }, data: { status: "publicada" } }),
    prisma.progressoAluno.createMany({ data: progressosIniciais, skipDuplicates: true }),
  ]);

  revalidatePath(`/painel/trilhas/${trilhaId}`);
  revalidatePath("/trilha");
  return { ok: true };
}

function normalizarQuizPerguntas(perguntas: QuestaoTrilhaGerada[] | undefined) {
  if (!perguntas) return undefined;
  const validas = perguntas
    .map((p) => ({
      enunciado: p.enunciado.trim(),
      alternativas: p.alternativas.map((a) => a.trim()).filter(Boolean),
      respostaCorreta: p.respostaCorreta.trim(),
    }))
    .filter((p) => p.enunciado && p.alternativas.length >= 2 && p.alternativas.includes(p.respostaCorreta));
  return validas.length > 0 ? validas : undefined;
}

export type ResultadoGerarTrilhaIa = { ok: true; trilhaId: string } | { ok: false; erro: string };

// Gera uma trilha inteira (nome, descrição e todas as missões em sequência)
// com IA, alinhada à BNCC Computação. Sempre cria como "rascunho" — o
// professor revisa/ajusta as missões antes de publicar pros alunos.
export async function gerarTrilhaIa(input: {
  turmaId: string;
  nivel: string;
  tema?: string;
  quantidadeMissoes: number;
  // Vem preenchido quando a geração parte da aba "BNCC Computação" — trava
  // a trilha nesse eixo específico e fica salvo pra exibir o selo depois.
  eixo?: EixoBnccComputacao;
}): Promise<ResultadoGerarTrilhaIa> {
  const sessao = await exigirAssinaturaAtiva();

  const turma = await prisma.turma.findUnique({ where: { id: input.turmaId } });
  if (!turma || turma.professorId !== sessao.userId) {
    return { ok: false, erro: "Turma não encontrada." };
  }

  const quantidade = Math.min(8, Math.max(3, Math.round(input.quantidadeMissoes) || 5));

  let gerada;
  try {
    gerada = await gerarTrilhaComIa({
      nivel: input.nivel,
      tema: input.tema,
      quantidadeMissoes: quantidade,
      eixo: input.eixo,
    });
  } catch {
    return { ok: false, erro: "Não consegui gerar a trilha agora. Tente novamente em instantes." };
  }

  if (gerada.missoes.length === 0) {
    return { ok: false, erro: "A IA não gerou nenhuma missão. Tente novamente." };
  }

  const trilhaId = await prisma.$transaction(async (tx) => {
    const trilha = await tx.trilha.create({
      data: {
        nome: gerada.nome,
        descricao: gerada.descricao,
        tipoEstrutura: "linear",
        nivel: input.nivel,
        competenciasBncc: gerada.competenciasBncc,
        eixoBnccComputacao: input.eixo,
        turmaId: input.turmaId,
        professorId: sessao.userId,
      },
    });

    let preRequisitoId: string | undefined;
    for (const [indice, missao] of gerada.missoes.entries()) {
      const quizPerguntas =
        missao.checkpointTipo === "quiz_automatico"
          ? normalizarQuizPerguntas(missao.quizPerguntas)
          : undefined;

      const criada = await tx.missao.create({
        data: {
          titulo: missao.titulo,
          descricao: missao.descricao,
          xpRecompensa: Math.max(1, Math.round(missao.xp) || 10),
          criadaPorId: sessao.userId,
          trilhaId: trilha.id,
          ordem: indice,
          tipoAtividade: missao.tipoAtividade,
          preRequisitoId,
          checkpointTipo: quizPerguntas ? "quiz_automatico" : "correcao_professor",
          quizPerguntas: quizPerguntas as Prisma.InputJsonValue | undefined,
        },
      });
      preRequisitoId = criada.id;
    }

    return trilha.id;
  });

  revalidatePath("/painel/trilhas");
  revalidatePath("/painel/bncc-computacao");
  return { ok: true, trilhaId };
}

// Adiciona uma trilha MODELO (conteúdo pronto, escrito à mão — ver
// src/lib/modelosBnccComputacao.ts) na turma, sem chamar IA nenhuma —
// instantâneo, ao contrário de gerarTrilhaIa. Mesma estrutura de trilha
// "linear" com missões em sequência, já com o eixo BNCC marcado.
export async function criarTrilhaAPartirDeModelo(input: {
  modeloId: string;
  turmaId: string;
}): Promise<ResultadoGerarTrilhaIa> {
  const sessao = await exigirAssinaturaAtiva();

  const modelo = modeloBnccPorId(input.modeloId);
  if (!modelo) {
    return { ok: false, erro: "Modelo não encontrado." };
  }

  const turma = await prisma.turma.findUnique({ where: { id: input.turmaId } });
  if (!turma || turma.professorId !== sessao.userId) {
    return { ok: false, erro: "Turma não encontrada." };
  }

  const trilhaId = await prisma.$transaction(async (tx) => {
    const trilha = await tx.trilha.create({
      data: {
        nome: modelo.nome,
        descricao: modelo.descricao,
        tipoEstrutura: "linear",
        nivel: modelo.nivelSugerido,
        eixoBnccComputacao: modelo.eixo,
        turmaId: input.turmaId,
        professorId: sessao.userId,
      },
    });

    let preRequisitoId: string | undefined;
    for (const [indice, missao] of modelo.missoes.entries()) {
      const quizPerguntas =
        missao.checkpointTipo === "quiz_automatico" ? normalizarQuizPerguntas(missao.quizPerguntas) : undefined;

      const criada = await tx.missao.create({
        data: {
          titulo: missao.titulo,
          descricao: missao.descricao,
          xpRecompensa: missao.xp,
          criadaPorId: sessao.userId,
          trilhaId: trilha.id,
          ordem: indice,
          tipoAtividade: missao.tipoAtividade,
          preRequisitoId,
          checkpointTipo: quizPerguntas ? "quiz_automatico" : "correcao_professor",
          quizPerguntas: quizPerguntas as Prisma.InputJsonValue | undefined,
        },
      });
      preRequisitoId = criada.id;
    }

    return trilha.id;
  });

  revalidatePath("/painel/trilhas");
  revalidatePath("/painel/bncc-computacao");
  return { ok: true, trilhaId };
}

export async function excluirTrilha(trilhaId: string) {
  const sessao = await exigirAssinaturaAtiva();
  await verificarDonoTrilha(trilhaId, sessao.userId);

  const missoes = await prisma.missao.findMany({ where: { trilhaId }, select: { id: true } });
  const missaoIds = missoes.map((m) => m.id);

  await prisma.$transaction([
    prisma.progressoAluno.deleteMany({ where: { missaoId: { in: missaoIds } } }),
    prisma.missao.deleteMany({ where: { trilhaId } }),
    prisma.trilha.delete({ where: { id: trilhaId } }),
  ]);

  revalidatePath("/painel/trilhas");
  redirect("/painel/trilhas");
}
