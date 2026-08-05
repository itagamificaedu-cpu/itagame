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

import { aleatorioInt, escolher, gerarSemRepetir } from "@/lib/geradores/aleatorio";
const COR_TEMA = "#ef4444";


type Dificuldade = "facil" | "medio" | "dificil" | "qualquer";

const MINUTOS_POSSIVEIS: Record<Dificuldade, number[]> = {
  facil: [0],
  medio: [0, 30],
  dificil: [0, 15, 30, 45],
  qualquer: Array.from({ length: 60 }, (_, i) => i),
};

const RAIO = 55;
const CENTRO = 65;
const TAMANHO_SVG = 130;

function ponto(anguloGraus: number, raio: number) {
  const rad = ((anguloGraus - 90) * Math.PI) / 180;
  return { x: CENTRO + raio * Math.cos(rad), y: CENTRO + raio * Math.sin(rad) };
}

function Relogio({ hora, minuto }: { hora: number; minuto: number }) {
  const anguloHora = ((hora % 12) + minuto / 60) * 30;
  const anguloMinuto = minuto * 6;
  const ponteiroHora = ponto(anguloHora, RAIO * 0.5);
  const ponteiroMinuto = ponto(anguloMinuto, RAIO * 0.8);

  return (
    <svg width={TAMANHO_SVG} height={TAMANHO_SVG} viewBox={`0 0 ${TAMANHO_SVG} ${TAMANHO_SVG}`}>
      <circle cx={CENTRO} cy={CENTRO} r={RAIO} fill="white" stroke="#1f2937" strokeWidth={3} />
      {Array.from({ length: 12 }, (_, i) => {
        const externo = ponto(i * 30, RAIO * 0.9);
        const interno = ponto(i * 30, RAIO * 0.78);
        return (
          <line key={i} x1={interno.x} y1={interno.y} x2={externo.x} y2={externo.y} stroke="#1f2937" strokeWidth={2} />
        );
      })}
      <line x1={CENTRO} y1={CENTRO} x2={ponteiroHora.x} y2={ponteiroHora.y} stroke="#1f2937" strokeWidth={4} strokeLinecap="round" />
      <line x1={CENTRO} y1={CENTRO} x2={ponteiroMinuto.x} y2={ponteiroMinuto.y} stroke="#1a3fd4" strokeWidth={3} strokeLinecap="round" />
      <circle cx={CENTRO} cy={CENTRO} r={4} fill="#1f2937" />
    </svg>
  );
}

export function GeradorQuizRelogioCliente() {
  const [dificuldade, setDificuldade] = useState<Dificuldade>("facil");
  const [quantidade, setQuantidade] = useState(8);
  const [mostrarRespostas, setMostrarRespostas] = useState(false);
  const [semente, setSemente] = useState(0);
  const [modo, setModo] = useState<ModoAtividade>("imprimir");
  const [respostas, setRespostas] = useState<Record<number, { hora: string; minuto: string }>>({});
  const [conferido, setConferido] = useState(false);

  const relogios = useMemo(() => {
    const minutos = MINUTOS_POSSIVEIS[dificuldade];
    return gerarSemRepetir(
      () => ({ hora: aleatorioInt(1, 12), minuto: escolher(minutos) }),
      quantidade,
      (r) => `${r.hora}:${r.minuto}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dificuldade, quantidade, semente]);

  const [relogiosConferidos, setRelogiosConferidos] = useState(relogios);
  if (relogiosConferidos !== relogios) {
    setRelogiosConferidos(relogios);
    setRespostas({});
    setConferido(false);
  }

  function respostaCorreta(indice: number) {
    const r = relogios[indice];
    const resp = respostas[indice];
    if (!resp) return false;
    return Number(resp.hora) === r.hora && Number(resp.minuto) === r.minuto;
  }

  const acertos = relogios.filter((_, i) => respostaCorreta(i)).length;

  return (
    <LayoutGerador
      titulo="🕒 Gerador de Quiz do Relógio"
      cor={COR_TEMA}
      config={
        <>
          <CampoConfig rotulo="Modo">
            <SeletorModo modo={modo} aoAlterar={setModo} cor={COR_TEMA} />
          </CampoConfig>

          <CampoConfig rotulo="Dificuldade">
            <select
              value={dificuldade}
              onChange={(e) => setDificuldade(e.target.value as Dificuldade)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            >
              <option value="facil">Hora cheia</option>
              <option value="medio">Hora e meia</option>
              <option value="dificil">De 15 em 15 minutos</option>
              <option value="qualquer">Qualquer minuto</option>
            </select>
          </CampoConfig>

          <CampoConfig rotulo={`Total de relógios: ${quantidade}`}>
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
      <CabecalhoFolha titulo="Quiz do Relógio" cor={COR_TEMA} />
      {modo === "online" && conferido && <ResumoPontuacao acertos={acertos} total={relogios.length} cor={COR_TEMA} />}
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {relogios.map((r, indice) => {
          const resp = respostas[indice] ?? { hora: "", minuto: "" };
          const correta = respostaCorreta(indice);
          return (
            <div key={indice} className="flex flex-col items-center gap-2">
              <Relogio hora={r.hora} minuto={r.minuto} />
              {modo === "online" ? (
                <div
                  className={`flex items-center gap-1 rounded-lg border-2 px-2 py-1 text-sm font-bold ${
                    conferido ? (correta ? "border-[#00c264] bg-[#00c264]/10" : "border-[#e11d48] bg-[#e11d48]/10") : ""
                  }`}
                  style={!conferido ? { borderColor: COR_TEMA } : undefined}
                >
                  <select
                    value={resp.hora}
                    disabled={conferido}
                    onChange={(e) =>
                      setRespostas((atual) => ({ ...atual, [indice]: { ...resp, hora: e.target.value } }))
                    }
                    className="bg-transparent outline-none disabled:opacity-100"
                  >
                    <option value="">--</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                      <option key={h} value={h}>
                        {h.toString().padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  :
                  <select
                    value={resp.minuto}
                    disabled={conferido}
                    onChange={(e) =>
                      setRespostas((atual) => ({ ...atual, [indice]: { ...resp, minuto: e.target.value } }))
                    }
                    className="bg-transparent outline-none disabled:opacity-100"
                  >
                    <option value="">--</option>
                    {MINUTOS_POSSIVEIS[dificuldade].map((m) => (
                      <option key={m} value={m}>
                        {m.toString().padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                </div>
              ) : mostrarRespostas ? (
                <p className="text-sm font-bold text-[#00854a]">
                  {r.hora.toString().padStart(2, "0")}:{r.minuto.toString().padStart(2, "0")}
                </p>
              ) : (
                <p className="w-20 border-b-2 border-neutral-400 text-center text-sm">&nbsp;</p>
              )}
            </div>
          );
        })}
      </div>
    </LayoutGerador>
  );
}
