import { verificarSessao } from "@/lib/acessoDados";
import { GeradorSimuladoSpaeceCliente } from "@/components/geradores/GeradorSimuladoSpaeceCliente";

export default async function PaginaGeradorSimuladoSpaece() {
  await verificarSessao();
  return <GeradorSimuladoSpaeceCliente />;
}
