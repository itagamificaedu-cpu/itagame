"use client";

import { useState } from "react";
import { LayoutGerador, CampoConfig, CabecalhoFolha } from "./LayoutGerador";
import { ROTULO_FORMA, pontosForma, type TipoForma } from "@/lib/geradores/formas";

const TAMANHO_SVG = 90;

function FormaPontilhada({ tipo }: { tipo: TipoForma }) {
  const { path, pontos } = pontosForma(tipo, TAMANHO_SVG);
  const propsComuns = {
    fill: "none",
    stroke: "#9ca3af",
    strokeWidth: 3,
    strokeDasharray: "6 6",
    strokeLinecap: "round" as const,
  };

  return (
    <svg width={TAMANHO_SVG} height={TAMANHO_SVG} viewBox={`0 0 ${TAMANHO_SVG} ${TAMANHO_SVG}`}>
      {tipo === "circulo" && (
        <circle cx={TAMANHO_SVG / 2} cy={TAMANHO_SVG / 2} r={TAMANHO_SVG * 0.4} {...propsComuns} />
      )}
      {path && <path d={path} {...propsComuns} />}
      {pontos && <polygon points={pontos} {...propsComuns} />}
    </svg>
  );
}

export function GeradorTracadoFormasCliente() {
  const [formas, setFormas] = useState<TipoForma[]>(["circulo", "quadrado", "triangulo"]);
  const [repeticoes, setRepeticoes] = useState(5);

  function alternarForma(tipo: TipoForma) {
    setFormas((atual) => (atual.includes(tipo) ? atual.filter((f) => f !== tipo) : [...atual, tipo]));
  }

  return (
    <LayoutGerador
      titulo="✏️ Gerador de Traçado de Formas"
      config={
        <>
          <CampoConfig rotulo="Formas">
            <div className="space-y-1.5">
              {(Object.keys(ROTULO_FORMA) as TipoForma[]).map((tipo) => (
                <label key={tipo} className="flex items-center gap-2 text-sm text-neutral-700">
                  <input type="checkbox" checked={formas.includes(tipo)} onChange={() => alternarForma(tipo)} />
                  {ROTULO_FORMA[tipo]}
                </label>
              ))}
            </div>
          </CampoConfig>

          <CampoConfig rotulo={`Repetições por linha: ${repeticoes}`}>
            <input
              type="range"
              min={2}
              max={8}
              value={repeticoes}
              onChange={(e) => setRepeticoes(Number(e.target.value))}
              className="w-full"
            />
          </CampoConfig>
        </>
      }
    >
      <CabecalhoFolha titulo="Traçado de Formas" />
      <div className="space-y-8">
        {formas.map((tipo) => (
          <div key={tipo}>
            <p className="mb-2 text-sm font-bold text-neutral-700">{ROTULO_FORMA[tipo]}</p>
            <div className="flex flex-wrap gap-4">
              {Array.from({ length: repeticoes }, (_, indice) => (
                <FormaPontilhada key={indice} tipo={tipo} />
              ))}
            </div>
          </div>
        ))}
        {formas.length === 0 && (
          <p className="text-sm text-neutral-400">Selecione ao menos uma forma no painel ao lado.</p>
        )}
      </div>
    </LayoutGerador>
  );
}
