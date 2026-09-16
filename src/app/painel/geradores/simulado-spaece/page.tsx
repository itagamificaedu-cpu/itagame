import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { GeradorSimuladoSpaeceCliente } from "@/components/geradores/GeradorSimuladoSpaeceCliente";

export default async function PaginaGeradorSimuladoSpaece() {
  const sessao = await exigirAssinaturaAtiva();

  const turmas = await prisma.turma.findMany({
    where: { professorId: sessao.userId },
    orderBy: { nome: "asc" },
    select: { id: true, nome: true },
  });

  return <GeradorSimuladoSpaeceCliente turmas={turmas} />;
}
