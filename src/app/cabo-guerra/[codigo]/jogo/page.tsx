import { redirect } from "next/navigation";
import { obterSessaoParticipanteCaboGuerra } from "@/lib/caboGuerraSessao";
import { JogoCaboGuerraOnlineCliente } from "@/components/caboGuerraOnline/JogoCaboGuerraOnlineCliente";

export default async function PaginaJogoCaboGuerraOnline({
  params,
}: {
  params: Promise<{ codigo: string }>;
}) {
  const { codigo } = await params;
  const sessao = await obterSessaoParticipanteCaboGuerra(codigo);

  if (!sessao) {
    redirect("/entrar-cabo-guerra");
  }

  return <JogoCaboGuerraOnlineCliente codigo={codigo} />;
}
