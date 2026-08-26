import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { GeradorCacaPalavrasCliente } from "@/components/geradores/GeradorCacaPalavrasCliente";

export default async function PaginaGeradorCacaPalavras() {
  await exigirAssinaturaAtiva();
  return <GeradorCacaPalavrasCliente />;
}
