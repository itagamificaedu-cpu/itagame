import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { GeradorBnccDesplugadoCliente } from "@/components/geradores/GeradorBnccDesplugadoCliente";

export default async function PaginaGeradorBnccDesplugado() {
  await exigirAssinaturaAtiva();
  return <GeradorBnccDesplugadoCliente />;
}
