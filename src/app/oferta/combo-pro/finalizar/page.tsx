import { redirect } from "next/navigation";
import { getUsuarioAtual } from "@/lib/acessoDados";
import { iniciarCheckoutComboPro } from "@/app/actions/assinatura";
import { OFERTA_COMBO_PRO_ATIVA } from "@/lib/mercadoPago";

export default async function FinalizarComboPro() {
  if (!OFERTA_COMBO_PRO_ATIVA) {
    redirect("/");
  }

  const usuario = await getUsuarioAtual();

  if (!usuario) {
    redirect("/cadastro?next=/oferta/combo-pro/finalizar");
  }

  await iniciarCheckoutComboPro();
}
