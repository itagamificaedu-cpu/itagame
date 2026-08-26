import { notFound } from "next/navigation";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { PlacarJogoExternoCliente } from "@/components/jogos/PlacarJogoExternoCliente";

export default async function PaginaSalaJogoExterno({
  params,
}: {
  params: Promise<{ codigo: string }>;
}) {
  const { codigo } = await params;
  const sessao = await exigirAssinaturaAtiva();

  const sala = await prisma.salaJogoExterno.findUnique({ where: { codigo } });
  if (!sala || sala.professorId !== sessao.userId) {
    notFound();
  }

  return <PlacarJogoExternoCliente codigo={codigo} jogo={sala.jogo} />;
}
