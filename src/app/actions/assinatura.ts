"use server";

import { redirect } from "next/navigation";
import { verificarSessao } from "@/lib/acessoDados";
import { preferenciaMercadoPago, PRECO_PRO_ANUAL, PRECO_COMBO_PRO } from "@/lib/mercadoPago";
import { prisma } from "@/lib/prisma";

export async function iniciarCheckoutAssinaturaPro() {
  const sessao = await verificarSessao();
  const urlBase = process.env.NEXT_PUBLIC_APP_URL as string;

  const preferencia = await preferenciaMercadoPago.create({
    body: {
      items: [
        {
          id: "itagame-pro-anual",
          title: "ItaGame Pro — acesso por 1 ano",
          quantity: 1,
          unit_price: PRECO_PRO_ANUAL,
          currency_id: "BRL",
        },
      ],
      external_reference: sessao.userId,
      back_urls: {
        success: `${urlBase}/painel/assinatura?status=sucesso`,
        pending: `${urlBase}/painel/assinatura?status=pendente`,
        failure: `${urlBase}/painel/assinatura?status=falha`,
      },
      auto_return: "approved",
      notification_url: `${urlBase}/api/mercadopago/webhook`,
    },
  });

  const urlCheckout = preferencia.init_point ?? preferencia.sandbox_init_point;

  if (!urlCheckout) {
    throw new Error("Não foi possível iniciar o checkout do Mercado Pago.");
  }

  redirect(urlCheckout);
}

export async function iniciarCheckoutComboPro() {
  const sessao = await verificarSessao();
  const urlBase = process.env.NEXT_PUBLIC_APP_URL as string;

  const preferencia = await preferenciaMercadoPago.create({
    body: {
      items: [
        {
          id: "itagame-combo-pro-bonus",
          title: "ItaGame Pro + Bônus — oferta especial",
          quantity: 1,
          unit_price: PRECO_COMBO_PRO,
          currency_id: "BRL",
        },
      ],
      external_reference: sessao.userId,
      back_urls: {
        success: `${urlBase}/oferta/combo-pro/obrigado?status=sucesso`,
        pending: `${urlBase}/oferta/combo-pro/obrigado?status=pendente`,
        failure: `${urlBase}/oferta/combo-pro?status=falha`,
      },
      auto_return: "approved",
      notification_url: `${urlBase}/api/mercadopago/webhook`,
    },
  });

  const urlCheckout = preferencia.init_point ?? preferencia.sandbox_init_point;

  if (!urlCheckout) {
    throw new Error("Não foi possível iniciar o checkout do Mercado Pago.");
  }

  redirect(urlCheckout);
}

export async function buscarAssinaturaAtual() {
  const sessao = await verificarSessao();

  return prisma.assinatura.findUnique({
    where: { professorId: sessao.userId },
  });
}
