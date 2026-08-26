import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { GeradorTracadoFormasCliente } from "@/components/geradores/GeradorTracadoFormasCliente";

export default async function PaginaGeradorTracadoFormas() {
  await exigirAssinaturaAtiva();
  return <GeradorTracadoFormasCliente />;
}
