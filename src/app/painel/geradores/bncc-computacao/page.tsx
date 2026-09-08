import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { GeradorBnccComputacaoCliente } from "@/components/geradores/GeradorBnccComputacaoCliente";

export default async function PaginaGeradorBnccComputacao() {
  await exigirAssinaturaAtiva();
  return <GeradorBnccComputacaoCliente />;
}
