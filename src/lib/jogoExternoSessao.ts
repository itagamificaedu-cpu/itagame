import "server-only";
import { SignJWT, jwtVerify } from "jose";

// Sessão do participante de um jogo externo (ex: Construct 2 hospedado fora do
// domínio do painel). Segue o mesmo padrão de src/lib/salaSessao.ts, mas o token
// vai no corpo da resposta e é enviado de volta via header Authorization — não dá
// pra usar cookie porque o jogo roda em outra origem (itatecnologiaeducacional.tech,
// fora do domínio do painel do ItaGame).

const chaveSecreta = process.env.SESSION_SECRET;
const chaveCodificada = new TextEncoder().encode(chaveSecreta);

export type DadosParticipanteJogoExterno = {
  participanteId: string;
  salaId: string;
};

export async function criarTokenParticipanteJogoExterno(dados: DadosParticipanteJogoExterno) {
  return new SignJWT(dados)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("6h")
    .sign(chaveCodificada);
}

export async function verificarTokenParticipanteJogoExterno(
  token: string | undefined | null,
): Promise<DadosParticipanteJogoExterno | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, chaveCodificada, { algorithms: ["HS256"] });
    return payload as unknown as DadosParticipanteJogoExterno;
  } catch {
    return null;
  }
}
