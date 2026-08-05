import { aleatorioInt, aleatorioNaoZero } from "./aleatorio";
import { termoLinear, termoLinearComSinal } from "./algebra";

export type DificuldadeSistema = "facil" | "medio" | "dificil";

export type QuestaoSistema = {
  eq1: string;
  eq2: string;
  respostaX: number;
  respostaY: number;
};

/**
 * Gera um sistema de 2 equações do 1º grau com 2 incógnitas e solução
 * inteira garantida, alinhado à BNCC EF08MA07/EF08MA08 e aos descritores
 * SPAECE/SAEB D34 (identificar sistema) e D35 (representação algébrica/geométrica).
 */
export function gerarQuestaoSistema(dificuldade: DificuldadeSistema): QuestaoSistema {
  const faixaCoef = dificuldade === "facil" ? 5 : dificuldade === "medio" ? 8 : 10;
  const x = aleatorioInt(-10, 10);
  const y = aleatorioInt(-10, 10);

  let a1 = 0;
  let b1 = 0;
  let a2 = 0;
  let b2 = 0;
  do {
    // No nível fácil, a primeira equação fica só com "x + b1 y", pra facilitar a substituição.
    a1 = dificuldade === "facil" ? 1 : aleatorioNaoZero(-faixaCoef, faixaCoef);
    b1 = aleatorioNaoZero(-faixaCoef, faixaCoef);
    a2 = aleatorioNaoZero(-faixaCoef, faixaCoef);
    b2 = aleatorioNaoZero(-faixaCoef, faixaCoef);
  } while (a1 * b2 - a2 * b1 === 0); // garante solução única (determinante ≠ 0)

  const c1 = a1 * x + b1 * y;
  const c2 = a2 * x + b2 * y;

  return {
    eq1: `${termoLinear(a1, "x")} ${termoLinearComSinal(b1, "y")} = ${c1}`,
    eq2: `${termoLinear(a2, "x")} ${termoLinearComSinal(b2, "y")} = ${c2}`,
    respostaX: x,
    respostaY: y,
  };
}
