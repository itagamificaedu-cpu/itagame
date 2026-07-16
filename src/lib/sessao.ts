import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const chaveSecreta = process.env.SESSION_SECRET;
const chaveCodificada = new TextEncoder().encode(chaveSecreta);

export type DadosSessao = {
  userId: string;
  papel: "ita_owner" | "escola_admin" | "professor" | "aluno";
};

export async function criptografar(dados: DadosSessao) {
  return new SignJWT(dados)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(chaveCodificada);
}

export async function descriptografar(sessao: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(sessao, chaveCodificada, {
      algorithms: ["HS256"],
    });
    return payload as DadosSessao & { exp: number; iat: number };
  } catch {
    return null;
  }
}

export async function criarSessao(dados: DadosSessao) {
  const expiraEm = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const sessao = await criptografar(dados);
  const cookieStore = await cookies();

  cookieStore.set("itagame_sessao", sessao, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiraEm,
    sameSite: "lax",
    path: "/",
  });
}

export async function excluirSessao() {
  const cookieStore = await cookies();
  cookieStore.delete("itagame_sessao");
}
