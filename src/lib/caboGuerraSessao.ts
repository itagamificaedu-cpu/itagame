import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const chaveSecreta = process.env.SESSION_SECRET;
const chaveCodificada = new TextEncoder().encode(chaveSecreta);

export type DadosParticipanteCaboGuerra = {
  participanteId: string;
  salaId: string;
};

function nomeCookie(codigo: string) {
  return `itagame_cabo_guerra_${codigo}`;
}

export async function criarSessaoParticipanteCaboGuerra(codigo: string, dados: DadosParticipanteCaboGuerra) {
  const sessao = await new SignJWT(dados)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("6h")
    .sign(chaveCodificada);

  const cookieStore = await cookies();
  cookieStore.set(nomeCookie(codigo), sessao, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 6 * 60 * 60 * 1000),
    sameSite: "lax",
    path: "/",
  });
}

export async function obterSessaoParticipanteCaboGuerra(
  codigo: string
): Promise<DadosParticipanteCaboGuerra | null> {
  const cookie = (await cookies()).get(nomeCookie(codigo))?.value;
  if (!cookie) return null;

  try {
    const { payload } = await jwtVerify(cookie, chaveCodificada, { algorithms: ["HS256"] });
    return payload as unknown as DadosParticipanteCaboGuerra;
  } catch {
    return null;
  }
}
