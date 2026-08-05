"use client";

import { useMemo, useState } from "react";
import {
  LayoutGerador,
  CampoConfig,
  CabecalhoFolha,
  SeletorModo,
  ControleConferencia,
  ResumoPontuacao,
  type ModoAtividade,
} from "./LayoutGerador";
import {
  sortearQuestoesSimulado,
  ROTULO_TEMA_SIMULADO,
  type TemaSimulado,
} from "@/lib/geradores/bancoSimuladoSpaece";

const COR_TEMA = "#1e3a8a";
const LETRAS = ["A", "B", "C", "D"];

export function GeradorSimuladoSpaeceCliente() {
  const [tema, setTema] = useState<TemaSimulado | "todos">("todos");
  const [quantidade, setQuantidade] = useState(10);
  const [mostrarRespostas, setMostrarRespostas] = useState(false);
  const [semente, setSemente] = useState(0);
  const [modo, setModo] = useState<ModoAtividade>("imprimir");
  const [respostas, setRespostas] = useState<Record<number, number>>({});
  const [conferido, setConferido] = useState(false);

  const questoes = useMemo(() => {
    return sortearQuestoesSimulado(quantidade, tema);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tema, quantidade, semente]);

  const [questoesConferidas, setQuestoesConferidas] = useState(questoes);
  if (questoesConferidas !== questoes) {
    setQuestoesConferidas(questoes);
    setRespostas({});
    setConferido(false);
  }

  const acertos = questoes.filter((q, i) => respostas[i] === q.respostaCorreta).length;

  return (
    <LayoutGerador
      titulo="📝 Simulado SPAECE/SAEB — 9º ano"
      cor={COR_TEMA}
      config={
        <>
          <CampoConfig rotulo="Modo">
            <SeletorModo modo={modo} aoAlterar={setModo} cor={COR_TEMA} />
          </CampoConfig>

          <CampoConfig rotulo="Conteúdo">
            <select
              value={tema}
              onChange={(e) => setTema(e.target.value as TemaSimulado | "todos")}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            >
              <option value="todos">Todos os conteúdos</option>
              {Object.entries(ROTULO_TEMA_SIMULADO).map(([valor, rotulo]) => (
                <option key={valor} value={valor}>
                  {rotulo}
                </option>
              ))}
            </select>
          </CampoConfig>

          <CampoConfig rotulo={`Total de questões: ${quantidade}`}>
            <input
              type="range"
              min={4}
              max={20}
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
              Mostrar gabarito
            </label>
          )}

          <button
            onClick={() => setSemente((s) => s + 1)}
            className="w-full rounded-lg bg-[#1a3fd4] py-2.5 text-sm font-bold text-white transition hover:brightness-110"
          >
            🔄 Sortear novo simulado
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

          <p className="text-xs leading-relaxed text-neutral-400">
            Questões contextualizadas de múltipla escolha, no formato do SPAECE/SAEB, alinhadas à Matriz de
            Referência (descritores D18–D35) e à BNCC (habilidades EF07MA18 a EF09MA09).
          </p>
        </>
      }
    >
      <CabecalhoFolha
        titulo="Simulado SPAECE/SAEB — Matemática, 9º ano"
        subtitulo="Leia com atenção e marque a alternativa correta."
        cor={COR_TEMA}
      />
      {modo === "online" && conferido && <ResumoPontuacao acertos={acertos} total={questoes.length} cor={COR_TEMA} />}

      <div className="space-y-8">
        {questoes.map((questao, indice) => {
          const respostaEscolhida = respostas[indice];
          return (
            <div key={`${questao.enunciado}-${indice}`} className="rounded-2xl border border-neutral-200 p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <p className="font-bold text-neutral-900">Questão {indice + 1}</p>
                <span className="rounded-full bg-[#1e3a8a]/10 px-3 py-0.5 text-[11px] font-bold text-[#1e3a8a]">
                  {questao.descritor.split(" — ")[0]} · BNCC {questao.habilidadeBncc}
                </span>
              </div>
              <p className="text-neutral-800">{questao.enunciado}</p>

              <div className="mt-4 space-y-2">
                {questao.alternativas.map((alternativa, indiceAlt) => {
                  const online = modo === "online";
                  const selecionada = respostaEscolhida === indiceAlt;
                  const ehCorreta = indiceAlt === questao.respostaCorreta;

                  let estilo = "border-neutral-200";
                  if (online && conferido) {
                    if (ehCorreta) estilo = "border-[#00c264] bg-[#00c264]/10";
                    else if (selecionada) estilo = "border-[#e11d48] bg-[#e11d48]/10";
                  } else if (online && selecionada) {
                    estilo = "border-[#1e3a8a] bg-[#1e3a8a]/5";
                  } else if (!online && mostrarRespostas && ehCorreta) {
                    estilo = "border-[#00c264] bg-[#00c264]/10";
                  }

                  return (
                    <label
                      key={indiceAlt}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-2.5 text-sm transition ${estilo} ${
                        !online ? "cursor-default" : ""
                      }`}
                    >
                      {online && (
                        <input
                          type="radio"
                          name={`questao-${indice}`}
                          className="sr-only"
                          checked={selecionada ?? false}
                          disabled={conferido}
                          onChange={() => setRespostas((atual) => ({ ...atual, [indice]: indiceAlt }))}
                        />
                      )}
                      <span
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-extrabold"
                        style={{
                          borderColor: online && selecionada ? "#1e3a8a" : "#d4d4d4",
                          color: online && selecionada ? "#1e3a8a" : "#737373",
                        }}
                      >
                        {LETRAS[indiceAlt]}
                      </span>
                      <span className="text-neutral-800">{alternativa}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </LayoutGerador>
  );
}
