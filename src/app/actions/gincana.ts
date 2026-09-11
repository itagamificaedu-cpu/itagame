"use server";

import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma, TipoAtividade } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { prepararPerguntasPersonalizadas } from "@/lib/caboGuerraPersonalizado";

// Mesmos tipos de atividade que dá pra jogar numa Sala Ao Vivo — ver
// TIPOS_SEM_SALA_AO_VIVO em painel/atividades/[id]/page.tsx. Cabo de guerra
// tem o jogo dedicado dele (rodada tipo "cabo_de_guerra"); caça-palavras e
// apresentação não têm modo "sala ao vivo" e ficam de fora da gincana online
// (viram pontuação manual, lançada na mão pelo professor).
const TIPOS_QUIZ_AO_VIVO: TipoAtividade[] = [
  "quiz",
  "verdadeiro_falso",
  "completar_frase",
  "associar_colunas",
];

function gerarCodigo() {
  return String(crypto.randomInt(100000, 999999));
}

// Muita escola nomeia as turmas todas iguais (ex: "8ANO") e usa o campo
// série pra diferenciar de verdade (A, B, C) — sem isso aqui, o painel da
// gincana mostrava "8ANO" três vezes, impossível saber qual é qual.
function nomeExibicaoTurma(turma: { nome: string; serie: string }) {
  return turma.serie ? `${turma.nome} (${turma.serie})` : turma.nome;
}

async function buscarGincanaDoProfessor(gincanaId: string, professorId: string) {
  const gincana = await prisma.gincana.findUnique({
    where: { id: gincanaId },
    include: { times: { include: { turma: true } }, rodadas: true },
  });
  if (!gincana || gincana.professorId !== professorId) {
    throw new Error("Gincana não encontrada.");
  }
  return gincana;
}

export async function criarGincana(formData: FormData) {
  const sessao = await exigirAssinaturaAtiva();

  const nome = (formData.get("nome") as string)?.trim();
  const turmaIds = formData.getAll("turmaIds") as string[];

  if (!nome || nome.length < 2) {
    throw new Error("Informe o nome da gincana.");
  }
  if (turmaIds.length < 2) {
    throw new Error("Escolha pelo menos 2 turmas pra disputar a gincana.");
  }

  const turmasValidas = await prisma.turma.findMany({
    where: { id: { in: turmaIds }, professorId: sessao.userId },
    select: { id: true },
  });
  if (turmasValidas.length < 2) {
    throw new Error("Escolha pelo menos 2 turmas válidas.");
  }

  const gincana = await prisma.gincana.create({
    data: {
      nome,
      professorId: sessao.userId,
      times: { create: turmasValidas.map((t) => ({ turmaId: t.id })) },
    },
  });

  revalidatePath("/painel/gincana");
  redirect(`/painel/gincana/${gincana.id}`);
}

export async function adicionarTurmaNaGincana(gincanaId: string, formData: FormData) {
  const sessao = await exigirAssinaturaAtiva();
  const gincana = await buscarGincanaDoProfessor(gincanaId, sessao.userId);

  const turmaId = formData.get("turmaId") as string;
  const turma = await prisma.turma.findUnique({ where: { id: turmaId } });
  if (!turma || turma.professorId !== sessao.userId) {
    throw new Error("Turma não encontrada.");
  }

  await prisma.gincanaTime.upsert({
    where: { gincanaId_turmaId: { gincanaId: gincana.id, turmaId } },
    update: {},
    create: { gincanaId: gincana.id, turmaId },
  });

  revalidatePath(`/painel/gincana/${gincanaId}`);
}

export async function ajustarPontosManuais(gincanaId: string, timeId: string, delta: number) {
  const sessao = await exigirAssinaturaAtiva();
  const gincana = await buscarGincanaDoProfessor(gincanaId, sessao.userId);

  const time = gincana.times.find((t) => t.id === timeId);
  if (!time) {
    throw new Error("Time não encontrado nessa gincana.");
  }

  await prisma.gincanaTime.update({
    where: { id: timeId },
    data: { pontosManuais: { increment: delta } },
  });

  revalidatePath(`/painel/gincana/${gincanaId}`);
}

