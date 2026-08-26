"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { EsquemaCriarTrilha, EstadoCriarTrilha } from "@/lib/definicoes";

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
