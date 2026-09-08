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
    // Formatos possíveis do external_reference:
    // "<professorId>"                    → combo antigo, trata como anual
    // "<professorId>:mensal"             → Pro mensal
    // "<professorId>:anual"              → Pro anual
    // "<professorId>:anual:bncc"         → Pro anual JÁ com o add-on BNCC
    // "<professorId>:addon-bncc"         → só o add-on avulso (já é Pro)
    const [professorId, segundo, terceiro] = pagamento.external_reference.split(":");

    if (segundo === "addon-bncc") {
      // Add-on avulso: não mexe no plano/validade do Pro, só estende (ou
      // cria) a validade do add-on de BNCC Computação por 1 ano a partir de
      // hoje — se a atual ainda não venceu, soma em cima dela.
      const assinaturaAtual = await prisma.assinatura.findUnique({ where: { professorId } });
      const baseAtual =
        assinaturaAtual?.bnccComputacaoAte && assinaturaAtual.bnccComputacaoAte > new Date()
          ? assinaturaAtual.bnccComputacaoAte
          : new Date();
      const novaValidadeBncc = new Date(baseAtual);
      novaValidadeBncc.setFullYear(novaValidadeBncc.getFullYear() + 1);

      await prisma.assinatura.update({
        where: { professorId },
        data: { bnccComputacaoAte: novaValidadeBncc, mercadoPagoId: String(pagamento.id) },
      });

      return NextResponse.json({ ok: true });
    }

    const ehMensal = segundo === "mensal";
    const comBncc = terceiro === "bncc";

    const validade = new Date();
    if (ehMensal) {
      validade.setMonth(validade.getMonth() + 1);
    } else {
      validade.setFullYear(validade.getFullYear() + 1);
    }

    const bnccComputacaoAte = comBncc ? new Date(validade) : undefined;

    await prisma.assinatura.upsert({
      where: { professorId },
      update: {
        plano: "pro",
        status: "ativa",
        mercadoPagoId: String(pagamento.id),
        validade,
        cortesia: false, // pagou de verdade — vira assinante, sem os limites do cortesia
        ...(bnccComputacaoAte ? { bnccComputacaoAte } : {}),
      },
      create: {
        professorId,
        plano: "pro",
        status: "ativa",
        mercadoPagoId: String(pagamento.id),
        validade,
        cortesia: false,
        ...(bnccComputacaoAte ? { bnccComputacaoAte } : {}),
      },
    });
  }

  return NextResponse.json({ ok: true });
}
