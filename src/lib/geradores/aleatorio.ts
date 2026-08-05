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

/**
 * Gera `quantidade` itens usando `gerarUm()`, evitando repetir a mesma questão
 * na mesma folha (compara pela `chave` de cada item). Se o "espaço" de
 * combinações possíveis for menor que a quantidade pedida (ex: dificuldade
 * fácil com poucas combinações), aceita repetir só como último recurso, pra
 * nunca travar nem devolver menos itens do que o pedido.
 */
export function gerarSemRepetir<T>(gerarUm: () => T, quantidade: number, chave: (item: T) => string): T[] {
  const MAX_TENTATIVAS_POR_ITEM = 200;
  const vistos = new Set<string>();
  const resultado: T[] = [];

  for (let i = 0; i < quantidade; i++) {
    let candidato = gerarUm();
    let tentativas = 0;
    while (vistos.has(chave(candidato)) && tentativas < MAX_TENTATIVAS_POR_ITEM) {
      candidato = gerarUm();
      tentativas++;
    }
    vistos.add(chave(candidato));
    resultado.push(candidato);
  }

  return resultado;
}
