import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { GeradorPotenciaCliente } from "@/components/geradores/GeradorPotenciaCliente";

export default async function PaginaGeradorPotencia() {
  await exigirAssinaturaAtiva();
  return <GeradorPotenciaCliente />;
}
