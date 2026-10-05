"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { verificarPinAluno } from "@/lib/alunoPin";
import { criarSessaoProva, obterSessaoProva } from "@/lib/provaSessao";
import {
  blocosDaProva,
  chaveResposta,
  finalizarSeNecessario,
  gerarCodigoProva,
  type BlocoProva,
} from "@/lib/provas";
import { restanteSegundos } from "@/lib/provaTempo";

type Resultado = { ok: true } | { ok: false; erro: string };

// ---------- lado do professor ----------

async function provaDoProfessor(codigo: string) {
  const sessao = await exigirAssinaturaAtiva();
  const prova = await prisma.provaCronometrada.findUnique({ where: { codigo } });
  if (!prova || prova.professorId !== sessao.userId) throw new Error("Prova não encontrada.");
  return prova;
}

export async function criarProva(input: {
  titulo: string;
  turmaId: string;
  atividadeIds: string[];
  duracaoMin: number;
}): Promise<{ ok: true; codigo: string } | { ok: false; erro: string }> {
  const sessao = await exigirAssinaturaAtiva();

  const titulo = input.titulo.trim().slice(0, 120);
  if (!titulo) return { ok: false, erro: "Dê um nome para a prova." };
  if (!Number.isInteger(input.duracaoMin) || input.duracaoMin < 10 || input.duracaoMin > 300) {
    return { ok: false, erro: "A duração precisa ficar entre 10 e 300 minutos." };
  }
  if (input.atividadeIds.length < 1 || input.atividadeIds.length > 3) {
    return { ok: false, erro: "Escolha de 1 a 3 simulados para a prova." };
  }

  const turma = await prisma.turma.findUnique({ where: { id: input.turmaId } });
  if (!turma || turma.professorId !== sessao.userId) return { ok: false, erro: "Turma não encontrada." };

  const blocos: BlocoProva[] = [];
  for (const atividadeId of input.atividadeIds) {
    const atividade = await prisma.atividade.findUnique({ where: { id: atividadeId } });
    if (!atividade || atividade.professorId !== sessao.userId || atividade.tipo !== "quiz") {
      return { ok: false, erro: "Um dos simulados escolhidos não foi encontrado." };
    }
    const conteudo = atividade.conteudoGerado as { questoes?: { enunciado: string; alternativas?: string[]; imagem?: string }[] };
    const gabarito = atividade.gabarito as { respostaCorreta: string }[];
    const questoes = conteudo.questoes ?? [];
    if (questoes.length === 0 || questoes.length !== gabarito.length) {
      return { ok: false, erro: `O simulado "${atividade.tema}" está incompleto.` };
    }
    blocos.push({
      nome: atividade.disciplina,
      atividadeId: atividade.id,
      disciplina: atividade.disciplina,
      questoes: questoes.map((q) => ({
        enunciado: q.enunciado,
        alternativas: q.alternativas ?? [],
        ...(q.imagem ? { imagem: q.imagem } : {}),
      })),
      gabarito: gabarito.map((g) => g.respostaCorreta),
    });
  }

  let codigo = gerarCodigoProva();
  while (await prisma.provaCronometrada.findUnique({ where: { codigo } })) codigo = gerarCodigoProva();

  await prisma.provaCronometrada.create({
    data: {
      codigo,
      titulo,
      duracaoMin: input.duracaoMin,
      blocos: blocos as unknown as object,
      professorId: sessao.userId,
      turmaId: turma.id,
    },
  });

  revalidatePath("/painel/spaece/prova");
  return { ok: true, codigo };
}

export async function iniciarProva(codigo: string): Promise<Resultado> {
  const prova = await provaDoProfessor(codigo);
  if (prova.status !== "aguardando") return { ok: false, erro: "A prova já foi iniciada." };
  await prisma.provaCronometrada.update({
    where: { id: prova.id },
    data: { status: "em_andamento", iniciadaEm: new Date() },
  });
  return { ok: true };
}

export async function pausarProva(codigo: string): Promise<Resultado> {
  const prova = await provaDoProfessor(codigo);
  if (prova.status !== "em_andamento") return { ok: false, erro: "A prova não está em andamento." };
  await prisma.provaCronometrada.update({ where: { id: prova.id }, data: { status: "pausada", pausadoEm: new Date() } });
  return { ok: true };
}

export async function retomarProva(codigo: string): Promise<Resultado> {
  const prova = await provaDoProfessor(codigo);
  if (prova.status !== "pausada" || !prova.pausadoEm) return { ok: false, erro: "A prova não está pausada." };
  const segundos = Math.max(0, Math.round((Date.now() - prova.pausadoEm.getTime()) / 1000));
  await prisma.provaCronometrada.update({
    where: { id: prova.id },
    data: { status: "em_andamento", pausadoEm: null, segundosPausados: { increment: segundos } },
  });
  return { ok: true };
}

export async function adicionarTempoProva(codigo: string, minutos: number): Promise<Resultado> {
  const prova = await provaDoProfessor(codigo);
  if (prova.status === "encerrada") return { ok: false, erro: "A prova já foi encerrada." };
  if (!Number.isInteger(minutos) || minutos < 1 || minutos > 60) return { ok: false, erro: "Minutos inválidos." };
  await prisma.provaCronometrada.update({ where: { id: prova.id }, data: { segundosExtras: { increment: minutos * 60 } } });
  return { ok: true };
}

