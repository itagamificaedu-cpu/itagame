import { NextRequest, NextResponse } from "next/server";
import { descriptografar } from "@/lib/sessao";
import { cookies } from "next/headers";

const rotasProtegidas = ["/painel"];

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
      // Turmas próprias dos professores convidados (a lista esconde as do CEITEC)
      /^\/painel\/turmas(\/nova|\/[^/]+(\/pins)?)?$/,
      /^\/painel\/trilhas\/gerar-ia$/,
      /^\/painel\/trilhas\/(?!nova$|gerar-ia$|usar-modelo)[^/]+$/,
      /^\/painel\/atividades\/(?!nova$)[^/]+$/,
      /^\/painel\/salas\/[^/]+$/,
      /^\/painel\/cabo-de-guerra\/personalizado\/[^/]+$/,
      /^\/painel\/cabo-de-guerra-online\/(?!nova$)[^/]+$/,
    ],
  },
};

export default async function proxy(req: NextRequest) {
  const caminho = req.nextUrl.pathname;
  const ehRotaProtegida = rotasProtegidas.some((rota) => caminho.startsWith(rota));

  const cookie = (await cookies()).get("itagame_sessao")?.value;
  const sessao = await descriptografar(cookie);

  if (ehRotaProtegida && !sessao?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  const area = sessao?.restrito ? AREAS[sessao.restrito] : undefined;
  if (area && ehRotaProtegida) {
    const limpo = caminho.replace(/\/$/, "");
    if (!area.permitidas.some((regra) => regra.test(limpo))) {
      return NextResponse.redirect(new URL(area.inicio, req.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
