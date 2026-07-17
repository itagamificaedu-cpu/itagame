import "server-only";

export type PosicaoPalavra = {
  palavra: string;
  linha: number;
  coluna: number;
  direcao: "H" | "V" | "D";
};

export type GradeCacaPalavras = {
  tamanho: number;
  grade: string[][];
  posicoes: PosicaoPalavra[];
};

const LETRAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const DIRECOES: { dl: number; dc: number; nome: PosicaoPalavra["direcao"] }[] = [
  { dl: 0, dc: 1, nome: "H" },
  { dl: 1, dc: 0, nome: "V" },
  { dl: 1, dc: 1, nome: "D" },
];

const REGEX_DIACRITICOS = /[\u0300-\u036f]/g;

function normalizarPalavra(palavra: string) {
  return palavra
    .normalize("NFD")
    .replace(REGEX_DIACRITICOS, "")
    .replace(/[^A-Za-z]/g, "")
    .toUpperCase();
}

function podeColocar(
  grade: (string | null)[][],
  linha: number,
  coluna: number,
  direcao: (typeof DIRECOES)[number],
  palavra: string
) {
  for (let i = 0; i < palavra.length; i++) {
    const atual = grade[linha + direcao.dl * i][coluna + direcao.dc * i];
    if (atual !== null && atual !== palavra[i]) return false;
  }
  return true;
}

function colocar(
  grade: (string | null)[][],
  linha: number,
  coluna: number,
  direcao: (typeof DIRECOES)[number],
  palavra: string
) {
  for (let i = 0; i < palavra.length; i++) {
    grade[linha + direcao.dl * i][coluna + direcao.dc * i] = palavra[i];
  }
}

export function gerarGradeCacaPalavras(palavrasBrutas: string[]): GradeCacaPalavras {
  const palavras = palavrasBrutas
    .map(normalizarPalavra)
    .filter((palavra) => palavra.length >= 3)
    .sort((a, b) => b.length - a.length);

  const maiorPalavra = Math.max(3, ...palavras.map((p) => p.length));
  const tamanho = Math.min(20, Math.max(12, maiorPalavra + 2));

  const palavrasCabem = palavras.filter((p) => p.length <= tamanho);

  const grade: (string | null)[][] = Array.from({ length: tamanho }, () => Array(tamanho).fill(null));
  const posicoes: PosicaoPalavra[] = [];

  for (const palavra of palavrasCabem) {
    let colocada = false;
    for (let tentativa = 0; tentativa < 100 && !colocada; tentativa++) {
      const direcao = DIRECOES[Math.floor(Math.random() * DIRECOES.length)];
      const limiteLinha = direcao.dl === 0 ? tamanho - 1 : tamanho - palavra.length;
      const limiteColuna = direcao.dc === 0 ? tamanho - 1 : tamanho - palavra.length;
      if (limiteLinha < 0 || limiteColuna < 0) continue;

      const linha = Math.floor(Math.random() * (limiteLinha + 1));
      const coluna = Math.floor(Math.random() * (limiteColuna + 1));

      if (!podeColocar(grade, linha, coluna, direcao, palavra)) continue;

      colocar(grade, linha, coluna, direcao, palavra);
      posicoes.push({ palavra, linha, coluna, direcao: direcao.nome });
      colocada = true;
    }
  }

  const gradeFinal = grade.map((linha) =>
    linha.map((celula) => celula ?? LETRAS[Math.floor(Math.random() * LETRAS.length)])
  );

  return { tamanho, grade: gradeFinal, posicoes };
}
