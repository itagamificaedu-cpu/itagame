import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { criarSessao } from "@/lib/sessao";

/**
 * Login automático de um clique — usado pelo link de acesso cortesia
 * gerado em /api/interno/cortesia. O professor clica e já entra logado
 * no painel, sem digitar e-mail nem senha.
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const chaveSessao = new TextEncoder().encode(process.env.SESSION_SECRET);
    const { payload } = await jwtVerify(token, chaveSessao, { algorithms: ["HS256"] });
    const userId = payload.userId as string;
    if (!userId) throw new Error("token sem userId");

    await criarSessao({ userId, papel: "professor" });
    return NextResponse.redirect(new URL("/painel", req.url));
  } catch {
    return NextResponse.redirect(new URL("/login?erro=link-expirado", req.url));
  }
}
