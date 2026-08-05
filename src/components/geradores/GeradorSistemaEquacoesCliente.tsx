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
import { gerarQuestaoSistema, type DificuldadeSistema } from "@/lib/geradores/sistemaEquacoes";

const COR_TEMA = "#10b981";

export function GeradorSistemaEquacoesCliente() {
  const [dificuldade, setDificuldade] = useState<DificuldadeSistema>("facil");
  const [quantidade, setQuantidade] = useState(6);
  const [mostrarRespostas, setMostrarRespostas] = useState(false);
  const [semente, setSemente] = useState(0);
  const [modo, setModo] = useState<ModoAtividade>("imprimir");
  const [respostas, setRespostas] = useState<Record<number, { x: string; y: string }>>({});
  const [conferido, setConferido] = useState(false);

  const questoes = useMemo(() => {
    return Array.from({ length: quantidade }, () => gerarQuestaoSistema(dificuldade));
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
    return Number(r.x) === q.respostaX && Number(r.y) === q.respostaY;
  }

  const acertos = questoes.filter((_, i) => respostaCorreta(i)).length;

  return (
    <LayoutGerador
      titulo="🧮 Gerador de Sistema de Equações"
      cor={COR_TEMA}
      config={
        <>
          <CampoConfig rotulo="Modo">
            <SeletorModo modo={modo} aoAlterar={setModo} cor={COR_TEMA} />
          </CampoConfig>

          <CampoConfig rotulo="Dificuldade">
            <select
              value={dificuldade}
              onChange={(e) => setDificuldade(e.target.value as DificuldadeSistema)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            >
              <option value="facil">Fácil (1ª equação com x isolado)</option>
              <option value="medio">Médio</option>
              <option value="dificil">Difícil (coeficientes maiores)</option>
            </select>
          </CampoConfig>

          <CampoConfig rotulo={`Total de sistemas: ${quantidade}`}>
            <input
              type="range"
              min={3}
              max={10}
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
      <CabecalhoFolha titulo="Sistema de Equações" subtitulo="Encontre os valores de x e y." cor={COR_TEMA} />
      {modo === "online" && conferido && <ResumoPontuacao acertos={acertos} total={questoes.length} cor={COR_TEMA} />}
      <div className="grid gap-5 sm:grid-cols-2">
        {questoes.map((questao, indice) => {
          const cor = PALETA_CORES[indice % PALETA_CORES.length];
          const resp = respostas[indice] ?? { x: "", y: "" };
          const correta = respostaCorreta(indice);
          return (
            <div key={indice} className="rounded-xl border-2 p-4" style={{ borderColor: `${cor}33` }}>
              <div className="flex items-center gap-2">
                <NumeroColorido numero={indice + 1} cor={cor} />
                <div className="font-semibold text-neutral-800">
                  <p>{questao.eq1}</p>
                  <p>{questao.eq2}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-4 pl-8 text-sm">
                <span className="flex items-center gap-1">
                  x =
                  {modo === "online" ? (
                    <CampoRespostaCurta
                      valor={resp.x}
                      aoAlterar={(valor) => setRespostas((atual) => ({ ...atual, [indice]: { ...resp, x: valor } }))}
                      cor={cor}
                      conferido={conferido}
                      correta={correta}
                      largura="w-14"
                    />
                  ) : mostrarRespostas ? (
                    <span className="font-bold" style={{ color: cor }}>
                      {questao.respostaX}
                    </span>
                  ) : (
                    <span className="inline-block w-14 border-b-2" style={{ borderColor: cor }}>&nbsp;</span>
                  )}
                </span>
                <span className="flex items-center gap-1">
                  y =
                  {modo === "online" ? (
                    <CampoRespostaCurta
                      valor={resp.y}
                      aoAlterar={(valor) => setRespostas((atual) => ({ ...atual, [indice]: { ...resp, y: valor } }))}
                      cor={cor}
                      conferido={conferido}
                      correta={correta}
                      largura="w-14"
                    />
                  ) : mostrarRespostas ? (
                    <span className="font-bold" style={{ color: cor }}>
                      {questao.respostaY}
                    </span>
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
      <p className="text-center text-xs text-neutral-400">BNCC: EF08MA07, EF08MA08 · SPAECE/SAEB: D34, D35</p>
    </LayoutGerador>
  );
}
