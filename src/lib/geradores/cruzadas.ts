import { normalizarPalavra } from "./texto";

export type ItemCruzada = { palavra: string; dica: string };
export type PalavraColocada = {
  palavra: string;
  dica: string;
  linha: number;
  coluna: number;
  direcao: "H" | "V";
  numero: number;
};

type OcupacaoCelula = { letra: string; direcoes: Set<"H" | "V"> };

function chave(r: number, c: number) {
  return `${r},${c}`;
}

export function gerarCruzadas(itensBrutos: ItemCruzada[]) {
  const itens = itensBrutos
    .map((i) => ({ palavra: normalizarPalavra(i.palavra), dica: i.dica }))
    .filter((i) => i.palavra.length >= 2)
    .sort((a, b) => b.palavra.length - a.palavra.length);

  if (itens.length === 0) {
    return { linhas: 0, colunas: 0, grade: [] as (string | null)[][], numeros: [] as (number | null)[][], palavras: [] as PalavraColocada[] };
  }

  const ocupacao = new Map<string, OcupacaoCelula>();
  const colocadas: { palavra: string; dica: string; linha: number; coluna: number; direcao: "H" | "V" }[] = [];

  function tentarColocar(palavra: string, linha: number, coluna: number, direcao: "H" | "V") {
    for (let i = 0; i < palavra.length; i++) {
      const r = direcao === "V" ? linha + i : linha;
      const c = direcao === "H" ? coluna + i : coluna;
      const existente = ocupacao.get(chave(r, c));
      if (existente) {
        if (existente.letra !== palavra[i]) return false;
        if (existente.direcoes.has(direcao)) return false;
      }
    }
    return true;
  }

  function colocar(palavra: string, dica: string, linha: number, coluna: number, direcao: "H" | "V") {
    for (let i = 0; i < palavra.length; i++) {
      const r = direcao === "V" ? linha + i : linha;
      const c = direcao === "H" ? coluna + i : coluna;
      const k = chave(r, c);
      const existente = ocupacao.get(k);
      if (existente) {
        existente.direcoes.add(direcao);
      } else {
        ocupacao.set(k, { letra: palavra[i], direcoes: new Set([direcao]) });
      }
    }
    colocadas.push({ palavra, dica, linha, coluna, direcao });
  }

  colocar(itens[0].palavra, itens[0].dica, 0, 0, "H");

  for (let idx = 1; idx < itens.length; idx++) {
    const palavra = itens[idx].palavra;
    let colocou = false;

    for (const [chaveExistente, dadosExistente] of ocupacao) {
      if (colocou) break;
      const [rExistente, cExistente] = chaveExistente.split(",").map(Number);
      for (let i = 0; i < palavra.length && !colocou; i++) {
        if (palavra[i] !== dadosExistente.letra) continue;
        const direcaoNova: "H" | "V" = dadosExistente.direcoes.has("H") ? "V" : "H";
        const linha = direcaoNova === "V" ? rExistente - i : rExistente;
        const coluna = direcaoNova === "H" ? cExistente - i : cExistente;
        if (tentarColocar(palavra, linha, coluna, direcaoNova)) {
          colocar(palavra, itens[idx].dica, linha, coluna, direcaoNova);
          colocou = true;
        }
      }
    }

    if (!colocou) {
      const linhasUsadas = [...ocupacao.keys()].map((k) => Number(k.split(",")[0]));
      const linhaLivre = (linhasUsadas.length ? Math.max(...linhasUsadas) : 0) + 2;
      colocar(palavra, itens[idx].dica, linhaLivre, 0, "H");
    }
  }

  const coords = [...ocupacao.keys()].map((k) => k.split(",").map(Number));
  const minR = Math.min(...coords.map((c) => c[0]));
  const maxR = Math.max(...coords.map((c) => c[0]));
  const minC = Math.min(...coords.map((c) => c[1]));
  const maxC = Math.max(...coords.map((c) => c[1]));

  const linhas = maxR - minR + 1;
  const colunas = maxC - minC + 1;
  const grade: (string | null)[][] = Array.from({ length: linhas }, () => Array(colunas).fill(null));

  for (const [k, dados] of ocupacao) {
    const [r, c] = k.split(",").map(Number);
    grade[r - minR][c - minC] = dados.letra;
  }

  const numeros: (number | null)[][] = Array.from({ length: linhas }, () => Array(colunas).fill(null));
  const palavrasOrdenadas = [...colocadas].sort((a, b) => {
    const ra = a.linha - minR;
    const rb = b.linha - minR;
    const ca = a.coluna - minC;
    const cb = b.coluna - minC;
    return ra !== rb ? ra - rb : ca - cb;
  });

  const inicioParaNumero = new Map<string, number>();
  let contador = 1;
  const palavras: PalavraColocada[] = palavrasOrdenadas.map((p) => {
    const r = p.linha - minR;
    const c = p.coluna - minC;
    const k = chave(r, c);
    let numero = inicioParaNumero.get(k);
    if (!numero) {
      numero = contador++;
      inicioParaNumero.set(k, numero);
      numeros[r][c] = numero;
    }
    return { ...p, linha: r, coluna: c, numero };
  });

  return { linhas, colunas, grade, numeros, palavras };
}
