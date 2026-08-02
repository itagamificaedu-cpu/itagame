export type CelulaLabirinto = { topo: boolean; direita: boolean; baixo: boolean; esquerda: boolean };

export function gerarLabirinto(linhas: number, colunas: number): CelulaLabirinto[][] {
  const grade: CelulaLabirinto[][] = Array.from({ length: linhas }, () =>
    Array.from({ length: colunas }, () => ({ topo: true, direita: true, baixo: true, esquerda: true }))
  );
  const visitadas: boolean[][] = Array.from({ length: linhas }, () => Array(colunas).fill(false));

  const pilha: [number, number][] = [[0, 0]];
  visitadas[0][0] = true;

  while (pilha.length > 0) {
    const [r, c] = pilha[pilha.length - 1];
    const vizinhos: { r: number; c: number; dir: keyof CelulaLabirinto; oposto: keyof CelulaLabirinto }[] = [];

    if (r > 0 && !visitadas[r - 1][c]) vizinhos.push({ r: r - 1, c, dir: "topo", oposto: "baixo" });
    if (c < colunas - 1 && !visitadas[r][c + 1]) vizinhos.push({ r, c: c + 1, dir: "direita", oposto: "esquerda" });
    if (r < linhas - 1 && !visitadas[r + 1][c]) vizinhos.push({ r: r + 1, c, dir: "baixo", oposto: "topo" });
    if (c > 0 && !visitadas[r][c - 1]) vizinhos.push({ r, c: c - 1, dir: "esquerda", oposto: "direita" });

    if (vizinhos.length === 0) {
      pilha.pop();
      continue;
    }

    const escolhido = vizinhos[Math.floor(Math.random() * vizinhos.length)];
    grade[r][c][escolhido.dir] = false;
    grade[escolhido.r][escolhido.c][escolhido.oposto] = false;
    visitadas[escolhido.r][escolhido.c] = true;
    pilha.push([escolhido.r, escolhido.c]);
  }

  return grade;
}

export function resolverLabirinto(grade: CelulaLabirinto[][]): [number, number][] {
  const linhas = grade.length;
  const colunas = grade[0].length;
  const destino = [linhas - 1, colunas - 1];

  const visitado: boolean[][] = Array.from({ length: linhas }, () => Array(colunas).fill(false));
  const anterior = new Map<string, [number, number]>();
  const fila: [number, number][] = [[0, 0]];
  visitado[0][0] = true;

  while (fila.length > 0) {
    const [r, c] = fila.shift()!;
    if (r === destino[0] && c === destino[1]) break;

    const celula = grade[r][c];
    const vizinhos: [number, number][] = [];
    if (!celula.topo && r > 0) vizinhos.push([r - 1, c]);
    if (!celula.direita && c < colunas - 1) vizinhos.push([r, c + 1]);
    if (!celula.baixo && r < linhas - 1) vizinhos.push([r + 1, c]);
    if (!celula.esquerda && c > 0) vizinhos.push([r, c - 1]);

    for (const [vr, vc] of vizinhos) {
      if (!visitado[vr][vc]) {
        visitado[vr][vc] = true;
        anterior.set(`${vr},${vc}`, [r, c]);
        fila.push([vr, vc]);
      }
    }
  }

  const caminho: [number, number][] = [destino as [number, number]];
  let atual = destino as [number, number];
  while (atual[0] !== 0 || atual[1] !== 0) {
    const ant = anterior.get(`${atual[0]},${atual[1]}`);
    if (!ant) break;
    caminho.push(ant);
    atual = ant;
  }
  return caminho.reverse();
}
