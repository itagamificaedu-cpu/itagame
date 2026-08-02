import { verificarSessao } from "@/lib/acessoDados";
import { GeradorTracosLinhaCliente } from "@/components/geradores/GeradorTracosLinhaCliente";

export default async function PaginaGeradorTracosLinha() {
  await verificarSessao();
  return <GeradorTracosLinhaCliente />;
}
