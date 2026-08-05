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
import { gerarQuestaoEquacao1Grau, type DificuldadeEquacao1Grau } from "@/lib/geradores/equacaoPrimeiroGrau";
import { gerarSemRepetir } from "@/lib/geradores/aleatorio";

const COR_TEMA = "#f43f5e";

export function GeradorEquacao1GrauCliente() {
  const [dificuldade, setDificuldade] = useState<DificuldadeEquacao1Grau>("facil");
  const [quantidade, setQuantidade] = useState(10);
  const [mostrarRespostas, setMostrarRespostas] = useState(false);
  const [semente, setSemente] = useState(0);
  const [modo, setModo] = useState<ModoAtividade>("imprimir");
  const [respostas, setRespostas] = useState<Record<number, string>>({});
  const [conferido, setConferido] = useState(false);

  const questoes = useMemo(() => {
    return gerarSemRepetir(() => gerarQuestaoEquacao1Grau(dificuldade), quantidade, (q) => q.enunciado);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dificuldade, quantidade, semente]);

  const [questoesConferidas, setQuestoesConferidas] = useState(questoes);
  if (questoesConferidas !== questoes) {
    setQuestoesConferidas(questoes);
    setRespostas({});
    setConferido(false);
  }

  const acertos = questoes.filter((q, i) => Number(respostas[i]) === q.resposta).length;

  return (
    <LayoutGerador
      titulo="⚖️ Gerador de Equação do 1º Grau"
      cor={COR_TEMA}
      config={
        <>
          <CampoConfig rotulo="Modo">
            <SeletorModo modo={modo} aoAlterar={setModo} cor={COR_TEMA} />
          </CampoConfig>

          <CampoConfig rotulo="Dificuldade">
            <select
              value={dificuldade}
              onChange={(e) => setDificuldade(e.target.value as DificuldadeEquacao1Grau)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            >
              <option value="facil">Fácil (x + b = c)</option>
              <option value="medio">Médio (ax + b = c)</option>
              <option value="dificil">Difícil (incógnita nos 2 lados)</option>
            </select>
          </CampoConfig>

          <CampoConfig rotulo={`Total de questões: ${quantidade}`}>
            <input
              type="range"
              min={4}
              max={16}
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
      <CabecalhoFolha titulo="Equação do 1º Grau" subtitulo="Encontre o valor de x." cor={COR_TEMA} />
      {modo === "online" && conferido && <ResumoPontuacao acertos={acertos} total={questoes.length} cor={COR_TEMA} />}
      <div className="space-y-4">
        {questoes.map((questao, indice) => {
          const cor = PALETA_CORES[indice % PALETA_CORES.length];
          return (
            <div key={indice} className="flex flex-wrap items-center gap-2 text-lg text-neutral-800">
              <NumeroColorido numero={indice + 1} cor={cor} />
              <span className="font-semibold">{questao.enunciado}</span>
              <span className="text-sm text-neutral-500">x =</span>
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
      <p className="text-center text-xs text-neutral-400">BNCC: EF07MA18 · SPAECE/SAEB: D33</p>
    </LayoutGerador>
  );
}
