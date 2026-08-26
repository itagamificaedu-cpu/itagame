import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { GeradorVocabularioCliente } from "@/components/geradores/GeradorVocabularioCliente";

export default async function PaginaGeradorVocabulario() {
  await exigirAssinaturaAtiva();
  return <GeradorVocabularioCliente />;
}
