import { verificarSessao } from "@/lib/acessoDados";
import { GeradorVocabularioCliente } from "@/components/geradores/GeradorVocabularioCliente";

export default async function PaginaGeradorVocabulario() {
  await verificarSessao();
  return <GeradorVocabularioCliente />;
}
