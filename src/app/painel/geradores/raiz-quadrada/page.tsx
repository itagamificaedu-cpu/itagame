import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { GeradorRaizQuadradaCliente } from "@/components/geradores/GeradorRaizQuadradaCliente";

export default async function PaginaGeradorRaizQuadrada() {
  await exigirAssinaturaAtiva();
  return <GeradorRaizQuadradaCliente />;
}
