"use server";

import { redirect } from "next/navigation";
import { verificarSessao } from "@/lib/acessoDados";
import {
  preferenciaMercadoPago,
  PRECO_PRO_ANUAL,
  PRECO_PRO_MENSAL,
  PRECO_COMBO_PRO,
  PRECO_ADDON_BNCC,
} from "@/lib/mercadoPago";
import { prisma } from "@/lib/prisma";

// A periodicidade escolhida vai junto no external_reference (ex: "abc123:mensal")
// pra o webhook do Mercado Pago saber se a validade da assinatura é de 1 mês ou 1 ano.
export async function iniciarCheckoutAssinaturaPro(periodicidade: "mensal" | "anual") {
  const sessao = await verificarSessao();
  const urlBase = process.env.NEXT_PUBLIC_APP_URL as string;

  const ehMensal = periodicidade === "mensal";

  const preferencia = await preferenciaMercadoPago.create({
    body: {
      items: [
        {
          id: ehMensal ? "itagame-pro-mensal" : "itagame-pro-anual",
          title: ehMensal
            ? "ItaGameficaEdu Pro — acesso mensal"
            : "ItaGameficaEdu Pro — acesso por 1 ano",
          quantity: 1,
          unit_price: ehMensal ? PRECO_PRO_MENSAL : PRECO_PRO_ANUAL,
          currency_id: "BRL",
        },
      ],
      external_reference: `${sessao.userId}:${periodicidade}`,
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
          title: "ItaGameficaEdu Pro + Bônus — oferta especial",
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

// Assinatura anual do Pro JÁ com o add-on de BNCC Computação incluso —
// R$ 49,99 + R$ 20 = R$ 69,99, liberando tudo (Pro normal + BNCC
// Computação) por 1 ano de uma vez. O webhook reconhece o sufixo ":bncc" no
// external_reference e grava as duas validades (plano Pro e o add-on).
export async function iniciarCheckoutAssinaturaProComBncc() {
  const sessao = await verificarSessao();
  const urlBase = process.env.NEXT_PUBLIC_APP_URL as string;

  const preferencia = await preferenciaMercadoPago.create({
    body: {
      items: [
        {
          id: "itagame-pro-anual-bncc",
          title: "ItaGameficaEdu Pro + BNCC Computação — acesso por 1 ano",
          quantity: 1,
          unit_price: Number((PRECO_PRO_ANUAL + PRECO_ADDON_BNCC).toFixed(2)),
          currency_id: "BRL",
        },
      ],
      external_reference: `${sessao.userId}:anual:bncc`,
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

// Add-on avulso de BNCC Computação pra quem JÁ é Pro e só quer acrescentar
// (não mexe na validade do plano Pro, só grava/estende bnccComputacaoAte).
export async function iniciarCheckoutAddonBncc() {
  const sessao = await verificarSessao();
  const urlBase = process.env.NEXT_PUBLIC_APP_URL as string;

  const preferencia = await preferenciaMercadoPago.create({
    body: {
      items: [
        {
          id: "itagame-addon-bncc",
          title: "Add-on BNCC Computação — 1 ano",
          quantity: 1,
          unit_price: PRECO_ADDON_BNCC,
          currency_id: "BRL",
        },
      ],
      external_reference: `${sessao.userId}:addon-bncc`,
      back_urls: {
        success: `${urlBase}/painel/bncc-computacao?status=sucesso`,
        pending: `${urlBase}/painel/bncc-computacao?status=pendente`,
        failure: `${urlBase}/painel/bncc-computacao/oferta?status=falha`,
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
