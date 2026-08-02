"use client";

import { useMemo, useState } from "react";
import { LayoutGerador, CampoConfig, CabecalhoFolha } from "./LayoutGerador";

import { gerarLabirinto, resolverLabirinto } from "@/lib/geradores/labirinto";
const COR_TEMA = "#f59e0b";


type Dificuldade = "facil" | "medio" | "dificil";

const TAMANHO_GRADE: Record<Dificuldade, number> = { facil: 8, medio: 12, dificil: 16 };
const CELULA = 30;

export function GeradorLabirintosCliente() {
  const [dificuldade, setDificuldade] = useState<Dificuldade>("medio");
  const [mostrarSolucao, setMostrarSolucao] = useState(false);
  const [semente, setSemente] = useState(0);

  const tamanho = TAMANHO_GRADE[dificuldade];

  const grade = useMemo(() => gerarLabirinto(tamanho, tamanho), [tamanho, semente]);
  const caminho = useMemo(() => resolverLabirinto(grade), [grade]);

  const largura = tamanho * CELULA;
  const altura = tamanho * CELULA;

  return (
    <LayoutGerador
      titulo="🌀 Gerador de Labirintos"
      cor={COR_TEMA}
      config={
        <>
          <CampoConfig rotulo="Dificuldade">
            <select
              value={dificuldade}
              onChange={(e) => setDificuldade(e.target.value as Dificuldade)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            >
              <option value="facil">Fácil (8×8)</option>
              <option value="medio">Médio (12×12)</option>
              <option value="dificil">Difícil (16×16)</option>
            </select>
          </CampoConfig>

          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input type="checkbox" checked={mostrarSolucao} onChange={(e) => setMostrarSolucao(e.target.checked)} />
            Mostrar solução
          </label>

          <button
            onClick={() => setSemente((s) => s + 1)}
            className="w-full rounded-lg bg-[#1a3fd4] py-2.5 text-sm font-bold text-white transition hover:brightness-110"
          >
            🔄 Gerar novo labirinto
          </button>
        </>
      }
    >
      <CabecalhoFolha titulo="Labirinto" cor={COR_TEMA} />
      <div className="flex justify-center">
        <svg width={largura} height={altura} viewBox={`0 0 ${largura} ${altura}`}>
          <rect x={0} y={0} width={largura} height={altura} fill="none" stroke="#1f2937" strokeWidth={3} />
          {grade.flatMap((linha, r) =>
            linha.map((celula, c) => {
              const x = c * CELULA;
              const y = r * CELULA;
              const linhas: React.ReactNode[] = [];
              if (celula.topo) linhas.push(<line key={`t-${r}-${c}`} x1={x} y1={y} x2={x + CELULA} y2={y} stroke="#1f2937" strokeWidth={2} />);
              if (celula.direita)
                linhas.push(<line key={`r-${r}-${c}`} x1={x + CELULA} y1={y} x2={x + CELULA} y2={y + CELULA} stroke="#1f2937" strokeWidth={2} />);
              if (celula.baixo)
                linhas.push(<line key={`b-${r}-${c}`} x1={x} y1={y + CELULA} x2={x + CELULA} y2={y + CELULA} stroke="#1f2937" strokeWidth={2} />);
              if (celula.esquerda)
                linhas.push(<line key={`e-${r}-${c}`} x1={x} y1={y} x2={x} y2={y + CELULA} stroke="#1f2937" strokeWidth={2} />);
              return linhas;
            })
          )}
          {mostrarSolucao && (
            <polyline
              points={caminho.map(([r, c]) => `${c * CELULA + CELULA / 2},${r * CELULA + CELULA / 2}`).join(" ")}
              fill="none"
              stroke="#00c264"
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.8}
            />
          )}
          <circle cx={CELULA / 2} cy={CELULA / 2} r={CELULA * 0.25} fill="#1a3fd4" />
          <circle cx={largura - CELULA / 2} cy={altura - CELULA / 2} r={CELULA * 0.25} fill="#FF8F00" />
        </svg>
      </div>
      <p className="mt-4 text-center text-xs text-neutral-400">🔵 Início · 🟠 Chegada</p>
    </LayoutGerador>
  );
}
