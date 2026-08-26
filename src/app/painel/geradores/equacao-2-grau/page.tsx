import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { GeradorEquacao2GrauCliente } from "@/components/geradores/GeradorEquacao2GrauCliente";

export default async function PaginaGeradorEquacao2Grau() {
  await exigirAssinaturaAtiva();
  return <GeradorEquacao2GrauCliente />;
}
