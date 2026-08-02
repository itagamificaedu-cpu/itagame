"use client";

import { useMemo, useState } from "react";
import { LayoutGerador, CampoConfig, CabecalhoFolha } from "./LayoutGerador";
import { aleatorioInt } from "@/lib/geradores/aleatorio";

const TEMAS: Record<string, string> = {
  frutas: "🍎",
  animais: "🐱",
  estrelas: "⭐",
  balões: "🎈",
  doces: "🍬",
};

type Operacao = "soma" | "subtracao";
type Dificuldade = "facil" | "medio";

export function GeradorMatematicaEmojisCliente() {
  const [tema, setTema] = useState("frutas");
  const [operacao, setOperacao] = useState<Operacao>("soma");
  const [dificuldade, setDificuldade] = useState<Dificuldade>("facil");
  const [quantidade, setQuantidade] = useState(10);
  const [mostrarRespostas, setMostrarRespostas] = useState(false);
  const [semente, setSemente] = useState(0);

  const emoji = TEMAS[tema];
  const maximo = dificuldade === "facil" ? 6 : 12;

  const questoes = useMemo(() => {
    return Array.from({ length: quantidade }, () => {
      if (operacao === "soma") {
        const a = aleatorioInt(1, maximo);
        const b = aleatorioInt(1, maximo);
        return { a, b, resposta: a + b };
      }
      const a = aleatorioInt(2, maximo);
      const b = aleatorioInt(1, a);
      return { a, b, resposta: a - b };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tema, operacao, dificuldade, quantidade, semente]);

  return (
    <LayoutGerador
      titulo="😄 Matemática com Emojis"
      config={
        <>
          <CampoConfig rotulo="Tema">
            <select
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            >
              {Object.keys(TEMAS).map((chave) => (
                <option key={chave} value={chave}>
                  {TEMAS[chave]} {chave[0].toUpperCase() + chave.slice(1)}
                </option>
              ))}
            </select>
          </CampoConfig>

          <CampoConfig rotulo="Operação">
            <select
              value={operacao}
              onChange={(e) => setOperacao(e.target.value as Operacao)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            >
              <option value="soma">Soma (+)</option>
              <option value="subtracao">Subtração (-)</option>
            </select>
          </CampoConfig>

          <CampoConfig rotulo="Dificuldade">
            <select
              value={dificuldade}
              onChange={(e) => setDificuldade(e.target.value as Dificuldade)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            >
              <option value="facil">Fácil (até 6)</option>
              <option value="medio">Médio (até 12)</option>
            </select>
          </CampoConfig>

          <CampoConfig rotulo={`Total de questões: ${quantidade}`}>
            <input
              type="range"
              min={4}
              max={20}
              step={2}
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
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
      <CabecalhoFolha titulo="Matemática com Emojis" />
      <div className="grid gap-6 sm:grid-cols-2">
        {questoes.map((questao, indice) => (
          <div key={indice} className="rounded-xl border border-neutral-200 p-4">
            <p className="text-xs font-bold text-neutral-400">Questão {indice + 1}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-2xl">
              <span>{emoji.repeat(questao.a)}</span>
              <span className="text-lg font-bold text-neutral-500">{operacao === "soma" ? "+" : "-"}</span>
              <span>{emoji.repeat(questao.b)}</span>
              <span className="text-lg font-bold text-neutral-500">=</span>
              {mostrarRespostas ? (
                <span className="text-lg font-bold text-[#00854a]">{questao.resposta}</span>
              ) : (
                <span className="inline-block h-8 w-14 rounded border-2 border-dashed border-neutral-400" />
              )}
            </div>
          </div>
        ))}
      </div>
    </LayoutGerador>
  );
}
