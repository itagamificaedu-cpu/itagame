import { redirect } from "next/navigation";
import { getUsuarioAtual } from "@/lib/acessoDados";
import { iniciarCheckoutComboPro } from "@/app/actions/assinatura";

export default async function FinalizarComboPro() {
  const usuario = await getUsuarioAtual();

  if (!usuario) {
    redirect("/cadastro?next=/oferta/combo-pro/finalizar");
  }

  await iniciarCheckoutComboPro();
}
