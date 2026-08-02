"use client";

import { useMemo, useState } from "react";
import { LayoutGerador, CampoConfig, CabecalhoFolha } from "./LayoutGerador";
import { CATEGORIAS_VOCABULARIO, ROTULO_CATEGORIA } from "@/lib/geradores/vocabulario";
import { aleatorioInt, embaralhar } from "@/lib/geradores/aleatorio";

type Modo = "unir" | "letras_faltando" | "tracado";

const LETRAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function comLetraFaltando(palavra: string) {
  const posicao = aleatorioInt(1, palavra.length - 2);
  return palavra
    .split("")
    .map((letra, indice) => (indice === posicao ? "_" : letra))
    .join("");
}

export function GeradorVocabularioCliente() {
  const [categoria, setCategoria] = useState("animais");
  const [modo, setModo] = useState<Modo>("unir");
  const [quantidade, setQuantidade] = useState(8);
  const [semente, setSemente] = useState(0);

  const banco = CATEGORIAS_VOCABULARIO[categoria];
  const maximo = Math.min(quantidade, banco.length);

  const palavras = useMemo(() => {
    return embaralhar(banco).slice(0, maximo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoria, maximo, semente]);

  const emojisEmbaralhados = useMemo(() => embaralhar(palavras), [palavras]);

  return (
    <LayoutGerador
      titulo="📖 Gerador de Folhas de Vocabulário"
      config={
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

          <CampoConfig rotulo="Modo">
            <select
              value={modo}
              onChange={(e) => setModo(e.target.value as Modo)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            >
              <option value="unir">Unir com numeração</option>
              <option value="letras_faltando">Letras faltando</option>
              <option value="tracado">Traçado pontilhado</option>
            </select>
          </CampoConfig>

          <CampoConfig rotulo={`Quantidade de palavras: ${maximo}`}>
            <input
              type="range"
              min={4}
              max={banco.length}
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              className="w-full"
            />
          </CampoConfig>

          <button
            onClick={() => setSemente((s) => s + 1)}
            className="w-full rounded-lg bg-[#1a3fd4] py-2.5 text-sm font-bold text-white transition hover:brightness-110"
          >
            🔄 Gerar nova folha
          </button>
        </>
      }
    >
      <CabecalhoFolha titulo={`Vocabulário — ${ROTULO_CATEGORIA[categoria]}`} />

      {modo === "unir" && (
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-3">
            {palavras.map((item, indice) => (
              <p key={item.palavra} className="text-base font-semibold text-neutral-800">
                {indice + 1}. {item.palavra} <span className="text-neutral-400">( ___ )</span>
              </p>
            ))}
          </div>
          <div className="space-y-3">
            {emojisEmbaralhados.map((item, indice) => (
              <p key={item.palavra} className="text-base text-neutral-800">
                {LETRAS[indice]}) <span className="text-2xl">{item.emoji}</span>
              </p>
            ))}
          </div>
        </div>
      )}

      {modo === "letras_faltando" && (
        <div className="grid gap-5 sm:grid-cols-2">
          {palavras.map((item) => (
            <div key={item.palavra} className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4">
              <span className="text-3xl">{item.emoji}</span>
              <p className="text-xl font-extrabold tracking-widest text-neutral-800">
                {comLetraFaltando(item.palavra)}
              </p>
            </div>
          ))}
        </div>
      )}

      {modo === "tracado" && (
        <div className="grid gap-6 sm:grid-cols-2">
          {palavras.map((item) => (
            <div key={item.palavra} className="text-center">
              <span className="text-3xl">{item.emoji}</span>
              <p
                className="mt-1 text-3xl font-extrabold tracking-widest"
                style={{
                  color: "transparent",
                  WebkitTextStrokeWidth: "1px",
                  WebkitTextStrokeColor: "#9ca3af",
                }}
              >
                {item.palavra}
              </p>
            </div>
          ))}
        </div>
      )}
    </LayoutGerador>
  );
}
