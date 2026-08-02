"use client";

import { useMemo, useState } from "react";
import { LayoutGerador, CampoConfig, CabecalhoFolha } from "./LayoutGerador";

import { gerarCruzadas } from "@/lib/geradores/cruzadas";
import { CATEGORIAS_CRUZADAS, ROTULO_CATEGORIA_CRUZADAS } from "@/lib/geradores/bancoCruzadas";
import { embaralhar } from "@/lib/geradores/aleatorio";
const COR_TEMA = "#e11d48";


type Origem = "categoria" | "personalizada";

export function GeradorCruzadasCliente() {
  const [origem, setOrigem] = useState<Origem>("categoria");
  const [categoria, setCategoria] = useState("animais");
  const [quantidade, setQuantidade] = useState(6);
  const [listaPersonalizada, setListaPersonalizada] = useState(
    "LEAO:Rei da selva\nTIGRE:Felino listrado\nURSO:Hiberna no inverno\nLOBO:Vive em matilha"
  );
  const [mostrarRespostas, setMostrarRespostas] = useState(false);
  const [semente, setSemente] = useState(0);

  const banco = CATEGORIAS_CRUZADAS[categoria];

  const itens = useMemo(() => {
    if (origem === "personalizada") {
      return listaPersonalizada
        .split("\n")
        .map((linha) => linha.trim())
        .filter(Boolean)
        .map((linha) => {
          const [palavra, ...resto] = linha.split(":");
          return { palavra: palavra.trim(), dica: resto.join(":").trim() || "Dica não informada" };
        });
    }
    return embaralhar(banco).slice(0, Math.min(quantidade, banco.length));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [origem, categoria, quantidade, listaPersonalizada, semente]);

  const resultado = useMemo(() => gerarCruzadas(itens), [itens]);

  const horizontais = resultado.palavras.filter((p) => p.direcao === "H").sort((a, b) => a.numero - b.numero);
  const verticais = resultado.palavras.filter((p) => p.direcao === "V").sort((a, b) => a.numero - b.numero);

  return (
    <LayoutGerador
      titulo="🧩 Gerador de Palavras Cruzadas"
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
                  {Object.keys(CATEGORIAS_CRUZADAS).map((chave) => (
                    <option key={chave} value={chave}>
                      {ROTULO_CATEGORIA_CRUZADAS[chave]}
                    </option>
                  ))}
                </select>
              </CampoConfig>
              <CampoConfig rotulo={`Quantidade de palavras: ${Math.min(quantidade, banco.length)}`}>
                <input
                  type="range"
                  min={3}
                  max={banco.length}
                  value={quantidade}
                  onChange={(e) => setQuantidade(Number(e.target.value))}
                  className="w-full"
                />
              </CampoConfig>
            </>
          ) : (
            <CampoConfig rotulo="Lista personalizada (PALAVRA:dica por linha)">
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
            Mostrar respostas
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
      <CabecalhoFolha titulo="Palavras Cruzadas" cor={COR_TEMA} />

      <div className="flex flex-col items-center gap-6">
        <div
          className="grid gap-0.5"
          style={{ gridTemplateColumns: `repeat(${resultado.colunas}, minmax(0, 1.8rem))` }}
        >
          {resultado.grade.flatMap((linha, r) =>
            linha.map((letra, c) => (
              <div
                key={`${r}-${c}`}
                className={`relative flex h-7 w-7 items-center justify-center border text-sm font-bold ${
                  letra ? "border-neutral-400 bg-white" : "border-transparent"
                }`}
              >
                {letra && resultado.numeros[r][c] && (
                  <span className="absolute top-0 left-0.5 text-[8px] font-bold text-neutral-400">
                    {resultado.numeros[r][c]}
                  </span>
                )}
                {letra && mostrarRespostas && <span className="text-neutral-800">{letra}</span>}
              </div>
            ))
          )}
        </div>

        <div className="grid w-full gap-6 sm:grid-cols-2">
          <div>
            <p className="text-sm font-bold text-neutral-900">➡️ Horizontais</p>
            <ol className="mt-2 space-y-1 text-sm text-neutral-700">
              {horizontais.map((p) => (
                <li key={`${p.numero}-h`}>
                  {p.numero}. {p.dica}
                </li>
              ))}
            </ol>
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-900">⬇️ Verticais</p>
            <ol className="mt-2 space-y-1 text-sm text-neutral-700">
              {verticais.map((p) => (
                <li key={`${p.numero}-v`}>
                  {p.numero}. {p.dica}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </LayoutGerador>
  );
}
