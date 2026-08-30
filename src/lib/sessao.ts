import "server-only";
import crypto from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const chaveSecreta = process.env.SESSION_SECRET;
const chaveCodificada = new TextEncoder().encode(chaveSecreta);

export type DadosSessao = {
  userId: string;
  papel: "ita_owner" | "escola_admin" | "professor" | "aluno";
  sessaoId: string;
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

/**
 * Cria a sessão do usuário — gera um novo "carimbo" (sessaoId) e grava em
 * Usuario.sessaoAtual antes de assinar o cookie. Só existe um carimbo válido
 * por vez: logar em outro aparelho troca esse valor no banco e o cookie
 * antigo, mesmo ainda existindo no outro navegador, para de bater com ele —
 * a próxima requisição de lá é tratada como sessão encerrada (ver
 * verificarSessao em acessoDados.ts). Evita duas pessoas usando a mesma
 * conta ao mesmo tempo.
 */
export async function criarSessao(dados: { userId: string; papel: DadosSessao["papel"] }) {
  const sessaoId = crypto.randomUUID();
  await prisma.usuario.update({ where: { id: dados.userId }, data: { sessaoAtual: sessaoId } });

  const sessao = await criptografar({ ...dados, sessaoId });
  const expiraEm = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
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
