"use client";

import { useMemo, useState } from "react";
import { LayoutGerador, CampoConfig, CabecalhoFolha } from "./LayoutGerador";
import { aleatorioInt, escolher } from "@/lib/geradores/aleatorio";

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

  const relogios = useMemo(() => {
    const minutos = MINUTOS_POSSIVEIS[dificuldade];
    return Array.from({ length: quantidade }, () => ({
      hora: aleatorioInt(1, 12),
      minuto: escolher(minutos),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dificuldade, quantidade, semente]);

  return (
    <LayoutGerador
      titulo="🕒 Gerador de Quiz do Relógio"
      config={
        <>
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
      <CabecalhoFolha titulo="Quiz do Relógio" />
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {relogios.map((r, indice) => (
          <div key={indice} className="flex flex-col items-center gap-2">
            <Relogio hora={r.hora} minuto={r.minuto} />
            {mostrarRespostas ? (
              <p className="text-sm font-bold text-[#00854a]">
                {r.hora.toString().padStart(2, "0")}:{r.minuto.toString().padStart(2, "0")}
              </p>
            ) : (
              <p className="w-20 border-b-2 border-neutral-400 text-center text-sm">&nbsp;</p>
            )}
          </div>
        ))}
      </div>
    </LayoutGerador>
  );
}
