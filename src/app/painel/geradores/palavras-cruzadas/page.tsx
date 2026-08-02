import { verificarSessao } from "@/lib/acessoDados";
import { GeradorCruzadasCliente } from "@/components/geradores/GeradorCruzadasCliente";

export default async function PaginaGeradorCruzadas() {
  await verificarSessao();
  return <GeradorCruzadasCliente />;
}
