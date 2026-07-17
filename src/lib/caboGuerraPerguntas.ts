export type Nivel = 1 | 2 | 3 | 4 | 5;

export const TOTAL_RODADAS = 15;
export const TEMPO_RODADA = 30;
export const PAUSA_MS = 2300;

export const NOMES_NIVEL: Record<Nivel, string> = {
  1: "⭐ Nível 1",
  2: "🌟 Nível 2",
  3: "💥 Nível 3",
  4: "🔥 Nível 4",
  5: "🏆 Nível 5",
};
export const SUB_NIVEL: Record<Nivel, string> = {
  1: "Aquecendo os motores!",
  2: "Adição e subtração!",
  3: "Chegou a multiplicação!",
  4: "Todas as operações!",
  5: "MODO DIFÍCIL — tudo junto!",
};

export function nivelDaRodada(rodada: number): Nivel {
  if (rodada <= 3) return 1;
  if (rodada <= 6) return 2;
  if (rodada <= 9) return 3;
  if (rodada <= 12) return 4;
  return 5;
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function escolher<T>(itens: T[]): T {
  return itens[Math.floor(Math.random() * itens.length)];
}

export function gerarPergunta(nivel: Nivel): { texto: string; resposta: number } {
  if (nivel === 1) {
    const a = randInt(1, 10);
    const b = randInt(1, 10);
    return { texto: `${a} + ${b} = ?`, resposta: a + b };
  }

  if (nivel === 2) {
    if (Math.random() < 0.5) {
      const a = randInt(5, 29);
      const b = randInt(5, 29);
      return { texto: `${a} + ${b} = ?`, resposta: a + b };
    }
    const a = randInt(20, 49);
    const b = randInt(1, a - 1);
    return { texto: `${a} − ${b} = ?`, resposta: a - b };
  }

  if (nivel === 3) {
    const op = escolher(["+", "-", "×"]);
    if (op === "+") {
      const a = randInt(10, 49);
      const b = randInt(10, 49);
      return { texto: `${a} + ${b} = ?`, resposta: a + b };
    }
    if (op === "-") {
      const a = randInt(30, 79);
      const b = randInt(1, a - 1);
      return { texto: `${a} − ${b} = ?`, resposta: a - b };
    }
    const [fa, fb] = escolher([
      [2, 3], [2, 4], [2, 5], [3, 3], [3, 4], [3, 5], [4, 4], [4, 5], [5, 5], [2, 6], [3, 6],
    ]);
    return { texto: `${fa} × ${fb} = ?`, resposta: fa * fb };
  }

  if (nivel === 4) {
    const op = escolher(["+", "-", "×", "÷"]);
    if (op === "+") {
      const a = randInt(20, 99);
      const b = randInt(20, 99);
      return { texto: `${a} + ${b} = ?`, resposta: a + b };
    }
    if (op === "-") {
      const a = randInt(50, 129);
      const b = randInt(1, a - 1);
      return { texto: `${a} − ${b} = ?`, resposta: a - b };
    }
    if (op === "×") {
      const [fa, fb] = escolher([
        [4, 5], [4, 6], [5, 6], [5, 7], [6, 6], [6, 7], [4, 7], [3, 8], [3, 9], [4, 8],
      ]);
      return { texto: `${fa} × ${fb} = ?`, resposta: fa * fb };
    }
    const [dd, dv] = escolher([
      [2, 1], [3, 1], [4, 1], [4, 2], [6, 2], [6, 3], [8, 2], [8, 4], [9, 3], [12, 3],
      [12, 4], [15, 3], [16, 4], [18, 3], [20, 4], [20, 5],
    ]);
    return { texto: `${dd} ÷ ${dv} = ?`, resposta: dd / dv };
  }

  const op = escolher(["+", "-", "×", "÷"]);
  if (op === "+") {
    const a = randInt(50, 249);
    const b = randInt(50, 249);
    return { texto: `${a} + ${b} = ?`, resposta: a + b };
  }
  if (op === "-") {
    const a = randInt(100, 299);
    const b = randInt(1, a - 1);
    return { texto: `${a} − ${b} = ?`, resposta: a - b };
  }
  if (op === "×") {
    const [fa, fb] = escolher([
      [7, 7], [7, 8], [7, 9], [8, 8], [8, 9], [9, 9], [6, 8], [6, 9], [7, 6], [8, 6], [9, 6],
    ]);
    return { texto: `${fa} × ${fb} = ?`, resposta: fa * fb };
  }
  const [dd, dv] = escolher([
    [21, 3], [24, 4], [24, 6], [25, 5], [27, 3], [28, 4], [32, 4], [36, 6], [42, 6],
    [45, 5], [48, 6], [49, 7], [56, 7], [63, 7], [64, 8], [72, 8], [81, 9],
  ]);
  return { texto: `${dd} ÷ ${dv} = ?`, resposta: dd / dv };
}
