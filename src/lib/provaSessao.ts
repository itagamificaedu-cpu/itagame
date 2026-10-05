import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// Sessão do aluno dentro de uma prova cronometrada (um cookie por prova).
// Dura 10 horas: cobre a prova inteira, mesmo que o tablet recarregue.
const chaveCodificada = new TextEncoder().encode(process.env.SESSION_SECRET);

export type DadosParticipanteProva = {
  participanteId: string;
  provaId: string;
};

function nomeCookie(codigo: string) {
  return `itagame_prova_${codigo}`;
}

export async function criarSessaoProva(codigo: string, dados: DadosParticipanteProva) {
  const sessao = await new SignJWT(dados)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10h")
    .sign(chaveCodificada);

  (await cookies()).set(nomeCookie(codigo), sessao, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 10 * 60 * 60 * 1000),
    sameSite: "lax",
    path: "/",
  });
}

export async function obterSessaoProva(codigo: string): Promise<DadosParticipanteProva | null> {
  const cookie = (await cookies()).get(nomeCookie(codigo))?.value;
  if (!cookie) return null;
  try {
    const { payload } = await jwtVerify(cookie, chaveCodificada, { algorithms: ["HS256"] });
    return payload as unknown as DadosParticipanteProva;
  } catch {
    return null;
  }
}
