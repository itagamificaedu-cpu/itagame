import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { GeradorMatematicaEmojisCliente } from "@/components/geradores/GeradorMatematicaEmojisCliente";

export default async function PaginaGeradorMatematicaEmojis() {
  await exigirAssinaturaAtiva();
  return <GeradorMatematicaEmojisCliente />;
}
