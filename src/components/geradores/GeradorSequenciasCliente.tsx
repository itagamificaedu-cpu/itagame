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
import { aleatorioInt } from "@/lib/geradores/aleatorio";

const COR_TEMA = "#6366f1";

type Tipo = "numerica" | "emoji";
type Dificuldade = "facil" | "medio" | "dificil";

const TEMAS_EMOJI: Record<string, string[]> = {
  frutas: ["🍎", "🍌", "🍇"],
  formas: ["⭐", "🔺", "🔵"],
  animais: ["🐶", "🐱", "🐰"],
};

function gerarSequenciaNumerica(dificuldade: Dificuldade, tamanho: number) {
  const passo = { facil: aleatorioInt(1, 2), medio: aleatorioInt(2, 5), dificil: aleatorioInt(5, 10) }[dificuldade];
  const inicio = aleatorioInt(1, 20);
  const termos = Array.from({ length: tamanho }, (_, i) => inicio + i * passo);
  const posicaoLacuna = aleatorioInt(1, tamanho - 2);
  return { termos, posicaoLacuna };
}

function gerarSequenciaEmoji(tema: string, tamanho: number) {
  const unidade = TEMAS_EMOJI[tema];
  const termos = Array.from({ length: tamanho }, (_, i) => unidade[i % unidade.length]);
  const posicaoLacuna = aleatorioInt(1, tamanho - 2);
  return { termos, posicaoLacuna };
}

export function GeradorSequenciasCliente() {
  const [tipo, setTipo] = useState<Tipo>("numerica");
  const [dificuldade, setDificuldade] = useState<Dificuldade>("facil");
  const [tema, setTema] = useState("frutas");
  const [quantidadeSequencias, setQuantidadeSequencias] = useState(6);
  const [mostrarRespostas, setMostrarRespostas] = useState(false);
  const [semente, setSemente] = useState(0);
  const [modo, setModo] = useState<ModoAtividade>("imprimir");
  const [respostas, setRespostas] = useState<Record<number, string>>({});
  const [conferido, setConferido] = useState(false);

  const tamanhoSequencia = 6;

  const sequencias = useMemo(() => {
    return Array.from({ length: quantidadeSequencias }, () =>
      tipo === "numerica"
        ? gerarSequenciaNumerica(dificuldade, tamanhoSequencia)
        : gerarSequenciaEmoji(tema, tamanhoSequencia)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipo, dificuldade, tema, quantidadeSequencias, semente]);

  const [sequenciasConferidas, setSequenciasConferidas] = useState(sequencias);
  if (sequenciasConferidas !== sequencias) {
    setSequenciasConferidas(sequencias);
    setRespostas({});
    setConferido(false);
  }

  const acertos = sequencias.filter(
    (seq, i) => String(respostas[i] ?? "").trim() === String(seq.termos[seq.posicaoLacuna])
  ).length;

  return (
    <LayoutGerador
      titulo="🔢 Gerador de Sequências"
      cor={COR_TEMA}
      config={
        <>
          <CampoConfig rotulo="Modo">
            <SeletorModo modo={modo} aoAlterar={setModo} cor={COR_TEMA} />
          </CampoConfig>

          <CampoConfig rotulo="Tipo">
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as Tipo)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            >
              <option value="numerica">Numérica</option>
              <option value="emoji">Padrão de figuras</option>
            </select>
          </CampoConfig>

          {tipo === "numerica" ? (
            <CampoConfig rotulo="Dificuldade">
              <select
                value={dificuldade}
                onChange={(e) => setDificuldade(e.target.value as Dificuldade)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
              >
                <option value="facil">Fácil (passo 1-2)</option>
                <option value="medio">Médio (passo 2-5)</option>
                <option value="dificil">Difícil (passo 5-10)</option>
              </select>
            </CampoConfig>
          ) : (
            <CampoConfig rotulo="Tema">
              <select
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
              >
                {Object.keys(TEMAS_EMOJI).map((chave) => (
                  <option key={chave} value={chave}>
                    {TEMAS_EMOJI[chave].join(" ")}
                  </option>
                ))}
              </select>
            </CampoConfig>
          )}

          <CampoConfig rotulo={`Total de sequências: ${quantidadeSequencias}`}>
            <input
              type="range"
              min={3}
              max={12}
              value={quantidadeSequencias}
              onChange={(e) => setQuantidadeSequencias(Number(e.target.value))}
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
      <CabecalhoFolha titulo="Sequências" subtitulo="Descubra o padrão e complete." cor={COR_TEMA} />
      {modo === "online" && conferido && (
        <ResumoPontuacao acertos={acertos} total={sequencias.length} cor={COR_TEMA} />
      )}
      <div className="space-y-4">
        {sequencias.map((seq, indiceSeq) => {
          const cor = PALETA_CORES[indiceSeq % PALETA_CORES.length];
          const respostaCerta = String(seq.termos[seq.posicaoLacuna]);
          return (
            <div key={indiceSeq} className="flex items-center gap-3 rounded-xl border-2 p-4" style={{ borderColor: `${cor}33` }}>
              <NumeroColorido numero={indiceSeq + 1} cor={cor} />
              <div className="flex flex-wrap items-center gap-2 text-lg font-bold text-neutral-800">
                {seq.termos.map((termo, indice) => {
                  if (indice !== seq.posicaoLacuna) {
                    return <span key={indice}>{termo}</span>;
                  }
                  if (modo === "online") {
                    const respostaDigitada = respostas[indiceSeq] ?? "";
                    const correta = respostaDigitada.trim() === respostaCerta;
                    return tipo === "numerica" ? (
                      <CampoRespostaCurta
                        key={indice}
                        valor={respostaDigitada}
                        aoAlterar={(valor) => setRespostas((atual) => ({ ...atual, [indiceSeq]: valor }))}
                        cor={cor}
                        conferido={conferido}
                        correta={correta}
                        largura="w-14"
                      />
                    ) : (
                      <select
                        key={indice}
                        value={respostaDigitada}
                        disabled={conferido}
                        onChange={(e) => setRespostas((atual) => ({ ...atual, [indiceSeq]: e.target.value }))}
                        className={`rounded-lg border-2 px-2 py-1 text-center text-xl outline-none disabled:opacity-100 ${
                          conferido
                            ? correta
                              ? "border-[#00c264] bg-[#00c264]/10"
                              : "border-[#e11d48] bg-[#e11d48]/10"
                            : "bg-white"
                        }`}
                        style={!conferido ? { borderColor: cor } : undefined}
                      >
                        <option value="">?</option>
                        {TEMAS_EMOJI[tema].map((op) => (
                          <option key={op} value={op}>
                            {op}
                          </option>
                        ))}
                      </select>
                    );
                  }
                  return !mostrarRespostas ? (
                    <span
                      key={indice}
                      className="inline-block w-12 rounded border-2 border-dashed text-center"
                      style={{ borderColor: cor }}
                    >
                      ?
                    </span>
                  ) : (
                    <span key={indice} className="rounded px-1" style={{ backgroundColor: `${cor}22`, color: cor }}>
                      {termo}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <EstrelaDivisoria cor={COR_TEMA} />
    </LayoutGerador>
  );
}
