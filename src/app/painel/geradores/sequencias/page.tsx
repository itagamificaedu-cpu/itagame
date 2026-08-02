import { verificarSessao } from "@/lib/acessoDados";
import { GeradorSequenciasCliente } from "@/components/geradores/GeradorSequenciasCliente";

export default async function PaginaGeradorSequencias() {
  await verificarSessao();
  return <GeradorSequenciasCliente />;
}
