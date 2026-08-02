"use client";

import { useMemo, useState } from "react";
import { LayoutGerador, CampoConfig, CabecalhoFolha } from "./LayoutGerador";

import { gerarGradeCacaPalavras } from "@/lib/geradores/cacaPalavras";
import { CATEGORIAS_VOCABULARIO, ROTULO_CATEGORIA } from "@/lib/geradores/vocabulario";
import { embaralhar } from "@/lib/geradores/aleatorio";
const COR_TEMA = "#7c3aed";


type Origem = "categoria" | "personalizada";

export function GeradorCacaPalavrasCliente() {
  const [origem, setOrigem] = useState<Origem>("categoria");
  const [categoria, setCategoria] = useState("animais");
  const [quantidade, setQuantidade] = useState(8);
  const [listaPersonalizada, setListaPersonalizada] = useState("LEAO\nTIGRE\nURSO\nLOBO\nRAPOSA\nGIRAFA");
  const [mostrarRespostas, setMostrarRespostas] = useState(false);
  const [semente, setSemente] = useState(0);

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

  return (
    <LayoutGerador
      titulo="🔎 Gerador de Caça-Palavras"
      cor={COR_TEMA}
      config={
        <>
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

          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input
              type="checkbox"
              checked={mostrarRespostas}
              onChange={(e) => setMostrarRespostas(e.target.checked)}
            />
            Destacar respostas
          </label>

          <button
            onClick={() => setSemente((s) => s + 1)}
            className="w-full rounded-lg bg-[#1a3fd4] py-2.5 text-sm font-bold text-white transition hover:brightness-110"
          >
            🔄 Gerar nova folha
          </button>
        </>
      }
    >
      <CabecalhoFolha titulo="Caça-Palavras" cor={COR_TEMA} />

      <div className="flex flex-col items-center gap-6">
        <div
          className="grid gap-0.5 font-mono"
          style={{ gridTemplateColumns: `repeat(${resultado.tamanho}, minmax(0, 1.6rem))` }}
        >
          {resultado.grade.flatMap((linha, l) =>
            linha.map((letra, c) => (
              <span
                key={`${l}-${c}`}
                className={`flex h-6 w-6 items-center justify-center text-sm font-bold ${
                  mostrarRespostas && marcadas.has(`${l}-${c}`)
                    ? "rounded bg-[#FFD600]/60 text-neutral-900"
                    : "text-neutral-700"
                }`}
              >
                {letra}
              </span>
            ))
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {resultado.posicoes.map((pos) => (
            <span
              key={pos.palavra}
              className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700"
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