export async function criarRodadaQuiz(gincanaId: string, atividadeId: string) {
  const sessao = await exigirAssinaturaAtiva();
  const gincana = await buscarGincanaDoProfessor(gincanaId, sessao.userId);

  const atividade = await prisma.atividade.findUnique({ where: { id: atividadeId } });
  if (!atividade || atividade.professorId !== sessao.userId) {
    throw new Error("Atividade não encontrada.");
  }
  if (!TIPOS_QUIZ_AO_VIVO.includes(atividade.tipo)) {
    throw new Error("Esse tipo de atividade não dá pra jogar em Sala Ao Vivo.");
  }
  if (gincana.times.length === 0) {
    throw new Error("Adicione turmas na gincana antes de criar uma rodada.");
  }

  const salasPorTurma: { turmaId: string; salaCodigo: string }[] = [];
  for (const time of gincana.times) {
    let sala = null;
    for (let tentativa = 0; tentativa < 5 && !sala; tentativa++) {
      try {
        sala = await prisma.salaAoVivo.create({
          data: { codigo: gerarCodigo(), atividadeId, turmaId: time.turmaId },
        });
      } catch {
        sala = null;
      }
    }
    if (!sala) {
      throw new Error(`Não foi possível criar a sala pra turma ${nomeExibicaoTurma(time.turma)}.`);
    }
    salasPorTurma.push({ turmaId: time.turmaId, salaCodigo: sala.codigo });
  }

  await prisma.$transaction([
    prisma.gincanaRodada.create({
      data: {
        gincanaId: gincana.id,
        tipo: "quiz",
        atividadeId,
        salasQuizPorTurma: salasPorTurma as unknown as Prisma.InputJsonValue,
      },
    }),
    prisma.gincana.update({ where: { id: gincana.id }, data: { status: "em_andamento" } }),
  ]);

  revalidatePath(`/painel/gincana/${gincanaId}`);
}

export async function criarRodadaCaboDeGuerra(
  gincanaId: string,
  atividadeId: string,
  equipe1TurmaId: string,
  equipe2TurmaId: string
) {
  const sessao = await exigirAssinaturaAtiva();
  const gincana = await buscarGincanaDoProfessor(gincanaId, sessao.userId);

  if (equipe1TurmaId === equipe2TurmaId) {
    throw new Error("Escolha duas turmas diferentes pra disputar.");
  }
  const time1 = gincana.times.find((t) => t.turmaId === equipe1TurmaId);
  const time2 = gincana.times.find((t) => t.turmaId === equipe2TurmaId);
  if (!time1 || !time2) {
    throw new Error("As duas turmas precisam estar na gincana.");
  }

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
          modo: "equipes",
          nomeEquipe1: nomeExibicaoTurma(time1.turma),
          nomeEquipe2: nomeExibicaoTurma(time2.turma),
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

  await prisma.gincanaRodada.create({
    data: {
      gincanaId: gincana.id,
      tipo: "cabo_de_guerra",
      atividadeId,
      salaCaboGuerraCodigo: sala.codigo,
      equipe1TurmaId,
      equipe2TurmaId,
    },
  });

  revalidatePath(`/painel/gincana/${gincanaId}`);
}

export type RankingGincanaTime = {
  timeId: string;
  turmaId: string;
  turmaNome: string;
  pontosManuais: number;
  pontosQuiz: number;
  pontosCaboGuerra: number;
  total: number;
};

export type RodadaGincanaResumo = {
  id: string;
  tipo: "quiz" | "cabo_de_guerra";
  atividadeTitulo: string;
  criadaEm: string;
  // quiz: 1 código de sala por turma. cabo de guerra: 1 código só, com as
  // duas turmas envolvidas.
  salasQuiz?: { turmaNome: string; salaCodigo: string }[];
  salaCaboGuerra?: { salaCodigo: string; equipe1Nome: string; equipe2Nome: string };
};

export type EstadoGincana = {
  id: string;
  nome: string;
  status: "preparando" | "em_andamento" | "encerrada";
  ranking: RankingGincanaTime[];
  rodadas: RodadaGincanaResumo[];
};

