import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { GeradorSistemaEquacoesCliente } from "@/components/geradores/GeradorSistemaEquacoesCliente";

export default async function PaginaGeradorSistemaEquacoes() {
  await exigirAssinaturaAtiva();
  return <GeradorSistemaEquacoesCliente />;
}
