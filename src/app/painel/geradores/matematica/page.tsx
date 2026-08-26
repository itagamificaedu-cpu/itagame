import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { GeradorMatematicaCliente } from "@/components/geradores/GeradorMatematicaCliente";

export default async function PaginaGeradorMatematica() {
  await exigirAssinaturaAtiva();
  return <GeradorMatematicaCliente />;
}
