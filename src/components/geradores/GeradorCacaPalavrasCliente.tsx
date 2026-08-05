"use client";

import { useEffect, useMemo, useRef, useState, type TouchEvent as ReactTouchEvent } from "react";
import { LayoutGerador, CampoConfig, CabecalhoFolha, SeletorModo, type ModoAtividade } from "./LayoutGerador";

import { gerarGradeCacaPalavras } from "@/lib/geradores/cacaPalavras";
import { CATEGORIAS_VOCABULARIO, ROTULO_CATEGORIA } from "@/lib/geradores/vocabulario";
import { embaralhar } from "@/lib/geradores/aleatorio";
const COR_TEMA = "#7c3aed";

type Coordenada = { r: number; c: number };

// Calcula a linha reta (horizontal, vertical ou diagonal) entre duas células,
// na ordem em que o aluno arrastou. Retorna null se não formar uma linha reta.
function celulasEntre(inicio: Coordenada, fim: Coordenada): Coordenada[] | null {
  const dr = Math.sign(fim.r - inicio.r);
  const dc = Math.sign(fim.c - inicio.c);
  const distR = Math.abs(fim.r - inicio.r);
  const distC = Math.abs(fim.c - inicio.c);
  if (dr !== 0 && dc !== 0 && distR !== distC) return null;
  const passos = Math.max(distR, distC);
  return Array.from({ length: passos + 1 }, (_, i) => ({ r: inicio.r + dr * i, c: inicio.c + dc * i }));
}


type Origem = "categoria" | "personalizada";

