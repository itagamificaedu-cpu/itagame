"use client";

import { useState } from "react";
import { LayoutGerador, CampoConfig, CabecalhoFolha } from "./LayoutGerador";
import { pathLinha, pathEspiral, ROTULO_TRACO, type TipoTraco } from "@/lib/geradores/tracos";

const LARGURA_LINHA = 600;
const ALTURA_LINHA = 70;

export function GeradorTracosLinhaCliente() {
  const [tipo, setTipo] = useState<TipoTraco>("reta");
  const [quantidade, setQuantidade] = useState(6);

  return (
    <LayoutGerador
      titulo="〰️ Gerador de Traços de Linha"
      config={
        <>
          <CampoConfig rotulo="Tipo de traço">
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoTraco)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            >
              {Object.entries(ROTULO_TRACO).map(([valor, rotulo]) => (
                <option key={valor} value={valor}>
                  {rotulo}
                </option>
              ))}
            </select>
          </CampoConfig>

          <CampoConfig rotulo={`Quantidade de linhas: ${quantidade}`}>
            <input
              type="range"
              min={3}
              max={10}
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              className="w-full"
            />
          </CampoConfig>
        </>
      }
    >
      <CabecalhoFolha titulo="Traços de Linha — Coordenação Motora" />

      {tipo === "espiral" ? (
        <div className="flex flex-wrap gap-6">
          {Array.from({ length: quantidade }, (_, indice) => (
            <svg key={indice} width={110} height={110} viewBox="0 0 110 110">
              <path
                d={pathEspiral(55, 55, 45, 3)}
                fill="none"
                stroke="#9ca3af"
                strokeWidth={3}
                strokeDasharray="6 5"
                strokeLinecap="round"
              />
              <circle cx={55} cy={55} r={3} fill="#00c264" />
            </svg>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {Array.from({ length: quantidade }, (_, indice) => (
            <svg key={indice} width="100%" height={ALTURA_LINHA} viewBox={`0 0 ${LARGURA_LINHA} ${ALTURA_LINHA}`}>
              <path
                d={pathLinha(tipo, LARGURA_LINHA, ALTURA_LINHA / 2)}
                fill="none"
                stroke="#9ca3af"
                strokeWidth={3}
                strokeDasharray="6 5"
                strokeLinecap="round"
              />
              <circle cx={10} cy={ALTURA_LINHA / 2} r={5} fill="#00c264" />
              <text x={LARGURA_LINHA - 20} y={ALTURA_LINHA / 2 + 5} fontSize={16}>
                🏁
              </text>
            </svg>
          ))}
        </div>
      )}
    </LayoutGerador>
  );
}
