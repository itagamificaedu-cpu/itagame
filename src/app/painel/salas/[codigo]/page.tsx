import { notFound } from "next/navigation";
import { verificarSessao } from "@/lib/acessoDados";
import { prisma } from "@/lib/prisma";
import { ControleSalaCliente } from "@/components/sala/ControleSalaCliente";

export default async function PaginaControleSala({
  params,
}: {
  params: Promise<{ codigo: string }>;
}) {
  const { codigo } = await params;
  const sessao = await verificarSessao();

  const sala = await prisma.salaAoVivo.findUnique({
    where: { codigo },
    include: { atividade: true },
  });

  if (!sala || sala.atividade.professorId !== sessao.userId) {
    notFound();
  }

  return <ControleSalaCliente codigo={codigo} />;
}
