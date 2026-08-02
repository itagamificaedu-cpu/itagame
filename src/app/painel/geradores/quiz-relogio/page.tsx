import { verificarSessao } from "@/lib/acessoDados";
import { GeradorQuizRelogioCliente } from "@/components/geradores/GeradorQuizRelogioCliente";

export default async function PaginaGeradorQuizRelogio() {
  await verificarSessao();
  return <GeradorQuizRelogioCliente />;
}
