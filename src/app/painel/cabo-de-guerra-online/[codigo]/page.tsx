import { notFound } from "next/navigation";
import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { ControleCaboGuerraOnlineCliente } from "@/components/caboGuerraOnline/ControleCaboGuerraOnlineCliente";

export default async function PaginaControleCaboGuerraOnline({
  params,
}: {
  params: Promise<{ codigo: string }>;
}) {
  const { codigo } = await params;
  const sessao = await exigirAssinaturaAtiva();

  const sala = await prisma.salaCaboGuerra.findUnique({ where: { codigo } });

  if (!sala || sala.professorId !== sessao.userId) {
    notFound();
  }

  return <ControleCaboGuerraOnlineCliente codigo={codigo} />;
}
