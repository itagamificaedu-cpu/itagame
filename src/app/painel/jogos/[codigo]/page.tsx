import { notFound } from "next/navigation";
import { verificarSessao } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { PlacarJogoExternoCliente } from "@/components/jogos/PlacarJogoExternoCliente";

export default async function PaginaSalaJogoExterno({
  params,
}: {
  params: Promise<{ codigo: string }>;
}) {
  const { codigo } = await params;
  const sessao = await verificarSessao();

  const sala = await prisma.salaJogoExterno.findUnique({ where: { codigo } });
  if (!sala || sala.professorId !== sessao.userId) {
    notFound();
  }

  return <PlacarJogoExternoCliente codigo={codigo} jogo={sala.jogo} />;
}
