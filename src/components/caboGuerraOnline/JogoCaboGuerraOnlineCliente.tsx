"use client";

import { useEffect, useRef, useState } from "react";
import { responderCaboGuerra } from "@/app/actions/caboGuerraOnline";
import { NOMES_NIVEL, TOTAL_RODADAS, TEMPO_RODADA, type Nivel } from "@/lib/caboGuerraPerguntas";

type EstadoSala = {
  status: "aberta" | "em_andamento" | "encerrada";
  nomeEquipe1: string;
  nomeEquipe2: string;
  rodadaAtual: number;
  nivel: Nivel;
  pontosEquipe1: number;
  pontosEquipe2: number;
  perguntaTexto: string | null;
  tempoRestante: number;
  rodadaGanhaPor: number | null;
  minhaEquipe: number | null;
  vencedorFinal: number | null;
};

const TECLAS = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "⌫", "0", "✓"];

export function JogoCaboGuerraOnlineCliente({ codigo }: { codigo: string }) {
  const [dados, setDados] = useState<EstadoSala | null>(null);
  const [entrada, setEntrada] = useState("");
  const [status, setStatus] = useState<"correta" | "errada" | null>(null);
  const rodadaAnteriorRef = useRef<number | null>(null);
  const enviandoRef = useRef(false);

  useEffect(() => {
    const origem = new EventSource(`/api/cabo-guerra/${codigo}/eventos`);
    origem.onmessage = (evento) => setDados(JSON.parse(evento.data));
    return () => origem.close();
  }, [codigo]);

  useEffect(() => {
    if (dados && dados.rodadaAtual !== rodadaAnteriorRef.current) {
      rodadaAnteriorRef.current = dados.rodadaAtual;
      setEntrada("");
      setStatus(null);
    }
  }, [dados]);

  if (!dados) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-50">Carregando...</main>
    );
  }

  const cor = dados.minhaEquipe === 2 ? "vermelho" : "azul";
  const corPrincipal = cor === "azul" ? "#1565C0" : "#C62828";
  const nomeMinhaEquipe = dados.minhaEquipe === 2 ? dados.nomeEquipe2 : dados.nomeEquipe1;

  if (dados.status === "aberta") {
    return (
      <main
        className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center text-white"
        style={{ background: `linear-gradient(135deg, ${corPrincipal}, #0d0d1a)` }}
      >
        <span className="text-6xl">{cor === "azul" ? "🔵" : "🔴"}</span>
        <p className="text-2xl font-extrabold">Você está na {nomeMinhaEquipe}</p>
        <p className="text-white/80">Aguardando o professor iniciar o jogo...</p>
      </main>
    );
  }

  const travado = dados.rodadaGanhaPor !== null || status !== null;

  async function digitar(valor: string) {
    if (travado || enviandoRef.current) return;

    if (valor === "⌫") {
      setEntrada((atual) => atual.slice(0, -1));
      return;
    }

    if (valor === "✓") {
      const valorAtual = entrada;
      if (!valorAtual) return;
      enviandoRef.current = true;
      const resultado = await responderCaboGuerra(codigo, valorAtual);
      enviandoRef.current = false;
      if (resultado.ok) {
        setStatus(resultado.correta && !resultado.tarde ? "correta" : "errada");
        if (!resultado.correta || resultado.tarde) {
          setTimeout(() => {
            setStatus(null);
            setEntrada("");
          }, 700);
        }
      }
      return;
    }

    setEntrada((atual) => (atual.length < 5 ? atual + valor : atual));
  }

  if (dados.status === "em_andamento") {
    return (
      <main className="flex min-h-screen flex-col bg-[#0d0d1a] text-white">
        <div className="flex items-center justify-between border-b-4 border-[#FFD600] bg-black/30 px-4 py-2">
          <div className="rounded-xl border-2 border-white/15 bg-white/10 px-4 py-1.5">
            <p className="text-[0.6rem] font-bold tracking-wide text-neutral-400 uppercase">{dados.nomeEquipe1}</p>
            <p className="text-2xl font-extrabold text-[#42A5F5]">{dados.pontosEquipe1}</p>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <div className="rounded-xl border-2 border-[#FFD600] bg-[#FFD600]/15 px-4 py-1">
              <p className="text-center text-[0.6rem] font-bold tracking-widest text-neutral-400 uppercase">Tempo</p>
              <p
                className={`text-center text-2xl font-extrabold ${
                  dados.tempoRestante <= 5 ? "animate-pulse text-red-400" : "text-[#FFD600]"
                }`}
              >
                {dados.tempoRestante}
              </p>
            </div>
            <p className="text-xs text-neutral-400">
              Rodada <b className="text-white">{dados.rodadaAtual}</b>/{TOTAL_RODADAS} · {NOMES_NIVEL[dados.nivel]}
            </p>
          </div>
          <div className="rounded-xl border-2 border-white/15 bg-white/10 px-4 py-1.5 text-right">
            <p className="text-[0.6rem] font-bold tracking-wide text-neutral-400 uppercase">{dados.nomeEquipe2}</p>
            <p className="text-2xl font-extrabold text-[#EF5350]">{dados.pontosEquipe2}</p>
          </div>
        </div>

        <div className="border-b-4 border-black/25 bg-gradient-to-br from-[#FFD600] to-[#FF8F00] px-4 py-3 text-center">
          <p className="text-[0.65rem] font-semibold tracking-widest text-black/45 uppercase">
            Você joga por: {cor === "azul" ? "🔵" : "🔴"} {nomeMinhaEquipe}
          </p>
          <p className="text-4xl font-extrabold tracking-wide text-[#1a1a2e]">{dados.perguntaTexto ?? "..."}</p>
        </div>

        {dados.rodadaGanhaPor !== null && (
          <p className="mt-3 text-center text-sm font-semibold text-[#FFD600]">
            {dados.rodadaGanhaPor === 0
              ? "⏰ Tempo esgotado — ninguém pontuou"
              : dados.rodadaGanhaPor === (dados.minhaEquipe ?? -1)
                ? "🎉 Sua equipe acertou!"
                : "A outra equipe acertou primeiro."}
          </p>
        )}

        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
          <div
            className={`flex min-h-[52px] w-full max-w-[240px] items-center justify-end gap-2 rounded-lg border-2 bg-black/40 px-3 py-2 ${
              status === "correta"
                ? "border-[#69F0AE]"
                : status === "errada"
                  ? "animate-pulse border-[#EF5350]"
                  : "border-white/20"
            }`}
          >
            <span>{status === "correta" ? "✅" : status === "errada" ? "❌" : ""}</span>
            <span className="text-2xl font-extrabold">{entrada || "_"}</span>
          </div>

          <div className="grid w-full max-w-[240px] grid-cols-3 gap-2">
            {TECLAS.map((tecla) => {
              const isOk = tecla === "✓";
              const isDel = tecla === "⌫";
              return (
                <button
                  key={tecla}
                  onClick={() => digitar(tecla)}
                  disabled={travado}
                  className={`rounded-lg py-4 text-lg font-extrabold text-white transition active:scale-90 disabled:opacity-40 ${
                    isOk
                      ? "col-span-3 bg-[#ffd600] text-[#1a1a2e]"
                      : isDel
                        ? "bg-red-500/40"
                        : "bg-white/15 hover:bg-white/25"
                  }`}
                >
                  {isOk ? "↵ ENTER" : tecla}
                </button>
              );
            })}
          </div>
        </div>
      </main>
    );
  }

  const corFundo =
    dados.vencedorFinal === 1
      ? "bg-gradient-to-br from-[#0D47A1] to-[#42A5F5]"
      : dados.vencedorFinal === 2
        ? "bg-gradient-to-br from-[#B71C1C] to-[#EF5350]"
        : "bg-gradient-to-br from-[#1a1a2e] to-[#2d2d5e]";

  const minhaVitoria = dados.vencedorFinal === dados.minhaEquipe;

  return (
    <main className={`flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center ${corFundo}`}>
      <span className="text-7xl">{dados.vencedorFinal === 0 ? "🤝" : minhaVitoria ? "🏆" : "😢"}</span>
      <p className="text-3xl font-extrabold text-white">
        {dados.vencedorFinal === 0
          ? "EMPATE!"
          : dados.vencedorFinal === 1
            ? `🔵 ${dados.nomeEquipe1.toUpperCase()} VENCEU!`
            : `🔴 ${dados.nomeEquipe2.toUpperCase()} VENCEU!`}
      </p>
      <p className="text-lg text-white/85">
        Placar final: {dados.pontosEquipe1} × {dados.pontosEquipe2}
      </p>
    </main>
  );
}
