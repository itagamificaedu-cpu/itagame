import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { GeradorQuizRelogioCliente } from "@/components/geradores/GeradorQuizRelogioCliente";

export default async function PaginaGeradorQuizRelogio() {
  await exigirAssinaturaAtiva();
  return <GeradorQuizRelogioCliente />;
}
