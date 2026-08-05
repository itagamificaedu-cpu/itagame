import { verificarSessao } from "@/lib/acessoDados";
import { GeradorSistemaEquacoesCliente } from "@/components/geradores/GeradorSistemaEquacoesCliente";

export default async function PaginaGeradorSistemaEquacoes() {
  await verificarSessao();
  return <GeradorSistemaEquacoesCliente />;
}
