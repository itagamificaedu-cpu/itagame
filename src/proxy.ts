import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Trava de área do professor colaborador (Usuario.acessoRestrito): ele só
// abre as páginas da área liberada; qualquer outra página do painel volta
// pra tela inicial da área. Lê só o cookie (o carimbo "restrito" é gravado
// no login, ver criarSessao), sem consultar o banco a cada requisição.

const AREAS: Record<string, { inicio: string; permitidas: RegExp[] }> = {
  // Aba SPAECE 9º ano + o que ela precisa pra funcionar: abrir trilha,
  // simulado, sala ao vivo e cabo de guerra criados a partir dela.
  spaece_9ano: {
    inicio: "/painel/spaece",
    permitidas: [
      /^\/painel\/spaece(\/.*)?$/,
      /^\/painel\/trilhas\/gerar-ia$/,
      /^\/painel\/trilhas\/(?!nova$|gerar-ia$|usar-modelo)[^/]+$/,
      /^\/painel\/atividades\/(?!nova$)[^/]+$/,
      /^\/painel\/salas\/[^/]+$/,
      /^\/painel\/cabo-de-guerra\/personalizado\/[^/]+$/,
      /^\/painel\/cabo-de-guerra-online\/(?!nova$)[^/]+$/,
    ],
  },
};

export async function proxy(request: NextRequest) {
  console.log("[proxy] chamado", request.nextUrl.pathname, Boolean(request.cookies.get("itagame_sessao")));
  const cookie = request.cookies.get("itagame_sessao")?.value;
  if (!cookie) return NextResponse.next();

  let restrito: string | undefined;
  try {
    const chave = new TextEncoder().encode(process.env.SESSION_SECRET);
    const { payload } = await jwtVerify(cookie, chave, { algorithms: ["HS256"] });
    restrito = typeof payload.restrito === "string" ? payload.restrito : undefined;
  } catch (erro) {
    console.error("[proxy] falha ao ler a sessão:", erro);
    return NextResponse.next();
  }

  console.log("[proxy] restrito =", restrito);
  const area = restrito ? AREAS[restrito] : undefined;
  if (!area) return NextResponse.next();

  const caminho = request.nextUrl.pathname.replace(/\/$/, "");
  if (area.permitidas.some((regra) => regra.test(caminho))) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL(area.inicio, request.url));
}

export const config = {
  matcher: ["/painel/:path*"],
};