export function GeradorCacaPalavrasCliente() {
  const [origem, setOrigem] = useState<Origem>("categoria");
  const [categoria, setCategoria] = useState("animais");
  const [quantidade, setQuantidade] = useState(8);
  const [listaPersonalizada, setListaPersonalizada] = useState("LEAO\nTIGRE\nURSO\nLOBO\nRAPOSA\nGIRAFA");
  const [mostrarRespostas, setMostrarRespostas] = useState(false);
  const [semente, setSemente] = useState(0);
  const [modo, setModo] = useState<ModoAtividade>("imprimir");
  const [arrastando, setArrastando] = useState(false);
  const [inicioArraste, setInicioArraste] = useState<Coordenada | null>(null);
  const [celulasSelecionadas, setCelulasSelecionadas] = useState<Set<string>>(new Set());
  const [celulasEncontradas, setCelulasEncontradas] = useState<Set<string>>(new Set());
  const [palavrasEncontradas, setPalavrasEncontradas] = useState<Set<string>>(new Set());
  const gradeRef = useRef<HTMLDivElement>(null);

  const banco = CATEGORIAS_VOCABULARIO[categoria];

  const palavrasEscolhidas = useMemo(() => {
    if (origem === "personalizada") {
      return listaPersonalizada
        .split("\n")
        .map((linha) => linha.trim())
        .filter(Boolean);
    }
    return embaralhar(banco)
      .slice(0, Math.min(quantidade, banco.length))
      .map((item) => item.palavra);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [origem, categoria, quantidade, listaPersonalizada, semente]);

  const resultado = useMemo(
    () => gerarGradeCacaPalavras(palavrasEscolhidas),
    [palavrasEscolhidas]
  );

  const marcadas = useMemo(() => {
    const conjunto = new Set<string>();
    resultado.posicoes.forEach((pos) => {
      const dir = DIRECOES_MAPA[pos.direcao];
      for (let i = 0; i < pos.palavra.length; i++) {
        conjunto.add(`${pos.linha + dir.dl * i}-${pos.coluna + dir.dc * i}`);
      }
    });
    return conjunto;
  }, [resultado]);

  // Célula-a-célula de cada palavra colocada, pra conferir se a seleção do aluno bate certinho.
  const caminhosPalavras = useMemo(() => {
    const mapa = new Map<string, Set<string>>();
    resultado.posicoes.forEach((pos) => {
      const dir = DIRECOES_MAPA[pos.direcao];
      const celulas = new Set<string>();
      for (let i = 0; i < pos.palavra.length; i++) {
        celulas.add(`${pos.linha + dir.dl * i}-${pos.coluna + dir.dc * i}`);
      }
      mapa.set(pos.palavra, celulas);
    });
    return mapa;
  }, [resultado]);

  const [resultadoAtual, setResultadoAtual] = useState(resultado);
  if (resultadoAtual !== resultado) {
    setResultadoAtual(resultado);
    setCelulasEncontradas(new Set());
    setPalavrasEncontradas(new Set());
    setCelulasSelecionadas(new Set());
    setArrastando(false);
  }

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
    for (const [palavra, caminho] of caminhosPalavras) {
      if (palavrasEncontradas.has(palavra)) continue;
      if (caminho.size !== celulasSelecionadas.size) continue;
      const bateuTudo = [...caminho].every((celula) => celulasSelecionadas.has(celula));
      if (bateuTudo) {
        setPalavrasEncontradas((atual) => new Set(atual).add(palavra));
        setCelulasEncontradas((atual) => new Set([...atual, ...caminho]));
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

  // Mantém a função de finalizar sempre atualizada num ref, pra registrar
  // o listener global de "soltou o mouse/dedo" uma única vez.
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
    <LayoutGerador
      titulo="🔎 Gerador de Caça-Palavras"
      cor={COR_TEMA}
      config={
        <>
          <CampoConfig rotulo="Modo">
            <SeletorModo modo={modo} aoAlterar={setModo} cor={COR_TEMA} />
          </CampoConfig>

          <CampoConfig rotulo="Origem das palavras">
            <select
              value={origem}
              onChange={(e) => setOrigem(e.target.value as Origem)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            >
              <option value="categoria">Categoria pronta</option>
              <option value="personalizada">Lista personalizada</option>
            </select>
          </CampoConfig>

          {origem === "categoria" ? (
            <>
              <CampoConfig rotulo="Categoria">
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                >
                  {Object.keys(CATEGORIAS_VOCABULARIO).map((chave) => (
                    <option key={chave} value={chave}>
                      {ROTULO_CATEGORIA[chave]}
                    </option>
                  ))}
                </select>
              </CampoConfig>
              <CampoConfig rotulo={`Quantidade de palavras: ${Math.min(quantidade, banco.length)}`}>
                <input
                  type="range"
                  min={4}
                  max={banco.length}
                  value={quantidade}
                  onChange={(e) => setQuantidade(Number(e.target.value))}
                  className="w-full"
                />
              </CampoConfig>
            </>
          ) : (
            <CampoConfig rotulo="Lista personalizada (uma por linha)">
              <textarea
                value={listaPersonalizada}
                onChange={(e) => setListaPersonalizada(e.target.value)}
                rows={8}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
              />
            </CampoConfig>
          )}

          {modo === "imprimir" && (
            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={mostrarRespostas}
                onChange={(e) => setMostrarRespostas(e.target.checked)}
              />
              Destacar respostas
            </label>
          )}

          <button
            onClick={() => setSemente((s) => s + 1)}
            className="w-full rounded-lg bg-[#1a3fd4] py-2.5 text-sm font-bold text-white transition hover:brightness-110"
          >
            🔄 Gerar nova folha
          </button>

          {modo === "online" && (
            <button
              onClick={() => {
                setCelulasEncontradas(new Set());
                setPalavrasEncontradas(new Set());
              }}
              className="w-full rounded-lg py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-110"
              style={{ backgroundColor: COR_TEMA }}
            >
              🔄 Limpar seleção
            </button>
          )}
        </>
      }
    >
      <CabecalhoFolha titulo="Caça-Palavras" cor={COR_TEMA} />

      {modo === "online" && palavrasEncontradas.size === resultado.posicoes.length && resultado.posicoes.length > 0 && (
        <div
          className="mb-8 flex items-center justify-center gap-2 rounded-xl border-2 p-3 text-center font-extrabold"
          style={{ borderColor: COR_TEMA, color: COR_TEMA, backgroundColor: `${COR_TEMA}12` }}
        >
          <span className="text-xl">🏆</span>
          <span>Você encontrou todas as {resultado.posicoes.length} palavras!</span>
        </div>
      )}

      <div className="flex flex-col items-center gap-6">
        {modo === "online" && (
          <p className="text-sm font-bold text-neutral-500">
            🔎 Encontradas: {palavrasEncontradas.size}/{resultado.posicoes.length} — arraste o dedo ou o mouse sobre as letras
          </p>
        )}
        <div
          ref={gradeRef}
          onTouchMove={aoMoverToque}
          className="grid gap-0.5 font-mono select-none"
          style={{ gridTemplateColumns: `repeat(${resultado.tamanho}, minmax(0, 1.6rem))` }}
        >
          {resultado.grade.flatMap((linha, l) =>
            linha.map((letra, c) => {
              const chaveCelula = `${l}-${c}`;
              const encontrada = celulasEncontradas.has(chaveCelula);
              const selecionada = celulasSelecionadas.has(chaveCelula);
              return (
                <span
                  key={chaveCelula}
                  data-r={l}
                  data-c={c}
                  onMouseDown={() => modo === "online" && iniciarSelecao(l, c)}
                  onMouseEnter={() => modo === "online" && estenderSelecao(l, c)}
                  onTouchStart={() => modo === "online" && iniciarSelecao(l, c)}
                  className={`flex h-6 w-6 items-center justify-center text-sm font-bold ${
                    modo === "online" ? "cursor-pointer" : ""
                  } ${
                    encontrada
                      ? "rounded-full bg-[#00c264]/70 text-white"
                      : selecionada
                        ? "rounded-full text-white"
                        : mostrarRespostas && marcadas.has(chaveCelula)
                          ? "rounded bg-[#FFD600]/60 text-neutral-900"
                          : "text-neutral-700"
                  }`}
                  style={selecionada && !encontrada ? { backgroundColor: COR_TEMA } : undefined}
                >
                  {letra}
                </span>
              );
            })
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {resultado.posicoes.map((pos) => (
            <span
              key={pos.palavra}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                modo === "online" && palavrasEncontradas.has(pos.palavra)
                  ? "bg-[#00c264]/15 text-[#00854a] line-through"
                  : "bg-neutral-100 text-neutral-700"
              }`}
            >
              {pos.palavra}
            </span>
          ))}
        </div>
      </div>
    </LayoutGerador>
  );
}

const DIRECOES_MAPA: Record<"H" | "V" | "D", { dl: number; dc: number }> = {
  H: { dl: 0, dc: 1 },
  V: { dl: 1, dc: 0 },
  D: { dl: 1, dc: 1 },
};
