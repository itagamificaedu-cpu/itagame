import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// Sessão do ALUNO nas Trilhas — diferente da sessão do professor (sessao.ts)
// e da sessão de participante de sala ao vivo (salaSessao.ts), que dura só
// algumas horas. Essa aqui precisa durar dias/semanas, porque o aluno volta
// em dias diferentes pra continuar a trilha de onde parou. Sem e-mail: o
// aluno entra com código da turma + nome + PIN de 4 dígitos.

const chaveSecreta = process.env.SESSION_SECRET;
const chaveCodificada = new TextEncoder().encode(chaveSecreta);

const NOME_COOKIE = "itagame_aluno_sessao";
const DURACAO_DIAS = 30;

export type DadosAluno = {
  alunoId: string;
  turmaId: string;
};

export async function criarSessaoAluno(dados: DadosAluno) {
  const sessao = await new SignJWT(dados)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${DURACAO_DIAS}d`)
    .sign(chaveCodificada);

  const cookieStore = await cookies();
  cookieStore.set(NOME_COOKIE, sessao, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + DURACAO_DIAS * 24 * 60 * 60 * 1000),
    sameSite: "lax",
    path: "/",
  });
}

export async function obterSessaoAluno(): Promise<DadosAluno | null> {
  const cookie = (await cookies()).get(NOME_COOKIE)?.value;
  if (!cookie) return null;

  try {
    const { payload } = await jwtVerify(cookie, chaveCodificada, { algorithms: ["HS256"] });
    return payload as unknown as DadosAluno;
  } catch {
    return null;
  }
}

export async function excluirSessaoAluno() {
  const cookieStore = await cookies();
  cookieStore.delete(NOME_COOKIE);
}
