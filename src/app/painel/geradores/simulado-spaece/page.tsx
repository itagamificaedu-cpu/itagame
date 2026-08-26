import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { GeradorSimuladoSpaeceCliente } from "@/components/geradores/GeradorSimuladoSpaeceCliente";

export default async function PaginaGeradorSimuladoSpaece() {
  await exigirAssinaturaAtiva();
  return <GeradorSimuladoSpaeceCliente />;
}
