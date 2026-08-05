import { aleatorioInt, aleatorioNaoZero } from "./aleatorio";
import { comSinal, termoLinear } from "./algebra";

export type DificuldadeEquacao1Grau = "facil" | "medio" | "dificil";

export type QuestaoEquacao1Grau = { enunciado: string; resposta: number };

/**
 * Gera uma equação do 1º grau com 1 incógnita e solução inteira garantida,
 * alinhada à BNCC EF07MA18 (ax + b = c) e ao descritor SPAECE/SAEB D33.
 */
export function gerarQuestaoEquacao1Grau(dificuldade: DificuldadeEquacao1Grau): QuestaoEquacao1Grau {
  if (dificuldade === "facil") {
    // x + b = c, com x positivo pequeno.
    const x = aleatorioInt(1, 15);
    const b = aleatorioInt(1, 15);
    return { enunciado: `x + ${b} = ${x + b}`, resposta: x };
  }

  if (dificuldade === "medio") {
    // ax + b = c, com a podendo ser negativo e x podendo ser negativo.
    const x = aleatorioInt(-12, 12) || 1;
    const a = aleatorioNaoZero(-9, 9);
    const b = aleatorioInt(-15, 15);
    const c = a * x + b;
    return { enunciado: `${termoLinear(a, "x")} ${comSinal(b)} = ${c}`, resposta: x };
  }

  // Difícil: incógnita nos dois lados — ax + b = dx + e.
  const x = aleatorioInt(-10, 10) || 1;
  const a = aleatorioNaoZero(2, 9);
  let d = aleatorioNaoZero(-8, 8);
  while (d === a) d = aleatorioNaoZero(-8, 8); // evita a === d (senão não há solução única)
  const b = aleatorioInt(-10, 10);
  const e = (a - d) * x + b;
  return {
    enunciado: `${termoLinear(a, "x")} ${comSinal(b)} = ${termoLinear(d, "x")} ${comSinal(e)}`,
    resposta: x,
  };
}
