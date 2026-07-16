import { NextRequest, NextResponse } from "next/server";
import { descriptografar } from "@/lib/sessao";
import { cookies } from "next/headers";

const rotasProtegidas = ["/painel"];
const rotasSomentePublicas = ["/login", "/cadastro"];

export default async function proxy(req: NextRequest) {
  const caminho = req.nextUrl.pathname;
  const ehRotaProtegida = rotasProtegidas.some((rota) => caminho.startsWith(rota));
  const ehRotaSomentePublica = rotasSomentePublicas.includes(caminho);

  const cookie = (await cookies()).get("itagame_sessao")?.value;
  const sessao = await descriptografar(cookie);

  if (ehRotaProtegida && !sessao?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (ehRotaSomentePublica && sessao?.userId) {
    return NextResponse.redirect(new URL("/painel", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