export async function encerrarProvaAgora(codigo: string): Promise<Resultado> {
  const prova = await provaDoProfessor(codigo);
  if (prova.status === "encerrada") return { ok: true };
  await prisma.provaCronometrada.updateMany({
    where: { id: prova.id, status: { not: "encerrada" } },
    data: { status: "encerrada", encerradaEm: new Date(), pausadoEm: null },
  });
  const atualizada = await prisma.provaCronometrada.findUnique({ where: { id: prova.id } });
  if (atualizada) await finalizarSeNecessario(atualizada);
  revalidatePath("/painel/spaece/resultados-matematica");
  return { ok: true };
}

// ---------- lado do aluno ----------

export type InfoProvaEntrada =
  | { ok: true; titulo: string; turma: string; alunos: { id: string; nome: string }[] }
  | { ok: false; erro: string };

export async function buscarProvaParaEntrada(codigo: string): Promise<InfoProvaEntrada> {
  const limpo = codigo.trim();
  if (limpo.length !== 6) return { ok: false, erro: "O código tem 6 dígitos." };

  const prova = await prisma.provaCronometrada.findUnique({
    where: { codigo: limpo },
    include: { turma: { include: { alunos: { orderBy: { nome: "asc" } } } } },
  });
  if (!prova) return { ok: false, erro: "Código de prova não encontrado." };
  const atual = await finalizarSeNecessario(prova);
  if (atual.status === "encerrada") return { ok: false, erro: "Essa prova já foi encerrada." };

  return {
    ok: true,
    titulo: prova.titulo,
    turma: prova.turma.nome,
    alunos: prova.turma.alunos.map((a) => ({ id: a.id, nome: a.nome })),
  };
}

export async function entrarComoAlunoNaProva(
  codigo: string,
  alunoId: string,
  pin: string
): Promise<Resultado> {
  const prova = await prisma.provaCronometrada.findUnique({ where: { codigo } });
  if (!prova) return { ok: false, erro: "Código de prova não encontrado." };
  const atual = await finalizarSeNecessario(prova);
  if (atual.status === "encerrada") return { ok: false, erro: "Essa prova já foi encerrada." };

  const verificacao = await verificarPinAluno(alunoId, pin);
  if (!verificacao.ok) return verificacao;
  if (verificacao.aluno.turmaId !== prova.turmaId) return { ok: false, erro: "Esse aluno não é dessa turma." };

  const participante = await prisma.participanteProva.upsert({
    where: { provaId_alunoId: { provaId: prova.id, alunoId: verificacao.aluno.id } },
    update: { ultimoSinalEm: new Date() },
    create: { provaId: prova.id, alunoId: verificacao.aluno.id },
  });

  await criarSessaoProva(codigo, { participanteId: participante.id, provaId: prova.id });
  redirect(`/prova/${codigo}/fazer`);
}

export type ResultadoSalvar = { ok: true } | { ok: false; erro: string; fim?: boolean };

export async function salvarRespostaProva(
  codigo: string,
  bloco: number,
  indice: number,
  alternativa: string | null
): Promise<ResultadoSalvar> {
  const sessao = await obterSessaoProva(codigo);
  if (!sessao) return { ok: false, erro: "Sessão perdida. Entre de novo com seu nome e PIN." };

  const provaBruta = await prisma.provaCronometrada.findUnique({ where: { id: sessao.provaId } });
  if (!provaBruta) return { ok: false, erro: "Prova não encontrada." };
  const prova = await finalizarSeNecessario(provaBruta);
  if (prova.status === "encerrada") return { ok: false, erro: "O tempo acabou.", fim: true };
  if (prova.status !== "em_andamento") return { ok: false, erro: "A prova não está em andamento." };
  if (restanteSegundos(prova) < 0) return { ok: false, erro: "O tempo acabou.", fim: true };

  const participante = await prisma.participanteProva.findUnique({ where: { id: sessao.participanteId } });
  if (!participante || participante.provaId !== prova.id) return { ok: false, erro: "Participante não encontrado." };
  if (participante.entregueEm) return { ok: false, erro: "Você já entregou a prova.", fim: true };

  const blocos = blocosDaProva(prova);
  const questao = blocos[bloco]?.questoes[indice];
  if (!questao) return { ok: false, erro: "Questão inválida." };
  if (alternativa !== null && !questao.alternativas.includes(alternativa)) return { ok: false, erro: "Alternativa inválida." };

  const chave = chaveResposta(bloco, indice);
  // Atualização atômica do JSON: duas marcações seguidas não se atropelam.
  if (alternativa === null) {
    await prisma.$executeRaw`UPDATE participantes_prova SET respostas = respostas - ${chave}::text, "ultimoSinalEm" = now() WHERE id = ${participante.id}`;
  } else {
    await prisma.$executeRaw`UPDATE participantes_prova SET respostas = jsonb_set(respostas, ARRAY[${chave}]::text[], to_jsonb(${alternativa}::text)), "ultimoSinalEm" = now() WHERE id = ${participante.id}`;
  }
  return { ok: true };
}

export async function entregarProva(codigo: string): Promise<Resultado> {
  const sessao = await obterSessaoProva(codigo);
  if (!sessao) return { ok: false, erro: "Sessão perdida. Entre de novo com seu nome e PIN." };
  await prisma.participanteProva.updateMany({
    where: { id: sessao.participanteId, entregueEm: null },
    data: { entregueEm: new Date() },
  });
  return { ok: true };
}
