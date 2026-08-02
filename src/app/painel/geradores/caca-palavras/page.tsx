import { verificarSessao } from "@/lib/acessoDados";
import { GeradorCacaPalavrasCliente } from "@/components/geradores/GeradorCacaPalavrasCliente";

export default async function PaginaGeradorCacaPalavras() {
  await verificarSessao();
  return <GeradorCacaPalavrasCliente />;
}
