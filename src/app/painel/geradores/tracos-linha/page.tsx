import { exigirAssinaturaAtiva } from "@/lib/acessoDados";
import { GeradorTracosLinhaCliente } from "@/components/geradores/GeradorTracosLinhaCliente";

export default async function PaginaGeradorTracosLinha() {
  await exigirAssinaturaAtiva();
  return <GeradorTracosLinhaCliente />;
}