export async function obterEstadoGincana(gincanaId: string): Promise<EstadoGincana> {
  const sessao = await exigirAssinaturaAtiva();

  const gincana = await prisma.gincana.findUnique({
    where: { id: gincanaId },
    include: {
      times: { include: { turma: true } },
      rodadas: { include: { atividade: true }, orderBy: { criadaEm: "asc" } },
    },
  });
  if (!gincana || gincana.professorId !== sessao.userId) {
    throw new Error("Gincana não encontrada.");
  }

  const pontosQuizPorTurma = new Map<string, number>();
  const pontosCaboGuerraPorTurma = new Map<string, number>();

  const rodadasResumo: RodadaGincanaResumo[] = [];

  for (const rodada of gincana.rodadas) {
    if (rodada.tipo === "quiz") {
      const salasPorTurma = (rodada.salasQuizPorTurma ?? []) as {
        turmaId: string;
        salaCodigo: string;
      }[];
      const codigos = salasPorTurma.map((s) => s.salaCodigo);
      const salas = await prisma.salaAoVivo.findMany({
        where: { codigo: { in: codigos } },
        include: { participantes: { select: { pontuacao: true } } },
      });
      const salaPorCodigo = new Map(salas.map((s) => [s.codigo, s]));

      const salasQuiz: { turmaNome: string; salaCodigo: string }[] = [];
      for (const item of salasPorTurma) {
        const time = gincana.times.find((t) => t.turmaId === item.turmaId);
        if (!time) continue;
        const sala = salaPorCodigo.get(item.salaCodigo);
        const pontosDaSala = sala
          ? sala.participantes.reduce((soma, p) => soma + p.pontuacao, 0)
          : 0;
        pontosQuizPorTurma.set(
          item.turmaId,
          (pontosQuizPorTurma.get(item.turmaId) ?? 0) + pontosDaSala
        );
        salasQuiz.push({ turmaNome: nomeExibicaoTurma(time.turma), salaCodigo: item.salaCodigo });
      }

      rodadasResumo.push({
        id: rodada.id,
        tipo: "quiz",
        atividadeTitulo: rodada.atividade
          ? ((rodada.atividade.conteudoGerado as { titulo?: string })?.titulo ?? "Quiz")
          : "Quiz",
        criadaEm: rodada.criadaEm.toISOString(),
        salasQuiz,
      });
    } else if (rodada.tipo === "cabo_de_guerra" && rodada.salaCaboGuerraCodigo) {
      const sala = await prisma.salaCaboGuerra.findUnique({
        where: { codigo: rodada.salaCaboGuerraCodigo },
      });
      const time1 = gincana.times.find((t) => t.turmaId === rodada.equipe1TurmaId);
      const time2 = gincana.times.find((t) => t.turmaId === rodada.equipe2TurmaId);

      if (sala && time1) {
        pontosCaboGuerraPorTurma.set(
          time1.turmaId,
          (pontosCaboGuerraPorTurma.get(time1.turmaId) ?? 0) + sala.pontosEquipe1
        );
      }
      if (sala && time2) {
        pontosCaboGuerraPorTurma.set(
          time2.turmaId,
          (pontosCaboGuerraPorTurma.get(time2.turmaId) ?? 0) + sala.pontosEquipe2
        );
      }

      rodadasResumo.push({
        id: rodada.id,
        tipo: "cabo_de_guerra",
        atividadeTitulo: rodada.atividade
          ? ((rodada.atividade.conteudoGerado as { titulo?: string })?.titulo ?? "Cabo de Guerra")
          : "Cabo de Guerra",
        criadaEm: rodada.criadaEm.toISOString(),
        salaCaboGuerra: {
          salaCodigo: rodada.salaCaboGuerraCodigo,
          equipe1Nome: time1 ? nomeExibicaoTurma(time1.turma) : "?",
          equipe2Nome: time2 ? nomeExibicaoTurma(time2.turma) : "?",
        },
      });
    }
  }

  const ranking: RankingGincanaTime[] = gincana.times
    .map((time) => {
      const pontosQuiz = pontosQuizPorTurma.get(time.turmaId) ?? 0;
      const pontosCaboGuerra = pontosCaboGuerraPorTurma.get(time.turmaId) ?? 0;
      return {
        timeId: time.id,
        turmaId: time.turmaId,
        turmaNome: nomeExibicaoTurma(time.turma),
        pontosManuais: time.pontosManuais,
        pontosQuiz,
        pontosCaboGuerra,
        total: time.pontosManuais + pontosQuiz + pontosCaboGuerra,
      };
    })
    .sort((a, b) => b.total - a.total);

  return {
    id: gincana.id,
    nome: gincana.nome,
    status: gincana.status,
    ranking,
    rodadas: rodadasResumo,
  };
}

export async function encerrarGincana(gincanaId: string) {
  const sessao = await exigirAssinaturaAtiva();
  await buscarGincanaDoProfessor(gincanaId, sessao.userId);

  await prisma.gincana.update({ where: { id: gincanaId }, data: { status: "encerrada" } });

  revalidatePath(`/painel/gincana/${gincanaId}`);
  redirect(`/painel/gincana/${gincanaId}/podio`);
}

export async function excluirGincana(gincanaId: string) {
  const sessao = await exigirAssinaturaAtiva();
  await buscarGincanaDoProfessor(gincanaId, sessao.userId);

  await prisma.gincanaRodada.deleteMany({ where: { gincanaId } });
  await prisma.gincanaTime.deleteMany({ where: { gincanaId } });
  await prisma.gincana.delete({ where: { id: gincanaId } });

  revalidatePath("/painel/gincana");
  redirect("/painel/gincana");
}
