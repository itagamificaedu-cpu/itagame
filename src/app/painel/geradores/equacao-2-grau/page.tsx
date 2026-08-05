import { verificarSessao } from "@/lib/acessoDados";
import { GeradorEquacao2GrauCliente } from "@/components/geradores/GeradorEquacao2GrauCliente";

export default async function PaginaGeradorEquacao2Grau() {
  await verificarSessao();
  return <GeradorEquacao2GrauCliente />;
}
