import { verificarSessao } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { CaboDeGuerraCliente } from "@/components/caboDeGuerra/CaboDeGuerraCliente";

export default async function PaginaCaboDeGuerra() {
  const sessao = await verificarSessao();

  const turmas = await prisma.turma.findMany({
    where: { professorId: sessao.userId },
    orderBy: { nome: "asc" },
    include: { alunos: { orderBy: { nome: "asc" } } },
  });

  return <CaboDeGuerraCliente turmas={turmas} />;
}
