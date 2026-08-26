import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { GeradorEquacao1GrauCliente } from "@/components/geradores/GeradorEquacao1GrauCliente";

export default async function PaginaGeradorEquacao1Grau() {
  await exigirAssinaturaAtiva();
  return <GeradorEquacao1GrauCliente />;
}
