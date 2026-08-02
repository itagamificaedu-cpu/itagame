"use client";

import { useMemo, useState } from "react";
import { LayoutGerador, CampoConfig, CabecalhoFolha } from "./LayoutGerador";
import { aleatorioInt } from "@/lib/geradores/aleatorio";

type Tipo = "numerica" | "emoji";
type Dificuldade = "facil" | "medio" | "dificil";

const TEMAS_EMOJI: Record<string, string[]> = {
  frutas: ["🍎", "🍌", "🍇"],
  formas: ["⭐", "🔺", "🔵"],
  animais: ["🐶", "🐱", "🐰"],
};

function gerarSequenciaNumerica(dificuldade: Dificuldade, tamanho: number) {
  const passo = { facil: aleatorioInt(1, 2), medio: aleatorioInt(2, 5), dificil: aleatorioInt(5, 10) }[dificuldade];
  const inicio = aleatorioInt(1, 20);
  const termos = Array.from({ length: tamanho }, (_, i) => inicio + i * passo);
  const posicaoLacuna = aleatorioInt(1, tamanho - 2);
  return { termos, posicaoLacuna };
}

function gerarSequenciaEmoji(tema: string, tamanho: number) {
  const unidade = TEMAS_EMOJI[tema];
  const termos = Array.from({ length: tamanho }, (_, i) => unidade[i % unidade.length]);
  const posicaoLacuna = aleatorioInt(1, tamanho - 2);
  return { termos, posicaoLacuna };
}

export function GeradorSequenciasCliente() {
  const [tipo, setTipo] = useState<Tipo>("numerica");
  const [dificuldade, setDificuldade] = useState<Dificuldade>("facil");
  const [tema, setTema] = useState("frutas");
  const [quantidadeSequencias, setQuantidadeSequencias] = useState(6);
  const [mostrarRespostas, setMostrarRespostas] = useState(false);
  const [semente, setSemente] = useState(0);

  const tamanhoSequencia = 6;

  const sequencias = useMemo(() => {
    return Array.from({ length: quantidadeSequencias }, () =>
      tipo === "numerica"
        ? gerarSequenciaNumerica(dificuldade, tamanhoSequencia)
        : gerarSequenciaEmoji(tema, tamanhoSequencia)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipo, dificuldade, tema, quantidadeSequencias, semente]);

  return (
    <LayoutGerador
      titulo="🔢 Gerador de Sequências"
      config={
        <>
          <CampoConfig rotulo="Tipo">
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as Tipo)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            >
              <option value="numerica">Numérica</option>
              <option value="emoji">Padrão de figuras</option>
            </select>
          </CampoConfig>

          {tipo === "numerica" ? (
            <CampoConfig rotulo="Dificuldade">
              <select
                value={dificuldade}
                onChange={(e) => setDificuldade(e.target.value as Dificuldade)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
              >
                <option value="facil">Fácil (passo 1-2)</option>
                <option value="medio">Médio (passo 2-5)</option>
                <option value="dificil">Difícil (passo 5-10)</option>
              </select>
            </CampoConfig>
          ) : (
            <CampoConfig rotulo="Tema">
              <select
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
              >
                {Object.keys(TEMAS_EMOJI).map((chave) => (
                  <option key={chave} value={chave}>
                    {TEMAS_EMOJI[chave].join(" ")}
                  </option>
                ))}
              </select>
            </CampoConfig>
          )}

          <CampoConfig rotulo={`Total de sequências: ${quantidadeSequencias}`}>
            <input
              type="range"
              min={3}
              max={12}
              value={quantidadeSequencias}
              onChange={(e) => setQuantidadeSequencias(Number(e.target.value))}
              className="w-full"
            />
          </CampoConfig>

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
      <CabecalhoFolha titulo="Sequências" />
      <div className="space-y-4">
        {sequencias.map((seq, indiceSeq) => (
          <div key={indiceSeq} className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4">
            <span className="text-sm font-bold text-neutral-400">{indiceSeq + 1}.</span>
            <div className="flex flex-wrap items-center gap-2 text-lg font-bold text-neutral-800">
              {seq.termos.map((termo, indice) =>
                indice === seq.posicaoLacuna && !mostrarRespostas ? (
                  <span key={indice} className="inline-block w-12 rounded border-2 border-dashed border-neutral-400 text-center">
                    ?
                  </span>
                ) : (
                  <span
                    key={indice}
                    className={indice === seq.posicaoLacuna ? "rounded bg-[#00c264]/10 px-1 text-[#00854a]" : ""}
                  >
                    {termo}
                  </span>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </LayoutGerador>
  );
}
