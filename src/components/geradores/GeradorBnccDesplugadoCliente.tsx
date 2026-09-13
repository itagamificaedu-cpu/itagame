"use client";

import { useMemo, useState } from "react";
import {
  LayoutGerador,
  CampoConfig,
  CabecalhoFolha,
  EstrelaDivisoria,
  NumeroColorido,
} from "./LayoutGerador";
import {
  gerarProgrameORobo,
  gerarPadraoDesplugado,
  sortearTarefaDesplugada,
  embaralharPassos,
  type TemaPadrao,
  type DificuldadePadrao,
} from "@/lib/geradores/bnccDesplugado";

const COR_TEMA = "#1a3fd4";
const CELULA = 34;

type Atividade = "robo" | "padrao" | "passos";

const NOME_ATIVIDADE: Record<Atividade, string> = {
  robo: "🤖 Programe o Robô",
  padrao: "🔁 Complete o Padrão",
  passos: "🧩 Organize os Passos",
};

export function GeradorBnccDesplugadoCliente() {
  const [atividade, setAtividade] = useState<Atividade>("robo");

  // Programe o Robô
  const [tamanhoLabirinto, setTamanhoLabirinto] = useState(6);
  const [mostrarComandos, setMostrarComandos] = useState(false);

  // Complete o Padrão
  const [temaPadrao, setTemaPadrao] = useState<TemaPadrao>("robos");
  const [dificuldadePadrao, setDificuldadePadrao] = useState<DificuldadePadrao>("facil");
  const [quantidadePadroes, setQuantidadePadroes] = useState(4);
  const [mostrarRespostasPadrao, setMostrarRespostasPadrao] = useState(false);

  // Organize os Passos
  const [mostrarRespostaTarefa, setMostrarRespostaTarefa] = useState(false);

  const [semente, setSemente] = useState(0);

  const robo = useMemo(
    () => gerarProgrameORobo(tamanhoLabirinto),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tamanhoLabirinto, semente]
  );

  const padroes = useMemo(
    () => Array.from({ length: quantidadePadroes }, () => gerarPadraoDesplugado(temaPadrao, dificuldadePadrao)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [temaPadrao, dificuldadePadrao, quantidadePadroes, semente]
  );

  const { tarefa, passosEmbaralhados } = useMemo(() => {
    const { tarefa } = sortearTarefaDesplugada();
    return { tarefa, passosEmbaralhados: embaralharPassos(tarefa) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semente]);

  const larguraLabirinto = tamanhoLabirinto * CELULA;

  return (
    <LayoutGerador
      titulo="🧠 BNCC Computação Desplugada"
      cor={COR_TEMA}
      config={
        <>
          <CampoConfig rotulo="Atividade">
            <select
              value={atividade}
              onChange={(e) => setAtividade(e.target.value as Atividade)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            >
              <option value="robo">🤖 Programe o Robô</option>
              <option value="padrao">🔁 Complete o Padrão</option>
              <option value="passos">🧩 Organize os Passos</option>
            </select>
          </CampoConfig>

          {atividade === "robo" && (
            <>
              <CampoConfig rotulo="Tamanho do labirinto">
                <select
                  value={tamanhoLabirinto}
                  onChange={(e) => setTamanhoLabirinto(Number(e.target.value))}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                >
                  <option value={5}>Pequeno (5×5) — Infantil/Iniciais</option>
                  <option value={6}>Médio (6×6)</option>
                  <option value={8}>Grande (8×8) — Anos Finais</option>
                </select>
              </CampoConfig>
              <label className="flex items-center gap-2 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  checked={mostrarComandos}
                  onChange={(e) => setMostrarComandos(e.target.checked)}
                />
                Mostrar comandos (gabarito)
              </label>
            </>
          )}

          {atividade === "padrao" && (
            <>
              <CampoConfig rotulo="Tema">
                <select
                  value={temaPadrao}
                  onChange={(e) => setTemaPadrao(e.target.value as TemaPadrao)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                >
                  <option value="robos">Tecnologia (🤖⚙️🔌💾)</option>
                  <option value="formas">Formas (⭐🔺🔵🟩)</option>
                  <option value="animais">Animais (🐶🐱🐰🐢)</option>
                </select>
              </CampoConfig>
              <CampoConfig rotulo="Dificuldade">
                <select
                  value={dificuldadePadrao}
                  onChange={(e) => setDificuldadePadrao(e.target.value as DificuldadePadrao)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                >
                  <option value="facil">Fácil (padrão de 2)</option>
                  <option value="medio">Médio (padrão de 3)</option>
                  <option value="dificil">Difícil (padrão de 4)</option>
                </select>
              </CampoConfig>
              <CampoConfig rotulo="Quantidade de linhas">
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={quantidadePadroes}
                  onChange={(e) => setQuantidadePadroes(Number(e.target.value))}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                />
              </CampoConfig>
              <label className="flex items-center gap-2 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  checked={mostrarRespostasPadrao}
                  onChange={(e) => setMostrarRespostasPadrao(e.target.checked)}
                />
                Mostrar respostas (gabarito)
              </label>
            </>
          )}

          {atividade === "passos" && (
            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={mostrarRespostaTarefa}
                onChange={(e) => setMostrarRespostaTarefa(e.target.checked)}
              />
              Mostrar ordem certa (gabarito)
            </label>
          )}

          <button
            onClick={() => setSemente((s) => s + 1)}
            className="w-full rounded-lg bg-[#1a3fd4] py-2.5 text-sm font-bold text-white transition hover:brightness-110"
          >
            🔄 Gerar nova folha
          </button>
        </>
      }
    >
      <CabecalhoFolha titulo={NOME_ATIVIDADE[atividade]} subtitulo="BNCC Computação · atividade sem tela" cor={COR_TEMA} />

      {atividade === "robo" && (
        <>
          <p className="mb-4 text-center text-sm font-bold text-neutral-500">
            Escreva no espaço abaixo a sequência de setas (↑ ↓ ← →) que leva o robô do ponto azul até o ponto laranja, sem esbarrar nas paredes.
          </p>
          <div className="flex justify-center">
            <svg width={larguraLabirinto} height={larguraLabirinto} viewBox={`0 0 ${larguraLabirinto} ${larguraLabirinto}`}>
              <rect x={0} y={0} width={larguraLabirinto} height={larguraLabirinto} fill="none" stroke="#1f2937" strokeWidth={3} />
              {robo.grade.flatMap((linha, r) =>
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
              <circle cx={CELULA / 2} cy={CELULA / 2} r={CELULA * 0.25} fill="#1a3fd4" />
              <circle cx={larguraLabirinto - CELULA / 2} cy={larguraLabirinto - CELULA / 2} r={CELULA * 0.25} fill="#FF8F00" />
            </svg>
          </div>
          <p className="mt-4 text-center text-xs text-neutral-400">🔵 Início · 🟠 Chegada</p>

          <div className="mt-6 rounded-xl border-2 border-dashed border-neutral-300 p-4">
            <p className="text-xs font-bold text-neutral-500">Minha sequência de comandos:</p>
            <div className="mt-3 h-10 border-b-2 border-neutral-300" />
          </div>

          {mostrarComandos && (
            <div className="mt-4 rounded-xl border-2 p-3 text-center text-sm font-bold" style={{ borderColor: COR_TEMA, color: COR_TEMA }}>
              Gabarito: {robo.comandos.join(" ")}
            </div>
          )}
        </>
      )}

      {atividade === "padrao" && (
        <div className="space-y-6">
          {padroes.map((padrao, indice) => (
            <div key={indice} className="flex items-center gap-3">
              <NumeroColorido numero={indice + 1} cor={COR_TEMA} />
              <div className="flex flex-wrap items-center gap-2 text-3xl">
                {padrao.termos.map((termo, i) =>
                  i === padrao.posicaoLacuna ? (
                    <span
                      key={i}
                      className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-dashed text-sm font-bold text-neutral-400"
                      style={{ borderColor: COR_TEMA }}
                    >
                      {mostrarRespostasPadrao ? termo : "?"}
                    </span>
                  ) : (
                    <span key={i}>{termo}</span>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {atividade === "passos" && (
        <>
          <p className="mb-4 text-center text-lg font-extrabold text-neutral-800">{tarefa.titulo}</p>
          <p className="mb-4 text-center text-sm text-neutral-500">
            Os passos abaixo estão fora de ordem. Escreva o número certo (1 a {tarefa.passos.length}) na frente de cada um.
          </p>
          <ul className="space-y-3">
            {passosEmbaralhados.map((passo, indice) => {
              const ordemCerta = tarefa.passos.indexOf(passo) + 1;
              return (
                <li key={indice} className="flex items-center gap-3 rounded-xl border border-neutral-200 p-3">
                  <span className="flex h-9 w-14 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 text-sm font-bold text-neutral-400">
                    {mostrarRespostaTarefa ? ordemCerta : ""}
                  </span>
                  <span className="text-sm text-neutral-800">{passo}</span>
                </li>
              );
            })}
          </ul>
        </>
      )}

      <EstrelaDivisoria cor={COR_TEMA} />
      <p className="text-center text-xs text-neutral-400">
        Pensamento Computacional · Mundo Digital · Cultura Digital — BNCC Computação
      </p>
    </LayoutGerador>
  );
}
