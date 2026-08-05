/**
 * Helpers de formatação de expressões algébricas, compartilhados pelos geradores
 * de Potência, Equação do 1º Grau, Sistema de Equações e Equação do 2º Grau
 * (Matemática 8º/9º ano, alinhados à BNCC).
 */

const DIGITOS_SOBRESCRITOS: Record<string, string> = {
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
  "-": "⁻",
};

/** Converte um número em algarismos sobrescritos (expoente), ex: 12 -> "¹²". */
export function expoenteTexto(n: number): string {
  return String(n)
    .split("")
    .map((c) => DIGITOS_SOBRESCRITOS[c] ?? c)
    .join("");
}

/** Formata a base de uma potência, colocando parênteses se for negativa. */
export function baseTexto(base: number): string {
  return base < 0 ? `(${base})` : `${base}`;
}

/** Formata "+ 5" ou "- 5" a partir de um valor com sinal, pra encaixar depois de outro termo. */
export function comSinal(valor: number): string {
  return valor < 0 ? `- ${Math.abs(valor)}` : `+ ${valor}`;
}

/**
 * Formata um termo linear "coeficiente·variável", omitindo o "1" implícito
 * (ex: 1x -> "x", -1x -> "-x", 5x -> "5x") — usado como PRIMEIRO termo da expressão.
 */
export function termoLinear(coeficiente: number, variavel: string): string {
  if (coeficiente === 1) return variavel;
  if (coeficiente === -1) return `-${variavel}`;
  return `${coeficiente}${variavel}`;
}

/**
 * Formata um termo linear com sinal explícito pra encaixar DEPOIS de outro termo
 * (ex: "+ 3y", "- y", "+ x").
 */
export function termoLinearComSinal(coeficiente: number, variavel: string): string {
  const absoluto = Math.abs(coeficiente);
  const corpo = absoluto === 1 ? variavel : `${absoluto}${variavel}`;
  return coeficiente < 0 ? `- ${corpo}` : `+ ${corpo}`;
}
