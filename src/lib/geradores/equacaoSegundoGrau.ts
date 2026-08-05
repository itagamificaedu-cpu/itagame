import { aleatorioInt, aleatorioNaoZero } from "./aleatorio";
import { comSinal } from "./algebra";

export type DificuldadeEquacao2Grau = "facil" | "medio" | "dificil";

export type QuestaoEquacao2Grau = {
  enunciado: string;
  /** As duas raízes, sempre em ordem crescente e sempre distintas. */
  raizMenor: number;
  raizMaior: number;
};

/**
 * Gera uma equação do 2º grau com raízes inteiras garantidas, alinhada à
 * BNCC EF09MA09 (equações polinomiais do 2º grau) e ao descritor
 * SPAECE/SAEB D31 (resolver problema envolvendo equação do 2º grau).
 */
export function gerarQuestaoEquacao2Grau(dificuldade: DificuldadeEquacao2Grau): QuestaoEquacao2Grau {
  if (dificuldade === "facil") {
    // Equação incompleta: x² = k² (raízes k e -k) ou x² - kx = 0 (raízes 0 e k).
    if (Math.random() < 0.5) {
      const r = aleatorioInt(1, 10);
      return { enunciado: `x² = ${r * r}`, raizMenor: -r, raizMaior: r };
    }
    const r = aleatorioInt(1, 10);
    return { enunciado: `x² - ${r}x = 0`, raizMenor: 0, raizMaior: r };
  }

  // Médio e difícil: equação completa ax² + bx + c = 0, construída a partir
  // das raízes escolhidas (garante números inteiros "redondos" pro aluno achar).
  const a = dificuldade === "dificil" ? aleatorioInt(2, 3) : 1;
  const r1 = aleatorioNaoZero(-8, 8);
  let r2 = aleatorioNaoZero(-8, 8);
  while (r2 === r1) r2 = aleatorioNaoZero(-8, 8);

  const b = -a * (r1 + r2);
  const c = a * r1 * r2;
  const prefixoA = a === 1 ? "" : `${a}`;
  // Quando a soma das raízes é 0, o termo em x some (b = 0) — evita mostrar "+ 0x".
  const termoB = b === 0 ? "" : ` ${comSinal(b)}x`;
  const enunciado = `${prefixoA}x²${termoB} ${comSinal(c)} = 0`;

  const [raizMenor, raizMaior] = [r1, r2].sort((x, y) => x - y);
  return { enunciado, raizMenor, raizMaior };
}
