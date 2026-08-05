"use client";

import { useMemo, useState } from "react";
import {
  LayoutGerador,
  CampoConfig,
  CabecalhoFolha,
  EstrelaDivisoria,
  NumeroColorido,
  PALETA_CORES,
  SeletorModo,
  ControleConferencia,
  ResumoPontuacao,
  CampoRespostaCurta,
  type ModoAtividade,
} from "./LayoutGerador";
import { aleatorioInt } from "@/lib/geradores/aleatorio";

const COR_TEMA = "#1a3fd4";

type Operacao = "soma" | "subtracao" | "multiplicacao" | "divisao" | "mista";
type Dificuldade = "facil" | "medio" | "dificil";

const ROTULO_OPERACAO: Record<Operacao, string> = {
  soma: "Soma (+)",
  subtracao: "Subtração (-)",
  multiplicacao: "Multiplicação (×)",
  divisao: "Divisão (÷)",
  mista: "Operações mistas",
};

const SIMBOLO: Record<Exclude<Operacao, "mista">, string> = {
  soma: "+",
  subtracao: "-",
  multiplicacao: "×",
  divisao: "÷",
};

function gerarQuestao(operacao: Exclude<Operacao, "mista">, dificuldade: Dificuldade) {
  if (operacao === "soma") {
    const faixa = { facil: 10, medio: 50, dificil: 200 }[dificuldade];
    const a = aleatorioInt(1, faixa);
    const b = aleatorioInt(1, faixa);
    return { texto: `${a} + ${b} =`, resposta: a + b };
  }
  if (operacao === "subtracao") {
    const faixa = { facil: 10, medio: 50, dificil: 200 }[dificuldade];
    const a = aleatorioInt(1, faixa);
    const b = aleatorioInt(1, a);
    return { texto: `${a} - ${b} =`, resposta: a - b };
  }
  if (operacao === "multiplicacao") {
    const faixa = { facil: 5, medio: 10, dificil: 12 }[dificuldade];
    const a = aleatorioInt(1, faixa);
    const b = aleatorioInt(1, faixa);
    return { texto: `${a} × ${b} =`, resposta: a * b };
  }
  const faixa = { facil: 5, medio: 10, dificil: 12 }[dificuldade];
  const a = aleatorioInt(1, faixa);
  const b = aleatorioInt(1, faixa);
  return { texto: `${a * b} ÷ ${a} =`, resposta: b };
}

export function GeradorMatematicaCliente() {
  const [operacao, setOperacao] = useState<Operacao>("soma");
  const [dificuldade, setDificuldade] = useState<Dificuldade>("medio");
  const [quantidade, setQuantidade] = useState(20);
  const [mostrarRespostas, setMostrarRespostas] = useState(false);
  const [semente, setSemente] = useState(0);
  const [modo, setModo] = useState<ModoAtividade>("imprimir");
  const [respostas, setRespostas] = useState<Record<number, string>>({});
  const [conferido, setConferido] = useState(false);

  const questoes = useMemo(() => {
    const operacoesPossiveis: Exclude<Operacao, "mista">[] = ["soma", "subtracao", "multiplicacao", "divisao"];
    return Array.from({ length: quantidade }, () => {
      const op = operacao === "mista" ? operacoesPossiveis[aleatorioInt(0, 3)] : operacao;
      return gerarQuestao(op, dificuldade);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operacao, dificuldade, quantidade, semente]);

  const [questoesConferidas, setQuestoesConferidas] = useState(questoes);
  if (questoesConferidas !== questoes) {
    setQuestoesConferidas(questoes);
    setRespostas({});
    setConferido(false);
  }

  const colunas = quantidade > 24 ? 3 : 2;
  const acertos = questoes.filter((q, i) => Number(respostas[i]) === q.resposta).length;

  return (
    <LayoutGerador
      titulo="🧮 Gerador de Matemática"
      cor={COR_TEMA}
      config={
        <>
          <CampoConfig rotulo="Modo">
            <SeletorModo modo={modo} aoAlterar={setModo} cor={COR_TEMA} />
          </CampoConfig>

          <CampoConfig rotulo="Operação">
            <select
              value={operacao}
              onChange={(e) => setOperacao(e.target.value as Operacao)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            >
              {Object.entries(ROTULO_OPERACAO).map(([valor, rotulo]) => (
                <option key={valor} value={valor}>
                  {rotulo}
                </option>
              ))}
            </select>
          </CampoConfig>

          <CampoConfig rotulo="Dificuldade">
            <select
              value={dificuldade}
              onChange={(e) => setDificuldade(e.target.value as Dificuldade)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            >
              <option value="facil">Fácil</option>
              <option value="medio">Médio</option>
              <option value="dificil">Difícil</option>
            </select>
          </CampoConfig>

          <CampoConfig rotulo={`Total de questões: ${quantidade}`}>
            <input
              type="range"
              min={6}
              max={40}
              step={2}
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              className="w-full"
            />
          </CampoConfig>

          {modo === "imprimir" && (
            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={mostrarRespostas}
                onChange={(e) => setMostrarRespostas(e.target.checked)}
              />
              Mostrar respostas
            </label>
          )}

          <button
            onClick={() => setSemente((s) => s + 1)}
            className="w-full rounded-lg bg-[#1a3fd4] py-2.5 text-sm font-bold text-white transition hover:brightness-110"
          >
            🔄 Gerar nova folha
          </button>

          {modo === "online" && (
            <ControleConferencia
              conferido={conferido}
              aoConferir={() => setConferido(true)}
              aoTentarNovamente={() => {
                setRespostas({});
                setConferido(false);
              }}
              cor={COR_TEMA}
            />
          )}
        </>
      }
    >
      <CabecalhoFolha
        titulo={`${ROTULO_OPERACAO[operacao]}`}
        subtitulo="Resolva as operações a seguir."
        cor={COR_TEMA}
      />
      {modo === "online" && conferido && <ResumoPontuacao acertos={acertos} total={questoes.length} cor={COR_TEMA} />}
      <div
        className="grid gap-x-8 gap-y-4"
        style={{ gridTemplateColumns: `repeat(${colunas}, minmax(0, 1fr))` }}
      >
        {questoes.map((questao, indice) => {
          const cor = PALETA_CORES[indice % PALETA_CORES.length];
          return (
            <div key={indice} className="flex items-center gap-2 text-sm text-neutral-800">
              <NumeroColorido numero={indice + 1} cor={cor} />
              <span className="font-semibold">{questao.texto}</span>
              {modo === "online" ? (
                <CampoRespostaCurta
                  valor={respostas[indice] ?? ""}
                  aoAlterar={(valor) => setRespostas((atual) => ({ ...atual, [indice]: valor }))}
                  cor={cor}
                  conferido={conferido}
                  correta={Number(respostas[indice]) === questao.resposta}
                />
              ) : mostrarRespostas ? (
                <span className="font-bold" style={{ color: cor }}>
                  {questao.resposta}
                </span>
              ) : (
                <span className="ml-1 inline-block w-14 border-b-2" style={{ borderColor: cor }}>
                  &nbsp;
                </span>
              )}
            </div>
          );
        })}
      </div>
      <EstrelaDivisoria cor={COR_TEMA} />
    </LayoutGerador>
  );
}
