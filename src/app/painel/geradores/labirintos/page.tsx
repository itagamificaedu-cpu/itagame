import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { GeradorLabirintosCliente } from "@/components/geradores/GeradorLabirintosCliente";

export default async function PaginaGeradorLabirintos() {
  await exigirAssinaturaAtiva();
  return <GeradorLabirintosCliente />;
}
