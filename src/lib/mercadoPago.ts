import "server-only";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

const cliente = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN as string,
});

export const PRECO_PRO_ANUAL = 49.99;
export const PRECO_PRO_MENSAL = 24.99;
export const PRECO_COMBO_PRO = 37.0;

export const preferenciaMercadoPago = new Preference(cliente);
export const pagamentoMercadoPago = new Payment(cliente);
