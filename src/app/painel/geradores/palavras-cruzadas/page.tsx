import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { GeradorCruzadasCliente } from "@/components/geradores/GeradorCruzadasCliente";

export default async function PaginaGeradorCruzadas() {
  await exigirAssinaturaAtiva();
  return <GeradorCruzadasCliente />;
}
