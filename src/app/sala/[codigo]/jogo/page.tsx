import { redirect } from "next/navigation";
import { obterSessaoParticipante } from "@/lib/salaSessao";
import { JogoCliente } from "@/components/sala/JogoCliente";

export default async function PaginaJogoSala({
  params,
}: {
  params: Promise<{ codigo: string }>;
}) {
  const { codigo } = await params;
  const sessao = await obterSessaoParticipante(codigo);

  if (!sessao) {
    redirect("/entrar");
  }

  return <JogoCliente codigo={codigo} />;
}
