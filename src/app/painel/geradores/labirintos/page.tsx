import { verificarSessao } from "@/lib/acessoDados";
import { GeradorLabirintosCliente } from "@/components/geradores/GeradorLabirintosCliente";

export default async function PaginaGeradorLabirintos() {
  await verificarSessao();
  return <GeradorLabirintosCliente />;
}
