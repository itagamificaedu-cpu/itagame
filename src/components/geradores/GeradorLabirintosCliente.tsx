"use client";

import { useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import {
  LayoutGerador,
  CampoConfig,
  CabecalhoFolha,
  SeletorModo,
  type ModoAtividade,
} from "./LayoutGerador";

import { gerarLabirinto, resolverLabirinto } from "@/lib/geradores/labirinto";
const COR_TEMA = "#f59e0b";

type Dificuldade = "facil" | "medio" | "dificil";

const TAMANHO_GRADE: Record<Dificuldade, number> = { facil: 8, medio: 12, dificil: 16 };
const CELULA = 30;

export function GeradorLabirintosCliente() {
  const [dificuldade, setDificuldade] = useState<Dificuldade>("medio");
  const [mostrarSolucao, setMostrarSolucao] = useState(false);
  const [semente, setSemente] = useState(0);
  const [modo, setModo] = useState<ModoAtividade>("imprimir");
  const [tracoPontos, setTracoPontos] = useState<[number, number][]>([]);
  const [desenhando, setDesenhando] = useState(false);
  const [chegouAoFim, setChegouAoFim] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const tamanho = TAMANHO_GRADE[dificuldade];

  const grade = useMemo(() => gerarLabirinto(tamanho, tamanho), [tamanho, semente]);
  const caminho = useMemo(() => resolverLabirinto(grade), [grade]);

  // Reinicia o traço do aluno sempre que um labirinto novo é gerado.
  const [gradeConferida, setGradeConferida] = useState(grade);
  if (gradeConferida !== grade) {
    setGradeConferida(grade);
    setTracoPontos([]);
    setDesenhando(false);
    setChegouAoFim(false);
  }

  const largura = tamanho * CELULA;
  const altura = tamanho * CELULA;

  function pontoSvg(evento: ReactPointerEvent<SVGSVGElement>): [number, number] | null {
    const svg = svgRef.current;
    if (!svg) return null;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const ponto = svg.createSVGPoint();
    ponto.x = evento.clientX;
    ponto.y = evento.clientY;
    const transformado = ponto.matrixTransform(ctm.inverse());
    return [transformado.x, transformado.y];
  }

  function aoPressionar(e: ReactPointerEvent<SVGSVGElement>) {
    if (modo !== "online") return;
    const ponto = pontoSvg(e);
    if (!ponto) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDesenhando(true);
    setTracoPontos((atual) => [...atual, ponto]);
  }

  function aoMover(e: ReactPointerEvent<SVGSVGElement>) {
    if (!desenhando) return;
    const ponto = pontoSvg(e);
    if (!ponto) return;
    setTracoPontos((atual) => [...atual, ponto]);
    const distanciaAteFim = Math.hypot(ponto[0] - (largura - CELULA / 2), ponto[1] - (altura - CELULA / 2));
    if (distanciaAteFim < CELULA * 0.6) setChegouAoFim(true);
  }

  function aoSoltar() {
    setDesenhando(false);
  }

  return (
    <LayoutGerador
      titulo="🌀 Gerador de Labirintos"
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

          {modo === "online" && (
            <button
              onClick={() => {
                setTracoPontos([]);
                setChegouAoFim(false);
              }}
              className="w-full rounded-lg py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-110"
              style={{ backgroundColor: COR_TEMA }}
            >
              🧹 Limpar traço
            </button>
          )}
        </>
      }
    >
      <CabecalhoFolha titulo="Labirinto" cor={COR_TEMA} />

      {modo === "online" && chegouAoFim && (
        <div
          className="mb-8 flex items-center justify-center gap-2 rounded-xl border-2 p-3 text-center font-extrabold"
          style={{ borderColor: COR_TEMA, color: COR_TEMA, backgroundColor: `${COR_TEMA}12` }}
        >
          <span className="text-xl">🏆</span>
          <span>Você chegou até o fim!</span>
        </div>
      )}

      {modo === "online" && (
        <p className="mb-4 text-center text-sm font-bold text-neutral-500">
          ✏️ Arraste o dedo ou o mouse a partir do ponto azul pra desenhar o caminho até o ponto laranja
        </p>
      )}

      <div className="flex justify-center">
        <svg
          ref={svgRef}
          width={largura}
          height={altura}
          viewBox={`0 0 ${largura} ${altura}`}
          className={modo === "online" ? "cursor-crosshair touch-none" : ""}
          style={modo === "online" ? { touchAction: "none" } : undefined}
          onPointerDown={aoPressionar}
          onPointerMove={aoMover}
          onPointerUp={aoSoltar}
          onPointerLeave={aoSoltar}
        >
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
          {modo === "online" && tracoPontos.length > 1 && (
            <polyline
              points={tracoPontos.map(([x, y]) => `${x},${y}`).join(" ")}
              fill="none"
              stroke="#1a3fd4"
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
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
