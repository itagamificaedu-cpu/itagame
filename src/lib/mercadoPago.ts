import "server-only";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

const cliente = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN as string,
});

export const PRECO_PRO_ANUAL = 49.99;
export const PRECO_PRO_MENSAL = 24.99;
export const PRECO_COMBO_PRO = 37.0;

// Add-on de BNCC Computação — vendido separado do Pro (ver
// exigirAcessoBnccComputacao em acessoDados.ts). PRECO_ADDON_BNCC é a
// compra avulsa (professor que já é Pro só quer acrescentar); o valor total
// pra quem assina o Pro anual JÁ com o add-on incluso é PRECO_PRO_ANUAL +
// PRECO_ADDON_BNCC (R$ 49,99 + R$ 20 = R$ 69,99/ano).
export const PRECO_ADDON_BNCC = 20.0;

// Liga/desliga a oferta "Combo Pro + bônus" (/oferta/combo-pro). Desativada
// pra usar como base de uma futura promoção — o código fica pronto, só
// virar essa chave pra true de novo quando for rodar a próxima.
export const OFERTA_COMBO_PRO_ATIVA = false;

export const preferenciaMercadoPago = new Preference(cliente);
export const pagamentoMercadoPago = new Payment(cliente);
