import { notFound } from "next/navigation";
import { verificarSessao } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { prepararPerguntasPersonalizadas } from "@/lib/caboGuerraPersonalizado";
import { CaboDeGuerraPersonalizadoCliente } from "@/components/caboGuerraPersonalizado/CaboDeGuerraPersonalizadoCliente";

export default async function PaginaCaboDeGuerraPersonalizado({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sessao = await verificarSessao();

  const atividade = await prisma.atividade.findUnique({ where: { id } });
  if (!atividade || atividade.professorId !== sessao.userId || atividade.tipo !== "cabo_de_guerra") {
    notFound();
  }

  const turmas = await prisma.turma.findMany({
    where: { professorId: sessao.userId },
    orderBy: { nome: "asc" },
    include: { alunos: { orderBy: { nome: "asc" } } },
  });

  const perguntas = prepararPerguntasPersonalizadas(atividade);

  return <CaboDeGuerraPersonalizadoCliente perguntas={perguntas} turmas={turmas} titulo={atividade.tema} />;
}
