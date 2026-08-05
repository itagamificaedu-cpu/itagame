import { verificarSessao } from "@/lib/acessoDados";
import { GeradorPotenciaCliente } from "@/components/geradores/GeradorPotenciaCliente";

export default async function PaginaGeradorPotencia() {
  await verificarSessao();
  return <GeradorPotenciaCliente />;
}
