import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { NovaSalaCaboGuerraCliente } from "./NovaSalaCaboGuerraCliente";

export default async function PaginaNovaSalaCaboGuerra() {
  const sessao = await exigirAssinaturaAtiva();

  const turmas = await prisma.turma.findMany({
    where: { professorId: sessao.userId },
    orderBy: { nome: "asc" },
    select: { id: true, nome: true },
  });

  return <NovaSalaCaboGuerraCliente turmas={turmas} />;
}
