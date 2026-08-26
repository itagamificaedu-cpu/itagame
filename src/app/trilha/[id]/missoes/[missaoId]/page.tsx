import Link from "next/link";
import { notFound } from "next/navigation";
import { verificarSessaoAluno } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { MissaoAlunoCliente } from "@/components/trilhas/MissaoAlunoCliente";
import type { QuestaoQuizMissao } from "@/app/actions/missoes";

export default async function PaginaMissaoAluno({
  params,
}: {
  params: Promise<{ id: string; missaoId: string }>;
}) {
  const { id, missaoId } = await params;
  const aluno = await verificarSessaoAluno();

  const missao = await prisma.missao.findUnique({ where: { id: missaoId } });
  if (!missao || missao.trilhaId !== id) {
    notFound();
  }

  const progresso = await prisma.progressoAluno.findUnique({
    where: { alunoId_missaoId: { alunoId: aluno.id, missaoId } },
  });

  if (!progresso || progresso.status === "bloqueada") {
    notFound();
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link href={`/trilha/${id}`} className="text-sm font-semibold text-[#1a3fd4]">
          ← Voltar pra trilha
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-neutral-900">{missao.titulo}</h1>
        <p className="mt-1 text-sm text-neutral-600">{missao.descricao}</p>

        <div className="mt-6">
          <MissaoAlunoCliente
            progressoId={progresso.id}
            status={progresso.status}
            checkpointTipo={missao.checkpointTipo}
            quizPerguntas={missao.quizPerguntas as QuestaoQuizMissao[] | null}
            feedbackProfessor={progresso.feedbackProfessor}
            entregaTextoAtual={progresso.entregaTexto}
            xpRecompensa={missao.xpRecompensa}
            xpGanho={progresso.xpGanho}
          />
        </div>
      </div>
    </main>
  );
}
