import { aleatorioInt, escolher } from "./aleatorio";
import { baseTexto, expoenteTexto } from "./algebra";

export type DificuldadePotencia = "facil" | "medio" | "dificil";

export type QuestaoPotencia = { enunciado: string; resposta: number };

/**
 * Gera uma questão de potenciação alinhada à BNCC EF08MA01 (cálculos com
 * potências de expoente inteiro) — nível difícil trabalha as propriedades
 * operatórias (produto, quociente e potência de potência de mesma base).
 */
export function gerarQuestaoPotencia(dificuldade: DificuldadePotencia): QuestaoPotencia {
  if (dificuldade === "facil") {
    const base = aleatorioInt(2, 10);
    const expoente = aleatorioInt(2, 3);
    return { enunciado: `${baseTexto(base)}${expoenteTexto(expoente)} =`, resposta: base ** expoente };
  }

  if (dificuldade === "medio") {
    const base = escolher([-10, -9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const expoente = aleatorioInt(0, 4);
    return { enunciado: `${baseTexto(base)}${expoenteTexto(expoente)} =`, resposta: base ** expoente };
  }

  // Difícil: propriedades operatórias de potências de mesma base.
  const tipo = escolher(["produto", "quociente", "potenciaDePotencia"] as const);
  const base = aleatorioInt(2, 5);

  if (tipo === "produto") {
    const m = aleatorioInt(1, 4);
    const n = aleatorioInt(1, 4);
    return {
      enunciado: `${baseTexto(base)}${expoenteTexto(m)} × ${baseTexto(base)}${expoenteTexto(n)} =`,
      resposta: base ** (m + n),
    };
  }

  if (tipo === "quociente") {
    const n = aleatorioInt(1, 3);
    const m = n + aleatorioInt(1, 3); // garante m > n, expoente final positivo
    return {
      enunciado: `${baseTexto(base)}${expoenteTexto(m)} ÷ ${baseTexto(base)}${expoenteTexto(n)} =`,
      resposta: base ** (m - n),
    };
  }

  const m = aleatorioInt(1, 3);
  const n = aleatorioInt(1, 3);
  return {
    enunciado: `(${baseTexto(base)}${expoenteTexto(m)})${expoenteTexto(n)} =`,
    resposta: base ** (m * n),
  };
}
