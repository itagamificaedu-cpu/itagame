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
import { gerarQuestaoEquacao2Grau, type DificuldadeEquacao2Grau } from "@/lib/geradores/equacaoSegundoGrau";
import { gerarSemRepetir } from "@/lib/geradores/aleatorio";

const COR_TEMA = "#d97706";

export function GeradorEquacao2GrauCliente() {
  const [dificuldade, setDificuldade] = useState<DificuldadeEquacao2Grau>("facil");
  const [quantidade, setQuantidade] = useState(8);
  const [mostrarRespostas, setMostrarRespostas] = useState(false);
  const [semente, setSemente] = useState(0);
  const [modo, setModo] = useState<ModoAtividade>("imprimir");
  const [respostas, setRespostas] = useState<Record<number, { menor: string; maior: string }>>({});
  const [conferido, setConferido] = useState(false);

  const questoes = useMemo(() => {
    return gerarSemRepetir(() => gerarQuestaoEquacao2Grau(dificuldade), quantidade, (q) => q.enunciado);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dificuldade, quantidade, semente]);

  const [questoesConferidas, setQuestoesConferidas] = useState(questoes);
  if (questoesConferidas !== questoes) {
    setQuestoesConferidas(questoes);
    setRespostas({});
    setConferido(false);
  }

  function respostaCorreta(indice: number) {
    const q = questoes[indice];
    const r = respostas[indice];
    if (!r) return false;
    return Number(r.menor) === q.raizMenor && Number(r.maior) === q.raizMaior;
  }

  const acertos = questoes.filter((_, i) => respostaCorreta(i)).length;

  return (
    <LayoutGerador
      titulo="📐 Gerador de Equação do 2º Grau"
      cor={COR_TEMA}
      config={
        <>
          <CampoConfig rotulo="Modo">
            <SeletorModo modo={modo} aoAlterar={setModo} cor={COR_TEMA} />
          </CampoConfig>

          <CampoConfig rotulo="Dificuldade">
            <select
              value={dificuldade}
              onChange={(e) => setDificuldade(e.target.value as DificuldadeEquacao2Grau)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            >
              <option value="facil">Fácil (incompleta: x² = k ou x² - kx = 0)</option>
              <option value="medio">Médio (completa, a = 1)</option>
              <option value="dificil">Difícil (completa, a ≠ 1)</option>
            </select>
          </CampoConfig>

          <CampoConfig rotulo={`Total de questões: ${quantidade}`}>
            <input
              type="range"
              min={4}
              max={14}
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
      <CabecalhoFolha titulo="Equação do 2º Grau" subtitulo="Encontre as duas raízes (x′ e x″)." cor={COR_TEMA} />
      {modo === "online" && conferido && <ResumoPontuacao acertos={acertos} total={questoes.length} cor={COR_TEMA} />}
      <div className="space-y-4">
        {questoes.map((questao, indice) => {
          const cor = PALETA_CORES[indice % PALETA_CORES.length];
          const resp = respostas[indice] ?? { menor: "", maior: "" };
          const correta = respostaCorreta(indice);
          return (
            <div key={indice} className="flex flex-wrap items-center gap-4 rounded-xl border-2 p-4 text-lg" style={{ borderColor: `${cor}33` }}>
              <div className="flex items-center gap-2 font-semibold text-neutral-800">
                <NumeroColorido numero={indice + 1} cor={cor} />
                <span>{questao.enunciado}</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  x′ =
                  {modo === "online" ? (
                    <CampoRespostaCurta
                      valor={resp.menor}
                      aoAlterar={(valor) => setRespostas((atual) => ({ ...atual, [indice]: { ...resp, menor: valor } }))}
                      cor={cor}
                      conferido={conferido}
                      correta={correta}
                      largura="w-14"
                    />
                  ) : mostrarRespostas ? (
                    <span className="font-bold" style={{ color: cor }}>{questao.raizMenor}</span>
                  ) : (
                    <span className="inline-block w-14 border-b-2" style={{ borderColor: cor }}>&nbsp;</span>
                  )}
                </span>
                <span className="flex items-center gap-1">
                  x″ =
                  {modo === "online" ? (
                    <CampoRespostaCurta
                      valor={resp.maior}
                      aoAlterar={(valor) => setRespostas((atual) => ({ ...atual, [indice]: { ...resp, maior: valor } }))}
                      cor={cor}
                      conferido={conferido}
                      correta={correta}
                      largura="w-14"
                    />
                  ) : mostrarRespostas ? (
                    <span className="font-bold" style={{ color: cor }}>{questao.raizMaior}</span>
                  ) : (
                    <span className="inline-block w-14 border-b-2" style={{ borderColor: cor }}>&nbsp;</span>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <EstrelaDivisoria cor={COR_TEMA} />
      <p className="text-center text-xs text-neutral-400">BNCC: EF09MA09 · SPAECE/SAEB: D31</p>
    </LayoutGerador>
  );
}
