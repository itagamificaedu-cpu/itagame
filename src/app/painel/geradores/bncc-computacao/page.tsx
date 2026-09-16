import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { GeradorBnccComputacaoCliente } from "@/components/geradores/GeradorBnccComputacaoCliente";

export default async function PaginaGeradorBnccComputacao() {
  const sessao = await exigirAssinaturaAtiva();

  const turmas = await prisma.turma.findMany({
    where: { professorId: sessao.userId },
    orderBy: { nome: "asc" },
    select: { id: true, nome: true },
  });

  return <GeradorBnccComputacaoCliente turmas={turmas} />;
}
