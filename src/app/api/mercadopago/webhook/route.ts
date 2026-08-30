import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { pagamentoMercadoPago } from "@/lib/mercadoPago";
import { prisma } from "@/lib/prisma";

function assinaturaValida(req: NextRequest, dataId: string): boolean {
  const segredo = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
  if (!segredo) return true; // sem segredo configurado, aceita (ambiente de teste)

  const cabecalhoAssinatura = req.headers.get("x-signature");
  const requestId = req.headers.get("x-request-id");
  if (!cabecalhoAssinatura || !requestId) return false;

  const partes = Object.fromEntries(
    cabecalhoAssinatura.split(",").map((parte) => {
      const [chave, valor] = parte.split("=");
      return [chave.trim(), valor?.trim()];
    })
  );

  const ts = partes.ts;
  const v1Recebido = partes.v1;
  if (!ts || !v1Recebido) return false;

  const manifesto = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const v1Calculado = crypto.createHmac("sha256", segredo).update(manifesto).digest("hex");

  return v1Calculado === v1Recebido;
}

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const dataId = url.searchParams.get("data.id") ?? url.searchParams.get("id");
  const tipo = url.searchParams.get("type") ?? url.searchParams.get("topic");

  if (!dataId || tipo !== "payment") {
    return NextResponse.json({ ok: true });
  }

  if (!assinaturaValida(req, dataId)) {
    return NextResponse.json({ erro: "assinatura inválida" }, { status: 401 });
  }

  const pagamento = await pagamentoMercadoPago.get({ id: dataId });

  if (pagamento.status === "approved" && pagamento.external_reference) {
    // Formato novo: "<professorId>:mensal" ou "<professorId>:anual".
    // Pagamentos antigos (antes da assinatura mensal existir) só têm o
    // professorId puro — tratamos como anual pra não quebrar histórico.
    const [professorId, periodicidade] = pagamento.external_reference.split(":");
    const ehMensal = periodicidade === "mensal";

    const validade = new Date();
    if (ehMensal) {
      validade.setMonth(validade.getMonth() + 1);
    } else {
      validade.setFullYear(validade.getFullYear() + 1);
    }

    await prisma.assinatura.upsert({
      where: { professorId },
      update: {
        plano: "pro",
        status: "ativa",
        mercadoPagoId: String(pagamento.id),
        validade,
        cortesia: false, // pagou de verdade — vira assinante, sem os limites do cortesia
      },
      create: {
        professorId,
        plano: "pro",
        status: "ativa",
        mercadoPagoId: String(pagamento.id),
        validade,
        cortesia: false,
      },
    });
  }

  return NextResponse.json({ ok: true });
}
