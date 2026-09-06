"use client";

import { useEffect, useRef, useState, type TouchEvent as ReactTouchEvent } from "react";

// Mesma mecânica de arrastar-pra-selecionar do Gerador de Caça-Palavras
// (src/components/geradores/GeradorCacaPalavrasCliente.tsx), adaptada pra
// atividade gerada por IA — aqui a posição de cada palavra na grade não fica
// salva no banco (só a grade final + a lista de palavras), então a
// conferência é feita comparando as LETRAS da seleção com cada palavra-alvo
// (nos dois sentidos), em vez de comparar com uma posição pré-calculada.

type Coordenada = { r: number; c: number };

function celulasEntre(inicio: Coordenada, fim: Coordenada): Coordenada[] | null {
  const dr = Math.sign(fim.r - inicio.r);
  const dc = Math.sign(fim.c - inicio.c);
  const distR = Math.abs(fim.r - inicio.r);
  const distC = Math.abs(fim.c - inicio.c);
  if (dr !== 0 && dc !== 0 && distR !== distC) return null;
  const passos = Math.max(distR, distC);
  return Array.from({ length: passos + 1 }, (_, i) => ({ r: inicio.r + dr * i, c: inicio.c + dc * i }));
}

const REGEX_DIACRITICOS = /[\u0300-\u036f]/g;
function normalizarPalavra(palavra: string) {
  return palavra
    .normalize("NFD")
    .replace(REGEX_DIACRITICOS, "")
    .replace(/[^A-Za-z]/g, "")
    .toUpperCase();
}

const COR_TEMA = "#7c3aed";

export function BlocoCacaPalavrasCliente({
  grade,
  tamanho,
  palavras,
}: {
  grade: string[][];
  tamanho: number;
  palavras: string[];
}) {
  const palavrasAlvo = palavras.map((p) => ({ original: p, normalizada: normalizarPalavra(p) }));

  const [arrastando, setArrastando] = useState(false);
  const [inicioArraste, setInicioArraste] = useState<Coordenada | null>(null);
  const [celulasSelecionadas, setCelulasSelecionadas] = useState<Set<string>>(new Set());
  const [celulasEncontradas, setCelulasEncontradas] = useState<Set<string>>(new Set());
  const [palavrasEncontradas, setPalavrasEncontradas] = useState<Set<string>>(new Set());

  function iniciarSelecao(r: number, c: number) {
    setArrastando(true);
    setInicioArraste({ r, c });
    setCelulasSelecionadas(new Set([`${r}-${c}`]));
  }

  function estenderSelecao(r: number, c: number) {
    if (!arrastando || !inicioArraste) return;
    const caminho = celulasEntre(inicioArraste, { r, c });
    if (!caminho) return;
    setCelulasSelecionadas(new Set(caminho.map((p) => `${p.r}-${p.c}`)));
  }

  function finalizarSelecao() {
    if (!arrastando) return;
    setArrastando(false);

    const caminhoOrdenado = [...celulasSelecionadas]
      .map((chave) => {
        const [r, c] = chave.split("-").map(Number);
        return { r, c };
      })
      // celulasSelecionadas foi montado em ordem pela última estenderSelecao,
      // então dá pra reconstruir a ordem a partir do início do arraste
      .sort((a, b) => {
        if (!inicioArraste) return 0;
        const distA = Math.hypot(a.r - inicioArraste.r, a.c - inicioArraste.c);
        const distB = Math.hypot(b.r - inicioArraste.r, b.c - inicioArraste.c);
        return distA - distB;
      });

    const letras = caminhoOrdenado.map(({ r, c }) => grade[r]?.[c] ?? "").join("");
    const letrasInvertidas = [...letras].reverse().join("");

    for (const palavra of palavrasAlvo) {
      if (palavrasEncontradas.has(palavra.original)) continue;
      if (palavra.normalizada === letras || palavra.normalizada === letrasInvertidas) {
        setPalavrasEncontradas((atual) => new Set(atual).add(palavra.original));
        setCelulasEncontradas((atual) => new Set([...atual, ...celulasSelecionadas]));
        break;
      }
    }

    setCelulasSelecionadas(new Set());
    setInicioArraste(null);
  }

  function celulaNaPosicao(clientX: number, clientY: number): Coordenada | null {
    const alvo = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
    const el = alvo?.closest("[data-r]") as HTMLElement | null;
    if (!el) return null;
    return { r: Number(el.dataset.r), c: Number(el.dataset.c) };
  }

  const finalizarSelecaoRef = useRef(finalizarSelecao);
  useEffect(() => {
    finalizarSelecaoRef.current = finalizarSelecao;
  });

  useEffect(() => {
    function aoSoltar() {
      finalizarSelecaoRef.current();
    }
    document.addEventListener("mouseup", aoSoltar);
    document.addEventListener("touchend", aoSoltar);
    return () => {
      document.removeEventListener("mouseup", aoSoltar);
      document.removeEventListener("touchend", aoSoltar);
    };
  }, []);

  function aoMoverToque(e: ReactTouchEvent) {
    if (!arrastando) return;
    e.preventDefault();
    const toque = e.touches[0];
    const celula = celulaNaPosicao(toque.clientX, toque.clientY);
    if (celula) estenderSelecao(celula.r, celula.c);
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      {palavrasAlvo.length > 0 && (
        <p className="mb-3 text-center text-sm font-bold text-neutral-500">
          🔎 Encontradas: {palavrasEncontradas.size}/{palavrasAlvo.length} — arraste o mouse ou o dedo sobre as
          letras
        </p>
      )}

      {palavrasAlvo.length > 0 && palavrasEncontradas.size === palavrasAlvo.length && (
        <div
          className="mb-4 flex items-center justify-center gap-2 rounded-xl border-2 p-3 text-center font-extrabold"
          style={{ borderColor: COR_TEMA, color: COR_TEMA, backgroundColor: `${COR_TEMA}12` }}
        >
          <span className="text-xl">🏆</span>
          <span>Encontrou todas as palavras!</span>
        </div>
      )}

      <div
        onTouchMove={aoMoverToque}
        className="mx-auto grid w-fit gap-0.5 select-none"
        style={{ gridTemplateColumns: `repeat(${tamanho}, minmax(0, 1fr))` }}
      >
        {grade.map((linha, r) =>
          linha.map((letra, c) => {
            const chave = `${r}-${c}`;
            const encontrada = celulasEncontradas.has(chave);
            const selecionada = celulasSelecionadas.has(chave);
            return (
              <div
                key={chave}
                data-r={r}
                data-c={c}
                onMouseDown={() => iniciarSelecao(r, c)}
                onMouseEnter={() => estenderSelecao(r, c)}
                onTouchStart={() => iniciarSelecao(r, c)}
                className={`flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm text-xs font-bold sm:h-7 sm:w-7 sm:text-sm ${
                  encontrada
                    ? "rounded-full bg-[#00c264]/70 text-white"
                    : selecionada
                      ? "rounded-full text-white"
                      : "bg-neutral-50 text-neutral-700"
                }`}
                style={selecionada && !encontrada ? { backgroundColor: COR_TEMA } : undefined}
              >
                {letra}
              </div>
            );
          })
        )}
      </div>

      {palavrasAlvo.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {palavrasAlvo.map((palavra) => (
            <span
              key={palavra.original}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                palavrasEncontradas.has(palavra.original)
                  ? "bg-[#00c264]/15 text-[#00854a] line-through"
                  : "bg-neutral-100 text-neutral-700"
              }`}
            >
              {palavra.original}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
