import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Endpoint interno — chamado só pelo backend do Desafio Prof Conectado
 * (outro sistema, banco isolado) pra dar acesso cortesia ao ItaGameficaEdu
 * pra um professor que ainda não é assinante. Protegido por chave
 * compartilhada (INTERNO_API_KEY), nunca exposto pro navegador.
 *
 * Cria (ou reaproveita) a conta do professor pelo e-mail, garante uma
 * assinatura Pro válida por `dias` (sem derrubar uma assinatura paga que já
 * vença depois disso) e devolve um link de login automático — o professor
 * clica e já cai logado dentro do painel, sem senha nenhuma.
 */
export async function POST(req: NextRequest) {
  const chave = process.env.INTERNO_API_KEY;
  if (!chave) {
    return NextResponse.json({ erro: "Integração não configurada." }, { status: 500 });
  }
  if (req.headers.get("x-interno-key") !== chave) {
    return NextResponse.json({ erro: "não autorizado" }, { status: 401 });
  }

  const { nome, email, dias } = await req.json().catch(() => ({}));
  if (!nome || !email || !dias || Number(dias) <= 0) {
    return NextResponse.json({ erro: "Informe nome, email e dias." }, { status: 400 });
  }

  let usuario = await prisma.usuario.findUnique({ where: { email } });
  let contaNova = false;

  if (!usuario) {
    const senhaAleatoria = crypto.randomBytes(24).toString("hex");
    const senhaHash = await bcrypt.hash(senhaAleatoria, 10);
    usuario = await prisma.usuario.create({
      data: { nome, email, senhaHash, papel: "professor" },
    });
    contaNova = true;
  }

  const validadeCortesia = new Date(Date.now() + Number(dias) * 24 * 60 * 60 * 1000);
  const assinaturaAtual = await prisma.assinatura.findUnique({ where: { professorId: usuario.id } });

  // Já é assinante pago de verdade (veio do Mercado Pago, não de outra
  // cortesia) — não mexe em nada, ele já tem tudo liberado sem limite.
  const jaPagaDeVerdade = assinaturaAtual?.status === "ativa" && assinaturaAtual.plano === "pro" && !assinaturaAtual.cortesia;

  // Não derruba uma cortesia anterior que ainda vença depois dessa.
  const jaTemCortesiaMaisLonga =
    assinaturaAtual?.cortesia && assinaturaAtual.validade && assinaturaAtual.validade > validadeCortesia;

  if (!jaPagaDeVerdade && !jaTemCortesiaMaisLonga) {
    await prisma.assinatura.upsert({
      where: { professorId: usuario.id },
      update: { plano: "pro", status: "ativa", validade: validadeCortesia, cortesia: true },
      create: { professorId: usuario.id, plano: "pro", status: "ativa", validade: validadeCortesia, cortesia: true },
    });
  }

  const chaveSessao = new TextEncoder().encode(process.env.SESSION_SECRET);
  const token = await new SignJWT({ userId: usuario.id })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${dias}d`)
    .sign(chaveSessao);

  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://itagame.itatecnologiaeducacional.tech";
  const link = `${base}/api/cortesia/entrar?token=${token}`;

  return NextResponse.json({ email: usuario.email, link, contaNova });
}
