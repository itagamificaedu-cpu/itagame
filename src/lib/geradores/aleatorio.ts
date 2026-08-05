export function aleatorioInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function embaralhar<T>(itens: T[]): T[] {
  const copia = [...itens];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

export function escolher<T>(itens: T[]): T {
  return itens[aleatorioInt(0, itens.length - 1)];
}

/** Sorteia um inteiro no intervalo [min, max], nunca zero (útil pra coeficiente de equação). */
export function aleatorioNaoZero(min: number, max: number): number {
  let n = 0;
  while (n === 0) n = aleatorioInt(min, max);
  return n;
}
